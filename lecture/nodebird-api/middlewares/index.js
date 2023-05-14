const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const {Domain} = require('../models');


//로그인 여부 체크 (로그인 했을 경우 사용)
exports.isLoggedIn = (req, res, next) => {
    //로그인 했으면 true, 로그인 안 했으면 false
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).send('로그인 필요');
    }
};

//로그인 여부 체크(로그인 안했을 경우 체크)
exports.isNotLoggedIn = (req, res, next) => {
    //로그인 안 했으면 true, 로그인하면 false
    if(!req.isAuthenticated()){
        next();
    }else{
        const message = encodeURIComponent('로그인한 상태입니다.');
        // encodeURIComponent : URL로 데이터를 전달하기 위해서 문자열을 인코딩
        res.redirect(`/?error=${message}`);
    }
};


//API유효성 체크
exports.verifyToken = (req, res, next) => {
    try {
      res.locals.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
      return next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') { // 유효기간 초과
        return res.status(419).json({
          code: 419,
          message: '토큰이 만료되었습니다',
        });
      }
      return res.status(401).json({
        code: 401,
        message: '유효하지 않은 토큰입니다',
      });
    }
  };

  //API 사용량 제한 체크
  exports.apiLimiter = rateLimit({
    windowMs : 60 * 1000, 
    max : 10,
    handler(req, res){
      res.status(this.statusCode).json({
        code : this.statusCode,
        message : `1분에 ${max}번만 요청할 수 있습니다.`,
      });
    }
  });


  //API 새로운 버전 나옴. 이전 버전 사용 시 경고 출력.
  exports.deprecated = (req, res) => {
    res.status(410).json({
      code: 410,
      message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
    });
  };


//cors 허용
exports.corsWhenDomainMatches = async(req, res, next) => {

  const domain = await Domain.findOne({
    where : { host : new URL(req.get('origin')).host },
  });
  if(domain){
    cors({
      origin: true,
      credentials : true,
    })(req,res,next);
  }else{
    next();
  }
}
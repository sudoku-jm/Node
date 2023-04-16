const jwt = require('jsonwebtoken');

exports.isLoggedIn = (req, res, next) => {
    //로그인 했으면 true, 로그인 안 했으면 false
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).send('로그인 필요');
    }
};

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

exports.verifyToken = (req, res, next) => {
    try{
        res.locals.decoded = jwt.verify(req.headers.authorization, prosess.env.JWT_SECRET);
        return next();
    }catch(err){
        if(err.name === 'TokenExpriedError'){   //유효기간 초과
            return res.status(419).json({
                code : 419,
                message : '토큰이 만료되었습니다.',
            })
        }
        return res.status(401).json({
            code : 401,
            message : '유효하지 않은 토큰입니다',
        });
    }   
}
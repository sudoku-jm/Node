const jwt = require('jsonwebtoken');
const {Domain, User} = require('../models');


//토큰 발급 라우터
exports.createToken = async(req,res) => {
    const {clientSecret} = req.body;
    try{
        // 도메인 등록 검사. 요금제, 할당량 등 검사.
        const domain = await Domain.findOne({
            where : { clientSecret },
            include : {
                model : User,
                attribute : ['id','nick']
            },
        });

        if(!domain){
            return res.status(401).json({
                code : 401,
                message : '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요.'
            });
        }

        // 토큰 발급.  앞으로 발급 받은 토큰을 사용해서 API 서버에 요청할 것이다.
        const token = jwt.sign({
            id : domain.Uesr.id,
            nick : domain.User.nick,
        }, process.env.JWT_SECRET, {
            expiresIn:'1m',      //1분 만료기간 
            issuer:'nodebird',   //발급자
        });

        return res.json({
            code : 200,
            message : '토큰이 발급되었습니다.',
            token,
        })

    }catch(err){
        console.error(err);
        return res.status(500).json({
            code : 500,
            message : '서버 에러',
        })
    }
}


// 토큰 발급 테스트
exports.tokenTest = (req, res) => {
    res.json(res.locals.decoded);
}
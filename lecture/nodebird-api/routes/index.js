const express = require('express');
const { isLoggedIn } = require('../middlewares');
const {User,Domain} = require('../models');
const router = express.Router();
const {v4 : uuidv4} = require('uuid');

// GET /
// http://localhost:8002로 접속 시 실행.
router.get('/', async(req, res, next) => {
    try{
        // 로그인 해야 도메인 정보를 불러오게 함.
        const user = await User.findOne({ 
            where : { id: req.user?.id || null},
            include : {model : Domain}
        });
        //login.html 불러옴
        res.render('login',{
            user,
            domains: user?.Domains, //user 정보 있을 경우 도메인 테이블 정보 내려줌.
        });

    }catch(err){
        console.error(err);
        next(err);
    }
});


//POST /domain 
//도메인 등록
router.post('/domain',isLoggedIn , async(req, res, next) => {
    try{
        await Domain.create({
            UserId : req.user.id,
            host : req.body.host,
            type: req.body.type,
            clientSecret : uuidv4(),
        });
        res.redirect('/');
    }catch(err){
        console.error(err);
        next(err);
    }
});


module.exports = router;
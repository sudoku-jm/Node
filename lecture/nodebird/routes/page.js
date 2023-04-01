const express = require('express');

const router = express.Router();


//GET /
router.get('/', (req, res, next) => {
    const twits = [];
    res.render('main', {        //main.html
        title : 'Nodebird',
        twits,
        user : req.user,        // 로그인을 했을 경우 유저정보를 내려준다.
    });
});


// GET /join
router.get('/join', (req, res, next) => {
    res.render('join', {        //join.html
        title : '회원가입 - NodeBird',
    })
});


// GET /profile
router.get('/profile' , (req, res, next) => {
    res.render('profile', {     //profile.html
        title : '내 정보 - NodeBird',
    })
});

module.exports = router;



const express = require('express');

const router = express.Router();


//GET /
router.get('/', (req, res, next) => {
    const twits = [];
    res.render('main', {
        title : 'Nodebird',
        twits
    });
});


// GET /join
router.get('/join', (req, res, next) => {
    res.render('join', { 
        title : '회원가입 - NodeBird',
    })
});


// GET /profile
router.get('/profile' , (req, res, next) => {
    res.render('profile', {
        title : '내 정보 - NodeBird',
    })
});

module.exports = router;



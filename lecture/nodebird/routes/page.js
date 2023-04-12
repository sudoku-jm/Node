const express = require('express');
const {Post , User} = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
    next();
});

//GET /
router.get('/', async (req, res, next) => {
    try{
        const posts = await Post.findAll({
            include : {
                model : User,
                attributes : ['id', 'nick'],
            },
            order : [['createdAt','DESC']],
        });
        res.render('main', {        //main.html
            title : 'Nodebird',
            twits : posts,
        });
    }catch(err){
        console.error(err);
        next(err);
    }
});


// GET /join
router.get('/join', isNotLoggedIn,(req, res, next) => {
    res.render('join', {        //join.html
        title : '회원가입 - NodeBird',
    })
});


// GET /profile
router.get('/profile' , isLoggedIn, (req, res, next) => {
    res.render('profile', {     //profile.html
        title : '내 정보 - NodeBird',
    })
});

module.exports = router;



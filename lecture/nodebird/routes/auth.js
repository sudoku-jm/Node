//회원가입, 사용자 계정
const express = require('express');
const bcrypt = require('bcrypt')
const passport = require('passport');
const User = require('../models/user');
const {isLoggedIn , isNotLoggedIn} = require('../middlewares');
const router = express.Router();

// POST /auth/join
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const {email, nick, password} = req.body;
    try{
        //회원 존재 여부
        const exUser = await User.findOne({where : {email}});
        if(exUser){
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12); //높을수록 좋음.
        await User.create({
            email,
            nick,
            password : hash,
        });
        return res.status(200).redirect('/');
    }catch(err){
        console.error(err);
        return next(err);
    }
});

// POST /auth/login
router.post('/login', isNotLoggedIn, (req, res, next) => {
   //패스포트 전략 사용
   //authenticate는 미들웨어다.
   passport.authenticate('local', (authError, user, info) => {

    if(authError){                      // passport에서 에러가 난 경우
        console.error(authError);
        return next(authError);
    }
    if(!user){                          // 회원정보가 없는 경우  
        return res.redirect(`/?loginError=${info.message}`);
    }

    // req.login 을 하는 순간 passport > index.js 로 간다. 
    // serializeUser로 가서
    //세션의 user의 id만 저장시켰다.
    return req.login(user, (loginError) => {
        if(loginError){                 // 로그인시 발생하는 애러
            console.error(loginError);
            return next(loginError);
        }

        // serializeUser에서 생성된 세션 쿠키를 브라우저로 보내준다.
        return res.status(200).redirect('/');      //로그인 성공.
    })

   })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});


// GET /auth/logout
router.get('/logout' , isLoggedIn , (req, res ) => {
  //  req.logout(); //서버에서 세샨 쿠키를 지워준다.
  //  req.session.destroy();  //세션 파괴
  //  res.redirect('/');
  req.logout(() => {
    res.redirect('/');
  });
});

// GET /auth/kakao
// 실행 시  kakaoStrategy 실행.
router.get('/kakao', passport.authenticate('kakao')); 

//보내지 않았지만 kakaoStrategy를 거치니 해당 콜백으로 온다.
// GET /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/?loginError=카카오로그인 실패',
}), (req, res) => {
    res.redirect('/'); // 성공 시에는 /로 이동
});

module.exports = router;
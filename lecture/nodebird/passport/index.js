const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {

    //로그인 과정
    passport.serializeUser((user, done) => {
        // console.log('serializeUser',user);
        done(null, user.id)     //세션의 user의 id만 저장.
        //아이디만 메모리에 저장. 
        //나중에는 메모리만 저장하는 디비만들기도 할 것.
        // 여기서 done되는 순간 /auth/login 의 req.login안으로 들어감.
    });

    // { id : 3 , connect.sid :a s$235235436464523}  
    // connect.sid 세션 쿠키를 내려준다.

    //deserializeUser 에서 해당 쿠키값을 확인하고 유저 정보 복구.

    // 로그인 이후 과정
    passport.deserializeUser((id, done) => {
        // console.log('deserializeUser');
        User.findOne({ where: { id } })
          .then(user => done(null, user))
          .catch(err => done(err));
    });

    local();
    kakao();
}
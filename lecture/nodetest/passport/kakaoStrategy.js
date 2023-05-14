const passport = require('passport');
//설치한 passport-kakao 불러오기.
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID : process.env.KAKAO_ID,            // 카카오 앱 아이디 추가
        callbackURL : '/auth/kakao/callback',       // 카카오 로그인 후 카카오가 겨로가를 전송해 줄 URL
    }, async(accessToken, refreshToken, profile, done) => { 
        // 카카오 프로필만 들고온다. (profile)
        /*
            accessToken , refreshToken : 로그인 성공 후 카카오가 보내준 토큰(사용하지 않음)
            profile : 카카오가 보내준 유저 정보, profile의 정보를 바탕으로 회원가입.
        */
        console.log('kakao profile', profile);
        try{
            const exUser = await User.findOne({
                where : { snsId : profile.id, provider : 'kakao'},
            });

            if(exUser){
                done(null, exUser);         // 로그인
            }else{                          // 회원가입 시키기
                const newUser = await User.create({
                    email: profile._json?.kakao_account?.email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                  });
                done(null, newUser);
            }

        }catch(err){
            console.error(err);
            done(err);
        }
    }));
};
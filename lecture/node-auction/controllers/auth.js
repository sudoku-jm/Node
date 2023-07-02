const bcrypt = require('bcrypt')
const passport = require('passport');
const User = require('../models/user');


//JOIN 회원가입
exports.join = async(req, res, next) => {
    const {email, nick, password, money } = req.body;
    try{
        //회원 존재 여부
        const exUser = await User.findOne({where : { email }});
        if(exUser){
            return res.redirect('/join?error=이미 가입된 이메일 입니다.');
        }
        const hash = await bcrypt.hash(password, 12); //높을수록 좋음.
        await User.create({
            email,
            nick,
            password : hash,
            money,
        });
        return res.redirect('/');
    }catch(err){
        console.error(err);
        return next(err);
    }
}


//LOGIN 로그인, 패스포트 전략 사용
exports.login = async(req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if(authError){                      
            console.error(authError);
            return next(authError);
        }
        if(!user){                          
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError) => {
            if(loginError){                 
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');     
        });
    })(req, res, next);  // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
}


//LOGOUT 로그아웃
exports.logout = (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
}
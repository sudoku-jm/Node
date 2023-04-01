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
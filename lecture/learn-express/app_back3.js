const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// const multer = require('multer');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(morgan('combined'));
app.use('/', (req, res, next) => {
    if(req.session.id){
        express.static(__dirname, 'public')(req, res, next);
    }else{
        next();
    }
});
app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({extended:true})); 
app.use(session({
    resave: false,              
    saveUninitialized: false,
    // secret: process.env.COOKIE_SECRET,   //쿠키와 같음
    secret : 'test',
    cookie: {                           //세션일 때 쿠키도 같이 설정을 이곳에서 사용 가능.
      httpOnly: true,                   //XSS 보안
      secure: false,                    //HTTPS에서만 사용 가능.
    },
    //name: 'connect-sid',                //기본 설정 값 : connect-sid. 서명 되어있어서 읽을 수 없음
    name: 'session-cookie',
  }));
// app.use(multer());


// '/' 경로로 들어온 요청에 대해 session 데이터 설정
app.get('/', (req, res) => {
    req.session.username = 'john';
    res.send('Session data set');
  });
  
  // '/user' 경로로 들어온 요청에 대해 session 데이터 읽기
  app.get('/user', (req, res) => {
    const username = req.session.username; //다음 요청에도 해당 정보가 남아 있다.
    //
    res.send(`Session data for user ${username}`);
  });
  


app.listen(3000,() => {
    console.log('익스프레스 서버 실행');
});
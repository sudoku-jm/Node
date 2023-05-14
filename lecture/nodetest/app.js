const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();// 최대한 위에 적어주는게 좋다. 프로세스 설정값들이 들어가기때문.
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const {sequelize} = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig();  //패스포트 설정
//배포시 80포트로 변경될 것이다.
app.set('port', process.env.PORT || 8001);

// 사용할 템플릿 엔진을 html로 설정.
// 넌적스 템플릿 엔진과 연동하는 부분이 아니라, express에서 사용 할 템플릿 엔진 설정.
 // 넌적스 기본 환경 설정 변경. 
app.set('view engine','html');
nunjucks.configure('views', {
    express: app,
    watch: true,
  });


//sequelize.sync()가 테이블 생성 IF NOT EXIST 으로 테이블이 없을 때만 생성
sequelize.sync({ force : false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });


//morgan : 서버로 들어온 요청과 응답을 기록해주는 미들웨어
// 개발 시 dev, 배포 시 comnined로 변경
app.use(morgan('dev'));        //실행 후 자동 next, 다음 라우터 이동.
app.use(express.static(path.join(__dirname, 'public')));  //정정 파일 제공, 파일 위치 지정,
app.use('/img',express.static(path.join(__dirname, 'uploads')));  //요청 주소와 업로드 주소가 다르다. img 주소로 요청하지만 실제로는 uploads 폴더로 요청해서 보내줌.
app.use(express.json());   // JSON 형식전송 req.body객체가 JSON으로 변환.
app.use(express.urlencoded({extended : false}));  //URL 주소 파라미터 값 파싱 해주는 역할.
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    cookie : {
        httpOnly : true,
        secure : false,
    }
}));


//express session보다 아래에 위치.
app.use(passport.initialize());
//패스포트 로그인 이후 작업 할 수 있게 해준다.deserializeUser로 보냄.
app.use(passport.session()); 

app.use('/', pageRouter);   // '/'경로에 요청이 들어오면 pageRouter객체에서 해다 요청에 대한 핸들러 함수를 찾아 실행. 
// 예 ) GET '/' 요청에 대한 함수가 정의 되어 있다면 해당 핸들러 함수 실행.

app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

//에러처리 미들웨어에는 next를 반드시적어주도록한다.
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res , next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};

    //방법1
    res.status(err.status || 500);
    res.render('error');

    //또는 방법2
    // res.status(err.status || 500).render();
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중입니다.');
});
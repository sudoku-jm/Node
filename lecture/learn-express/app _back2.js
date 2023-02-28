const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(morgan('combined'));
app.use(cookieParser());


app.use(express.json()); //json 데이터 파싱 req.body로 보냄
app.use(express.urlencoded({extended:true})); //클라이언트 form submit할 때 기본 url 인코딩 하면 폼 파싱을 해준다. extended 쿼리스트링 처리 여무 true로 보통 사용한다. true면 qs 모듈, false quertstring을 사용. 보통 true하는것을 권장.

//잘 안쓰여서 express에서 뺀 듯
// app.use(bodyParser.raw());
// app.use(bodyParser.text());

//이미지는 멀터를 자주 사용.

app.get('/',(req, res) => {
    req.body.name; //클라이언트에서 보낸 것. name. 
    res.sendFile(path.join(__dirname,'index.html'));
});

app.get('/',(req, res) => {
    const myCookie = 'hello';
    // req.cookies
   // req.signedCookies;  //암호화, 서명된 쿠키 이용
    //쿠키 설정
    res.cookie('myCookie', encodeURIComponent(myCookie), {
        expires : new Date(),
        httpOnly : true,
        path : '/'
    })

    //쿠키 삭제
    // res.clearCookie('myCookie', encodeURIComponent(myCookie),{
    //     httpOnly : true,
    //     path : '/'
    // })
    res.sendFile(path.join(__dirname,'index.html'));
});



// app.use((req, res, next) => {
//     res.status(404).send('404지롱');
// });
// app.use((err, req, res, next) => {
//     console.error(err);
//     res.status(500).send('뭔가 문제가 생겼어요!!');
// });
  

app.listen(3000,() => {
    console.log('익스프레스 서버 실행');
});
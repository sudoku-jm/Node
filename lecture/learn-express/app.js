const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(morgan('combined'));
app.use(cookieParser());


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
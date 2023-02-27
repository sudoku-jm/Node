const express = require('express');
const path = require('path');
const app = express();

app.set('port', process.env.PORT || 3000);

//위에서 아래로 실행.
app.use((req, res, next) => {
    console.log('1 모든 요청에 실행하고 싶어요');
    next();
// },(req, res, next) => {
//     try{
//     // console.log(에러야);

//     }catch(err){
//         next(err);  //다음 미들웨어로 넘어간다. 해당 next()안에 인수가 들어가면 에러처리로 내려간다.
//     }
});

app.get('/',(req, res, next) => {
    res.sendFile(path.join(__dirname,'index.html'));
    if(false){
        next('route');
    }else{
        next();
    }
   // res.writeHead(200,{'Content-Type' : 'text/plain; charset=utf-8'});
   // res.end('안녕하세요');

    // res.setHeader('Content-Type' ,'text/html');
    // res.status(200).send('안녕하세요');

    // res.writeHead(200, {'Content-Type':'application/json'});
    // res.end(JSON.stringify({name : 'jm'}));
    // res.json({name : 'jm'});
},(req,res) => {
    console.log('실행되나?');
});

app.get('/',(req, res) => {
    console.log('실행됨!');
});

app.get('/category/javascript',(req, res) => {
    res.send(`hello javascript`);
});
app.get('/category/:name',(req, res) => {
    res.send(`hello ${req.params.name}. wildcard`);
});

app.post('/',(req, res) => {
    res.send('hello express!!');
});
app.get('/about',(req, res) => {
    res.send('hello express!! about');
});
// app.get('*',(req, res) => {
//     res.send('hello every body~~~~');
// });

app.use((req, res, next) => {
    res.status(404).send('404지롱');
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('뭔가 문제가 생겼어요!!');
});
  

app.listen(3000,() => {
    console.log('익스프레스 서버 실행');
});
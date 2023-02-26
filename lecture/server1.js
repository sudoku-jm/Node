const http = require('http');
http.createServer((req,res) => {
    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
    res.write('<h1>http서버 실행</h1>');
    res.end('<p>안뇽 http서버!</p>');
}).listen(8080, () => {
    console.log('8080번 포트에서 서버 대기!')
})  
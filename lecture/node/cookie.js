const http = require('http');
http.createServer((req, res) => {
    console.log(req.url, req.headers.cookie);
    res.writeHead(200, {
        'Set-Cookie' : 'mycookie=test'
    });
    res.end('hello Cookie');
}).listen(8080,() => {
    console.log('8080포트에서 서버 대기!!^^')
}); 
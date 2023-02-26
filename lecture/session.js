const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const parseCookies = (cookie = '') => {
    return cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
        acc[k.trim()] = decodeURIComponent(v);
        return acc; 
    },{});
}

const session = {};

http.createServer(async (req, res) => {
    const cookies = parseCookies(req.headers.cookie);
    if(req.url.startsWith('/login')){
        //로그인 요청 시
        const url = new URL(req.url, 'http://localhost:8080');
        const name = url.searchParams.get('name');
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 5);
        const uniqueInt = Date.now();
        session[uniqueInt] = {
            name,
            expires
        }
        res.writeHead(302,{
            Location : '/',
            'Set-Cookie' : `session=${uniqueInt}; Expires=${expires.toUTCString()}; HttpOnly; Path=/`,
        })
        res.end();
    }else if(cookies.session && session[cookies.session].expires > new Date()){
        //세션쿠키가 존재하고, 만료 기간이 지나지 않았다면.
        res.writeHead(200, {'Content-Type' : 'text/plain; charset=utf-8'});
        res.end(`${session[cookies.session].name}님 안녕하세요.`);
    }else{
        try{
            const data = await fs.readFile(path.join(__dirname,'cookie2.html'));
            res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'});
            res.end(data);

        }catch(err){
            res.writeHead(500, {'Content-Type' : 'text/plain; charset=utf-8'});
            res.end(err.message);
        }
    }
}).listen(8080,() => {
    console.log('8080번 포트에서 서버 대기 중!')
});
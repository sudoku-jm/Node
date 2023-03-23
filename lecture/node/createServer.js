const http = require("http");

const server = http
  .createServer((req, res) => {
    //여기에 어떻게 응답할지 적음
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write("<h1>Hello Node!</h1>");
    res.write("<p>Hello server!</p>");
    res.end("<h1>Hello code!</h1>");
  })
  .listen(8080);

server.on("listening", (err) => {
  console.log("8080번 포트에서 서버 대기중.");
});

server.on("error", (err) => {
  console.error(err);
});

const server1 = http
  .createServer((req, res) => {
    //여기에 어떻게 응답할지 적음
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.write("<h1>Hello Node! 3000</h1>");
    res.write("<p>Hello server!</p>");
    res.end("<h1>Hello code!</h1>");
  })
  .listen(3000);

server1.on("listening", (err) => {
  console.log("3000번 포트에서 서버 대기중.");
});

server1.on("error", (err) => {
  console.error(err);
});

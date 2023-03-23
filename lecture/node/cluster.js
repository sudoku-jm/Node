const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if(cluster.isMaster){
    console.log(`마스터 프로세스 아이디 : ${process.pid}`);

    //CPU 개수만큼 워커를 생산.
    for(let i = 0; i < numCPUs; i += 1){
        cluster.fork();
    }

    //워커가 종료되었을 때
    cluster.on('exit', (worker, code, signal) => {
        console.log(`${worker.process.pid}번 워커가 종료되었습니다.`);
        console.log('code', code, 'signal', signal);
        // cluster.fork();          //종료 되었을 때 새로 하나 만들어 주는 역할.
    });
}else{
    //워커들이 포트에서 대기

    http.createServer((req, res) => {
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        res.write('<h1>안녕 노드!</h1>');
        res.end('<h1>안녕 Cluster!</h1>');

        setTimeout(() => { // 워커 존재를 확인하기 위해 1초마다 강제 종료
            process.exit(1);
        }, 1000);
    }).listen(8080);

    console.log(`${process.pid}번 워커 실행`);
}
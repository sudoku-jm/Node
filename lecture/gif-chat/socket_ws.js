// WebSocket사용 코드
const WebSocket = require('ws');


//해당 함수를 가지고 express서버와 웹소켓을 연결 해준다.
module.exports = (server) => {
    const wss = new WebSocket.Server({server});
    //wss : 웹소켓서버라는 뜻으로 지음

    wss.on('connection', (ws, req) => {     //웹소켓 연결 시
        //클라이언트 -> 서버로 요청 받았을 때 ip파악을 먼저해준다.
        const ip = req.headers['x-forwared-for'] || req.connection.remoteAddress;
        //req.connection.remoteAddress 해당 명령어 만으로도 ip파악을 할 수 있으나 프론트에서 프록시 서버로 접속 할 수 있다. 중간 대리서버를 끼고 보낼 때 ip 변조가 될 수 있다.(그렇다고 정확히 ip를 잡아내는 것은 아님)
        //express의 req라면 res.ip로도 가져올 수 있다.
        console.log('새로운 클라이언트 접속 ip : ', ip);

        ws.on('message', (message)=> {              //클라이언트로부터 메시지
            console.log(message.toString());
        });

        ws.on('error', (error) => {                 //에러 시
            console.error(error);
        });

        ws.on('close', () => {                      //연결 종료 시
            console.log('클라이언트 접속 해제 ip : ', ip);
            clearInterval(ws.interval);             //연결 끊겼을 때 ws.interval저장해서 사용
            // 연결 끊겼을 때 3초마다 보내는 기능도 멈추기.
        });

        //3초마다 프론트로 데이터를 보내보기
        ws.interval = setInterval(() => {
            // ws.readyState 웹소켓이 연결된 상태 확인.
            if(ws.readyState === ws.OPEN){
                ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
            }
        },3000);
    });
}
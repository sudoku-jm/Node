const SocketIO = require('socket.io');

module.exports = (server) => {                  //웹소켓 연결 시
    const io = SocketIO(server, { path : '/socket.io'} );
    //path부분은 프론트와 일치시켜준다.

    io.on('connection', (socket) => {

        //request는 socket안에 들어있다. 요청정보.
        const req = socket.request;
        //요청정보에서 ip찾을 수 있음.
        const ip = req.headers['x-forwared-for'] || req.socket.remoteAddress;

        console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
        //어떤 사람의 고유 아이디 : socket.id
        //특정 사람의 밤 정보, 강퇴 등..할 때 사용.

        socket.on('disconnect', () => {        //연결 종료 시
            console.log('클라이언트 접속 해제', ip , socket.id);
            clearInterval(socket.interval);
        });

        socket.on('error', (error) => {         //에러 시
            console.error(error);
        });

        socket.on('reply', (data) => {          //클라이언트로부터 메시지
            console.log(data);

        });

        socket.interval = setInterval(() => {
            socket.emit('news', 'Hello Socket.IO');
        },3000);

    });
};
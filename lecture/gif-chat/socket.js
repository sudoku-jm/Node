const SocketIO = require('socket.io');

module.exports = (server, app) => {                  //웹소켓 연결 
    const io = SocketIO(server, { 
        path : '/socket.io',     //서버측 path와 똑같이 맞춰주
    } );   //socket.io 서버 생성

    app.set('io', io);                 //req.app.get('io') 처럼 라우터에서 socket.io 를 사용가능.
    //네임스페이스 만들기
    const room = io.of('/room');        //room 네임스페이스 생성
    const chat = io.of('/chat');        //chat 네임스페이스 생성

    // room에 관련된 연결
    room.on('connection', (socket) => {
        console.log('room 네임스페이스에 접속');
        socket.on('disconnect', () => {
            console.log('room 네임스페이스 접속 해제');
        });
    });


    // chat에 관련된 연결
    chat.on('connection', (socket) => {
        console.log('chat 네임스페이스에 접속');
    
        const req = socket.request;
        const { headers : {referer } } = req;
        const roomId = referer
              .split('/')[referer.split('/').length - 1]
              .replace(/\?.+/,'');          //주소에서 룸 id 추출하는 것.
              //프론트에서 서버로 데이터가 어떻게 가는지 확인 해보기
        socket.join(roomId);

       // socket.on('join', (data) => {       //data는 브라우저에서 보낸 방 아이디
       //     socket.join(data);              //네임스페이스 아래 존재하는 방에 접속
       // });

        socket.on('disconnect', () => {
            console.log('chat 네임스페이스 접속 해제');
            socket.leave(roomId);
        });

    });
};
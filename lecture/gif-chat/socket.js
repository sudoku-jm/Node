const SocketIO = require('socket.io');
const { removeRoom } = require('./services');
const cookieParser = require('cookie-parser');

module.exports = (server, app, sessionMiddleware) => {                  //웹소켓 연결 
    const io = SocketIO(server, { 
        path : '/socket.io',     //서버측 path와 똑같이 맞춰주
    } );   //socket.io 서버 생성

    app.set('io', io);                 //req.app.get('io') 처럼 라우터에서 socket.io 를 사용가능.
    //네임스페이스 만들기
    const room = io.of('/room');        //room 네임스페이스 생성
    const chat = io.of('/chat');        //chat 네임스페이스 생성

    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
    chat.use(wrap(cookieParser(process.env.COOKIE_SECRET)));
    chat.use(wrap(sessionMiddleware));  //express.sesseion 미들웨어 적용. 체이닝 방식으로 적용.

    // room에 관련된 연결  
    //채팅 브라우저 들어감
    room.on('connection', (socket) => {
        console.log('room 네임스페이스에 접속');
        //채팅 브라우저 끔
        socket.on('disconnect', () => {
            console.log('room 네임스페이스 접속 해제');
        });
    });


    // chat에 관련된 연결   
    chat.on('connection', (socket) => {
        console.log('chat 네임스페이스에 접속');
        
        //채팅 연결
        socket.on('join', (data) => {
            socket.join(data);
            socket.to(data).emit('join', {
              user: 'system',
              chat: `${socket.request.session.color}님이 입장하셨습니다.`,  //session미들웨어 장착 후 접근 가능.
            });
          });


        // 채팅 나가기
        socket.on('disconnect', async() => {
            console.log('chat 네임스페이스 접속 해제');
            const { referer } = socket.request.headers; // 브라우저 주소가 들어있음
            if (!referer) {
                console.log('Invalid referer');
                return;
            }
            console.log('referer',referer)
            try {
                const url = new URL(referer);
                const roomId = url.pathname.split('/').pop();
                const currentRoom = chat.adapter.rooms.get(roomId);
                const userCount = currentRoom?.size || 0;
                
                if(userCount === 0){        //유저가 0명이면 방 삭제
                    await removeRoom(roomId); // 컨트롤러 대신 서비스를 사용.
                    room.emit('removeRoom', roomId);
                    console.log('방 제거 요청 성공')
                }else{                          
                    socket.to(roomId).emit('exit', {
                        user: 'system',
                        chat: `${socket.request.session.color}님이 퇴장하셨습니다.`,
                    });
                }
            } catch (error) {
                console.log('Error parsing URL:', error);
            }
            
        });

    });
};
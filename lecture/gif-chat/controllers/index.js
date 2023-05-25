const Room = require('../schemas/room');
const Chat = require('../schemas/chat');


// GET /
exports.renderMain = async (req, res, next) => {
    try{
        //모든 채팅방을 다 들고 와서 보여줌.
        const rooms = await Room.find({});
        res.render('main', {rooms, title : 'GIF 채팅방'});

    }catch(error){
        console.error(error);
        next(error);
    }
};  


// GET /room 방생성 페이지 이동
exports.renderRoom = (req, res) => {
    res.render('room', {title : 'GIF 채팅방'});
};

// POST /room 방생성
exports.createRoom = async (req, res, next) => {
    try{
        // room.html의 form 데이터를 받아서 룸 생성.
        const newRoom = await Room.create({
            title : req.body.title,
            max : req.body.max,
            owner : req.session.color,       // 홈 접속하면서 받은 컬러값
            password : req.body.password,
        });

        //socket.js에서 app.set('io',io); 시킨 것을 라우터에 들고와 사용.
        const io = req.app.get('io');
        //room이라는 네임스페이스에 들어가 있는 사람들에게 newRoom이라는 이벤트 데이터 전달.
        io.of('/room').emit('newRoom', newRoom);

        if(req.body.password){      //비밀번호가 있는 방
            res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
        }else{                      //비밀번호가 없는 방
            res.redirect(`/room/${newRoom._id}`);
        }
    }catch(error){
        console.error(error);
        next(error);
    }
};


//GET /room/:id 방 입장.
exports.enterRoom = async(req, res, next) => {
    try{
        // 방 만들거나 입장할 때 newRoom._id를 URL 파라미터로 받았다.
        // 방의 id를 가지고 방의 데이터를 가지고 온다
        const room = await Room.findOne({ _id : req.params.id });

        // 해당 id를 가진 방의 정보가 없을 경우 -> 존재하지 않는 방.
        if(!room){
            return res.redirect('/?error=존재하지 않는 방입니다');
        }

        // 방이 있고, 비밀번호를 가진 방일 경우 -> 파라미터(쿼리)로 받은 비밀번호와 동일한지 체크.
        if(room.password && room.password !== req.query.password){
            return res.redirect('/?error=비밀번호가 틀렸습니다.');
        }

        const io = req.app.get('io');
        // 인원 수 체크
        // /chat 네임스페이스로 접근
        // io.of('/chat') 네임스페이스
        const { rooms } = io.of('/chat').adapter;

        console.log(rooms, rooms.get(req.params.id), rooms.get(req.params.id));

        // o.of(네임스페이스).adapter[방아이디]로 방의 정보를 들고 올 수 있다.
        // 방의 정보를 room에 담고. room.length 로 방 사용자가 몇명인지 들고 올 수 있다.

        //[방법1]
        if (room.max <= rooms.get(req.params.id)?.size) {
            return res.redirect('/?error=허용 인원이 초과하였습니다.');
          }

        //[방법2]
        // if(rooms && rooms[req.params.id] && room.max <= room[req.params.id].length){
        //     return res.redirect('/?error=허용 인원이 초과하였습니다.');
        // }

        // io.of('/chat').adapter.rooms[방아이디].length 와 동일.
       
        
        //모든 조건을 충족 한다면 방 입장. 
        // chat.html 호출
        return res.render('chat', {
            room,
            title: room.title,
            chats: [],
            user: req.session.color,
          });
    }catch(error){
        console.error(error);
        next(error);
    }
};

// DELETE room/:id 방 삭제
exports.removeRoom = async (req, res, next) => {
    try{
        //모든 사용자가 채팅방 나갔을 때 몇 초 뒤 방 삭제.
        //방 삭제, 채팅내역 삭제. ->둘 다 삭제할지는 선택사항.
        await Room.remove({ _id : req.params.id });
        await Chat.remove({ room : req.params.id });
        res.send('ok');

        //채팅방 리스트 보고있는 사용자들에게 removeRoom 이벤트로 해당 채팅방 리스트 삭제.
        req.app.get('io').of('/room').emit('removeRoom', req.params.id ); 
        setTimeout(() => {
            req.app.get('io').of('/room').emit('removeRoom', req.params.id ); 
            //room 네임스페이스에 removeRoom 이벤트로 삭제되는 룸아이디 전달.
        }, 2000);

        //setTimtout으로 감싸지 않은 경우 마지막으로 방에서 나간사람에게는 채팅목록이 삭제된 것을 알 수 없다. 전달이 안된다. chat 네임스페이스에 접속되어있고 room 네임스페이스에 접속한게 아니라서. 
        //그래서 같은 이벤트를 한 번 더 보낸다.


    }catch(error){
        console.error(error);
        next(error);
    }
};
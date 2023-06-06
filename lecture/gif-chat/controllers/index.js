const Room = require('../schemas/room');
const Chat = require('../schemas/chat');
const { removeRoom: removeRoomService } = require('../services'); 


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

        console.log('enterRoom==================',rooms, rooms.get(req.params.id), rooms.get(req.params.id));

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
        

        //방 입장 후 기존 채팅 내역 불러오기 + 채팅 방에 데이터 내려주기.
        //서비스 정책에 따라 최근 10건~100건 만 불러오기 등 달라질 수 있다.
        const chats = await Chat.find({ room : room._id }).sort('createdAt'); // 작성날 기준 sort
       
        
        //모든 조건을 충족 한다면 방 입장. 
        // chat.html 호출
        return res.render('chat', {
            room,
            title: room.title,
            chats,
            user: req.session.color,
          });
    }catch(error){
        console.error(error);
        next(error);
    }
};

// DELETE room/:id 방 삭제
exports.removeRoom = async (req, res, next) => {
    try {
      await removeRoomService(req.params.id);
      res.send('ok');
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  //POST room/:id/chat 채팅 데이터 저장.
exports.sendChat = async( req, res, next) => {
    try{
        // console.log('sendChat - req : ', req)
        console.log('============req.session?',req.session.color)
        // console.log('sendChat - res : ', res)
        const chat = await Chat.create({
            room : req.params.id,
            user : req.session.color,
            chat : req.body.chat,
        });

        //chat 네임스페이스에 들어감. id가 동일한 곳. -> 채팅 내역 전송
        // 네임스페이스 지정 : req.app.get('io').of('/chat')
        // 네임스페이스의 특정 방 지정 : .to(req.params.id)
        // 이벤트 발생 : .emit('chat',chat)
        req.app.get('io').of('/chat').to(req.params.id).emit('chat',chat);
        res.send('ok');
    }catch(error){
      console.error(error);
      next(error);
    }
  }

  //POST room/:id/gif 채팅 이미지 데이터 저장
  exports.sendGif = async(req, res, next) => {
    try{
         const chat = await Chat.create({
            room : req.params.id,
            user : req.session.color,
            gif : req.file.filename,                    //파일명으로 저장.
         });

        req.app.get('io').of('/chat').to(req.params.id).emit('chat',chat);
        res.send('ok');
    }catch(error){
        console.error(error);
        next(error);
    }
  }
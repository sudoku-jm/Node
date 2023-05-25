const mongoose = require('mongoose');
const {Schema} = mongoose;
const { Types: { ObjectId } } = Schema;
const chatSchema = new Schema({
    room : {
        type : ObjectId,        //Room에 대한 정보로 치환.
        required : true,
        ref : 'Room',           //Room 스키마를 참조. ref를 사용해서 조인
    },
    user : {                    //대화 누가 보냈는지
        type : String,
        required : true,
    },
    chat : String ,             //채팅을 보내는 것(txt)
    gif : String ,              //이미지 보내는 것
    createdAt : {               //채팅 보낸 현재시간
        type : Date,
        default : Date.now,
    }
});

module.exports = mongoose.model('Chat', chatSchema);
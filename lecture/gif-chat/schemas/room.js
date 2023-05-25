const mongoose = require('mongoose');

const {Schema} = mongoose;
const roomSchema = new Schema({
    title : {               //방제목
        type : String,
        required : true,
    },
    max : {                 //인원
        type : Number,
        required : true,
        default : 10,       //기본 10명
        min : 2,            //최소2명
    },
    owner : {               //방장
        type : String,
        required : true,
    },
    password : String,      //비밀번호(있어도 없어도 됨)
    createdAt : {            
        type : Date,
        default : Date.now,
    }
});

module.exports = mongoose.model('Room', roomSchema);
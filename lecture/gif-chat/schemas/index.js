const mongoose = require('mongoose');

const {MONGO_ID, MONGO_PASSWORD, NODE_ENV}=process.env;
const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;

const connect = () => {
    if (process.env.NODE_ENV !== 'production') { //배포가 아닐 때 
      mongoose.set('debug', true);  //디버그 모드 true. 터미널에 쿼리가 뜨도록.
    }
    mongoose.connect(MONGO_URL, {
      dbName: 'gifchat',
      useNewUrlParser: true,
    }).then(() => {
        console.log("몽고디비 연결 성공");
      }).catch((err) => {
        console.error("몽고디비 연결 에러", err);
      });
  };
  
  
  //이벤트 리스너. 연결 에러 이벤트 리스너.
  mongoose.connection.on('error', (error) => {
    console.error('몽고디비 연결 에러', error);
  });
  mongoose.connection.on('disconnected', () => {
    console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
    connect(); //연결 재시도.
  });
  
  module.exports = connect;
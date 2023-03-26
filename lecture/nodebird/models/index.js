const Sequelize= require('sequelize');
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
)

db.sequelize = sequelize;

const basename = path.basename(__filename);   //현재 파일의 이름을 반환. 
// __filename은 현재 모듈 파일 경로를 나타내는 전역변수.


//readdirSync() 함수는 해당 디렉토리의 파일 이름들을 배열로 반환.

fs
  .readdirSync(__dirname)  //현재 폴더의 모든 파일을 조회
  .filter(file => {
    return (file.indexOf('.') !== 0 ) && (file !== basename) && (file.slice(-3) == '.js');
  })
  .forEach(file => {      //해당 파일의 모델 불러와서 init
    const model = require(path.join(__dirname, file));
    console.log(file,model.name);
    db[model.name] = model;
    model.initiate(sequelize);
  });

  Object.keys(db).forEach(modelName => { //associate 호출. 관계 설정 호출
    if(db[modelName].associate){
      db[modelName].associate(db);
    }
  });

  module.exports = db;

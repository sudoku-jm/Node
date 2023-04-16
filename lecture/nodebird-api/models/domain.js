const Sequelize = require('sequelize');

class Domain extends Sequelize.Model{
    static initiate(sequelize){
        Domain.init({
            host : {
                type : Sequelize.STRING(80), // 플렛폼 등록 http://localhost:8001과 같이 적어줬듯
                allowNull : false,
            },
            type : {
                type : Sequelize.ENUM('free','primium'), //요금제. 문자열 2개중 하나만 쓸 수있게 함.
                allowNull : false,
            },
            clientSecret : {
                type : Sequelize.UUID, //시크릿 키 발급
                allowNull : false,
            },
        },{
            sequelize,
            timestamps : true,
            paranoid : true,
            modelName : 'Domain',
            tableName : 'domain'
        });
    }

    static associate(db){
        db.Domain.belongsTo(db.User);
    }
}

module.exports = Domain;
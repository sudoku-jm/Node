const Sequelize= require('sequelize');

class User extends Sequelize.Model{
    static initiate(sequelize){
        User.init({
            email : {
                type: Sequelize.STRING(40),
                allowNull : true,
                unique : true
            },
            nick : {
                type : Sequelize.STRING(15),
                allowNull : false,
            },
            password : {
                type : Sequelize.STRING(100),
                allowNull : true,
            },
            provider : {
                type: Sequelize.ENUM('local','kakao'),
                allowNull : false,
                defaultValue : 'local',
            },
            snsId : {
                type : Sequelize.STRING(30),
                allowNull : true
            }
        },{
            sequelize,
            timestamps : true,
            underscored : false,  // 이름을 스네이크 케이스로 변환
            modelName: 'User',
            tableName : 'users',
            paranoid : true,  // 소프트 삭제 기능 활성화 , 실제로는 데이터베이스에서 데이터가 삭제되지 않고, deletedAt 열에 현재 날짜와 시간이 저장. 
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associations(db){
        db.User.hasMany(db.Post);                   // 1:N
        db.User.belongsToMany(db.User, {            // N:M
            foreignKey : 'followingId',
            as : 'Followers',
            through : 'Follow',
        });
        db.User.belongsToMany({                     // N:M
            foreignKey : 'followerId',
            as : 'Followings',
            through : 'Follow',
        });
    }
};

module.exports = User;
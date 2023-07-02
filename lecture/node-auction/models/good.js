const Sequelize = require('sequelize');

class Good extends Sequelize.Model {
  static initiate(sequelize) {
    Good.init({
      name: {                           //물건명
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      img: {                            //이미지    
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      price: {                          //가격
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize,
      timestamps: true,
      paranoid: true,
      modelName: 'Good',
      tableName: 'goods',
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.Good.belongsTo(db.User, { as: 'Owner' });            //물건 판매자
    db.Good.belongsTo(db.User, { as: 'Sold' });             //물건 낙찰자
    db.Good.hasMany(db.Auction);
  }
};

module.exports = Good;
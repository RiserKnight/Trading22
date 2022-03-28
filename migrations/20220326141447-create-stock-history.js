'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('StockHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      historyID: {
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        unique:true,
        validate:{
          notNull:{msg:'StockHistory must have a id'},
          notEmpty:{msg:'id must not be empty'}
        }},
        stockID:{type:DataTypes.INTEGER,allowNull:false,references:{
          model:'Stocks',
          key:'stockID'
         },validate:{
          notNull:{msg:'Stock must have a id'},
          notEmpty:{msg:'id must not be empty'}
        }},
        ltp:{type:DataTypes.DOUBLE,allowNull:false,validate:{
          notNull:{msg:'Price must have a value'},
          notEmpty:{msg:'Price must not be empty'}
        }},
        dateP:{
          type:DataTypes.STRING
        },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('StockHistories');
  }
};
'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Stocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      stockID: {
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        unique:true,
        validate:{
          notNull:{msg:'Stock must have a id'},
          notEmpty:{msg:'ID must not be empty'}
        }},
        stockName:{
          type:DataTypes.STRING,
          allowNull: false,
          validate:{
            notNull:{msg:'Stock must have a name'},
            notEmpty:{msg:'name must not be empty'}
          }
        },
        ltp:{type:DataTypes.DOUBLE,allowNull:false,validate:{
          notNull:{msg:'Price must have a value'},
          notEmpty:{msg:'Price must not be empty'}
        }},
        description:{
          type:DataTypes.TEXT,
          allowNull:false,
          primaryKey:false,
          validate:{
            notNull:{msg:'Description must have a value'},
            notEmpty:{msg:'Description must not be empty'}
          }},
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
    await queryInterface.dropTable('Stocks');
  }
};
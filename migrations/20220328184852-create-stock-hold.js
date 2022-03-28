'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('StockHolds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      stockHoldID: {
        type:DataTypes.INTEGER,
        allowNull:false,
        primaryKey:true,
        unique:true,
        validate:{
          notNull:{msg:'User  must have a id'},
          notEmpty:{msg:'id must not be empty'}
        }},
        userID: {type:DataTypes.INTEGER,allowNull:false,references:{
        model:'Users',
        key:'userID'
       },validate:{
        notNull:{msg:'User  must have a id'},
        notEmpty:{msg:'id must not be empty'}
      }},
      stockID: {type:DataTypes.INTEGER,allowNull:false,references:{
        model:'Stocks',
        key:'stockID'
       },validate:{
        notNull:{msg:'Stock must have a id'},
        notEmpty:{msg:'id must not be empty'}
      }},
      quantity: {type:DataTypes.INTEGER,allowNull:false,validate:{
        notNull:{msg:'Quantity must have a value'},
        notEmpty:{msg:'Quantity must not be empty'}
      }},
      avgPrice: {type:DataTypes.DOUBLE,allowNull:false,validate:{
        notNull:{msg:'AvgPrice must have a value'},
        notEmpty:{msg:'AvgPrice must not be empty'}
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
    await queryInterface.dropTable('StockHolds');
  }
};
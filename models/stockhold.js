'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockHold extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StockHold.init({
    stockHoldID: {
      type:DataTypes.INTEGER,
      allowNull:false,
      unique:true,
      primaryKey:true,
      validate:{
        notNull:{msg:'User  must have a id'},
        notEmpty:{msg:'id must not be empty'}
      }},
    userID: {type:DataTypes.INTEGER,allowNull:false,
      references:{
       model:'Users',
       key:'userID'
      },validate:{
      notNull:{msg:'User  must have a id'},
      notEmpty:{msg:'id must not be empty'}
    }},
    stockID: {type:DataTypes.INTEGER,allowNull:false,
      references:{
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
    }}
  }, {
    sequelize,
    modelName: 'StockHold',
  });
  return StockHold;
};
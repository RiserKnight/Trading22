'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BuyOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BuyOrder.init({
    bOrderID: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      unique:true,
      validate:{
        notNull:{msg:'Order must have a id'},
        notEmpty:{msg:'ID must not be empty'}
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
    price: {type:DataTypes.DOUBLE,allowNull:false,validate:{
      notNull:{msg:'Price must have a value'},
      notEmpty:{msg:'Price must not be empty'}
    }}
  }, {
    sequelize,
    modelName: 'BuyOrder',
  });
  return BuyOrder;
};
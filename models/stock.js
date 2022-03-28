'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Stock.init({
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
        }}
  }, {
    sequelize,
    modelName: 'Stock',
  });
  return Stock;
};
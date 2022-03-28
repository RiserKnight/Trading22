'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StockHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StockHistory.init({
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
      }
  }, {
    sequelize,
    modelName: 'StockHistory',
  });
  return StockHistory;
};
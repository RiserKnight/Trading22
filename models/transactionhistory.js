'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TransactionHistory.init({
    buyerID: DataTypes.INTEGER,
    sellerID: DataTypes.INTEGER,
    stockID: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    amount: DataTypes.DOUBLE,
    timeStamp: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TransactionHistory',
  });
  return TransactionHistory;
};
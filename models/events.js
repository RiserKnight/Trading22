'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Events.init({
    eventID: {
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      unique:true,
      validate:{
        notNull:{msg:'Event must have a id'},
        notEmpty:{msg:'id must not be empty'}
      }},
      timeStamp:{
        type:DataTypes.STRING
      },
      timeValue:DataTypes.INTEGER,
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
    modelName: 'Events',
  });
  return Events;
};
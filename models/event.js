'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Event.init({
    eventID:{
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      unique:true,
        validate:{
          notNull:{msg:'Ebent must have a ID'},
          notEmpty:{msg:'ID must not be empty'}
        }
    },
      timeStamp:{
        type:DataTypes.STRING
      },

      heading:{
        type:DataTypes.STRING
      },
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
    modelName: 'Event',
  });
  return Event;
};
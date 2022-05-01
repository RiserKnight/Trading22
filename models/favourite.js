'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favourite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Favourite.init({
   userID: {type:DataTypes.INTEGER,allowNull:false,validate:{
        notNull:{msg:'User  must have a id'},
        notEmpty:{msg:'id must not be empty'}
      }},
      stockID: {type:DataTypes.INTEGER,allowNull:false,validate:{
        notNull:{msg:'Stock must have a id'},
        notEmpty:{msg:'id must not be empty'}
      }}

  }, {
    sequelize,
    modelName: 'Favourite',
  });
  return Favourite;
};
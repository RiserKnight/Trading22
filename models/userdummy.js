'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserDummy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserDummy.init({
    userID: DataTypes.INTEGER,
    userName: DataTypes.STRING,
    userEmail: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserDummy',
  });
  UserDummy.prototype.validPassword = function(password) {
    if(password===this.password)
    return true;
    else
    return false;
 }; 

// create all the defined tables in the specified database.
sequelize.sync()
.then(() => console.log('users table has been successfully created, if one doesn\'t exist' ))
.catch(error => console.log("This error occured", error));
  return UserDummy;
};
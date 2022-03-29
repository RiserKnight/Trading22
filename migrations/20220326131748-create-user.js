'use strict';
module.exports = {
  async up(queryInterface,DataTypes) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique:true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userID: {
        type:DataTypes.INTEGER,
        unique:true,
        allowNull:false,
        primaryKey:true,
        validate:{
          notNull:{msg:'User  must have a id'},
          notEmpty:{msg:'id must not be empty'}
        }
  
      },
      name: {
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:false,
        validate:{
          notNull:{msg:'User  must have a id'},
          notEmpty:{msg:'id must not be empty'}
        }
  
      },
      funds: {
        type:DataTypes.DECIMAL,
        allowNull:false,
        primaryKey:false,
        validate:{
          notNull:{msg:'User  must have a id'},
          notEmpty:{msg:'id must not be empty'}
        }
  
      },
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
    await queryInterface.dropTable('Users');
  }
};
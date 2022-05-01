'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique:true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
          }},
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
    await queryInterface.dropTable('Events');
  }
};
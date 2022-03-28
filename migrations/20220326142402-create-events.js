'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
        timeStamp:{
          type:DataTypes.STRING
        },
        timeValue:DataTypes.DECIMAL,
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
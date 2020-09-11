const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database')

class StudentModel extends Model {};

StudentModel.init({
    studentName:{
        type:DataTypes.STRING,
        allowNull:false,
        validate: {
            notEmpty: true
          }
    },
    studentEmail:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate: {
            notEmpty: true,
            isEmail:true
          }
    }
}, {
  
  sequelize, 
  modelName: 'Student' 
});

module.exports = StudentModel;
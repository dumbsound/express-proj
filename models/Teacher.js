const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database')

class TeacherModel extends Model {};

TeacherModel.init({
    teacherName:{
        type:DataTypes.STRING,
        allowNull:false,
        validate: {
            notEmpty: true
          }
    },
    teacherEmail:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate: {
            notEmpty: true,
            isEmail:true
          }
    },
    toDelete:{
        type:DataTypes.STRING,
        allowNull:false,
        validate: {
            notEmpty: true
          }
    }
}, {
  
  sequelize, 
  modelName: 'Teacher' 
});

module.exports = TeacherModel;
const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database')

class ClassModel extends Model {};

ClassModel.init({
    classCode:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate: {
            notEmpty: true
          }
    },
    className:{
        type:DataTypes.STRING,
        allowNull:false,
        validate: {
            notEmpty: true
          }
    }
}, {
  
  sequelize, 
  modelName: 'Class' 
});

module.exports = ClassModel;
const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database')

class SubjectModel extends Model {};

SubjectModel.init({
    subjectCode:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate: {
            notEmpty: true
          }
    },
    subjectName:{
        type:DataTypes.STRING,
        allowNull:false,
        validate: {
            notEmpty: true
          }
    }
}, {
  
  sequelize, 
  modelName: 'Subject' 
});

module.exports = SubjectModel;
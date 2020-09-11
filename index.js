const express=require('express');
const path = require("path");
const database = require('./database');
const app=express();
app.use(express.json());
const Sequelize=require('sequelize');

app.listen(5000, () => {
    console.log("Server started");
  });

async function main() {
    let sequelize = await database.connect();
  
    const StudentModel = require("./models/Student");
    const ClassModel = require("./models/Class");
    const SubjectModel = require("./models/Subject");
    const TeacherModel = require("./models/Teacher");
  
    StudentModel.belongsToMany(ClassModel, { through: "Student_Classes" });
    ClassModel.belongsToMany(StudentModel, {
      through: "Student_Classes",
      as: "StudentClasses",
    });

    TeacherModel.belongsToMany(ClassModel, { through: "Teacher_Classes" });
    ClassModel.belongsToMany(TeacherModel, {
      through: "Teacher_Classes",
      as: "TeacherClasses",
    });

    TeacherModel.belongsToMany(SubjectModel, { through: "Teacher_Subjects" });
    SubjectModel.belongsToMany(TeacherModel, {
      through: "Teacher_Subjects",
      as: "TeacherSubjects",
    });

    await sequelize.sync({ alter: false });
  
    const api=require('./apiRoutes');
    app.use('/api', api)
  
  }
  
  main();



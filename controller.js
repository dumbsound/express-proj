const express = require('express');
const winston = require('winston');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const Teacher = require("./models/Teacher");
const Subject = require("./models/Subject");
const Student = require("./models/Student");
const Class = require("./models/Class");
const axios = require('axios');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

const errorLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: 'error' }),
    new winston.transports.File({ filename: 'error.log' })
  ]
});

exports.newEntry = async (req, res) => {
  try {
    let results = await Teacher.findOne({
      where: {
        teacherEmail: "Tan.Jimmy@edu.com",
        // teacherName: "Jimmy Tan",
        // toDelete: '1'
      }
    })
    // let classOne = await Class.create({
    //   className: "German",
    //   classCode: "G12"

    // })

    let subjectOne = await Subject.create({
      subjectName: "Python Basics",
      subjectCode: "CS244"
    })

    results.addSubject(subjectOne);
    // results.addClass(classOne);

    if (results != 0) {
      res.status(200).json({ message: "Successfully Updated" });
      logger.log({
        level: 'info',
        message: 'Updated id'
      });
    } else {
      res.status(200).json({ message: "Not added" })
    }
  }
  catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getAll = async (req, res) => {
  try {
    let results = await Teacher.findAll({
    })
    res.status(200).send(results)
    if (results != 0) {
      logger.log({
        level: 'info',
        message: 'GET - all'
      });
    } else {
      logger.log({
        level: 'error',
        message: 'GET/all - no entry in database'
      });
    }
  }
  catch (err) {
    res.status(400).json({ message: "Error" })
  }
};

exports.getId = async (req, res) => {
  try {
    let results = await Teacher.findAll({
      where: {
        id: req.params.id
      },
    })
    if (results != 0) {
      res.status(200).send(results);
      logger.log({
        level: 'info',
        message: 'Get - based on id'
      });
    } else {
      res.status(200).json({ message: "Id not found" });
      logger.log({
        level: 'error',
        message: 'Get/id - id not found'
      });
    }
  }
  catch (err) {
    errorLogger.log({
      level: 'error',
      message: 'GET- id Error'
    });
    res.status(400).json({ message: "Error" })
  }
};

exports.delete = async (req, res) => {
  try {
    let results = await Teacher.destroy({
      where: {
        id: req.params.id
      }
    })
    if (results == 1) {
      res.status(200).json({ message: "Deleted" });
    } else {
      res.status(200).json({ message: "Id not found" })
    }
    logger.log({
      level: 'info',
      message: 'DELETE/id '
    })
  }
  catch (err) {
    return res.status(400).json({ message: "Error" })
  }
};

exports.studentData = async (req, res) => {
  try {
    let results = await Student.findAndCountAll({
      where: {
        classCode: req.params.classCode
      },
      attributes: [
        "id",
        "studentName",
        "studentEmail",
      ]
    },
      // {
      //   offset: req.query.offset,
      //   limit: req.query.limit,
      // }
    )

    let res = await axios.get('http://localhost:8080/students', {

      params: {
        classCode: req.query.class,
        offset: req.query.limit,
        limit: req.query.limit
      }
    });

    data = {};
    data.count = results.count;
    data.students = results.rows.map((student) => ({
      id: student.id,
      name: student.studentName,
      email: student.studentEmail
    }));

    if (data.count === 0) {
      res.status(200).json({ message: "There is no entry" });
    } else {
      res.status(200).json(data)
    }
  } catch (err) {
    res.status(500).json({ message: "Error" })
  }
};

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv')
    cb(null, true);
  else {
    cb(new Error('message not in correct format'), false);
  }
}

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

exports.uploadFile = async (req, res) => {
  try {
    fs.createReadStream(req.file.path).pipe(csv({}))
      .on('data', async (data) => {
        const [teacher, teacherCreated] = await Teacher.findOrCreate({
          where: { teacherEmail: data.teacherEmail },
          defaults: {
            teacherName: data.teacherName,
            toDelete: data.toDelete
          }
        })

        if (!teacherCreated && teacher.teacherName != data.teacherName) {
          teacher.teacherName = data.teacherName;
          teacher.save();
        }

        const [student, studentCreated] = await Student.findOrCreate({
          where: { studentEmail: data.studentEmail },
          defaults: { studentName: data.studentName }
        })

        if (!studentCreated && student.studentName != data.studentName) {
          student.studentName = data.studentName;
          student.save();
        }

        const [subject, subjectCreated] = await Subject.findOrCreate({
          where: { subjectCode: data.subjectCode },
          defaults: { subjectName: data.subjectName }
        })

        if (!subjectCreated && subject.subjectName != data.subjectName) {
          subject.subjectName = data.subjectName;
          subject.save();
        }

        const [class1, classCreated] = await Class.findOrCreate({
          where: { classCode: data.classCode },
          defaults: { className: data.className }
        })

        if (!classCreated && class1.className != data.className) {
          class1.className = data.className;
          class1.save();
        }

        // teacher.addSubject(subject);
        // teacher.addClass(class1);
        // student.addClass(class1);
        
      })
      .on('end', () => {
      });

    res.status(200).send("File Uploaded!");
    logger.log({
      level: 'info',
      message: 'File Uploaded!'
    });
  } catch{
    res.status(500).json({ message: err });
  }
};

exports.updateClassName = async (req, res) => {
  try {
    let results = await Class.update({
      className: req.body.className
    }, {
      where: { classCode: req.params.classCode }
    })

    if (results != 0) {
      res.status(200).json({ message: "Class name updated" });
      logger.log({
        level: 'info',
        message: 'Updated class name'
      })
    } else {
      res.status(200).json({ message: "classCode not found" });
      logger.log({
        level: 'error',
        message: 'class code not found'
      })
    }
  }
  catch (err) {
    console.log(err)
    res.status(400).json({ message: err })
    errorLogger.log({
      level: 'error',
      message: 'Updated class name error'
    })
  }
};

exports.getReport = async (req, res) => {
  try {
    let raw = await Teacher.findAll({
      attributes: [
        'teacherName'
      ],
      include: [
        {
          'model': Subject,
        }, {
          'model': Class,
        }
      ],
    });

    // let results = raw.map(r => r.toJSON())
    // console.log(results)

    const mapResults = results.map((result, index) => {
      return {
        [result.teacherName]: result.Subjects.map((subject) => {
          return {
            subjectCode: subject.subjectCode,
            subjectName: subject.subjectName,
            numberOfClasses: result.Classes.length
          }
        })
      }
    });

    res.status(200).json(mapResults);

  } catch (err) {
    res.status(500).json({ message: "Error" })
  }
};
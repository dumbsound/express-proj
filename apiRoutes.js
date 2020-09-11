const express = require('express');
const router = express.Router();
const multer = require('multer');
const posts = require('./controller');

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get('/all', posts.getAll);

router.get('/upload/:id',posts.getId);

router.post("/upload/new", posts.newEntry);

router.delete("/upload/:id", posts.delete);

router.get('/class/:classCode', posts.studentData);

router.post('/upload', upload.single('file'), posts.uploadFile);

router.put('/class/:classCode', posts.updateClassName);

router.get('/reports/workload', posts.getReport);

module.exports = router; 
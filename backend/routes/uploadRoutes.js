const express = require('express');
const multer = require('multer');
const { MongoClient, GridFSBucket } = require('mongodb');
const { Readable } = require('stream');
const router = express.Router();


// MongoDB Atlas connection URI
const url = 'mongodb+srv://admin:rocky9886@cluster0.nczlwja.mongodb.net/CRY?retryWrites=true&w=majority&routerName=Cluster0';
const dbName = 'CRY';

// Set up Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const mongoose = require('mongoose');
router.use(express.static('public'));

let db;
//let gfs;

// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(client => {
//     db = client.db(dbName);
//     gfs = new GridFSBucket(db, { bucketName: 'uploads' });
//     console.log('Connected to MongoDB');
//   })
//   .catch(err => console.error(err));

// Endpoint to upload files
// router.post('/upload', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   const fileName = req.file.originalname;
//   const readableStream = new Readable();
//   readableStream.push(req.file.buffer);
//   readableStream.push(null);

//   const uploadStream = gfs.openUploadStream(fileName);
//   readableStream.pipe(uploadStream)
//     .on('error', (error) => {
//       console.error(error);
//       res.status(500).send('Error uploading file.');
//     })
//     .on('finish', () => {
//       res.status(201).send('File uploaded successfully.');
//     });
// });

// Endpoint to retrieve and display files
// router.get('/file/:filename', (req, res) => {
//   const fileName = req.params.filename;
//   console.log(req.params.filename);  console.log(gfs)
//   gfs.openDownloadStreamByName(fileName)
//     .pipe(res)
//     .on('error', (error) => {
//       console.error(error);
//       res.status(404).send('File not found.');
//     });
// });

// Endpoint to list all files
// router.get('/files', (req, res) => {
//   gfs.find().toArray((err, files) => {
//     if (err) {
//       return res.status(500).send('Error retrieving files.');
//     }
//     res.json(files);
//   });
// });


module.exports = router;
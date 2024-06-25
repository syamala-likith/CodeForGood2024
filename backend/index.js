const {PORT, mongoDBURL} = require('./config.js');
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');

const multer = require('multer');
const userRoutes = require('./routes/userRoutes.js')
const projectRoutes = require('./routes/projectRoutes.js')
const uploadRoutes = require('./routes/uploadRoutes.js')
const { GridFSBucket } = require('mongodb');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app=express();
const dbName = 'CRY';

app.use(express.json());

app.use(cors());

app.get('/file/:filename', (req, res) => {
    const fileName = req.params.filename;
    gfs.openDownloadStreamByName(fileName)
      .pipe(res)
      .on('error', (error) => {
        console.error(error);
        res.status(404).send('File not found.');
      });
  });

  app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  
    const fileName = req.file.originalname;
    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);
  
    const uploadStream = gfs.openUploadStream(fileName);
    readableStream.pipe(uploadStream)
      .on('error', (error) => {
        console.error(error);
        res.status(500).send('Error uploading file.');
      })
      .on('finish', () => {
        res.status(201).send('File uploaded successfully.');
      });
  });

  app.get('/file/:filename', (req, res) => {
    const fileName = req.params.filename;
    console.log(req.params.filename);  console.log(gfs)
    gfs.openDownloadStreamByName(fileName)
      .pipe(res)
      .on('error', (error) => {
        console.error(error);
        res.status(404).send('File not found.');
      });
  });

  app.get('/files', async (req, res) => {
    mongoose.connection.collection('uploads.files').find()
 .toArray()
 .then(docs => {
    res.json(docs);
  })
 .catch(err => {
    console.log(err);
  });
  });

app.use('/user',userRoutes)
app.use('/project',projectRoutes)
// app.use('/upload',uploadRoutes)
let gfs;
const conn = mongoose.createConnection(mongoDBURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
conn.once('open',()=>{
    console.log('Connected to MongoDB');
    gfs=new GridFSBucket(conn.db,{bucketName:'uploads'})
});
mongoose.connect(mongoDBURL)
    .then(()=>{
     //   db = client.db(dbName);
       // gfs = new GridFSBucket(db, { bucketName: 'uploads' });
        console.log("App Connected to the database");
        app.listen(PORT,()=>{
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error)=>{
        console.log(error);
    });


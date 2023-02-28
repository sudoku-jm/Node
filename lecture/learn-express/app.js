const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');

const fs = require('fs'); //uploads라는 폴더를 만들어도 되지만 알아서 만들어주는 파일시스템 모듈.


const app = express();

app.set('port', process.env.PORT || 3000);

app.use(morgan('combined'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({extended:true})); 
app.use(session({
    resave: false,              
    saveUninitialized: false,
    secret : 'test',
    cookie: {                         
      httpOnly: true,                   
      secure: false,                   
    },

    name: 'session-cookie',
  }));

//파일 시스템 여부 확인 후 업로드 파일 생성.
const dirPath = 'uploads';
try {
  fs.accessSync(dirPath);
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error(`${dirPath } 디렉토리가 없음`,err);
		console.log('uploads 폴더가 없으므로 생성합니다.');
	  fs.mkdirSync('uploads');
  } else {
    console.error(err);
  }
}
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');   //uploads라는 폴더에 업로드.
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },      //5MB
});


// 해당 경로에서는 파일 업로드를 하지 않음
app.get('/', upload.none(), (req, res) => {
    res.send('start!');
});
  
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'multipart.html'));
});
  


// app.post('/upload', upload.single('image'), (req, res) => {
//    console.log("upload!!",req.file);
//    res.status(200).send('ok');
// });
  
// app.post('/upload', upload.array('files'),async (req, res, next) => {
//    console.log("upload!!",req.files);
//    res.status(200).send('ok');
// });
  
// app.post('/upload', upload.fields([{name : 'image1'},{name : 'image2'}]),async (req, res, next) => {
//    console.log("upload!!",req.files, req.body);
//    res.status(200).send('ok');
// });
  
const fields = [
  { name: 'files1', maxCount: 5 },
  { name: 'files2', maxCount: 2 }
];
app.post('/upload', upload.fields(fields),async (req, res, next) => {
   console.log("upload!!",req.files, req.body);
   res.status(200).send('ok');
});
  


app.listen(3000,() => {
    console.log('익스프레스 서버 실행');
});
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

//uploads 폴더가 없는 경우 생성.
const dirPath = 'uploads';
try{
    fs.readdirSync(dirPath);
}catch(err){
    console.error(`${dirPath} 폴더가 없어 폴더를 생성합니다`);
    fs.mkdirSync(dirPath);
}

//라우터를 통해 multer저장을 하게된다면
const upload = multer({
    storage : multer.diskStorage({
        destination(req, res, done){
            done(null, 'uploads/');
        },
        filename(rea, res, done){
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            done(null, basename + Date.now() + ext);
            
        }
    }),
    limits : {
        fileSize : 5 * 1024 * 1024 ,    //5MB
    }
});

// POST /post/img
router.post('/img', isLoggedIn, upload.single('img'), (req, res, next) => {
    console.log(req.file);
    res.status(200).json({
        url : `/img/${req.file.filename}`
    })
});

//POST /post
router.post('/', isLoggedIn, upload.none(), (req, res, next) => {

}); 
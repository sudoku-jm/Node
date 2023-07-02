const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {isLoggedIn , isNotLoggedIn} = require('../middlewares');
const {renderMain, renderJoin, renderGood, createGood} = require('../controllers');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// 메인
router.get('/', renderMain);


// 회원가입
router.get('/join',isNotLoggedIn, renderJoin);

// 상품등록 페이지
router.get('/good',isLoggedIn ,renderGood);

//uploads 폴더가 없는 경우 생성.
const dirPath = 'uploads';
try{
    fs.readdirSync(dirPath);
}catch(err){
    console.error(`${dirPath} 폴더가 없어 폴더를 생성합니다`);
    fs.mkdirSync(dirPath);
}

const upload = multer({
    storage : multer.diskStorage({
        destination(req, res, done){
            done(null, 'uploads/');
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
            
        }
    }),
    limits : {
        fileSize : 5 * 1024 * 1024 ,    //5MB
    }
});


router.post('/good',isLoggedIn, upload.single('img'), createGood );

module.exports = router;
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isLoggedIn } = require('../middlewares');
const { Post } = require('../models');

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
        filename(rea, file, done){
            const ext = path.extname(file.originalname);
            const basename = path.basename(file.originalname, ext);
            done(null, basename + Date.now() + ext); //같은 파일 명 덮어씌워짐 방지하기위해 업로드 날짜 추가.
            
        }
    }),
    limits : {
        fileSize : 5 * 1024 * 1024 ,    //5MB
    }
});

// POST /post/img
router.post('/img', isLoggedIn, upload.single('img'), (req, res, next) => {
    console.log(req.file);
    res.status(200).json({url : `/img/${req.file.filename}`}); //URL 프론트로 돌려줌.
});

//POST /post
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
    try{
        //게시글 업로드.
        const post = await Post.create({
            content : req.body.content,
            img : req.body.url,
            UserId : req.user.id,
        });
        res.redirect("/");
    }catch(err){
        console.error(err);
        next(err);
    }
}); 

module.exports = router;
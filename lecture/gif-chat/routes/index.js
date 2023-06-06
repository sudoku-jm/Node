const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { renderMain, renderRoom, createRoom, enterRoom, removeRoom, sendChat, sendGif} = require('../controllers');
const router = express.Router();

router.get('/', renderMain);

router.get('/room', renderRoom);

router.post('/room', createRoom);

router.get('/room/:id',enterRoom);

router.delete('/room/:id',removeRoom);

router.post('/room/:id/chat', sendChat);

// multer 활용 
//이미지 저장 폴더가 없을 경우 폴더 생성.
try{
    fs.readFileSync('uploads');
}catch(error){
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads');                                 //uploads라는 폴더에 업로드.
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);            //확장자 추출 
            const basename = path.basename(file.originalname, ext); //파일명
            done(null, basename + Date.now() + ext);                //파일명_시간대.확장자
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },                          //5MB
});

router.post('/room/:id/gif', upload.single('gif'), sendGif);

module.exports = router;
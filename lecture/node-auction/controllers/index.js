
const { Op } = require('sequelize');
const { Good } = require('../models');
// const { test } = require('node:test');


// GET /                            물건 현황 가져오기 
exports.renderMain = async(req, res, next) => {
    try{
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // 어제시간
        const goods = await Good.findAll({ 
            where: {SoldId : null, createdAt : { [Op.gte] : yesterday } },
        }); //SoldId : null => 낙찰자가 없는 물건만 보이기.
        res.render('main',{
            title : 'NodeAuction',
            goods,
        });
    }catch(err){
        console.error(err);
        next(err);
    }
}

// GET /join                        회원가입하기
exports.renderJoin = (req, res) => {
    res.render('join', {
        title : '회원가입 - NodeAuction'
    });
}


// GET /good                        상품등록 페이디
exports.renderGood = (req, res) => {
    res.render('good', {
        title : '상품등록 - NodeAuction'
    });
}

//POST /good                        상품등록하기
exports.createGood = async(req, res, next) => {
    try{
        const { name, price} = req.body;

        //  upload.single('img')로 파일이 업로드 되는 경우 req.file에 파일에 대한 데이터가 들어온다.
        await Good.create({
            OwnerId : req.user.id,      //판매자아이디
            name,
            price,
            img : req.file.filename,
        });

        res.redirect('/');          //등록 후 메인목록 이동.
    }catch(err){
        console.error(err);
        next(err);
    }
}
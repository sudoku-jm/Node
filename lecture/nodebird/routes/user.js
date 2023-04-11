const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const User = require('../models/user');

// POST /user/1/follow
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try{
        const user = await User.findOne({where : {id : req.user.id}});
        if(user){
            await user.addFollowings(parseInt(req.params.id,10)); //팔로우 추가
            res.send('success');
        }else{
            res.status(404).send('no user');
        }
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;
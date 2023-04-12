const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const User = require('../models/user');

// POST /user/1/follow
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user) { // req.user.id가 followerId, req.params.id가 followingId
          await user.addFollowing(parseInt(req.params.id, 10));
          res.send('success');
        } else {
          res.status(404).send('no user');
        }
      } catch (error) {
        console.error(error);
        next(error);
      }
});

module.exports = router;
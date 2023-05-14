const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares');
const {addFollowing} = require('../controllers/user');

// POST /user/1/follow
router.post('/:id/follow', isLoggedIn, addFollowing);

module.exports = router;
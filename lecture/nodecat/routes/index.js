const express = require('express');
const { getMyPoster, searchByHashtag } = require('../controllers');

const router = express.Router();

// POST /test
// router.get('/test', test);

//GET /myposts
router.get('/myposts', getMyPoster);

//GET /search/:hashtag
router.get('/search/:hashtag', searchByHashtag);

module.exports = router;
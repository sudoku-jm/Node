const express = require('express');
const { getMyPoster, searchByHashtag, renderMain } = require('../controllers');

const router = express.Router();

// POST /test
// router.get('/test', test);

//GET /myposts
router.get('/myposts', getMyPoster);

//GET /search/:hashtag
router.get('/search/:hashtag', searchByHashtag);

//GET /
router.get('/', renderMain);

module.exports = router;
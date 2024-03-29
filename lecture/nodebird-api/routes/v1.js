const express = require('express');

const { verifyToken, deprecated } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag} = require('../controllers/v1');

const router = express.Router();

router.use(deprecated);     //모든 라우터에 사용.

// POST /v1/token
router.post('/token', createToken);

// POST /v1/test
router.get('/test', verifyToken, tokenTest);

//POST v1/posts/my
router.get('/posts/my',verifyToken, getMyPosts);

//POST v1/posts/hashtag/:title
router.get('/posts/hashtag/:title',verifyToken, getPostsByHashtag);

module.exports = router;
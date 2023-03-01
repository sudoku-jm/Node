const express = require('express');
const router = express.Router();


//  user/
router.get('/', (req, res) => {
    res.send('user ok!');
})


module.exports = router;
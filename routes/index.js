const express = require('express');
const path = require('path');

const user = require('./user');
const news = require('./news');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello. This is Football News backend.");
})

router.use('/api/user', user);
router.use('/api/news', news);

module.exports = router;
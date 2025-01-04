const express = require('express');
const router = express.Router();
const verifyToken = require("./verifyToken");

router.get('/', verifyToken, (req, res) => {
    res.send('This is a protected post.');
});

module.exports = router;
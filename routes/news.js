const express = require('express');
const router = express.Router();
const verifyToken = require("./verifyToken");

router.get('/', verifyToken, (req, res) => {
    console.log(req.user, "This is uer info");
    res.send('This is a protected post.');
});

module.exports = router;
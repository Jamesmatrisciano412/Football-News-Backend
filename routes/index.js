const express = require('express');
const path = require('path');

const user = require('./user');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("This is route index");
})

router.use('/api/user', user);

module.exports = router;
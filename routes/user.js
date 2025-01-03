const express = require("express");


const router  = express.Router();

module.exports = router;

router.get('/login', (req, res) => {
    console.log(req.body, "This is /api/user/login route.");
    res.status(200).send({message: "OK"});
});
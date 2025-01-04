const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access denied.');

    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verified;
        next();
    } catch(err) {
        console.log(err, "JWT verify error.");
        res.status(401).send('Invalid token');
    }
}
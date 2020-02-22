const jwt = require('jsonwebtoken');
const Users = require('../data/user-model');
const secrets = require('../config/secrets');

module.exports = (req, res, next) => {
    const token = req.headers.authorization;
    if(token) {
        jwt.verify(token, secrets.jwtSecret, (err, decoded) => {
            if(err) {
                res.status(400).json({message: 'You shall not pass!'});
            } else {
                req.decodedJwt = decoded;
                next();
            }
        })
    } else {
        res.status(400).json({message: 'No token present'})
    }
};
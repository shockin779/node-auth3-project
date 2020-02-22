const router = require('express').Router();
const Users = require('../data/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets');
const restricted = require('./auth-middleware');

router.get('/users', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => res.status(500).json({message: `Server error retrieving users: ${err}`}))
})

router.post('/register', (req, res) => {
    const newUser = req.body;
    if(!newUser.username || !newUser.password || !newUser.department) {
        res.status(400).json({message: 'You must provide a username, password, and department'});
    } else {
        const hash = bcrypt.hashSync(newUser.password, 10);
        newUser.password = hash;
        Users.addUser(newUser)
            .then(user => {
                [user] = user;
                res.status(201).json(user);
            })
            .catch(err => res.status(500).json({message: `Server error adding user: ${err}`}));
    }
})

router.post('/login', (req, res) => {
    const login = req.body;
    if(!login.username || !login.password) {
        res.status(400).json({message: 'You must provide a username and password'});
    }
    Users.findBy({username: login.username}).first()
        .then(user => {
            if(bcrypt.compareSync(login.password, user.password)) {
                const token = genToken(user)
                res.status(200).json({message: 'Logged in successful', token: token});
            } else {
                res.status(403).json({message: 'You shall not pass!'});
            }
        })
        .catch(err => res.status(500).json({message: `Server error getting your user account: ${err}`}))
})

function genToken(user) {
    
    const payload = {
        subject: user.id
    };

    const options = {
        expiresIn: '2h'
    }

    const token = jwt.sign(payload, secrets.jwtSecret, options);
    return token;
}

module.exports = router;
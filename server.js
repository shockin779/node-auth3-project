const express = require('express');
const helmet = require('helmet');
const server = express();
const authRouter = require('./auth/authRouter');

server.use(helmet());
server.use(express.json());

server.use('/api', authRouter);

server.get('/', (req, res) => {
    res.status(200).json({message: 'API is up and running'});
})

module.exports = server;
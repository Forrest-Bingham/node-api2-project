const express = require('express');

const postsRouter = require('./posts/posts-router.js');

const server = express();

server.use(express.json());

server.get('/', function(req,res){
    res.send(`
    <h2>API Project 2</h2>`
    );
});

server.use('/api/posts', postsRouter);

module.exports = server;


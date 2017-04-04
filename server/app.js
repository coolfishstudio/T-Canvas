'use strict';

var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var config = require('./config.json');

app.use(express.static(__dirname + '/../client'));

// io 链接
io.on('connection', function (socket) {
    console.log('有一个用户链接', socket.handshake.query.type);
});

http.listen(config.port, function () {
    console.log('项目已启动，端口号为' + config.port);
});

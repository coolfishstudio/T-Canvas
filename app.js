'use strict'
var express = require('express'),
    app = express(),
    path = require('path'),
    SocketIo = require('socket.io');

var port = 9019;

var Game = require('./server/Game');

// 静态文件存放位置
app.use(express.static(path.join(__dirname, 'client'), {maxAge: 86400000}));

// 路由
app.get('/ping', function (req, res) {
    res.end('OK');
});
// 首页
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
// 管理
app.get('/admin', function (req, res) {
    res.sendFile(__dirname + '/client/admin.html');
});

//往服务器端添加socket
var io = SocketIo.listen(app.listen(port, function () {
    console.log('项目已启动，端口号为' + port);
}));


var game = new Game();
// 监听
io.on('connection', function (socket) {
    console.log('有新的链接进来了');
    game.conn(socket);
});


'use strict';

var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);

var config = require('./config.json'),
    util = require('./util.js');

var users = [];
var sockets = {};

app.use(express.static(__dirname + '/../client'));

// io 链接
io.on('connection', function (socket) {
    console.log('[系统消息]有一个用户链接', socket.handshake.query.type);
    var type = socket.handshake.query.type;
    var name = socket.handshake.query.name;
    var position = {
        x: 280,
        y: 380
    };
    var cells = [];
    if (type === 'player') {
        cells = [{
            x: position.x,
            y: position.y
        }];
    }
    var currentPlayer = {
        id: socket.id,
        type: type,
        name: name,
        cells: cells,
        x: position.x,
        y: position.y,
        target: {
            x: 0,
            y: 0
        }
    };
    // 加入游戏
    socket.on('respawn', function () {
        var userIndex = util.findIndex(users, currentPlayer.id);
        // 如果已存在 则删除
        if (userIndex > -1) {
            users.splice(userIndex, 1);
        }
        socket.emit('join', currentPlayer);
        console.log('[系统消息] 用户加入。');
    });
    // 断开链接
    socket.on('disconnect', function () {
        var userIndex = util.findIndex(users, currentPlayer.id);
        if (userIndex > -1) {
            users.splice(userIndex, 1);
        }
        console.log('[系统消息] 玩家 ' + currentPlayer.name + ' 断开链接。');
        socket.broadcast.emit('playerDisconnect', { name: currentPlayer.name });
    });

    socket.on('gotit', function (player) {
        console.log('[系统消息] 玩家 ' + player.name + ' 链接中。');
        var userIndex = util.findIndex(users, player.id);
        if (userIndex > -1) {
            console.log('[系统消息] 玩家ID已经存在, 踢掉玩家。');
            socket.disconnect();
        } else if (!util.validNick(player.name)) {
            console.log('[系统消息] 玩家名字不合法, 踢掉玩家。');
            socket.emit('kick', 'Invalid username.');
            socket.disconnect();
        } else {
            console.log('[系统消息] 玩家 ' + player.name + ' 加入了链接!');
            sockets[player.id] = socket;

        }
    });
});

http.listen(config.port, function () {
    console.log('项目已启动，端口号为' + config.port);
});

var global = {
    mobile: false
};
// 加载socket
var socket = null;

var player = {
    id: -1,
    x: global.screenWidth / 2,
    y: global.screenHeight / 2,
    screenWidth: global.screenWidth,
    screenHeight: global.screenHeight,
    target: {
        x: global.screenWidth / 2,
        y: global.screenHeight / 2
    }
};

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    global.mobile = true;
}
window.onload = function () {
    // 加入游戏 
    $('#joinBtn').click(function () {
        if (util.validNick($('#playername').val())) {
            startGame('player');
        } else {
            alert('姓名不合法');
        }
    });
    // 观看游戏
    $('#spectateBtn').click(function () {
        startGame('spectate');
    });
    // 初始化游客名字
    initUserName();
};

// 初始化游客的名字
function initUserName () {
    var ts = String((new Date()).getTime()).substr(9, 4);
    var tempUserName = '游客' + ts;
    $('#playername').val(tempUserName);
}
// 开始游戏
function startGame (type) {
    global.playerName = $('#playername').val();
    global.playerType = type;
    global.screenWidth = window.innerWidth;
    global.screenHeight = window.innerHeight;

    $('#gameAreaWrapper').show();
    $('#startMenuWrapper').hide();

    if (!socket) {
        socket = io.connect({query: 'type=' + type + '&name=' + global.playerName});
        setupSocket(socket);
    }
    socket.emit('respawn');
    global.socket = socket;
}
// socket 通信
function setupSocket (socket) {
    socket.on('join', function (playerSettings) {
        player = playerSettings;
        player.name = global.playerName;
        player.screenWidth = global.screenWidth;
        player.screenHeight = global.screenHeight;
        global.player = player;
        global.gameStart = true;
        socket.emit('gotit', player);
    });
    socket.on('disconnect', function () {
        global.disconnected = true;
        global.kicked = true;
        socket.close();
    });
    socket.on('playerDisconnect', function (data) {
        console.log(data.name + '离开了游戏。');
    });
    socket.on('kick', function (data) {
        global.gameStart = false;
        console.log('>>>', data);
        socket.close();
    });
}
// 工具
var util = {
    validNick: function (value) {
        return /^[\w\u4e00-\u9fa5]*$/.exec(value) !== null;
    }
};

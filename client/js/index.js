window.onload = function () {
    // 加载socket
    var socket = io.connect();
    // 控制器设置
    var controller = {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        jump: 0,
        hit: 0,
        prop: 0
    };
    // 加入游戏
    function joinGame (options) {
        var userName = $('#username').val();
        socket.emit('join', {
            userName: userName,
            controller: options,
            roomId: 1
        });
    }
    // 初始化游客的名字
    function initUserName () {
        var ts = String((new Date()).getTime()).substr(9, 4);
        var tempUserName = '游客' + ts;
        $('#username').val(tempUserName);
    }
    // 初始化 加入房间
    function initJoin () {
        $('#joinBtn').click(function () {
            joinGame(controller);
        });
    }
    /* 初始化 */
    function init () {
        // 初始化游客名字
        initUserName();
        // 初始化链接
        initJoin();
    }
    init();
};
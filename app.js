var express = require('express'),
    app = express(),
    path = require('path');

var port = 9019;

app.listen(port, function () {
    console.log('项目已启动，端口号为' + port);
});

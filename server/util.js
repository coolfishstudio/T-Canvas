'use strict';

var config = require('./config.json');

// 根据id判断是否在数组内
exports.findIndex = function (arr, id) {
    var l = arr.length;
    while (l--) {
        if (arr[l].id === id) {
            return l;
        }
    }
    return -1;
};
exports.validNick = function (value) {
    return /^[\w\u4e00-\u9fa5]*$/.exec(value) !== null;
};
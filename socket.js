var tomSocket = /** @class */ (function () {
    function tomSocket(url, time, timeOut) {
        var _this = this;
        this.time = time;
        this.timeOut = timeOut;
        this.socket = new WebSocket(url);
        // 链接成功，60S发送心跳包
        this.socket.onopen = function () {
            _this.headTime();
        };
    }
    // 心跳定时器
    tomSocket.prototype.headTime = function () {
        var _this = this;
        this.SetHead = setTimeout(function () {
            // 发送心跳包
            _this.uSend("心跳包", true);
        }, this.time);
    };
    // 监控接收心跳包信息超时定时器
    tomSocket.prototype.getMessLong = function () {
        var _this = this;
        this.SetOut = setTimeout(function () {
            _this.socket.close();
        }, this.timeOut);
    };
    // 清除心跳包定时器，重置心跳包
    tomSocket.prototype.clearHead = function () {
        console.log("清除");
        // 清除
        clearTimeout(this.SetOut);
        // 重置
        this.headTime();
    };
    // 发送信息
    tomSocket.prototype.uSend = function (msg, head) {
        console.log("send" + msg);
        this.socket.send(msg);
        if (head) {
            this.getMessLong();
        }
    };
    // 断线触发重连
    tomSocket.prototype.reStar = function () {
        console.log("网络中断");
        // 触发重连
    };
    return tomSocket;
}());
var wsOne = new tomSocket("wss://echo.websocket.org/", 30000, 15000);
wsOne.socket.onmessage = function (msg) {
    console.log("收到" + msg.data);
    this.clearHead();
}.bind(wsOne);

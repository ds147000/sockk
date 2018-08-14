class SignalSocket{
    socket:any;
    private socketStatuc:number=0;//断线次数
    constructor(public url,public headr,public headTime,public messFun,public errorFun){
        // 设置请求URL
        $.connection.hub.url =url;
        // 存储socket代理对象
        this.socket=$.connection.chatHub;
        // 收到数据消息处理程序
        this.socket.client.broadcastMessage=function(message, data){
            this.messFun(message,data);
        }
        // 开始与服务器链接
        $.connection.hub.start( { transport: ['webSockets',"longPolling"] })
        .done(()=>{//链接成功
            this.sendHrad();
        })
        this.socket.error((error)=>{
            this.errorFun(error);
        })
    }
    // 心跳包定时程序
    private sendHrad(){
        if(this.socketStatuc==0){//链接成功启动
            console.log("启动心跳包程序")
            setInterval(()=>{
                this.uSend(this.headr,true);
            },this.headTime)
        }
    }
    uSend(Msg,init:boolean){
        if(init){
            this.socket.server.send(Msg);//发送心跳包
            this.getHeadMsg();//启动监控心跳包回复定时器
        }else{
            this.socket.server.send(Msg);//发送参数数据
        }
    }
}
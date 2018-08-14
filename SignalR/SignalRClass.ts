class SignalSocket{
    socket:any;
    private socketStatuc:number=0;//断线次数
    private setTimeNull:number=0;//记录获取心跳包超时次数
    private Monitor:any;
    constructor(public url,public headr,public headTime,public messFun,public errorFun,public onclose,public Slow ,public reStar,public reYes){
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
        this.socket.error((error)=>{//发生错误执行
            this.errorFun(error);
        })
        this.socket.received((Msg)=>{//接收到心跳包返回执行
            clearTimeout(this.Monitor)
        })
        this.socket.disconnected(()=>{//当连接已断开连接时引发
            this.onclose();
        })
        this.socket.connectionSlow(()=>{//当延迟高或网络断断续续引发
            this.Slow();
        })
        this.socket.reconnecting(()=>{//重新开始链接触发
            this.reStar();
        })
        this.socket.reconnected(()=>{//重新连接成功触发
            this.reYes();
        })
    }
    // 发送心跳包程序
    private sendHrad(){
        if(this.socketStatuc==0){//链接成功启动
            console.log("启动心跳包程序")
            setInterval(()=>{
                this.uSend(this.headr,true);
            },this.headTime)
        }
    }
    // 监控心跳包回复程序
    private getHeadMsg(){
        this.Monitor=setTimeout(()=>{
            if(this.setTimeNull>=3){//超时次数大于3，判断为网络不可用
                $.connection.hub.Stop();
            }
            this.setTimeNull+=1;
        },5000)
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
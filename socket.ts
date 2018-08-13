class tomSocket{
    socket:any;
    private SetHead:any;
    private SetOut:any;
    constructor(url:string,public time:number,public timeOut:number){
        this.socket=new WebSocket(url);
        // 链接成功，60S发送心跳包
        this.socket.onopen=()=>{
            this.headTime();
        }
    }
    // 心跳定时器
    private headTime(){
        clearTimeout(this.SetHead);
        this.SetHead=setTimeout(()=>{
            // 发送心跳包
            this.uSend("心跳包",true);
        },this.time)
    }
    // 监控接收心跳包信息超时定时器
    private getMessLong(){
        this.SetOut=setTimeout(()=>{
            this.socket.close();
        },this.timeOut)           
    }
    // 清除心跳包定时器，重置心跳包
    clearHead(){
        console.log("清除")
        // 清除超时定时器
        clearTimeout(this.SetOut);
        // 重置
        this.headTime();
    }
    // 发送信息
    uSend(msg,head:boolean){
        console.log("send"+msg)
        this.socket.send(msg)
        if(head){
            this.getMessLong();
        }
    }
    // 断线触发重连
    reStar(){
        console.log("网络中断");
        // 触发重连
    }
}
var wsOne=new tomSocket("wss://echo.websocket.org/",30000,15000);
wsOne.socket.onmessage=function(msg){
    console.log("收到"+msg.data)
    this.clearHead();
}.bind(wsOne)
class tomSocket{
    socket:any;
    private SetHead:any;
    private SetOut:any;
    private Interrupt:number=0;
    private status:number=0;
    private resTime:any;
    constructor(public url:string,public headObj,public time:number,public timeOut:number,public fun,public sendFun,public outFun){
        this.Interrupt++;
        this.socket=null;
        this.socket=new WebSocket(url);
        // 链接成功，60S发送心跳包
        this.socket.onopen=()=>{
            console.log("链接成功");
            if(this.Interrupt>1){//是否是断线后重连
                // 立即发送心跳包，进行网络测试
                this.uSend(this.headObj,true);
            }else{//首次登陆链接，60S后发送心跳包
                this.headTime();
            }
        }
        // 接收到信息处理程序
        this.socket.onmessage=(el)=>{
            this.Interrupt=0;
            this.resTime?clearTimeout(this.resTime):false;
            this.clearHead()//收到信息返回，删除超时监控器
            this.fun(el)//执行收到信息回调函数
        }
        // 发生链接中断进行重连
        this.socket.onclose=()=>{
            console.log("重新链接")
            this.reStar();
        }
        // 链接错误事件
        this.socket.onerror=(error)=>{
            if(this.status){//链接已经超时
                this.outFun();//执行确认网络中断回调函数
            }
        }
    }
    // 心跳定时器
    private headTime(){
        // 删除之前的心跳包程序
        clearTimeout(this.SetHead);
        this.SetHead=setTimeout(()=>{
            // 发送心跳包
            this.uSend(this.headObj,true);
        },this.time)
    }
    // 监控接收心跳包信息超时定时器
    private getMessLong(){
        this.SetOut=setTimeout(()=>{
            this.socket.close();
        },this.timeOut)           
    }
    // 清除心跳包定时器，重置心跳包
    private clearHead(){
        console.log("清除超时监控器")
        // 清除超时定时器
        clearTimeout(this.SetOut);
        // 重置
        this.headTime();
    }
    // 发送信息
    uSend(msg,head:boolean){
        console.log("send"+msg)
        this.socket.send(msg)
        if(head){//是否是发送心跳包的程序
            this.getMessLong();
        }else{
            this.sendFun();//执行发送信息后的回调函数
        }
    }
    // 断线触发重连
    private reStar(){
        this.Interrupt=1;
        console.log("网络中断");
        // 启动链接计时器
        this.resTime=setTimeout(()=>{
            this.status=1;
        },5000)
        // 触发重连
        this.constructor(this.url,this.headObj,this.time,this.timeOut,this.fun,this.sendFun,this.outFun);

    }
}
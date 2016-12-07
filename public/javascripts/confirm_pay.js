document.addEventListener("DOMContentLoaded", function () {
    var configSign = document.getElementById("configSign");
    var appIdDom = document.getElementById("appId");
    var configTs = document.getElementById("configTimestamp");
    var nonceStr = document.getElementById("nonceStr");
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appIdDom.value, // 必填，公众号的唯一标识
        timestamp: configTs.value, // 必填，生成签名的时间戳
        nonceStr: nonceStr.value, // 必填，生成签名的随机串
        signature: configSign.value,// 必填，签名，见附录1
        jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    }); 

    var payTimestamp = document.getElementById("ts");
    var package = document.getElementById("package");
    var signType = document.getElementById("signType");
    var paySign = document.getElementById("paySign");
    // console.log("appId",appIdDom.value);
    // console.log("ts",payTimestamp.value);
    // console.log("nonceStr",nonceStr.value);
    // console.log("package",package.value);
    // console.log("signType",signType.value);
    // console.log("paySign:",paySign.value);
    function onBridgeReady(){
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
            "appId":appIdDom.value,     //公众号名称，由商户传入     
            "timeStamp":payTimestamp.value,         //时间戳，自1970年以来的秒数     
            "nonceStr": nonceStr.value, //随机串     
            "package": package.value,     
            "signType": signType.value,         //微信签名方式：     
            "paySign": paySign.value//微信签名 
        },
        function(res){     
            if(res.err_msg == "get_brand_wcpay_request：ok" ) {}     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
        }
    ); 
    }
    if (typeof WeixinJSBridge == "undefined"){
        if( document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
    }else{
        onBridgeReady();
    }
});
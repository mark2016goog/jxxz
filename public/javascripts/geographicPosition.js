/**
 * Created by xuanhong on 16/10/6.
 */

document.addEventListener("DOMContentLoaded", function () {
    var ts = document.getElementById("ts").value;
    var nstr = document.getElementById("nstr").value;
    var sign = document.getElementById("sign").value;
    wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wxde4642a10788624f', // 必填，公众号的唯一标识
        timestamp: ts, // 必填，生成签名的时间戳
        nonceStr: nstr, // 必填，生成签名的随机串
        signature: sign,// 必填，签名，见附录1
        jsApiList: ["openLocation"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
});

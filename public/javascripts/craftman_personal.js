/**
 * Created by xuanhong on 16/10/7.
 */

document.addEventListener("DOMContentLoaded", function () {
    var popWin = document.getElementById("pop-dlg");
    window.cancelWithdraw = function () {
        popWin.style.display = "none";
    };

    window.showPopWin = function () {
        popWin.style.display = "block";
    };

    var amount = document.getElementById("withdraw-amount");
    window.confirmWithdraw = function () {
        var withdrawParam = {
            amount: amount.value
        };
        ajax.get("/withdraw", withdrawParam, function (res) {
            console.log(res);
            res = JSON.parse(res);
            if (res.withdrawResult) {
                alert("申请成功");
            } else {
                alert("申请失败");
            }
        });
        popWin.style.display = "none";
    };

    window.personalSetting = function () {
        window.location.href = "/craftmanSettingPage";
    };

    var telephoneNo = document.getElementById("telephone").innerText;
    sessionStorage.craftmanTelephone = telephoneNo;

    window.detailList = function(){
        window.location.href = "/getAccountDetailList";
    };

    var curCraftmanID = document.getElementById("curCraftmanID").value;
    var latitude = 0;
    var longitude = 0;
    window.businessCard = function(){
        window.location.href = "/craftmanBusinessCard?id=" + curCraftmanID + "&latitude=" + latitude + "&longitude=" + longitude;
    };

    var ts = document.getElementById("ts").value;
    var nstr = document.getElementById("nstr").value;
    var sign = document.getElementById("sign").value;
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: 'wxde4642a10788624f', // 必填，公众号的唯一标识
      timestamp: ts, // 必填，生成签名的时间戳
      nonceStr: nstr, // 必填，生成签名的随机串
      signature: sign,// 必填，签名，见附录1
      jsApiList: ["getLocation"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function(){
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
            latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            var speed = res.speed; // 速度，以米/每秒计
            var accuracy = res.accuracy; // 位置精度
            //jump to search craftman list
        }
      });
    });
});

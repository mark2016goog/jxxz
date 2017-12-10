document.addEventListener("DOMContentLoaded", function () {
    var popDialog = document.getElementById("pop-dlg");
    var cancelCallBtn = document.getElementById("cancel-call");
    // callBtn.addEventListener("click", function () {
    //     popDialog.style.display = "block";
    // });
    var applyBusinessCard = document.getElementById("apply-business-card");
    applyBusinessCard.addEventListener("click", function () {
        window.location.href = "/register-telephone";
    });

    cancelCallBtn.addEventListener("click", function () {
        popDialog.style.display = "none";
    });

    window.callPhone = function () {
        popDialog.style.display = "block";
    };

    var followBtn = document.getElementById("follow-btn");
    var unFollowBtn = document.getElementById("unfollow-btn");
    var craftmanId = document.getElementById("craftmanId").value;
    followBtn.addEventListener("click", function () {
        var queryParam = {
            id: craftmanId
        };
        ajax.get("/followCraftman", queryParam, function (response) {
            // console.log(JSON.parse(response));
            var result = JSON.parse(response);
            if (result.followResult === 1) {
                alert("关注成功");
                //change the focus button to focused
                followBtn.style.display = "none";
                unFollowBtn.style.display = "block";

            } else if (result.followResult === -1) {
                // not login
                window.location.href = "/?callbackURL=" + window.location.href;
            } else {
                alert("关注失败");
            }
        });
    });

    unFollowBtn.addEventListener("click", function () {
        var queryParam = {
            id: craftmanId
        };
        ajax.get("/unFollowCraftman", queryParam, function (response) {
            var result = JSON.parse(response);
            if (result.followResult) {
                alert("取消关注成功");
                //change the focused button to unfocused
                followBtn.style.display = "block";
                unFollowBtn.style.display = "none";
            } else {
                alert("取消关注失败");
            }
        });
    });

    var commentBtn = document.getElementById("comment-btn");
    commentBtn.addEventListener("click", function () {
        window.location.href = "/commentList?id=" + craftmanId;
    });

    var geoBtn = document.getElementById("geoBtn");

    var ts = document.getElementById("ts").value;
    var nstr = document.getElementById("nstr").value;
    var sign = document.getElementById("sign").value;
    var geoText = document.getElementById("geoText").value;
    var longitude = document.getElementById("longitude").value;
    var latitude = document.getElementById("latitude").value;
    var shop = document.getElementById("shop").value;
    var focused = document.getElementById("focused").value;

    if (focused === "1") {
        followBtn.style.display = "none";
        unFollowBtn.style.display = "block";
    }

    wx.config({
        appId: 'wxde4642a10788624f', // 必填，公众号的唯一标识
        timestamp: ts, // 必填，生成签名的时间戳
        nonceStr: nstr, // 必填，生成签名的随机串
        signature: sign,// 必填，签名，见附录1
        jsApiList: ["openLocation", "onMenuShareAppMessage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    geoBtn.addEventListener("click", function () {
        wx.openLocation({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            name: shop,
            address: geoText,
            scale: 14,
            infoUrl: 'http://weixin.qq.com'
        });
    });

    window.ToPayPage = function () {
        window.location.href = "/pay/prepay?craftmanID=" + craftmanId;
    }

    //don't forget to add protocol
    var shareUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?id=" + craftmanId;
    var shareImgUrl = document.getElementById("avatorURL").value;
    var craftmanName = document.getElementById("craftmanName").value;
    shareImgUrl = window.location.host + shareImgUrl.substring(1);

    wx.ready(function () {
        var shareData = {
            title: craftmanName,
            desc: craftmanName + "的工匠名片",
            link: shareUrl,
            imgUrl: "http://www.joinershow.cn/images/share-test.png",
            trigger: function () {
            },
            success: function () {
            },
            error: function () {
            }
        };
        wx.onMenuShareAppMessage(shareData);
    });
});

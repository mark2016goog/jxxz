document.addEventListener("DOMContentLoaded", function () {
  var photoArea = document.getElementById("photo");
  var submitBtn = document.getElementById("submit-btn");
  var ts = document.getElementById("ts").value;
  var nstr = document.getElementById("nstr").value;
  var sign = document.getElementById("sign").value;
  wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: 'wxde4642a10788624f', // 必填，公众号的唯一标识
      timestamp: ts, // 必填，生成签名的时间戳
      nonceStr: nstr, // 必填，生成签名的随机串
      signature: sign,// 必填，签名，见附录1
      jsApiList: ["chooseImage","uploadImage"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  });

  var previewImg = document.getElementById("preview-img");
  var localId = "";
  photoArea.addEventListener("click", function(){
    wx.chooseImage({
      success: function (res) {
        localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        previewImg.src = localId.toString();
        
      }
    })
  });

  submitBtn.addEventListener("click", function() {
    alert(localId);
    wx.uploadImage({
      localId: localId,
      isShowProgressTips: 1,
      success: function(res) {
        var serverId = res.serverId;
        console.log(serverId);
      }
    })
  })
})
document.addEventListener("DOMContentLoaded", function(){
  var getCaptchaBtn = document.getElementById("getCaptchaBtn");

  function showCountdown(){
    var countdown = document.getElementById("countdown");
    var initValue = 60;
    getCaptchaBtn.style.display = "none";
    countdown.style.display = "block";
    countdown.innerHTML = initValue + "S";
    initValue--;
    setInterval(function(){
      countdown.innerHTML = initValue + "S";
      initValue--;
    },1000);
  }
  
  window.retrieveValidateNo = function() {
    var mobilephone = document.getElementById("mobilephone").value.trim();
    if(mobilephone === "") {
      alert("手机号码不能为空！");
    }
    var param = {
      mobilephoneNumber:  mobilephone
    } ;
    ajax.get("/retrieveValidateNumer", param, function (response) {
      try{
        var resCode = JSON.parse(response).validateSendResult;
        console.log("validateSendResult", resCode);
        if(resCode === 1) {//发送成功
          showCountdown()
        } 
        if(resCode === 2) {
          alert("该手机号已经注册过");
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  window.goNext = function() {
    // window.location.href = '/uploadBusinessCard';
    var mobilephone = document.getElementById("mobilephone").value.trim();
    if(mobilephone === "") {
      alert("手机号码不能为空！");
    }
    var authcode = document.getElementById("authcode").value.trim(); 
    if(authcode === "") {
      alert("验证码不能为空！");
    }
    var param = {
      phone: mobilephone,
      num: authcode
    };
    var recommend = document.getElementById("recommend").value.trim(); 
    if(recommend != '') {
      param.recommend = recommend;
    } 

    ajax.get("/businessmanRegister", param, function(res) {
        if(res.postValidateNo === 'false') {
          alert("注册失败！");
        }
    });
  }
})
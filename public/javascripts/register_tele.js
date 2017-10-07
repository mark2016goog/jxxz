document.addEventListener("DOMContentLoaded", function(){
  var getCaptchaBtn = document.getElementById("getCaptchaBtn");

  function showCountdown(){
    var countdown = document.getElementById("countdown");
    var initValue = 60;
    getCaptchaBtn.style.display = "none";
    countdown.style.display = "block";
    countdown.innerHTML = initValue + "S";
    initValue--;
    var countDownTime = setInterval(function(){
      countdown.innerHTML = initValue + "S";
      if(initValue > 0){
        initValue--;
      } else {
        getCaptchaBtn.style.display = "block";
        countdown.style.display = "none";
        initValue = 60;
      }

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
        var result = JSON.parse(res);
        if(result.result === 'false') {
          alert("注册失败！");
        } else {
          window.location.href = "/toUploadBusinessCardPage?phone="+mobilephone;
        }
    });
  }
})
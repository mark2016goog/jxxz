document.addEventListener("DOMContentLoaded", function(){
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
        var validateSendResult = JSON.parse(response).validateSendResult;
        if(validateSendResult) {//发送成功
          
        } else {

        }
      } catch (e) {
        console.error(e);
      }
    });
  }
})
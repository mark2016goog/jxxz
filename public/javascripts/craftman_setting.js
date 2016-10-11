/**
 * Created by xuanhong on 16/10/9.
 */
document.addEventListener("DOMContentLoaded", function () {
    window.logout = function () {
        window.history.go(-2);
    };
    var modifyPwdWin = document.getElementById("pop-dlg");
    window.modifyPwdDlg = function () {
        modifyPwdWin.style.display = "block";
    };
    window.hideModifyDlg = function () {
        modifyPwdWin.style.display = "none";
    };
    var content = document.getElementById("content");
    content.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    var countDownSeconds = 60;
    var unit = "秒";
    var sendVerifyFunc = function () {
        ajax.get("/getVerifyCode", {teleNo: telephone}, function (res) {
            console.log(res);
            res = JSON.parse(res);
            if (res.sendVerifyCodeResult) {
                var countSeconds = countDownSeconds;
                getVerifyBtn.innerText = countSeconds + unit;
                getVerifyBtn.removeEventListener("click", sendVerifyFunc, false);
                var countInterval = setInterval(function () {
                    countSeconds--;
                    getVerifyBtn.innerText = countSeconds + unit;
                }, 1000);
                setTimeout(function () {
                    clearInterval(countInterval);
                    getVerifyBtn.innerText = "获取验证码";
                    getVerifyBtn.addEventListener("click", sendVerifyFunc, false);
                }, countDownSeconds * 1000);
            } else {
                alert("发送失败");
            }
        });
    };
    var telephone = sessionStorage.craftmanTelephone;
    var getVerifyBtn = document.getElementById("getVerifyBtn");
    getVerifyBtn.addEventListener("click", sendVerifyFunc, false);

    var newPwdInput = document.getElementById("newpwd");
    var newPwdConfirmInput = document.getElementById("confirmNewpwd");
    var verifyCodeInput = document.getElementById("verifyCode");
    window.confirmModify = function () {
        var newPwdValue = newPwdInput.value;
        var newPwdConfirmValue = newPwdConfirmInput.value;
        var verifyCodeValue = verifyCodeInput.value;
        if (newPwdValue === "" || newPwdConfirmValue === "") {
            alert("密码不能为空");
            return;
        }
        if (verifyCodeValue === "") {
            alert("验证码不能为空");
            return;
        }
        if (newPwdValue != newPwdConfirmValue) {
            alert("两次输入的密码不相同!重新输入");
            return;
        }
        //modify password
        ajax.get("/modifyPassword", {teleNo: telephone, password: newPwdConfirmValue}, function (res) {
            console.log(res);
            res = JSON.parse(res);
            if (res.result) {
                alert("修改成功");
            }
        });
    };
});
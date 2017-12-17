
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

document.addEventListener("DOMContentLoaded", function () {
    var bindDialog = document.getElementById("dialog");
    window.payClick = function () {
        //判断是否绑定了手机，如果绑定了去支付页面,否则就弹出绑定手机的浮层
        var mobilephoneNumber = getCookie("mobilephoneNum");
        if (mobilephoneNumber.trim() === "") {
            bindDialog.style.display = "block";
        } else {
            //amount 单位是分
            var payAmountInputValue = realPayAmount.innerText;
            var reg = /^\d+(\.\d+)?$/;
            if (!reg.test(payAmountInputValue)) {
                alert("输入的金额不是数字！");
                return;
            }
            window.location.href = "/pay/confirmPay/?amount=" + 100 * parseFloat(payAmountInputValue);
        }

    }
    window.hideDialog = window.hideCouponDialog = window.hideBrandDialog = function () {
        bindDialog.style.display = "none";
        couponDialog.style.display = "none";
        brandDialog.style.display = "none";
    };
    var bindDialogInner = document.getElementById("bind-dialog");
    bindDialogInner.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    var couponDialogInner = document.getElementById("coupon-inner-dialog");
    couponDialogInner.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    var couponDialog = document.getElementById("coupon-dialog");
    var couponListDom = document.getElementById("couponList");
    window.showCouponList = function () {
        couponDialog.style.display = "block";
        ajax.get("/couponlistAsync", {}, function (response) {
            couponListDom.innerHTML = response;
        });
    };

    var brandDialog = document.getElementById("brand-dialog");
    var brandListDom = document.getElementById("brandList");
    // window.showBrandList = function () {
    //     brandDialog.style.display = "block";
    //     ajax.get("/brandListAsync", {}, function (response) {
    //         brandListDom.innerHTML = response;
    //     });
    // };

    var brandDialogInner = document.getElementById("brand-inner-dialog");
    brandDialogInner.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    var bindConfirmBtn = document.getElementById("bind-mobilephone-confirm-btn");
    var realPayAmount = document.getElementById("realPayAmount");
    bindConfirmBtn.addEventListener("click", function (e) {
        var mobilephone = document.getElementById("mobilephone").value.trim();
        if (mobilephone === "") {
            alert("手机号不能为空！");
            return;
        }

        var authcode = document.getElementById("authcode").value.trim();
        if (authcode === "") {
            alert("验证码不能为空！");
            return;
        }

        //发送绑定请求
        var mobilephone = document.getElementById("mobilephone").value.trim();
        var validateNum = document.getElementById("authcode").value.trim();
        var param = {
            phoneNumber: mobilephone,
            validateNum: validateNum
        };
        ajax.get("/bindMobilePhone", param, function (response) {
            try {
                var resCode = JSON.parse(response).bindResult;
                console.log(resCode);
                //绑定成功
                if(resCode === "1") {
                    bindDialog.style.display = "none";
                } else {
                    alert("绑定失败，请您重试一次！");
                }
            } catch (e) {
                console.error(e);
            }
        });
    });

    var payAmountInput = document.getElementById("payAmountInput");
    payAmountInput.addEventListener("input", function (e) {
        realPayAmount.innerText = payAmountInput.value;
    });

    var getCaptchaBtn = document.getElementById("getCaptchaBtn");
    var initValue = 60;
    function showCountdown() {
        var countdown = document.getElementById("countdown");

        getCaptchaBtn.style.display = "none";
        countdown.style.display = "block";
        countdown.innerHTML = initValue + "S";
        initValue--;
        var countDownTime = setInterval(function () {
            countdown.innerHTML = initValue + "S";
            if (initValue > 0) {
                initValue--;
            } else {
                getCaptchaBtn.style.display = "block";
                countdown.style.display = "none";
                initValue = 60;
                clearInterval(countDownTime);
            }
        }, 1000);
    }

    window.retrieveValidateNo = function () {
        var mobilephone = document.getElementById("mobilephone").value.trim();
        if (mobilephone === "") {
            alert("手机号码不能为空！");
        }

        var param = {
            mobilephoneNumber: mobilephone
        };
        ajax.get("/retrieveBindPhoneValidateNumer", param, function (response) {
            try {
                var resCode = JSON.parse(response).validateSendResult;
                if (resCode === 1) {//发送成功
                    showCountdown()
                } else {
                    alert("发送验证码失败！");
                }
            } catch (e) {
                console.error(e);
            }
        });
    };

});
document.addEventListener("DOMContentLoaded", function () {
    var bindDialog = document.getElementById("dialog");
    window.payClick = function () {
        bindDialog.style.display = "block";
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
        //amount 单位是分
        var payAmountInputValue = realPayAmount.innerText;
        var reg = /^\d+(\.\d+)?$/;
        if (!reg.test(payAmountInputValue)) {
            alert("输入的金额不是数字！");
            return;
        }

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

        window.location.href = "/pay/confirmPay/?amount=" + 100 * parseFloat(payAmountInputValue);
    });

    var payAmountInput = document.getElementById("payAmountInput");
    payAmountInput.addEventListener("input", function (e) {
        realPayAmount.innerText = payAmountInput.value;
    });

    var getCaptchaBtn = document.getElementById("getCaptchaBtn");
    function showCountdown() {
        var countdown = document.getElementById("countdown");
        var initValue = 60;
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
        ajax.get("/retrieveValidateNumer", param, function (response) {
            try {
                var resCode = JSON.parse(response).validateSendResult;
                console.log("validateSendResult", resCode);
                if (resCode === 1) {//发送成功
                    showCountdown()
                }
                if (resCode === 2) {
                    alert("该手机号已经注册过");
                }
            } catch (e) {
                console.error(e);
            }
        });
    };

});
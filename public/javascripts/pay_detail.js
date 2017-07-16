document.addEventListener("DOMContentLoaded", function () {
    var bindDialog = document.getElementById("dialog");
    window.payClick = function(){
        bindDialog.style.display = "block";
    }
    window.hideDialog = window.hideCouponDialog = window.hideBrandDialog =function(){
        bindDialog.style.display = "none";
        couponDialog.style.display = "none";
        brandDialog.style.display = "none";
    };
    var bindDialogInner = document.getElementById("bind-dialog");
    bindDialogInner.addEventListener("click",function(e){
        e.stopPropagation();
    });

    var couponDialogInner = document.getElementById("coupon-inner-dialog");
    couponDialogInner.addEventListener("click",function(e){
        e.stopPropagation();
    });

    var couponDialog = document.getElementById("coupon-dialog");
    var couponListDom = document.getElementById("couponList");
    window.showCouponList = function(){
        couponDialog.style.display = "block";
        ajax.get("/couponlistAsync",{},function(response){
            couponListDom.innerHTML = response;
        });
    };

    var brandDialog = document.getElementById("brand-dialog");
    var brandListDom = document.getElementById("brandList");
    window.showBrandList = function(){
        brandDialog.style.display = "block";
        ajax.get("/brandListAsync",{},function(response){
            brandListDom.innerHTML = response;
        });
    };

    var brandDialogInner = document.getElementById("brand-inner-dialog");
    brandDialogInner.addEventListener("click",function(e){
        e.stopPropagation();
    });

    var bindConfirmBtn = document.getElementById("bind-mobilephone-confirm-btn");
    var realPayAmount = document.getElementById("realPayAmount");
    bindConfirmBtn.addEventListener("click", function(e){
        //amount 单位是分
        var payAmountInputValue = realPayAmount.innerText;
        var reg = /^\d+(\.\d+)?$/;
        if(reg.test(payAmountInputValue)){
            window.location.href = "/confirmPay/?amount=" + 100*parseFloat(payAmountInputValue);
        } else {
            alert("输入的金额不是数字！");
        }
    });

    var payAmountInput = document.getElementById("payAmountInput");
    payAmountInput.addEventListener("input",function(e){
        realPayAmount.innerText = payAmountInput.value;
    });

});
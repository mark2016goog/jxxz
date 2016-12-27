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

    window.businessCard = function(){
        window.location.href = "/craftmanBusinessCard?id=" + curCraftmanID;
    };
});

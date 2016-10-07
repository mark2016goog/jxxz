/**
 * Created by xiangkai on 16/9/7.
 */

document.addEventListener("DOMContentLoaded", function(){
    var completedOrderDiv = document.getElementById("completed-order");
    completedOrderDiv.addEventListener("click", function(){
        window.location.href = "/orderlist";
    });

    var couponListDiv = document.getElementById("coupon-list");
    couponListDiv.addEventListener("click", function(){
        window.location.href = "/couponlist";
    });

    var followedCraftman = document.getElementById("followed-craftman");
    followedCraftman.addEventListener("click", function(){
        window.location.href = "/followedCraftmanList";
    });

    var logoutBtn = document.getElementById("logout");
    logoutBtn.addEventListener("click",function(){
        window.history.back();
    });
});

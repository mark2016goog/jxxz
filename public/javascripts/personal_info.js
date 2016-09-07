/**
 * Created by xiangkai on 16/9/7.
 */

document.addEventListener("DOMContentLoaded", function(){
    var completedOrderDiv = document.getElementById("completed-order");
    completedOrderDiv.addEventListener("click", function(){
        window.location.href = "/orderlist";
    });
});

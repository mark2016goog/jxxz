/**
 * Created by xuanhong on 16/9/22.
 */

document.addEventListener("DOMContentLoaded", function () {
    var callBtn = document.getElementById("callphone");
    var popDialog = document.getElementById("pop-dlg");
    var cancelCallBtn = document.getElementById("cancel-call");
    callBtn.addEventListener("click", function () {
        popDialog.style.display = "block";
    });
    cancelCallBtn.addEventListener("click", function () {
        popDialog.style.display = "none";
    });

    var followBtn = document.getElementById("follow-btn");
    var craftmanId = document.getElementById("craftmanId").value;
    followBtn.addEventListener("click", function () {

        var queryParam = {
            id: craftmanId
        };
        ajax.get("/followCraftman", queryParam, function (response) {
            alert("关注成功");
        });
    });

    var commentBtn = document.getElementById("comment-btn");
    commentBtn.addEventListener("click", function () {
        window.location.href = "/commentList";
    });

    var geoBtn = document.getElementById("geoBtn");
    geoBtn.addEventListener("click", function () {
        window.location.href = "/geoPosition";
    });
});

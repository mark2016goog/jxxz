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
});
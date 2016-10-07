/**
 * Created by xuanhong on 16/10/7.
 */

document.addEventListener("DOMContentLoaded", function () {
    var usernameInput = document.getElementById("username");
    var pwd = document.getElementById("password");
    window.login = function () {
        var loginParam = {
            name: usernameInput.value,
            password: pwd.value
        };
        ajax.get("/loginCraftman", loginParam, function (res) {
            console.log(res);
            res = JSON.parse(res);
            if (res.loginSuc) {
                window.location.href = "/craftmanPersonalInfo";
            }
        });
    };
});

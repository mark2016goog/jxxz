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
            console.log(res);
            if (res.loginSuc) {
                window.location.href = "/craftmanPersonalInfo";
            } else {
                alert("用户名或者密码错误！请重新输入");
            }
        });
    };

    window.toRegisterPage = function () {
        window.location.href = "/register-telephone";
    };

    window.findbackPwd = function() {
        
    }

    window.contactCustomerService = function() {

    }
});

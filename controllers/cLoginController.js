/**
 * Created by xiangkai on 16/9/4.
 */
var request  = require("request");
var getAccessTokenURL = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxde4642a10788624f&secret=4e67e578e0318def0512293bff7e1550&code=CODE&grant_type=authorization_code";
exports.loginPage = function (req, res, next) {
    var loginData = {
        title: '用户登录',
        redirectUrl: encodeURIComponent('http://www.joinershow.cn/wechat_login')
    };
    res.render('login_c', loginData);
};

exports.weChatCallback = function (req, res, next) {
    res.send("code:" + JSON.stringify(req.query.code));
    var oauthCode = req.query.code;
    request.get("");
};

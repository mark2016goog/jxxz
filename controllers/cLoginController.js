/**
 * Created by xiangkai on 16/9/4.
 */
var request = require("request");
var getAccessTokenURL = "https://api.weixin.qq.com/sns/oauth2/access_token";
exports.loginPage = function (req, res, next) {
    var loginData = {
        title: '用户登录',
        redirectUrl: encodeURIComponent('http://www.joinershow.cn/wechat_login')
    };
    res.render('login_c', loginData);
};

exports.weChatCallback = function (req, res, next) {
    var oauthCode = req.query.code;
    var reqParam = {
        url: getAccessTokenURL,
        qs: {
            appid: "wxde4642a10788624f",
            secret: "4e67e578e0318def0512293bff7e1550",
            code: oauthCode,
            grant_type: "authorization_code"
        }
    };

    //body:{\"access_token\":\"1ZIqmH9JV0VAbaFx3aOYRJtlWTSAmsZs5iwaZYD7l0p0qE8T8uc0pzjtC0Tnx3mGdC4aldCbfbY7AS14vwh4ZpWzXVoheUpnfGr1LgYOJmY\",
    // \"expires_in\":7200,\"refresh_token\":\"bYXfbr4ucAL4KOwiKMD0V28_nRDTQhUKqPowvK_e9otknta4xHf_des2knBMja0gxiuPN-EIHmf2ZkgYWRBrSIFJcNZi5y5ItYEIPKbLdgE\",
    // \"openid\":\"ox8tuwPgKfc-_ZmY3ues-4TfSrAI\",\"scope\":\"snsapi_userinfo\"}

    request.get(reqParam, function (error, response, body) {
        console.log(body);
        var body = JSON.parse(body);
        var personalInfo = {
            avatorUrl: "",
            nickName: "xiangkai",
            gender: "男",
            bindMobilephone: "未绑定"
        };
        res.render('personal_info', personalInfo);
    });


};

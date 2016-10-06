/**
 * Created by xuanhong on 16/10/6.
 */
var request = require("request");

var GlobalCache = function () {
    this.accessToken = "000";
    var reqParam = {
        url: "https://api.weixin.qq.com/cgi-bin/token",
        qs: {
            grant_type: "client_credential",
            appid: "wxde4642a10788624f",
            secret: "4e67e578e0318def0512293bff7e1550",
        }
    };

    var self = this;

    var callback = function (error, response, body) {
        console.log(body);
        //{"access_token":"ACCESS_TOKEN","expires_in":7200}
        //{"errcode":40013,"errmsg":"invalid appid"}
        var body = JSON.parse(body);
        self.accessToken = body.access_token;
    };

    request.get(reqParam, callback);
};

GlobalCache.prototype.getAccessToken = function () {
    return this.accessToken;
};

var Singleton = function () {
    var cache = new GlobalCache();
    this.getInstance = function () {
        return cache;
    };
};

module.exports = Singleton;
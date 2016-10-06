/**
 * Created by xuanhong on 16/10/6.
 */
var request = require("request");
var alphabet = "abcdefghijklmnopqrstuvwxyz";
var randStrLen = 20;

var GlobalCache = function () {
    this.accessToken = "000";
    this.jsapi_ticket = "111";

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
        var ticketParam = {
            url: "https://api.weixin.qq.com/cgi-bin/ticket/getticket",
            qs: {
                access_token: body.access_token,
                type: "jsapi"
            }
        };
        var getTicketCallback = function (error, response, ticketData) {
            var ticket = JSON.parse(ticketData).ticket;
            self.jsapi_ticket = ticket;
        };

        request.get(ticketParam, getTicketCallback);
    };

    request.get(reqParam, callback);
};

GlobalCache.prototype.getAccessToken = function () {
    return this.accessToken;
};

GlobalCache.prototype.getApiTicket = function () {
    return this.jsapi_ticket;
};

GlobalCache.prototype.getRandomStr = function () {
    var randStr = "";
    for (var p = 0; p < randStrLen; p++) {
        var randNum = Math.random() * 26;
        randNum = Math.floor(randNum);
        randStr.push(alphabet[randNum]);
    }
    return randStr;
};

var Singleton = function () {
    var cache = new GlobalCache();
    this.getInstance = function () {
        return cache;
    };
};

module.exports = Singleton;
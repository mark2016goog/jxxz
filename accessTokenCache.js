/**
 * Created by xuanhong on 16/10/6.
 */
var request = require("request");
var scheduler = require("node-schedule");
var rule = new scheduler.RecurrenceRule();
rule.hour = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
var alphabet = "abcdefghijklmnopqrstuvwxyz";
var randStrLen = 20;
var getTokenURL = "https://api.weixin.qq.com/cgi-bin/token";
var getTicketURL = "https://api.weixin.qq.com/cgi-bin/ticket/getticket";
var appID = "wxde4642a10788624f";
var appSecret = "4e67e578e0318def0512293bff7e1550";


var GlobalCache = function () {
    this.jsapi_ticket = "";
    var self = this;
    var getTicket = function () {
        var reqParam = {
            url: getTokenURL,
            qs: {
                grant_type: "client_credential",
                appid: appID,
                secret: appSecret,
            }
        };

        var callback = function (error, response, body) {
            //{"access_token":"ACCESS_TOKEN","expires_in":7200}
            //{"errcode":40013,"errmsg":"invalid appid"}
            var body = JSON.parse(body);
            var ticketParam = {
                url: getTicketURL,
                qs: {
                    access_token: body.access_token,
                    type: "jsapi"
                }
            };
            var getTicketCallback = function (error, response, ticketData) {
                var ticket = JSON.parse(ticketData).ticket;
                console.log("ticket:" + ticket);
                self.jsapi_ticket = ticket;
            };

            request.get(ticketParam, getTicketCallback);
        };

        request.get(reqParam, callback);
    };

    getTicket();//excute when startup

    scheduler.scheduleJob(rule, getTicket);
};

GlobalCache.prototype.getApiTicket = function () {
    return this.jsapi_ticket;
};

GlobalCache.prototype.getRandomStr = function () {
    var randStr = "";
    for (var p = 0; p < randStrLen; p++) {
        var randNum = Math.random() * 26;
        randNum = Math.floor(randNum);
        randStr += alphabet[randNum];
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
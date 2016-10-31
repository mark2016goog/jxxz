/**
 * Created by xiangkai on 16/10/31.
 */

var request = require("request");

exports.callApi = function (method, url, paramObj) {
    if (method.toLowerCase() == "post") {
        return new Promise(function (resolve, reject) {
            request.post({
                url: url,
                form: paramObj
            }, function (err, httpResponse, body) {
                if (err) {
                    reject(err);
                }
                resolve(body);
            });
        });
    }
    if (method.toLowerCase() == "get") {
        return new Promise(function (resolve, reject) {
            request.get({
                url: url,
                qs: paramObj
            }, function (err, repsonse, body) {
                if (err) {
                    reject(err);
                }
                resolve(body);
            });
        });
    }
}
/**
 * Created by xiangkai on 16/9/4.
 */
var request = require("request");
var crypto = require("crypto");
var xml2js = require("xml2js");
var util = require("./util");
var log4js = require("log4js");

var xmlParser = new xml2js.Parser();

var getAccessTokenURL = "https://api.weixin.qq.com/sns/oauth2/access_token";
var prePayURL = "https://api.mch.weixin.qq.com/pay/unifiedorder";
var appid = "wxde4642a10788624f";
var secret = "4e67e578e0318def0512293bff7e1550";
var commercialAccountID = "1387195102";
var apiServerAddress = "http://139.196.243.125:17001/server/webapi";
// var apiServerAddress = "http://127.0.0.1:17001/server/webapi";
var commonUserLogin = "/normaluser/login";//普通用户登录
var personalOrderURL = "/order/normaluser/orders";//获取自己的订单列表
var personalCouponURL = "/coupon/coupon"; //获取优惠券列表
var followedCraftman = "/masters/master/mark";//关注的工匠
var logoutURL = "/normaluser/login";
var searchCraftmanURL = "/masters/all";
var getCraftmanDetailURL = "/masterdetail/detail";
var followCraftmanURL = "/masterdetail/markmaster";
var unFollowCraftmanURL = "/masterdetail/unmarkmaster";
var getCommentListURL = "/comment/all";
var craftmanLoginURL = "/masteruser/login";
var getCraftmanInfoURL = "/masteruser/info";
var getBrandListURL = "/getBrandList";
var getValidateNumberURL = "/masteruser/register/apply";
var postValidateNumberURL = '/masteruser/register/validate';
var generateNewOrderURL = '/order/neworder';
var updateOrderUrl = '/order/updateorder';
var payResultURL = '/order/payresult';
var updateCraftmanImage = '/masteruser/register/updatecard';
var selectBrand = '/normaluser/brand/pickbrand';
var bindPhoneGetValidateNum = "/normaluser/bindphone/getvalidatenum";
var bindPhone = "/normaluser/bindphone/validate";
var apiKey = "xiaozhujiangxin12340987656565482";
// var logger = log4js.getLogger('cheese');

exports.loginPage = function (req, res, next) {
    var token = req.cookies["token"];
    var callbackURL = req.query.callbackURL; //任何需要三方登录的业务都需要传递这个callbackURL，否则登录成功后就默认跳到个人信息页
    var redirectURL = encodeURIComponent('http://www.joinershow.cn/wechat_login');
    if (callbackURL !== "" && callbackURL !== undefined) {
        redirectURL = encodeURIComponent('http://www.joinershow.cn/wechat_login' + '/?callbackURL=' + callbackURL);
    }
    var loginData = {
        title: '用户登录',
        redirectUrl: redirectURL
    };
    res.render('login_c', loginData);
};

exports.weChatCallback = function (req, res, next) {
    var oauthCode = req.query.code;
    var cbURL = req.query.callbackURL;
    var reqParam = {
        url: getAccessTokenURL,
        qs: {
            appid: appid,
            secret: secret,
            code: oauthCode,
            grant_type: "authorization_code"
        }
    };

    //body:{\"access_token\":\"1ZIqmH9JV0VAbaFx3aOYRJtlWTSAmsZs5iwaZYD7l0p0qE8T8uc0pzjtC0Tnx3mGdC4aldCbfbY7AS14vwh4ZpWzXVoheUpnfGr1LgYOJmY\",
    // \"expires_in\":7200,\"refresh_token\":\"bYXfbr4ucAL4KOwiKMD0V28_nRDTQhUKqPowvK_e9otknta4xHf_des2knBMja0gxiuPN-EIHmf2ZkgYWRBrSIFJcNZi5y5ItYEIPKbLdgE\",
    // \"openid\":\"ox8tuwPgKfc-_ZmY3ues-4TfSrAI\",\"scope\":\"snsapi_userinfo\"}

    request.get(reqParam, function (error, response, body) {

        var weixinLoginResult = JSON.parse(body);
        var loginParam = {
            openID: weixinLoginResult.openid,
            access_token: weixinLoginResult.access_token,
            refresh_token: weixinLoginResult.refresh_token,
            expire: weixinLoginResult.expires_in
        };


        request.post({
            url: apiServerAddress + commonUserLogin, form: loginParam
        }, function (error, response, body) {
            var resObj = JSON.parse(body);
            var repsonseInfo = resObj.user;
            if (repsonseInfo === undefined || repsonseInfo === null) {
                repsonseInfo = new Object();
            }
            var personalInfo = {
                avatorUrl: repsonseInfo.imageUrl,
                nickName: repsonseInfo.nickName,
                gender: repsonseInfo.gender == "1" ? "男" : "女",
                bindMobilephone: repsonseInfo.phoneNumber
            };
            var token = resObj.token;
            var cookieAge = 1000 * 60 * 60 * 1000;
            res.cookie("token", token, { maxAge: cookieAge });
            res.cookie("openid", weixinLoginResult.openid, { maxAge: cookieAge });
            if(personalInfo.bindMobilephone === undefined) {
                personalInfo.bindMobilephone = "";
            }
            console.log("repsonseInfo",repsonseInfo);
            res.cookie("mobilephoneNum", personalInfo.bindMobilephone);
            if (cbURL === undefined) {
                res.render('personal_info', personalInfo);
            } else {
                res.redirect(cbURL);
            }
        });

    });
};

exports.orderList = function (req, res, next) {
    var token = req.cookies["token"];
    var param = {
        token: token
    };
    //{"brand":"天梭","createDate":"2016-11-01T01:00:00+08:00","masterName":"张师傅","money":300.0,"orderId":"订单号码"}
    request.post({ url: apiServerAddress + personalOrderURL, form: param }, function (err, response, body) {

        var resObj = JSON.parse(body).results;
        if (resObj === undefined || resObj === null) {
            resObj = [];
        }
        var orderList = [];
        for (var i = 0; i < resObj.length; i++) {
            var item = {
                brand: resObj[i].brand,
                orderID: resObj[i].orderId,
                payTime: resObj[i].createDate,
                payAmount: resObj[i].money,
                worker: resObj[i].masterName
            };
            orderList.push(item);
        }
        var pageData = {
            list: orderList
        }
        res.render('order_list', pageData);
    });
};

exports.couponList = function (req, res, next) {
    var token = req.cookies["token"];
    var param = {
        token: token
    };

    request.post({ url: apiServerAddress + personalCouponURL, form: param }, function (err, response, body) {

        var resObj = JSON.parse(body).results;
        if (resObj === undefined || resObj === null) {
            resObj = [];
        }
        var couponList = [];
        for (var i = 0; i < resObj.length; i++) {
            var startDateString = (new Date(resObj[i].startTime)).toISOString();
            var endDateString = (new Date(resObj[i].endTime)).toISOString();
            var item = {
                id: i,
                amount: resObj[i].money,
                validStartTime: startDateString.substr(0, 10),
                validEndTime: endDateString.substr(0, 10)
            };
            couponList.push(item);
        }
        var pageData = {
            list: couponList
        }
        res.render('coupon', pageData);
    });
};

exports.couponListAsync = function (req, res, next) {
    var token = req.cookies["token"];
    var param = {
        token: token
    };

    request.post({ url: apiServerAddress + personalCouponURL, form: param }, function (err, response, body) {
        var resObj = JSON.parse(body).results;
        var couponList = [];
        for (var i = 0; i < resObj.length; i++) {
            var startDateString = (new Date(resObj[i].startTime)).toISOString();
            var endDateString = (new Date(resObj[i].endTime)).toISOString();
            var item = {
                id: i,
                amount: resObj[i].money,
                validStartTime: startDateString.substr(0, 10),
                validEndTime: endDateString.substr(0, 10)
            };
            couponList.push(item);
        }
        var pageData = {
            list: couponList
        }
        res.render("async/coupon_list_fragment", pageData);
    });
};

exports.brandListAsync = function (req, res, next) {
    var token = req.cookies["token"];
    var param = {
        token: token
    };

    var brandList = [
    ];

    var pageData = {
        list: brandList
    }
    res.render("async/brand_list_fragment", pageData);
};

exports.followedCraftmanList = function (req, res, next) {
    var token = req.cookies["token"];
    var param = {
        token: token
    };

    var apiTicket = GlobalCache.getApiTicket();
    var nonceStr = GlobalCache.getRandomStr();
    var timestamp = (new Date()).getTime();
    var url = req.protocol + "://" + req.get("host") + req.originalUrl;

    var combineString = "jsapi_ticket=" + apiTicket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url;

    var shasum = crypto.createHash("sha1");
    shasum.update(combineString);
    var signature = shasum.digest("hex");


    request.post({ url: apiServerAddress + followedCraftman, form: param }, function (err, response, body) {

        var resObj = JSON.parse(body).result;
        var followedCraftmanList = [];
        if (resObj === undefined || resObj === null) {
            resObj = [];
        }
        for (var i = 0; i < resObj.length; i++) {
            var item = {
                id: resObj[i].id,
                avatorUrl: "./images/avator.jpg",
                name: resObj[i].name,
                company: resObj[i].shop,
                starLevel: parseInt(resObj[i].marks),
                orderCounts: resObj[i].orderCount,
                workAddress: resObj[i].address,
                distance: resObj[i].distance.toFixed(1)
            };
            followedCraftmanList.push(item);
        }
        var pageData = {
            title: "followedCraftman",
            list: followedCraftmanList,
            timestamp: timestamp,
            nonceStr: nonceStr,
            signature: signature
        }
        res.render('followed_craftman_list', pageData);
    });

};

exports.preloadPosition = function (req, res, next) {
    var apiTicket = GlobalCache.getApiTicket();
    var nonceStr = GlobalCache.getRandomStr();
    var timestamp = (new Date()).getTime();
    var url = req.protocol + "://" + req.get("host") + req.originalUrl;

    var combineString = "jsapi_ticket=" + apiTicket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url;

    var shasum = crypto.createHash("sha1");
    shasum.update(combineString);
    var signature = shasum.digest("hex");

    var detail = {
        timestamp: timestamp,
        nonceStr: nonceStr,
        signature: signature
    };

    res.render('get_position', detail);
}

exports.searchCraftman = function (req, res, next) {
    var param = {
        searchType: 1,
        longitude: parseFloat(req.query.longitude),
        latitude: parseFloat(req.query.latitude)
    };

    var apiTicket = GlobalCache.getApiTicket();
    var nonceStr = GlobalCache.getRandomStr();
    var timestamp = (new Date()).getTime();
    var url = req.protocol + "://" + req.get("host") + req.originalUrl;

    var combineString = "jsapi_ticket=" + apiTicket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url;

    var shasum = crypto.createHash("sha1");
    shasum.update(combineString);
    var signature = shasum.digest("hex");

    request.post({ url: apiServerAddress + searchCraftmanURL, form: param }, function (error, response, body) {
        try {
            var resObj = JSON.parse(body).result;
            var craftmanList = [];
            for (var i = 0; i < resObj.length; i++) {
                var item = {
                    id: resObj[i].id,
                    avatorUrl: "./images/avator.jpg",
                    name: resObj[i].name,
                    company: resObj[i].shop,
                    starLevel: resObj[i].marks,
                    orderCounts: resObj[i].orderCount,
                    workAddress: resObj[i].address,
                    distance: resObj[i].distance.toFixed(1),
                    longitude: resObj[i].longitude,
                    latitude: resObj[i].latitude
                };
                craftmanList.push(item);
            }

            var pageData = {
                title: "searchCraftman",
                list: craftmanList,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature
            };
            res.render('craftman_filter_list', pageData);
        }
        catch (e) {
        }
    });
};


exports.searchCraftmanAsync = function (req, res, next) {
    var searchType = req.query.searchType;
    var longitude = parseFloat(req.query.longitude);
    var latitude = parseFloat(req.query.latitude);
    var param = {
        searchType: searchType,
        longitude: longitude,
        latitude: latitude
    };

    request.post({ url: apiServerAddress + searchCraftmanURL, form: param }, function (error, response, body) {

        var resObj = JSON.parse(body).result;
        var craftmanList = [];
        for (var i = 0; i < resObj.length; i++) {
            var item = {
                id: resObj[i].id,
                avatorUrl: "./images/avator.jpg",
                name: resObj[i].name,
                company: resObj[i].shop,
                starLevel: resObj[i].marks,
                orderCounts: resObj[i].orderCount,
                workAddress: resObj[i].address,
                distance: resObj[i].distance.toFixed(1),
                longitude: resObj[i].longitude,
                latitude: resObj[i].latitude
            };
            craftmanList.push(item);
        }
        var pageData = {
            title: "searchCraftman",
            list: craftmanList
        };
        res.render('async/craftman_list_fragment', pageData);
    });
};

exports.craftmanDetail = function (req, res, next) {
    var apiTicket = GlobalCache.getApiTicket();
    var nonceStr = GlobalCache.getRandomStr();
    var timestamp = (new Date()).getTime();
    var url = req.protocol + "://" + req.get("host") + req.originalUrl;

    var combineString = "jsapi_ticket=" + apiTicket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url;

    var shasum = crypto.createHash("sha1");
    shasum.update(combineString);
    var signature = shasum.digest("hex");

    var craftmanId = req.query.id;
    var param = {
        id: craftmanId,
        longitude: 100,
        latitude: 100
    };

    request.post({ url: apiServerAddress + getCraftmanDetailURL, form: param }, function (err, response, body) {

        var detailObj = JSON.parse(body).result;
        detailObj = detailObj.length > 0 ? detailObj[0] : {};
        var craftmanDetail = {
            geoText: detailObj.address,
            timestamp: timestamp,
            nonceStr: nonceStr,
            signature: signature,
            id: detailObj.id,
            avatorUrl: "./images/avator.jpg",
            name: detailObj.name,
            company: detailObj.shop,
            starLevel: detailObj.marks,
            orderCounts: detailObj.orderCount,
            workAddress: detailObj.address,
            distance: detailObj.distance,
            intro: detailObj.description,
            telephone: detailObj.masterPhone,
            skilledBrandList: detailObj.brands,
            commentList: detailObj.comments,
            longitude: detailObj.longitude,
            latitude: detailObj.latitude
        };
        res.render('craftman_detail', craftmanDetail);
    });

};

exports.followCraftman = function (req, res, next) {
    var token = req.cookies["token"];
    if (token === undefined || token === "") {
        res.send({ followResult: -1 });
    }

    var craftmanID = req.query.id;
    var param = {
        token: token,
        id: craftmanID
    };

    request.post({ url: apiServerAddress + followCraftmanURL, form: param }, function (err, response, body) {
        res.setHeader('Content-Type', 'application/json');
        var followResultObj = JSON.parse(body);
        if (followResultObj.code === 1) {
            res.send({ followResult: 1 });
        } else {
            res.send({ followResult: 0 });
        }
    });
};

exports.unFollowCraftman = function (req, res, next) {
    var token = req.cookies["token"];
    if (token === undefined || token === "") {
        res.send({ followResult: -1 });
    }

    var craftmanId = req.query.id;
    var param = {
        token: token,
        id: craftmanId
    };
    request.post({ url: apiServerAddress + unFollowCraftmanURL, form: param }, function (err, response, body) {
        res.setHeader('Content-Type', 'application/json');
        var followResultObj = JSON.parse(body);
        if (followResultObj.code == 1) {
            res.send({ followResult: 1 });
        } else {
            res.send({ followResult: 0 });
        }
    });
}

exports.commentList = function (req, res, next) {
    var craftmanID = req.query.id;
    var param = {
        id: craftmanID
    };
    request.post({ url: apiServerAddress + getCommentListURL, form: param }, function (error, response, body) {

        var cmtObj = JSON.parse(body).result;
        var commentList = [];
        for (var i = 0; i < cmtObj.length; i++) {
            var item = {
                userAvatorUrl: "./images/avator.jpg",
                starLevel: cmtObj[i].marks,
                username: cmtObj[i].nickname,
                cmtDetail: cmtObj[i].comment,
                cmtTime: "2016-06-06"//cmtObj[i].commentTime
            };
            commentList.push(item);
        }
        var pageData = {
            commentList: commentList
        };
        res.render('user_comment_list', pageData);
    });

};

exports.craftmanLoginPage = function (req, res, next) {
    var loginData = {
        title: '工匠登陆'
    };
    res.render('login_b', loginData);
};

exports.craftmanLogin = function (req, res, next) {
    var teleNo = req.query.name;
    var pwd = req.query.password;
    var param = {
        telephone: teleNo,
        password: pwd
    };

    request.post({ url: apiServerAddress + craftmanLoginURL, form: param }, function (err, response, body) {
        var loginResult = JSON.parse(body);
        res.setHeader('Content-Type', 'application/json');
        if (loginResult.code == 1) {
            var cookieAge = 60 * 1000;
            res.cookie("b_token", loginResult.token, { maxAge: cookieAge });
            res.send({ loginSuc: true });
        } else {
            res.send({ loginSuc: false });
        }
    });
};

exports.craftmanPersonalInfo = function (req, res, next) {
    var token = req.cookies["b_token"];
    if (token === undefined || token === null) {
        res.redirect("/craftmanLoginPage");
    }

    var param = {
        token: token
    };

    var apiTicket = GlobalCache.getApiTicket();
    var nonceStr = GlobalCache.getRandomStr();
    var timestamp = (new Date()).getTime();
    var url = req.protocol + "://" + req.get("host") + req.originalUrl;

    var combineString = "jsapi_ticket=" + apiTicket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url;

    var shasum = crypto.createHash("sha1");
    shasum.update(combineString);
    var signature = shasum.digest("hex");

    request.post({ url: apiServerAddress + getCraftmanInfoURL, form: param }, function (err, response, body) {
        var craftmanDetailResult = JSON.parse(body);
        if (craftmanDetailResult.code == 1) {
            var craftmanInfo = craftmanDetailResult.result;
            var financeInfo = craftmanInfo.masterFinanceInfo;
            if (financeInfo == undefined) {
                financeInfo = {
                    orderAmount: 0,
                    remainMoney: 0,
                    withdrawingMoney: 0,
                    withdrawedMoney: 0,
                    totalIncome: 0,
                    withdrawAccount: ""
                }
            }
            var craftmanData = {
                id: craftmanInfo.id,
                avator: "./images/avator.jpg",
                name: craftmanInfo.basicInfo.name,
                telephone: craftmanInfo.phoneNumber,
                orderAmount: financeInfo.totalOrderAmount,
                remainMoney: financeInfo.rewordIncome,
                withdrawingMoney: financeInfo.withDrawIng,
                withdrawedMoney: financeInfo.withDrawEd,
                totalIncome: financeInfo.serviceIncome,
                realName: craftmanInfo.basicInfo.name,
                withdrawAccount: financeInfo.bankAccount,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature
            };
            res.render("craftman_personal", craftmanData);
        }
    });
};

exports.withdraw = function (req, res, next) {
    var amount = req.query.amount;
    res.setHeader('Content-Type', 'application/json');
    res.send({ withdrawResult: true });
};

exports.craftmanSettingPage = function (req, res, next) {
    var craftmanData = {
        name: ""
    };
    res.render("craftman_setting", craftmanData);
};

exports.getVerifyCode = function (req, res, next) {
    var telephoneNo = req.query.teleNo;
    var sendVerifyCodeResult = {
        sendVerifyCodeResult: true
    };
    //res.setHeader('Content-Type', 'application/json');
    res.send(sendVerifyCodeResult);
};

exports.modifyPassword = function (req, res, next) {
    var teleNo = req.query.teleNo;
    var password = req.query.password;
    res.send({ result: true });
};

exports.getAccountDetailList = function (req, res, next) {
    var detailList = {
        list: [{
            name: "服务收入",
            id: "123123123123",
            time: "2016-10-11",
            amount: 4000.00,
            type: 1
        }, {
            name: "提现",
            id: "123123123123",
            time: "2016-10-11",
            amount: -2000.00,
            type: 2
        }, {
            name: "服务收入",
            id: "123123123123",
            time: "2016-10-11",
            amount: 1000.00,
            type: 1
        }, {
            name: "服务收入",
            id: "123123123123",
            time: "2016-10-11",
            amount: 1000.00,
            type: 1
        }]
    };
    res.render("account_detail", detailList);
};

exports.showPaypage = function (req, res, next) {
    var craftmanId = req.query.craftmanID;
    //首先判断是否登陆
    if (req.cookies['openid'] === null || req.cookies['openid'] === undefined) {
        res.redirect("/?callbackURL=" + encodeURIComponent("/daily/pay?craftmanID=" + craftmanId));
    }

    //已经登陆就跳转到支付展示页
    //支付对象（钟表匠）的id
    req.session.craftmanIdPayTo = craftmanId;
    console.log("req.session.craftmanIdPayTo",req.session.craftmanIdPayTo);
    //支付人（当前登录用户）在我们server上的openid
    req.session.openIdPay = req.cookies['openid'];

    var param = {
        id: craftmanId,
        longitude: 0,
        latitude: 0
    };

    request.post({ url: apiServerAddress + getCraftmanDetailURL, form: param }, function (err, response, body) {
        var detailObj = JSON.parse(body).result;
        detailObj = detailObj.length > 0 ? detailObj[0] : {};
        var pageData = {
            name: detailObj.name,
            workAddress: detailObj.address,
            orderCounts: detailObj.orderCount,
            starLevel: detailObj.marks,
            avatorUrl: "../images/avator.jpg",
            company: detailObj.shop
        };
        res.render('pay_detail', pageData);
    });
};

exports.confirmPayPage = function (req, res, next) {
    var payInfo = {};

    var user_ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //IPV6   ::ffff:127.0.0.1
    if (user_ip.substr(0, 7) === "::ffff:") {
        user_ip = user_ip.substr(7);
    }

    var amount = req.query.amount;//req.query.amount;

    var nonceStr = GlobalCache.getRandomStr();

    //支付对象（钟表匠）的id
    console.log("req.session", req.session);
    var currentCraftmanId = req.session.craftmanIdPayTo;
    //支付人（当前登录用户）在我们server上的openid
    var currentOpenId = req.session.openIdPay;
    //根据currentCraftmanId和currentOpenId，amount生成订单号
    var getOrderIDParam = {
        masterId: currentCraftmanId,
        payAmount: amount,
        token: req.cookies["token"]
    };
    var commercialOrderID = '';
    console.log("getOrderIDParam",getOrderIDParam);
    request.post({ url: apiServerAddress + generateNewOrderURL, form: getOrderIDParam }, function (err, response, body) {

        if (!err && response.statusCode == 200) {
            var generateOrderResult = JSON.parse(body);
            console.log(generateOrderResult);
            if (generateOrderResult.code === -2) {
                var fullURL = req.protocol + '://' + req.get('host') + req.originalUrl;
                var redirectURL = encodeURIComponent('http://www.joinershow.cn/wechat_login/?callbackURL=' + fullURL);
                var loginData = {
                    title: '用户登录',
                    redirectUrl: redirectURL
                };

                res.render("login_c", loginData);
                return;
            }
            if(generateOrderResult.code !== 1) {
                res.render("404");
                return;
            }
            commercialOrderID = generateOrderResult.order.orderId;
            var prepayParameter = {
                appid: appid,
                body: "小筑匠心-百货",
                device_info: "WEB",
                mch_id: commercialAccountID,
                nonce_str: nonceStr,
                notify_url: "http://www.joinershow.cn/pay/payCallback",
                openid: req.cookies['openid'],
                out_trade_no: commercialOrderID,//商户订单号,不能重复
                spbill_create_ip: user_ip,
                total_fee: amount, //单位：分 
                trade_type: "JSAPI"
            };

            // var combineString = "jsapi_ticket=" + apiTicket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url;
            var combineString = "appid=" + prepayParameter.appid + "&body=" + prepayParameter.body + "&device_info=" + prepayParameter.device_info +
                "&mch_id=" + prepayParameter.mch_id + "&nonce_str=" + prepayParameter.nonce_str + "&notify_url=" + prepayParameter.notify_url +
                "&openid=" + prepayParameter.openid + "&out_trade_no=" + prepayParameter.out_trade_no + "&spbill_create_ip=" + prepayParameter.spbill_create_ip +
                "&total_fee=" + prepayParameter.total_fee + "&trade_type=" + prepayParameter.trade_type;

            combineString += "&key=" + apiKey;
            //中文md5，必须如下处理
            // combineString = (new Buffer(combineString)).toString("binary");
            // var md5sum = crypto.createHash("md5");
            // md5sum.update(combineString);
            // var signature = md5sum.digest("hex");

            var signature = crypto.createHash('md5').update(combineString, 'utf-8').digest('hex');
            prepayParameter.sign = signature.toUpperCase();
            var builder = new xml2js.Builder();
            var postXML = builder.buildObject(prepayParameter);

            //商户server调用统一下单接口请求订单,使用post xml
            request.post({ url: prePayURL, body: postXML, headers: { 'Content-Type': 'text/xml' } }, function (err, httpResponse, body) {

                //<xml><return_code><![CDATA[SUCCESS]]></return_code>
                // <return_msg><![CDATA[OK]]></return_msg>
                // <appid><![CDATA[wxde4642a10788624f]]></appid>
                // <mch_id><![CDATA[1387195102]]></mch_id>
                // <device_info><![CDATA[WEB]]></device_info>
                // <nonce_str><![CDATA[BMEPclsK4AxU2hfV]]></nonce_str>
                // <sign><![CDATA[4F9C6F2FC98A9AC812973078C397B0AD]]></sign>
                // <result_code><![CDATA[SUCCESS]]></result_code>
                // <prepay_id><![CDATA[wx20161127221433197c4155d00625535537]]></prepay_id>
                // <trade_type><![CDATA[JSAPI]]></trade_type>
                // </xml>

                xmlParser.parseString(body, function (err, result) {
                    if (err) {

                    } else {
                        try {
                            var prepayID = result.xml.prepay_id[0];
                            //get prepay_id from body, then generate prepay_id and paySign to the page.
                            //the page JSAPI-> getBrandWCPayRequest needs: appId,timeStamp,nonceStr,package(such as 'prepay_id=123456789'),signType(MD5),paySign
                            //All these parameters will be generated in the server.

                            var payTimeStamp = Math.floor((new Date()).getTime() / 1000);//转化为秒
                            var payNonceStr = GlobalCache.getRandomStr();
                            var payPackage = "prepay_id=" + prepayID;
                            var signType = "MD5";
                            //nonceStr,package,timestamp,signType 
                            var stringCombine = "appId=" + appid + "&nonceStr=" + payNonceStr + "&package=" + payPackage + "&signType=" + signType + "&timeStamp=" + payTimeStamp;//+"&signType="+signType;
                            //拼接api key
                            stringCombine += "&key=" + apiKey;
                            var md5Sum = crypto.createHash("md5");
                            md5Sum.update(stringCombine);
                            var signPay = md5Sum.digest("hex").toUpperCase();

                            //generate config param
                            var apiTicket = GlobalCache.getApiTicket();
                            var configTimestamp = (new Date()).getTime();
                            var url = req.protocol + "://" + req.get("host") + req.originalUrl;
                            var configCombineStr = "jsapi_ticket=" + apiTicket + "&noncestr=" + payNonceStr + "&timestamp=" + configTimestamp + "&url=" + url;
                            var shasum = crypto.createHash("sha1");
                            shasum.update(configCombineStr);
                            var configSign = shasum.digest("hex");


                            var pageData = {
                                timestamp: payTimeStamp,
                                nonceStr: payNonceStr,
                                package: payPackage,
                                signType: signType,
                                paySign: signPay,
                                configSign: configSign,
                                configTimestamp: configTimestamp,
                                appId: appid,
                                orderID: commercialOrderID,
                                payAmount: amount / 100//转化为元为单位
                            };
                            res.render('confirm_pay', pageData);
                        }
                        catch (e) {
                            res.render('confirm_pay', { error: e });
                        }
                    }
                });

            });
        }
    });

};

//支付后，微信会回调此API通知支付状态
exports.payCallback = function (req, res, next) {
    var token = req.cookies["token"];
    var returnCode = req.query.return_code;
    var returnMsg = req.query.return_msg;
    if (returnCode === "SUCCESS") {
        var detail = req.query;
        var appid = detail.appid;
        var mch_id = detail.mch_id;
        var device_info = detail.device_info;
        var nonce_str = detail.nonce_str;
        var sign = detail.sign;
        var sign_type = detail.sign_type;
        var result_code = detail.result_code;
        var err_code = detail.err_code;
        var err_code_des = detail.err_code_des;
        var openid = detail.openid;
        var is_subscribe = detail.is_subscribe;
        var trade_type = detail.trade_type;
        var bank_type = detail.bank_type; //银行类型
        var total_fee = detail.total_fee; //单位：分
        var settlement_total_fee = detail.settlement_total_fee;//应结订单金额=订单金额-非充值代金券金额，应结订单金额<=订单金额
        var fee_type = detail.fee_type;
        var cash_fee = detail.cash_fee;
        var cash_fee_type = detail.cash_fee_type;
        var coupon_fee = detail.coupon_fee;
        var coupon_count = detail.coupon_count;
        var coupon_type_$n = detail.coupon_type_$n;
        var coupon_id_$n = detail.coupon_id_$n;
        var coupon_fee_$n = detail.coupon_fee_$n;
        var transaction_id = detail.transaction_id; //微信支付订单号
        var out_trade_no = detail.out_trade_no; //商家订单号
        var attach = detail.attach; //商家数据包
        var time_end = detail.time_end; //支付完成时间
        //根据返回参数，进行校验，如果校验通过
        //就返回给weixin server return_code:SUCCESS
        //如果未通过校验，则返回给weixin sever return_code:FAIL return_msg:签名失败或者参数格式校验错误
        // res.send({ result : 1});

        var getPayConfirmInfo = {
            return_code: "SUCCESS"
        };

        confirmParam = {
            token: token,
            orderid: out_trade_no,
            status: 2 //1：初始化 2：成功 3：失败
        };
        request.post({ url: apiServerAddress + updateOrderUrl, form: confirmParam }, function (err, response, body) {
            // to do
        });

        var builder = new xml2js.Builder();
        var resultXml = builder.buildObject(getPayConfirmInfo);
        res.set('Content-Type', 'text/xml');
        res.send(resultXml);
    }

};

exports.businessCard = function (req, res, next) {
    var apiTicket = GlobalCache.getApiTicket();
    var nonceStr = GlobalCache.getRandomStr();
    var timestamp = (new Date()).getTime();
    var token = req.cookies["token"];
    var url = req.protocol + "://" + req.get("host") + req.originalUrl;

    var combineString = "jsapi_ticket=" + apiTicket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url;

    var shasum = crypto.createHash("sha1");
    shasum.update(combineString);
    var signature = shasum.digest("hex");

    var craftmanId = req.query.id;
    var longitude = 0, latitude = 0;
    if (req.query.longitude !== undefined) {
        longitude = parseFloat(req.query.longitude);
    }
    if (req.query.latitude !== undefined) {
        latitude = parseFloat(req.query.latitude);
    }
    var param = {
        id: craftmanId,
        longitude: longitude,
        latitude: latitude,
        token: token
    };
    request.post({ url: apiServerAddress + getCraftmanDetailURL, form: param }, function (err, response, body) {
        try {
            var detailObj = JSON.parse(body).result;
            detailObj = detailObj.length > 0 ? detailObj[0] : {};
            var craftmanDetail = {
                geoText: detailObj.address,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature,
                id: detailObj.id,
                avatorUrl: "./images/avator.jpg",
                name: detailObj.name,
                company: detailObj.shop,
                starLevel: detailObj.marks,
                orderCounts: detailObj.orderCount,
                workAddress: detailObj.address,
                distance: detailObj.distance.toFixed(1),
                intro: detailObj.description,
                telephone: detailObj.masterPhone,
                skilledBrandList: detailObj.brands,
                commentList: detailObj.comments,
                longitude: detailObj.longitude,
                latitude: detailObj.latitude,
                focused: detailObj.markStatusByCurrentUser
            };
            res.render('business_card', craftmanDetail);
        } catch (e) {
        }
    });
};

exports.registerTelephonePage = function (req, res, next) {
    res.render('register_tele', null);
};

exports.getValidateNumber = function (req, res, next) {
    var mobilephoneNumber = req.query.mobilephoneNumber;
    var param = {
        phone: mobilephoneNumber
    };
    request.post({ url: apiServerAddress + getValidateNumberURL, form: param }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            var validateNumberResult = JSON.parse(body);
            res.send({ validateSendResult: validateNumberResult.code });
        } else {
            res.send({ validateSendResult: 0 });
        }
    });
}

exports.getBindValidateNumber = function (req, res, next) {
    var mobilephoneNumber = req.query.mobilephoneNumber;
    var token = req.cookies["token"];
    var param = {
        token: token,
        phone: req.query.mobilephoneNumber
    };
    request.post({ url: apiServerAddress + bindPhoneGetValidateNum, form: param }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            var validateNumberResult = JSON.parse(body);
            res.send({ validateSendResult: validateNumberResult.code });
        } else {
            res.send({ validateSendResult: 0 });
        }
    });
}

exports.bindMobilePhoneReq = function (req, res, next) {
    var num = req.query.validateNum;
    var phone = req.query.phoneNumber;
    var token = req.cookies["token"];
    var param = {
        token: token,
        phone: phone,
        num: num
    };
    request.post({ url: apiServerAddress + bindPhone, form: param }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            console.log(body);
            var bindResult = JSON.parse(body);
            if(bindResult.code === 1) {
                var bindNumber = bindResult.validateNumber;
                res.cookie("mobilephoneNum", bindNumber);
            }
            res.send({ bindResult: bindResult.code  });
        } else {
            console.log(body);
        }

    });
}

exports.businessmanReg = function (req, res, next) {
    var phone = req.query.phone;
    var num = req.query.num;
    var recommend = req.query.recommend;

    var param = {
        num: num,
        phone: phone,
        recommend: recommend
    };

    request.post({ url: apiServerAddress + postValidateNumberURL, form: param }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var postValidateNoResult = JSON.parse(body);
            if (postValidateNoResult.code == 1) {

                res.send({ result: true });
                // res.render('upload_businesscard', uploadBusinesscardDetail);
            } else {
                res.send({ result: false });
            }
        } else {
            res.send({ result: false });
        }
    });

    //for test
    // var apiTicket = GlobalCache.getApiTicket();
    // var nonceStr = GlobalCache.getRandomStr();
    // var timestamp = (new Date()).getTime();
    // var url = req.protocol + "://" + req.get("host") + req.originalUrl;
    // var combineString = "jsapi_ticket=" + apiTicket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url;
    // var shasum = crypto.createHash("sha1");
    // shasum.update(combineString);
    // var signature = shasum.digest("hex");

    // var uploadBusinesscardDetail = {
    //     phone: 15800622061,
    //     timestamp: timestamp,
    //     nonceStr: nonceStr,
    //     signature: signature,
    // };
    // res.render('upload_businesscard', uploadBusinesscardDetail);

}

exports.toUploadBusinessCard = function (req, res, next) {
    var apiTicket = GlobalCache.getApiTicket();
    var nonceStr = GlobalCache.getRandomStr();
    var timestamp = (new Date()).getTime();
    var url = req.protocol + "://" + req.get("host") + req.originalUrl;
    var combineString = "jsapi_ticket=" + apiTicket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url;
    var shasum = crypto.createHash("sha1");
    shasum.update(combineString);
    var signature = shasum.digest("hex");

    var phone = req.query.phone;
    var uploadBusinesscardDetail = {
        phone: phone,
        timestamp: timestamp,
        nonceStr: nonceStr,
        signature: signature,
    };
    res.render('upload_businesscard', uploadBusinesscardDetail);
}

exports.uploadCraftmanImage = function (req, res, next) {
    var phone = req.query.phone;
    var serverId = req.query.serverId;
    var param = {
        phone: phone,
        serverid: serverId
    };
    request.post({ url: apiServerAddress + updateCraftmanImage, form: param }, function (err, response, body) {
        var result = JSON.parse(body);
        if (result.code == 1) {
            res.send({ result: 1 })
        } else {
            res.send({ result: 0 })
        }
    })
}

// exports.receiveWXMsg = function (req, res, next) {
//     var echostr = req.query.echostr;
//     res.send(echostr);
// }

// exports.getPushMsg = function (req, res, next) {
//     logger.info("req.body", req.body);
//     res.send("success");
// }

exports.showBrandSelect = function (req, res, next) {
    var fromPersonalPage = req.query.fromPersonalPage === "true";
    res.render("brand_list", { fromPersonalPage: fromPersonalPage });
}

exports.selectBrand = function (req, res, next) {
    var token = req.cookies["token"];
    if (token === undefined || token === null || token === "") {
        res.send({ result: -1 });
    } else {
        var brandId = req.query.id;
        var selectBrandParam = {
            token: token,
            brandId: brandId
        };
        request.post({ url: apiServerAddress + selectBrand, form: selectBrandParam }, function (error, response, body) {
            try {
                var resObj = JSON.parse(body);
                //select success
                console.log(resObj);
                if (resObj === undefined || resObj === null) {
                    resObj = { code: 0 };
                }
                res.send({ result: resObj.code });
            } catch (e) {
                console.log(e);
            }

        });
    }
}
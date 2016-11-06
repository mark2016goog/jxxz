/**
 * Created by xiangkai on 16/9/4.
 */
var request = require("request");
var crypto = require("crypto");

var getAccessTokenURL = "https://api.weixin.qq.com/sns/oauth2/access_token";
var prePayURL = "https://api.mch.weixin.qq.com/pay/unifiedorder";
var appid = "wxde4642a10788624f";
var secret = "4e67e578e0318def0512293bff7e1550";
var commercialAccountID = "1387195102";
var apiServerAddress = "http://139.196.243.125:17001/server/webapi";
var commonUserLogin = "/normaluser/login";//普通用户登录
var personalOrderURL = "/order/normaluser/orders";//获取自己的订单列表
var personalCouponURL = "/coupon/coupon"; //获取优惠券列表
var followedCraftman = "/masters/master/mark";//关注的工匠
var logoutURL = "/normaluser/login";
var searchCraftmanURL = "/masters/all";
var getCraftmanDetailURL = "/masterdetail/detail";
var followCraftmanURL = "/masterdetail/markmaster";
var getCommentListURL = "/comment/all";
var craftmanLoginURL = "/masteruser/login";
var getCraftmanInfoURL = "/masteruser/info";

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
        console.log(body);
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
                console.log("login result:" + body);
                var resObj = JSON.parse(body);
                var repsonseInfo = resObj.user;
                var personalInfo = {
                    avatorUrl: repsonseInfo.imageUrl,
                    nickName: repsonseInfo.nickName,
                    gender: repsonseInfo.gender == "1" ? "男" : "女",
                    bindMobilephone: "未绑定"
                };
                var token = resObj.token;
                var cookieAge = 60 * 60 * 1000;
                res.cookie("token", token, {maxAge: cookieAge});
                res.render('personal_info', personalInfo);
            }
        );
    });
};

exports.orderList = function (req, res, next) {
    var token = req.cookies["token"];
    var param = {
        token: token
    };
    //{"brand":"天梭","createDate":"2016-11-01T01:00:00+08:00","masterName":"张师傅","money":300.0,"orderId":"订单号码"}
    request.post({url: apiServerAddress + personalOrderURL, form: param}, function (err, response, body) {
        console.log("orderlist:" + body);
        var resObj = JSON.parse(body).results;
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

    request.post({url: apiServerAddress + personalCouponURL, form: param}, function (err, response, body) {
        console.log("coupon list:" + body);
        var resObj = JSON.parse(body).results;
        var couponList = [];
        for (var i = 0; i < resObj.length; i++) {
            var startDateString = (new Date(resObj[i].startTime)).toISOString();
            var endDateString = (new Date(resObj[i].endTime)).toISOString();
            var item = {
                id: i,
                amount: resObj[i].money,
                validStartTime: startDateString.substr(0,10),
                validEndTime: endDateString.substr(0,10)
            };
            couponList.push(item);
        }
        var pageData = {
            list: couponList
        }
        res.render('coupon', pageData);
    });

};

exports.followedCraftmanList = function (req, res, next) {
    var token = req.cookies["token"];
    var param = {
        token: token
    };

    request.post({url: apiServerAddress + followedCraftman, form: param}, function (err, response, body) {
        console.log("followedcraftman list:" + body);
        var resObj = JSON.parse(body).result;
        var followedCraftmanList = [];
        for (var i = 0; i < resObj.length; i++) {
            var item = {
                id: resObj[i].id,
                avatorUrl: "./images/avator.jpg",
                name: resObj[i].name,
                company: resObj[i].shop,
                starLevel: parseInt(resObj[i].marks),
                orderCounts: resObj[i].orderCount,
                workAddress: resObj[i].address,
                distance: resObj[i].distance
            };
            followedCraftmanList.push(item);
        }
        var pageData = {
            title: "followedCraftman",
            list: followedCraftmanList
        }
        res.render('followed_craftman_list', pageData);
    });

    //var craftmanList = {
    //    title: "followedCraftman",
    //    list: [{
    //        id: 1,
    //        avatorUrl: "./images/avator.jpg",
    //        name: "张师傅",
    //        company: "亨得利国际名表服务中心",
    //        starLevel: 4,
    //        orderCounts: 1000,
    //        workAddress: "上海市静安区南京西路1266号恒隆广场",
    //        distance: "1.1km"
    //    }, {
    //        id: 2,
    //        avatorUrl: "./images/avator.jpg",
    //        name: "张师傅",
    //        company: "亨得利国际名表服务中心",
    //        starLevel: 3,
    //        orderCounts: 1000,
    //        workAddress: "上海市静安区南京西路1266号恒隆广场",
    //        distance: "1.1km"
    //    }, {
    //        id: 3,
    //        avatorUrl: "./images/avator.jpg",
    //        name: "张师傅",
    //        company: "亨得利国际名表服务中心",
    //        starLevel: 2,
    //        orderCounts: 1000,
    //        workAddress: "上海市静安区南京西路1266号恒隆广场",
    //        distance: "1.1km"
    //    }]
    //};
    //res.render('followed_craftman_list', craftmanList);
};

exports.searchCraftman = function (req, res, next) {
    var param = {
        searchType:1,
        longitude:100,
        latitude:100
    };

    request.post({url: apiServerAddress + searchCraftmanURL,form:param},function(error,response,body){
        console.log("search result" + body);
        var resObj = JSON.parse(body).result;
        var craftmanList = [];
        for(var i=0;i<resObj.length;i++) {
            var item = {
                id: resObj[i].id,
                avatorUrl: "./images/avator.jpg",
                name: resObj[i].name,
                company: resObj[i].shop,
                starLevel: resObj[i].marks,
                orderCounts: resObj[i].orderCount,
                workAddress: resObj[i].address,
                distance: resObj[i].distance
            };
            craftmanList.push(item);
        }
        var pageData = {
            title: "searchCraftman",
            list: craftmanList
        };
        res.render('craftman_filter_list', pageData);
    });

    // var craftmanList = {
    //     title: "searchCraftman",
    //     list: [{
    //         id: 1,
    //         avatorUrl: "./images/avator.jpg",
    //         name: "张师傅",
    //         company: "亨得利国际名表服务中心",
    //         starLevel: 4,
    //         orderCounts: 1000,
    //         workAddress: "上海市静安区南京西路1266号恒隆广场",
    //         distance: "1.1km"
    //     }, {
    //         id: 2,
    //         avatorUrl: "./images/avator.jpg",
    //         name: "张师傅",
    //         company: "亨得利国际名表服务中心",
    //         starLevel: 3,
    //         orderCounts: 1000,
    //         workAddress: "上海市静安区南京西路1266号恒隆广场",
    //         distance: "2.1km"
    //     }, {
    //         id: 3,
    //         avatorUrl: "./images/avator.jpg",
    //         name: "张师傅",
    //         company: "亨得利国际名表服务中心",
    //         starLevel: 2,
    //         orderCounts: 1000,
    //         workAddress: "上海市静安区南京西路1266号恒隆广场",
    //         distance: "3.1km"
    //     }]
    // };
    // res.render('craftman_filter_list', craftmanList);
};


exports.searchCraftmanAsync = function (req, res, next) {
    var searchType = req.query.searchType;
    console.log("searchType:" + searchType);
    var param = {
        searchType:searchType,
        longitude:100,
        latitude:100
    };

    request.post({url: apiServerAddress + searchCraftmanURL,form:param},function(error,response,body){
        console.log("search result" + body);
        var resObj = JSON.parse(body).result;
        var craftmanList = [];
        for(var i=0;i<resObj.length;i++) {
            var item = {
                id: resObj[i].id,
                avatorUrl: "./images/avator.jpg",
                name: resObj[i].name,
                company: resObj[i].shop,
                starLevel: resObj[i].marks,
                orderCounts: resObj[i].orderCount,
                workAddress: resObj[i].address,
                distance: resObj[i].distance
            };
            craftmanList.push(item);
        }
        var pageData = {
            title: "searchCraftman",
            list: craftmanList
        };
        res.render('async/craftman_list_fragment', pageData);
    });

    // var craftmanList = {
    //     title: "searchCraftman",
    //     list: [{
    //         id: 1,
    //         avatorUrl: "./images/avator.jpg",
    //         name: "杨师傅",
    //         company: "亨得利国际名表服务中心",
    //         starLevel: 4,
    //         orderCounts: 1000,
    //         workAddress: "上海市静安区南京西路1266号恒隆广场",
    //         distance: "1.1km"
    //     }, {
    //         id: 2,
    //         avatorUrl: "./images/avator.jpg",
    //         name: "顾师傅",
    //         company: "亨得利国际名表服务中心",
    //         starLevel: 3,
    //         orderCounts: 1000,
    //         workAddress: "上海市静安区南京西路1266号恒隆广场",
    //         distance: "1.1km"
    //     }, {
    //         id: 3,
    //         avatorUrl: "./images/avator.jpg",
    //         name: "项师傅",
    //         company: "亨得利国际名表服务中心",
    //         starLevel: 2,
    //         orderCounts: 1000,
    //         workAddress: "上海市静安区南京西路1266号恒隆广场",
    //         distance: "1.1km"
    //     }]
    // };
    // res.render('async/craftman_list_fragment', craftmanList);
};

exports.craftmanDetail = function (req, res, next) {
    var apiTicket = GlobalCache.getApiTicket();
    var nonceStr = GlobalCache.getRandomStr();
    var timestamp = (new Date()).getTime();
    var url = req.protocol + "://" + req.get("host") + req.originalUrl;

    var combineString = "jsapi_ticket=" + apiTicket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url;
    console.log("combineString:" + combineString);
    var shasum = crypto.createHash("sha1");
    shasum.update(combineString);
    var signature = shasum.digest("hex");

    var craftmanId = req.query.id;
    var param = {
        id:craftmanId,
        longitude:100,
        latitude:100
    };

    request.post({url:apiServerAddress + getCraftmanDetailURL,form: param},function(err,response,body){
        console.log("craftman detai:" + body);
        var detailObj = JSON.parse(body).result;
        detailObj = detailObj.length>0?detailObj[0]:{};
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
            commentList: detailObj.comments
        };
        res.render('craftman_detail', craftmanDetail);
    });

    // var craftmanDetail = {
    //     geoText: "上海市静安区南京西路1266号恒隆广场",
    //     timestamp: timestamp,
    //     nonceStr: nonceStr,
    //     signature: signature,
    //     id: craftmanId,
    //     avatorUrl: "./images/avator.jpg",
    //     name: "张师傅",
    //     company: "亨得利国际名表服务中心",
    //     starLevel: 4,
    //     orderCounts: 1000,
    //     workAddress: "上海市静安区南京西路1266号恒隆广场",
    //     distance: "1.1km",
    //     intro: "张师傅,拥有国际认证的XXXXXX牛逼证书,从业8年8年年年年年从业8年8年年年年年从业8年8年年年年年从业8年8年年年年年",
    //     telephone: 15800622061,
    //     skilledBrandList: [
    //         {
    //             id: 1,
    //             name: "宝格丽"
    //         }, {
    //             id: 2,
    //             name: "阿玛尼"
    //         },
    //         {
    //             id: 3,
    //             name: "万宝龙"
    //         },
    //         {
    //             id: 4,
    //             name: "劳力士"
    //         },
    //         {
    //             id: 5,
    //             name: "百达翠丽"
    //         },
    //         {
    //             id: 6,
    //             name: "浪琴"
    //         }
    //     ],
    //     commentList: [
    //         {
    //             userAvatorUrl: "./images/avator.jpg",
    //             starLevel: 3,
    //             username: "柯南君1",
    //             cmtDetail: "服务态度非常好,技术一流"
    //         }, {
    //             userAvatorUrl: "./images/avator.jpg",
    //             starLevel: 4,
    //             username: "柯南君2",
    //             cmtDetail: "服务态度非常好,技术一流"
    //         }
    //     ]
    // };
    // res.render('craftman_detail', craftmanDetail);
};

exports.followCraftman = function (req, res, next) {
    var token = req.cookies["token"];
    var craftmanID = req.query.id;
    var param = {
        token: token,
        id: craftmanID
    };
    request.post({url:apiServerAddress + followCraftmanURL,form:param},function(err, response, body){
        res.setHeader('Content-Type', 'application/json');
        console.log("follow result:" + body);
        var followResultObj = JSON.parse(body);
        if(followResultObj.code == 1) {
            res.send({followResult: 1});
        } else {
            res.send({followResult: 0});
        }
    });
    
};


exports.commentList = function (req, res, next) {
    var craftmanID = req.query.id;
    var param = {
        id:craftmanID
    };
    request.post({url: apiServerAddress + getCommentListURL,form:param},function(error, response, body){
        console.log("get comment list:" + body);
        var cmtObj = JSON.parse(body).result;
        var commentList = [];
        for(var i=0;i<cmtObj.length;i++){
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
            commentList:commentList
        };
        res.render('user_comment_list', pageData);
    });
    // var commentList = {
    //     commentList: [{
    //         userAvatorUrl: "./images/avator.jpg",
    //         starLevel: 5,
    //         username: "柯南君1",
    //         cmtDetail: "服务态度非常好,技术一流aaa",
    //         cmtTime: "10月2日"
    //     }, {
    //         userAvatorUrl: "./images/avator.jpg",
    //         starLevel: 4,
    //         username: "柯南君2",
    //         cmtDetail: "服务态度非常好,技术一流nnnn",
    //         cmtTime: "5月2日"
    //     }, {
    //         userAvatorUrl: "./images/avator.jpg",
    //         starLevel: 4,
    //         username: "柯南君2",
    //         cmtDetail: "服务态度非常好,技术一流naaannn",
    //         cmtTime: "5月2日"
    //     }, {
    //         userAvatorUrl: "./images/avator.jpg",
    //         starLevel: 4,
    //         username: "柯南君2",
    //         cmtDetail: "服务态度非常好,技术一流啊啊啊nn",
    //         cmtTime: "5月2日"
    //     }, {
    //         userAvatorUrl: "./images/avator.jpg",
    //         starLevel: 4,
    //         username: "柯南君2",
    //         cmtDetail: "服务态度非常好,技术一流n啊啊啊阿瑟斯nnn",
    //         cmtTime: "5月2日"
    //     }]
    // };
    // res.render('user_comment_list', commentList);
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

    request.post({url: apiServerAddress+craftmanLoginURL,form:param},function(err,response,body){
        console.log("craftman login:" + body);
        var loginResult = JSON.parse(body);
        res.setHeader('Content-Type', 'application/json');
        if(loginResult.code == 1) {
            var cookieAge = 60 * 1000;
            res.cookie("b_token", loginResult.token, {maxAge: cookieAge});
            res.send({loginSuc: true});
        } else {
            res.send({loginSuc: false});
        }
    });
};

exports.craftmanPersonalInfo = function (req, res, next) {
    var token = req.cookies["b_token"];
    var param = {
        token:token
    };
    //getCraftmanInfoURL

    request.post({url: apiServerAddress + getCraftmanInfoURL, form: param}, function(err, response, body) {
        console.log("get craftman detail:" + body);
        var craftmanInfo = JSON.parse(body);
        if(craftmanInfo.code == 1) {
            var craftmanData = {
                avator: "./images/avator.jpg",
                name: craftmanInfo.basicInfo.name,
                telephone: craftmanInfo.phoneNumber,
                orderAmount: craftmanInfo.masterFinanceInfo.totalOrderAmount,
                remainMoney: craftmanInfo.masterFinanceInfo.rewordIncome,
                withdrawingMoney: craftmanInfo.masterFinanceInfo.withDrawIng,
                withdrawedMoney: craftmanInfo.masterFinanceInfo.withDrawEd,
                totalIncome: craftmanInfo.masterFinanceInfo.serviceIncome,
                realName: "王家卫",
                withdrawAccount: craftmanInfo.masterFinanceInfo.bankAccount
            };
            res.render("craftman_personal", craftmanData);
        }
    });


    // var craftmanData = {
    //     avator: "./images/avator.jpg",
    //     name: "黄师傅",
    //     telephone: 15800622061,
    //     orderAmount: 666,
    //     remainMoney: 1000.00,
    //     withdrawingMoney: 2200.00,
    //     withdrawedMoney: 800.00,
    //     totalIncome: 4000.00,
    //     realName: "王家卫",
    //     withdrawAccount: 421214
    // };
    // res.render("craftman_personal", craftmanData);
};

exports.withdraw = function (req, res, next) {
    var amount = req.query.amount;
    res.setHeader('Content-Type', 'application/json');
    res.send({withdrawResult: true});
};

exports.craftmanSettingPage = function (req, res, next) {
    var craftmanData = {
        name: "王家卫"
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
    res.send({result: true});
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


exports.prePay = function (req, res, next) {
    //生成商户订单
    var user_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var amount = req.query.amount;

    var apiTicket = GlobalCache.getApiTicket();
    var nonceStr = GlobalCache.getRandomStr();
    var timestamp = (new Date()).getTime();
    var url = req.protocol + "://" + req.get("host") + req.originalUrl;
    var combineString = "jsapi_ticket=" + apiTicket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url;
    console.log("combineString:" + combineString);
    var shasum = crypto.createHash("sha1");
    shasum.update(combineString);
    var signature = shasum.digest("hex");
    var detaiJSON = {};

    var prepayParameter = {
        appid: appid,
        mch_id: commercialAccountID,
        device_info: "WEB",
        nonce_str: nonceStr,
        sign: signature,
        body: "小筑匠心-百货",
        detail: detaiJSON,
        out_trade_no: "12123123123",//商户订单号
        total_fee: amount, //单位：分
        spbill_create_ip: user_ip,
        notify_url: "http://www.joinershow.cn/prepayCallback",
        trade_type: "JSAPI"
    };

    //商户server调用统一下单接口请求订单
    request.post({url: prePayURL}, {form: prepayParameter}, function (err, httpResponse, body) {

    });
    //
};

exports.showPaypage = function(req, res, next){
    var payInfo = {};
    res.render('pay_detail',payInfo);
};
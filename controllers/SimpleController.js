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
    request.post({url: apiServerAddress + personalOrderURL, form: param}, function (err, response, body) {
        console.log("orderlist:"+body);
        var resObj = JSON.parse(body);
        res.render('order_list', resObj.results);
    });
    //var orderList = {
    //    title: "",
    //    list: [{
    //        brand: "江诗丹顿",
    //        orderID: "123",
    //        payTime: (new Date()).getTime(),
    //        payAmout: 1234.00,
    //        worker: "张师傅"
    //    }, {
    //        brand: "格拉苏蒂",
    //        orderID: "123",
    //        payTime: (new Date()).getTime(),
    //        payAmout: 1234.00,
    //        worker: "张师傅"
    //    }]
    //};

};

exports.couponList = function (req, res, next) {
    var couponList = {
        title: "coupon",
        list: [{
            id: 1,
            amount: 88,
            validStartTime: "2016-05-04",
            validEndTime: "2016-09-04"
        }, {
            id: 2,
            amount: 288,
            validStartTime: "2016-05-04",
            validEndTime: "2016-05-04"
        }]
    };
    res.render('coupon', couponList);
};

exports.followedCraftmanList = function (req, res, next) {
    var craftmanList = {
        title: "followedCraftman",
        list: [{
            id: 1,
            avatorUrl: "./images/avator.jpg",
            name: "张师傅",
            company: "亨得利国际名表服务中心",
            starLevel: 4,
            orderCounts: 1000,
            workAddress: "上海市静安区南京西路1266号恒隆广场",
            distance: "1.1km"
        }, {
            id: 2,
            avatorUrl: "./images/avator.jpg",
            name: "张师傅",
            company: "亨得利国际名表服务中心",
            starLevel: 3,
            orderCounts: 1000,
            workAddress: "上海市静安区南京西路1266号恒隆广场",
            distance: "1.1km"
        }, {
            id: 3,
            avatorUrl: "./images/avator.jpg",
            name: "张师傅",
            company: "亨得利国际名表服务中心",
            starLevel: 2,
            orderCounts: 1000,
            workAddress: "上海市静安区南京西路1266号恒隆广场",
            distance: "1.1km"
        }]
    };
    res.render('followed_craftman_list', craftmanList);
};

exports.searchCraftman = function (req, res, next) {
    var craftmanList = {
        title: "searchCraftman",
        list: [{
            id: 1,
            avatorUrl: "./images/avator.jpg",
            name: "张师傅",
            company: "亨得利国际名表服务中心",
            starLevel: 4,
            orderCounts: 1000,
            workAddress: "上海市静安区南京西路1266号恒隆广场",
            distance: "1.1km"
        }, {
            id: 2,
            avatorUrl: "./images/avator.jpg",
            name: "张师傅",
            company: "亨得利国际名表服务中心",
            starLevel: 3,
            orderCounts: 1000,
            workAddress: "上海市静安区南京西路1266号恒隆广场",
            distance: "2.1km"
        }, {
            id: 3,
            avatorUrl: "./images/avator.jpg",
            name: "张师傅",
            company: "亨得利国际名表服务中心",
            starLevel: 2,
            orderCounts: 1000,
            workAddress: "上海市静安区南京西路1266号恒隆广场",
            distance: "3.1km"
        }]
    };
    res.render('craftman_filter_list', craftmanList);
};


exports.searchCraftmanAsync = function (req, res, next) {
    var searchType = req.query.searchType;
    console.log("searchType:" + searchType);
    //request.get(searchType, function (error, response, body) {
    //    console.log(body);
    //    var body = JSON.parse(body);
    //    var personalInfo = {
    //        avatorUrl: "",
    //        nickName: "xiangkai",
    //        gender: "男",
    //        bindMobilephone: "未绑定"
    //    };
    //    res.render('personal_info', personalInfo);
    //});
    var craftmanList = {
        title: "searchCraftman",
        list: [{
            id: 1,
            avatorUrl: "./images/avator.jpg",
            name: "杨师傅",
            company: "亨得利国际名表服务中心",
            starLevel: 4,
            orderCounts: 1000,
            workAddress: "上海市静安区南京西路1266号恒隆广场",
            distance: "1.1km"
        }, {
            id: 2,
            avatorUrl: "./images/avator.jpg",
            name: "顾师傅",
            company: "亨得利国际名表服务中心",
            starLevel: 3,
            orderCounts: 1000,
            workAddress: "上海市静安区南京西路1266号恒隆广场",
            distance: "1.1km"
        }, {
            id: 3,
            avatorUrl: "./images/avator.jpg",
            name: "项师傅",
            company: "亨得利国际名表服务中心",
            starLevel: 2,
            orderCounts: 1000,
            workAddress: "上海市静安区南京西路1266号恒隆广场",
            distance: "1.1km"
        }]
    };
    res.render('async/craftman_list_fragment', craftmanList);
};

exports.craftmanDetail = function (req, res, next) {
    var craftmanId = req.query.id;
    var apiTicket = GlobalCache.getApiTicket();
    var nonceStr = GlobalCache.getRandomStr();
    var timestamp = (new Date()).getTime();
    var url = req.protocol + "://" + req.get("host") + req.originalUrl;

    var combineString = "jsapi_ticket=" + apiTicket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url;
    console.log("combineString:" + combineString);
    var shasum = crypto.createHash("sha1");
    shasum.update(combineString);
    var signature = shasum.digest("hex");

    var craftmanDetail = {
        geoText: "上海市静安区南京西路1266号恒隆广场",
        timestamp: timestamp,
        nonceStr: nonceStr,
        signature: signature,
        id: craftmanId,
        avatorUrl: "./images/avator.jpg",
        name: "张师傅",
        company: "亨得利国际名表服务中心",
        starLevel: 4,
        orderCounts: 1000,
        workAddress: "上海市静安区南京西路1266号恒隆广场",
        distance: "1.1km",
        intro: "张师傅,拥有国际认证的XXXXXX牛逼证书,从业8年8年年年年年从业8年8年年年年年从业8年8年年年年年从业8年8年年年年年",
        telephone: 15800622061,
        skilledBrandList: [
            {
                id: 1,
                name: "宝格丽"
            }, {
                id: 2,
                name: "阿玛尼"
            },
            {
                id: 3,
                name: "万宝龙"
            },
            {
                id: 4,
                name: "劳力士"
            },
            {
                id: 5,
                name: "百达翠丽"
            },
            {
                id: 6,
                name: "浪琴"
            }
        ],
        commentList: [
            {
                userAvatorUrl: "./images/avator.jpg",
                starLevel: 3,
                username: "柯南君1",
                cmtDetail: "服务态度非常好,技术一流"
            }, {
                userAvatorUrl: "./images/avator.jpg",
                starLevel: 4,
                username: "柯南君2",
                cmtDetail: "服务态度非常好,技术一流"
            }
        ]
    };
    res.render('craftman_detail', craftmanDetail);
};

exports.followCraftman = function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send({followResult: "Follow successfully!"});
};


exports.commentList = function (req, res, next) {
    var commentList = {
        commentList: [{
            userAvatorUrl: "./images/avator.jpg",
            starLevel: 5,
            username: "柯南君1",
            cmtDetail: "服务态度非常好,技术一流aaa",
            cmtTime: "10月2日"
        }, {
            userAvatorUrl: "./images/avator.jpg",
            starLevel: 4,
            username: "柯南君2",
            cmtDetail: "服务态度非常好,技术一流nnnn",
            cmtTime: "5月2日"
        }, {
            userAvatorUrl: "./images/avator.jpg",
            starLevel: 4,
            username: "柯南君2",
            cmtDetail: "服务态度非常好,技术一流naaannn",
            cmtTime: "5月2日"
        }, {
            userAvatorUrl: "./images/avator.jpg",
            starLevel: 4,
            username: "柯南君2",
            cmtDetail: "服务态度非常好,技术一流啊啊啊nn",
            cmtTime: "5月2日"
        }, {
            userAvatorUrl: "./images/avator.jpg",
            starLevel: 4,
            username: "柯南君2",
            cmtDetail: "服务态度非常好,技术一流n啊啊啊阿瑟斯nnn",
            cmtTime: "5月2日"
        }]
    };
    res.render('user_comment_list', commentList);
};

exports.craftmanLoginPage = function (req, res, next) {
    var loginData = {
        title: '工匠登陆'
    };
    res.render('login_b', loginData);
};

exports.craftmanLogin = function (req, res, next) {
    var username = req.query.name;
    var password = req.query.password;
    console.log("username:" + username);
    console.log("pwd:" + password);
    res.setHeader('Content-Type', 'application/json');
    var cookieAge = 60 * 1000;
    res.cookie("b_token", 123456, {maxAge: cookieAge});
    res.send({loginSuc: true});
};

exports.craftmanPersonalInfo = function (req, res, next) {
    var craftmanData = {
        avator: "./images/avator.jpg",
        name: "黄师傅",
        telephone: 15800622061,
        orderAmount: 666,
        remainMoney: 1000.00,
        withdrawingMoney: 2200.00,
        withdrawedMoney: 800.00,
        totalIncome: 4000.00,
        realName: "王家卫",
        withdrawAccount: 421214
    };
    res.render("craftman_personal", craftmanData);
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
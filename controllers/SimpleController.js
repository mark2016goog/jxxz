/**
 * Created by xiangkai on 16/9/4.
 */
var request = require("request");
var crypto = require("crypto");

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

    //request.get(reqParam, function (error, response, body) {
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

    var personalInfo = {
        avatorUrl: "",
        nickName: "xiangkai",
        gender: "男",
        bindMobilephone: "未绑定"
    };
    res.render('personal_info', personalInfo);
};

exports.orderList = function (req, res, next) {
    var orderList = {
        title: "",
        list: [{
            brand: "江诗丹顿",
            orderID: "123",
            payTime: (new Date()).getTime(),
            payAmout: 1234.00,
            worker: "张师傅"
        }, {
            brand: "格拉苏蒂",
            orderID: "123",
            payTime: (new Date()).getTime(),
            payAmout: 1234.00,
            worker: "张师傅"
        }]
    };
    res.render('order_list', orderList);
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
        text: "上海市静安区南京西路1266号恒隆广场",
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
    res.contentType("json");
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
    res.contentType("json");
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
        totalIncome: 4000.00
    };
    res.render("craftman_personal", craftmanData);
};

exports.withdraw = function (req, res, next) {
    var username = req.query.amount;
    res.contentType("json");
    res.send({withdrawResult: true});
};
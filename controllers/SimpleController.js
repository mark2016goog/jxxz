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
            name: "王师傅",
            company: "亨得利国际名表服务中心",
            starLevel: 4,
            orderCounts: 1000,
            workAddress: "上海市静安区南京西路1266号恒隆广场",
            distance: "1.1km"
        }, {
            id: 2,
            avatorUrl: "./images/avator.jpg",
            name: "李师傅",
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


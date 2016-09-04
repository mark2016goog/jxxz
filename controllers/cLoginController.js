/**
 * Created by xiangkai on 16/9/4.
 */

exports.loginPage = function (req, res, next) {
    res.render('login_c', {title: '用户登录'});
};

exports.weChatCallback = function (req, res, next) {
    res.body = req.query.code;
};

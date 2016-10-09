var express = require('express');
var router = express.Router();
var controller = require('../controllers/SimpleController');
/* GET home page. */
router.get('/', controller.loginPage);
router.get('/wechat_login', controller.weChatCallback);
router.get('/orderlist', controller.orderList);
router.get('/couponlist', controller.couponList);
router.get('/followedCraftmanList', controller.followedCraftmanList);
router.get('/searchCraftmanByBrand', controller.searchCraftman);
router.get('/searchCraftmanAsync', controller.searchCraftmanAsync);
router.get('/craftmanDetail', controller.craftmanDetail);
router.get('/followCraftman', controller.followCraftman);
router.get('/commentList', controller.commentList);
router.get('/craftmanLoginPage',controller.craftmanLoginPage);
router.get('/loginCraftman',controller.craftmanLogin);
router.get('/craftmanPersonalInfo',controller.craftmanPersonalInfo);
router.get('/withdraw',controller.withdraw);
module.exports = router;

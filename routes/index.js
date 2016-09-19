var express = require('express');
var router = express.Router();
var cLoginController = require('../controllers/cLoginController');
/* GET home page. */
router.get('/', cLoginController.loginPage);
router.get('/wechat_login', cLoginController.weChatCallback);
router.get('/orderlist',cLoginController.orderList);
router.get('/couponlist',cLoginController.couponList);
router.get('/followedCraftmanList',cLoginController.followedCraftmanList);

module.exports = router;

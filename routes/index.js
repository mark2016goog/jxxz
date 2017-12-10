var express = require('express');
var router = express.Router();
var controller = require('../controllers/SimpleController');
/* GET home page. */
router.get('/', controller.loginPage);
router.get('/wechat_login', controller.weChatCallback);
router.get('/orderlist', controller.orderList);
router.get('/couponlist', controller.couponList);
router.get('/followedCraftmanList', controller.followedCraftmanList);
router.get('/preloadPosition', controller.preloadPosition)
router.get('/searchCraftmanByBrand', controller.searchCraftman);
router.get('/searchCraftmanAsync', controller.searchCraftmanAsync);
router.get('/craftmanDetail', controller.craftmanDetail);
router.get('/followCraftman', controller.followCraftman);
router.get('/unFollowCraftman', controller.unFollowCraftman);
router.get('/commentList', controller.commentList);
router.get('/craftmanLoginPage', controller.craftmanLoginPage);
router.get('/loginCraftman', controller.craftmanLogin);
router.get('/craftmanPersonalInfo', controller.craftmanPersonalInfo);
router.get('/withdraw', controller.withdraw);
router.get('/craftmanSettingPage', controller.craftmanSettingPage);
router.get('/getVerifyCode', controller.getVerifyCode);
router.get('/modifyPassword', controller.modifyPassword);
router.get('/getAccountDetailList', controller.getAccountDetailList);
router.get('/pay/prepay', controller.showPaypage);
router.get('/pay/payCallback', controller.payCallback);
router.get('/couponlistAsync', controller.couponListAsync);
router.get('/brandListAsync', controller.brandListAsync);
router.get('/pay/confirmPay/', controller.confirmPayPage);
router.get('/craftmanBusinessCard', controller.businessCard);
router.get('/register-telephone', controller.registerTelephonePage);
router.get('/retrieveValidateNumer', controller.getValidateNumber);
router.get('/businessmanRegister', controller.businessmanReg);
router.get('/toUploadBusinessCardPage', controller.toUploadBusinessCard);
router.get('/uploadCraftmanImage', controller.uploadCraftmanImage);
// router.get('/receive_push', controller.receiveWXMsg)
// router.post('/receive_push', controller.getPushMsg)
router.get("/brandSelectList", controller.showBrandSelect);
router.get("/selectBrand", controller.selectBrand);
module.exports = router;

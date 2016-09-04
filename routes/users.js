var express = require('express');
var router = express.Router();
var cLoginController = require('../controllers/cLoginController');

router.get('/wechat_login', cLoginController.weChatCallback);

module.exports = router;

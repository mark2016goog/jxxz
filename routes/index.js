var express = require('express');
var router = express.Router();
var cLoginController = require('../controllers/cLoginController');
/* GET home page. */
router.get('/', cLoginController.loginPage);

module.exports = router;

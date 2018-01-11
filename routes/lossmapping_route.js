/*
 auther:Android,
 NOTE:lossmapping请求的分配路由控制,
 time:20171108
 */

var express = require('express');
var router = express.Router();
var controller = require('../controllers/lossmapping_controller');

//test
router.post('/selectLossmappingByTimesAndLinebodys', async function (req, res, next) {
	controller.selectLossmappingByTimesAndLinebodys(req, res, next);
});
module.exports = router;
/*
 	auther:Android,
 	NOTE:overview请求的分配路由控制,
 	time:20171221
 */

var express = require('express');
var router = express.Router();
var controller = require('../controllers/overview_controller');

/*
	添加产品
 */
router.post('/selectOverviewByTimesAndLinebodys', function(req, res, next) {
    controller.selectOverviewByTimesAndLinebodys(req , res , next);
});

module.exports = router;
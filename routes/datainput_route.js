/*
 auther:Android,
 NOTE:loss请求的分配路由控制,
 time:20171019
 */

var express = require('express');
var router = express.Router();
var controller = require('../controllers/datainput_controller');

/*
	增加开班时间
 */
router.post('/addClasstime', function(req, res, next) {
    controller.addClasstime(req , res , next);
});

/*
	展示添加loss中三级目录结构
 */
router.post('/showLosstier3', function(req, res, next) {
    controller.showLosstier3(req , res , next);
});

module.exports = router;
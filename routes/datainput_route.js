/*
 auther:Android,
 NOTE:loss请求的分配路由控制,
 time:20171019
 */

var express = require('express');
var router = express.Router();
var controller = require('../controllers/datainput_controller');

/*
	查找二级loss结构
 */
router.post('/showKpitwolev', function(req, res, next) {
    controller.showKpitwolev(req , res , next);
});

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


/*
	添加四级loss发生的时间及持续时间
 */
router.post('/addLosstier4time', function(req, res, next) {
    controller.addLosstier4time(req , res , next);
});

/*
	三级下拉框结束，添加一条三级loss数据
 */
router.post('/addLosstier3data', function(req, res, next) {
    controller.addLosstier3data(req , res , next);
});

/*
	四级下拉框结束，添加一条四级loss数据
 */
router.post('/addLosstier4data', function(req, res, next) {
    controller.addLosstier4data(req , res , next);
});

/*
	点击确定，添加几条loss数据
 */
router.post('/addLosstier4time2', function(req, res, next) {
    controller.addLosstier4time2(req , res , next);
});

module.exports = router;
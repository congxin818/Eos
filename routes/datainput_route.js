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
	展示添加loss中三级目录结构
 */
router.post('/showLosstier3', function(req, res, next) {
    controller.showLosstier3(req , res , next);
});


/*
	点击确定，添加几条loss数据
 */
router.post('/addLosstier4time2', function(req, res, next) {
    controller.addLosstier4time2(req , res , next);
});

/*
	展示产品名字（最小的产品类）下拉列表
 */
router.post('/showProductName', function(req, res, next) {
    controller.showProductName(req , res , next);
});

/*
	展示产品信息
 */
router.post('/showProduct', function(req, res, next) {
    controller.showProduct(req , res , next);
});

/*
	添加产品信息
 */
router.post('/addProduct', function(req, res, next) {
    controller.addProduct(req , res , next);
});

/*
	更改产品信息
 */
router.post('/updateProduct', function(req, res, next) {
    controller.updateProduct(req , res , next);
});

/*
	删除产品信息
 */
router.post('/deleteProduct', function(req, res, next) {
    controller.deleteProduct(req , res , next);
});


/*
	添加开班信息
 */
router.post('/addClassinf', function(req, res, next) {
    controller.addClassinf(req , res , next);
});

/*
	编辑添加loss后的三级四级项目时间
 */
router.post('/updateObjectimeAfteradd', function(req, res, next) {
    controller.updateObjectimeAfteradd(req , res , next);
});

module.exports = router;
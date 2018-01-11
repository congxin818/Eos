/*
 	auther:Android,
 	NOTE:产品请求的分配路由控制,
 	time:20171019
 */

var express = require('express');
var router = express.Router();
var controller = require('../controllers/product_controller');


//查找所有用户
router.get('/selectProductAll', function (req, res, next) {
	controller.selectProductAll(req, res, next);
});


/*
	添加产品
 */
router.post('/addProductOne', function (req, res, next) {
	controller.addProductOne(req, res, next);
});

/*
	编辑产品
 */
router.post('/updateProductById', function (req, res, next) {
	controller.updateProductById(req, res, next);
});

/*
	删除产品
 */
router.post('/deleteProductById', function (req, res, next) {
	controller.deleteProductById(req, res, next);
});

/*
	查询产品
 */
router.post('/selectProductnameById', function (req, res, next) {
	controller.selectProductnameById(req, res, next);
});

/*
	编辑产品
 */
router.post('/updateProductnameById', function (req, res, next) {
	controller.updateProductnameById(req, res, next);
});


module.exports = router;
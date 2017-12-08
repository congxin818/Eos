/*
 	auther:Android,
 	NOTE:产品请求的分配路由控制,
 	time:20171019
 */

var express = require('express');
var router = express.Router();
var controller = require('../controllers/product_controller');


//查找所有用户
router.get('/selectProductAll', function(req, res, next) {
    controller.selectProductAll(req , res , next);
});

module.exports = router;
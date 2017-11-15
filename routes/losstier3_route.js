/*
 auther:Android,
 NOTE:loss请求的分配路由控制,
 time:20171019
 */

var express = require('express');
var router = express.Router();
var controller = require('../controllers/losstier3_controller');
var testcontroller = require('../controllers/impobject_controller');

/*
	查询所有loss
 */
router.get('/selectLossAll', function(req, res, next) {
    controller.selectLossAll(req , res , next);
});

/*
	添加一个loss
 */
router.post('/addLossOne', function(req, res, next) {
    controller.addLossOne(req , res , next);
});

/*
	删除所有loss
 */
router.get('/deleteLossById', function(req, res, next) {
    controller.deleteLossById(req , res , next);
});

/*
	根据ID更改loss
 */
router.post('/updateLossById', function(req, res, next) {
    controller.updateLossById(req , res , next);
});

/*
	text
 */
router.get('/selectImpobjectT', function(req, res, next) {
    testcontroller.selectImpobjectT(req , res , next);
});

/*
	text
 */
router.get('/showImpItempool', function(req, res, next) {
    testcontroller.showImpItempool(req , res , next);
});

module.exports = router;
var express = require('express');
var router = express.Router();
var controller = require('../controllers/linebody_controller');


/*
	展示所有线体
*/
router.get('/selectLinebodyAll', function(req, res, next) {
    controller.selectLinebodyAll(req , res);
});

/*
	根据id查找一个线体
*/
router.post('/selectLinebodyById', function(req, res, next) {
    controller.selectLinebodyById(req , res);
});

/*
	添加一个线体
*/
router.post('/addLinebodyOne', function(req, res, next) {
    controller.addLinebodyOne(req , res);
});

/*
	根据id删除线体
*/
router.get('/deleteLinebodyById', function(req, res, next) {
    controller.deleteLinebodyById(req , res);
});

/*
	根据id更新线体
*/
router.post('/updateLinebodyById', function(req, res, next) {
    controller.updateLinebodyById(req , res);
});
module.exports = router;
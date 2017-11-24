var express = require('express');
var router = express.Router();
var controller = require('../controllers/linebody_controller');


/*
	根据id查找一个线体
*/
router.post('/selectLinebodyById', function(req, res, next) {
    controller.selectLinebodyById(req , res);
});

/*
	根据id更新线体
*/
router.post('/updateLinebodyInfById', function(req, res, next) {
    controller.updateLinebodyInfById(req , res);
});

/*
	根据id更新线体权重
*/
router.post('/updateLinebodyWeightById', function(req, res, next) {
    controller.updateLinebodyWeightById(req , res , next);
});
module.exports = router;
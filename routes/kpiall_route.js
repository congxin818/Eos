var express = require('express');
var router = express.Router();
var controller = require('../controllers/kpiall_controller');


/*
	添加一个集团
*/
router.post('/addGroupOne', function(req, res, next) {
    controller.addGroupOne(req , res);
});

/*
	根据id删除集团
*/
router.get('/deleteGroupById', function(req, res, next) {
    controller.deleteGroupById(req , res);
});

/*
	根据id更新集团
*/
router.post('/updateGroupById', function(req, res, next) {
    controller.updateGroupById(req , res);
});
/*
	查询所有KPI
*/
router.get('/selectKPIAll', function(req, res, next) {
    controller.selectKPIAll(req , res);
});

module.exports = router;
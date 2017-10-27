var express = require('express');
var router = express.Router();
var controller = require('../controllers/kpiall_controller');

/*
	删除KPI二级目录
*/
router.get('/deleteKPItwoLev', function(req, res, next) {
    controller.deleteKPItwoLev(req , res);
});

/*
	根据id更新集团
*/
router.post('/updateKPItwoLev', function(req, res, next) {
    controller.updateKPItwoLev(req , res);
});
/*
	查询所有KPI
*/
router.get('/showKPIAll', function(req, res, next) {
    controller.showKPIAll(req , res);
});

/*
	添加KPI二级目录
*/
router.post('/addKPItwoLev', function(req, res, next) {
    controller.addKPItwoLev(req , res);
});

module.exports = router;
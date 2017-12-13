var express = require('express');
var router = express.Router();
var controller = require('../controllers/areaall_controller');



/*
	添加一个区域范围
	*/
	router.post('/addAreaOne', function(req, res, next) {
		controller.addAreaOne(req , res);
	});


/*
	查询所有地区
	*/
	router.get('/showAreaAll', function(req, res, next) {
		controller.showAreaAll(req , res);
	});

/*
	更改地区
	*/
	router.post('/updateArea', function(req, res, next) {
		controller.updateArea(req , res);
	});

/*
	删除地区
	*/
	router.get('/deleteArea', function(req, res, next) {
		controller.deleteArea(req , res);
	});

/*
	测试*/
router.get('/text123', function(req, res, next) {
    controller.text123(req , res);
});

/*
	根据线体ID查询该线体能生产的产品
	*/
router.post('/selectLinebodyProductsByLinebodyId', function(req, res, next) {
	controller.selectLinebodyProductsByLinebodyId(req , res , next);
});

/*
    根据线体ID添加产品
 */
router.post('/addLinebodyProductByLinebodyId', function(req, res, next) {
    controller.addLinebodyProductByLinebodyId(req , res , next);
});

/*
    根据线体ID删除产品
 */
router.post('/deleteLinebodyProductById', function(req, res, next) {
    controller.deleteLinebodyProductById(req , res , next);
});

/*
    根据线体ID删除产品
 */
router.post('/updateLinebodyProductById', function(req, res, next) {
    controller.updateLinebodyProductById(req , res , next);
});
module.exports = router;
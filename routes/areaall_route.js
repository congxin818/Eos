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

	module.exports = router;
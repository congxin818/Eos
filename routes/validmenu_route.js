var express = require('express');
var router = express.Router();
var controller = require('../controllers/validmenu_controller');


/*
	展示所有有效菜单
	*/
	router.post('/selectValmeuById', function(req, res, next) {
		controller.selectValmeuById(req , res);
	});


/*
	添加一个有效菜单
	*/
	router.post('/addValidmenuOne', function(req, res, next) {
		controller.addValidmenuOne(req , res);
	});

/*
	根据id删除有效菜单
	*/
	router.get('/deleteValidmenuById', function(req, res, next) {
		controller.deleteValidmenuById(req , res);
	});

	module.exports = router;

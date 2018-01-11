var express = require('express');
var router = express.Router();
var controller = require('../controllers/group_controller');


/*
	展示所有集团
	*/
router.get('/selectGroupAll', function (req, res, next) {
	controller.selectGroupAll(req, res);
});

/*
	根据id查找一个集团
	*/
router.post('/selectGroupById', function (req, res, next) {
	controller.selectGroupById(req, res);
});

/*
	添加一个集团
	*/
router.post('/addGroupOne', function (req, res, next) {
	controller.addGroupOne(req, res);
});

/*
	根据id删除集团
	*/
router.get('/deleteGroupById', function (req, res, next) {
	controller.deleteGroupById(req, res);
});

/*
	根据id更新集团
	*/
router.post('/updateGroupById', function (req, res, next) {
	controller.updateGroupById(req, res);
});


module.exports = router;
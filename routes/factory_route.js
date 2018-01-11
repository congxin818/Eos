var express = require('express');
var router = express.Router();
var controller = require('../controllers/factory_controller');


/*
	展示所有工厂
*/
router.get('/selectFactoryAll', function (req, res, next) {
    controller.selectFactoryAll(req, res);
});

/*
	根据id查找一个工厂
*/
router.post('/selectFactoryById', function (req, res, next) {
    controller.selectFactoryById(req, res);
});

/*
	添加一个工厂
*/
router.post('/addFactoryOne', function (req, res, next) {
    controller.addFactoryOne(req, res);
});

/*
	根据id删除工厂
*/
router.get('/deleteFactoryById', function (req, res, next) {
    controller.deleteFactoryById(req, res);
});

/*
	根据id更新工厂
*/
router.post('/updateFactoryById', function (req, res, next) {
    controller.updateFactoryById(req, res);
});
module.exports = router;
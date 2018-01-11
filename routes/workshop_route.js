var express = require('express');
var router = express.Router();
var controller = require('../controllers/workshop_controller');


/*
	展示所有车间
*/
router.get('/selectWorkshopAll', function (req, res, next) {
    controller.selectWorkshopAll(req, res);
});

/*
	根据id查找一个车间
*/
router.post('/selectWorkshopById', function (req, res, next) {
    controller.selectWorkshopById(req, res);
});

/*
	添加一个车间
*/
router.post('/addWorkshopOne', function (req, res, next) {
    controller.addWorkshopOne(req, res);
});

/*
	根据id删除车间
*/
router.get('/deleteWorkshopById', function (req, res, next) {
    controller.deleteWorkshopById(req, res);
});

/*
	根据id更新车间
*/
router.post('/updateWorkshopById', function (req, res, next) {
    controller.updateWorkshopById(req, res);
});

module.exports = router;
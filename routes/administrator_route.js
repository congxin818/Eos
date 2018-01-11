var express = require('express');
var router = express.Router();
var controller = require('../controllers/administrator_controller');

var dataSuccess = {
    status: '0',
    msg: '请求成功'
};

var parameterError = {
    status: '1',
    msg: '参数错误'
};

//查找所有管理员
router.get('/selectList', function (req, res, next) {
    controller.selectList(req, res);
});

//查找一个管理员
router.post('/selectByUserName', function (req, res, next) {
    controller.selectByUserName(req, res);
});

//添加一条管理员
router.post('/addOne', function (req, res, next) {
    controller.addOne(req, res);
});

//删除一个管理员
router.get('/deleteByUserName', function (req, res, next) {
    controller.deleteByUserName(req, res);
});

//更新一条管理员
router.post('/updateByUserName', function (req, res, next) {
    controller.updateByUserName(req, res);
});

router.post('/adminLogin', function (req, res, next) {
    controller.adminLogin(req, res);
});

module.exports = router;
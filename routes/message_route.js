var express = require('express');
var router = express.Router();
var controller = require('../controllers/message_controller');

//查找所有留言
router.get('/selectList', function(req, res, next) {
    controller.selectList(req , res);
});

//查找一个留言
router.get('/selectById', function(req, res, next) {
    controller.selectById(req , res);
});

//添加一条留言
router.post('/addOne', function(req, res, next) {
    controller.addOne(req , res);
});

//删除一个留言
router.get('/deleteById', function(req, res, next) {
    controller.deleteById(req , res);
});

//更新一条留言
router.post('/updateById', function(req, res, next) {
    controller.updateById(req , res);
});

module.exports = router;
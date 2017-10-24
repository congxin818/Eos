/*
 auther:Android,
 NOTE:用户请求的分配路由控制,
 time:20171019
 */

var express = require('express');
var router = express.Router();
var controller = require('../controllers/user_controller');

//查找所有用户
router.get('/selectUserAll', function(req, res, next) {
    controller.selectUserAll(req , res , next);
});

//根据用户名查找一个用户
router.post('/selectUserByName', function(req, res, next) {
    controller.selectUserByName(req , res , next);
});

//根据用户名ID查找一个用户
router.post('/selectUserById', function(req, res, next) {
    controller.selectUserById(req , res , next);
});

//添加一条用户
router.post('/addUserOne', function(req, res, next) {
    controller.addUserOne(req , res , next);
});

//删除一个用户
router.get('/deleteUserById', function(req, res, next) {
    controller.deleteUserById(req , res , next);
});

//更新一条用户
router.post('/updateUserById', function(req, res, next) {
    controller.updateUserById(req , res , next);
});

//测试user和group关联——添加
router.get('/createUserGroup' , function(req , res , next){
	controller.createUserGroup(req , res , next);
});

//测试user和group关联——查询
router.get('/selectUserGroup' , function(req , res , next){
	controller.selectUserGroup(req , res , next);
});
module.exports = router;
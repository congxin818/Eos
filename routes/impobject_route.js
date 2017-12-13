/*
 auther:Android,
 NOTE:loss请求的分配路由控制,
 time:20171019
 */

var express = require('express');
var router = express.Router();
var controller = require('../controllers/impobject_controller');


/*
	improvment展示项目池信息
 */
router.post('/showImpItempool', function(req, res, next) {
    controller.showImpItempool(req , res , next);
});

/*
	improvment展示项目状态
 */
router.post('/showImpItemstatus', function(req, res, next) {
    controller.showImpItemstatus(req , res , next);
});

/*
	improvment编辑项目状态
 */
router.post('/updateImpItemstatus', function(req, res, next) {
    controller.updateImpItemstatus(req , res , next);
});

/*
	根据线体id展示现进行项目
 */
router.post('/showObjectnowBylinedyid', function(req, res, next) {
    controller.showObjectnowBylinedyid(req , res , next);
});

/*
	添加现进行项目
 */
router.post('/addObjectnowBylossid', function(req, res, next) {
    controller.addObjectnowBylossid(req , res , next);
});

/*
	删除现进行项目
 */
router.post('/deleteObjectnowBylossid', function(req, res, next) {
    controller.deleteObjectnowBylossid(req , res , next);
});

/*
	improvment展示历史信息
 */
router.post('/showImpItemhistory', function(req, res, next) {
    controller.showImpItemhistory(req , res , next);
});

module.exports = router;
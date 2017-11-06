/*
 auther:Android,
 NOTE:loss请求的分配路由控制,
 time:20171019
 */

var express = require('express');
var router = express.Router();
var controller = require('../controllers/impobject_controller');



/*
	text
 */
router.get('/selectImpobjectT', function(req, res, next) {
    controller.selectImpobjectT(req , res , next);
});

/*
	improvment展示项目池信息
 */
router.get('/showImpItempool', function(req, res, next) {
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

module.exports = router;
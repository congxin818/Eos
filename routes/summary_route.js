/*
 auther:Android,
 NOTE:用户请求的分配路由控制,
 time:20171019
 */

var express = require('express');
var router = express.Router();
var controller = require('../controllers/summary_controller');

//分页查找
router.post('/selectProjectStateByTimeAndLinebodyIds', function(req, res, next) {
    controller.selectProjectStateByTimeAndLinebodyIds(req , res , next);
});
module.exports = router;
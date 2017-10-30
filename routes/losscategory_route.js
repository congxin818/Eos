/*
 auther:Android,
 NOTE:loss请求的分配路由控制,
 time:20171019
 */

var express = require('express');
var router = express.Router();
var controller = require('../controllers/losscategory_controller');

/*
	查询所有loss
 */
router.get('/selectLossAll', function(req, res, next) {
    controller.selectLossAll(req , res , next);
});
module.exports = router;
/*
 auther:Android,
 NOTE:lossmapping请求的分配路由控制,
 time:20171108
 */

var express = require('express');
var router = express.Router();
var controller = require('../controllers/lossmapping_controller');

//test
router.get('/linebody', async function(req, res, next) {
	const alldata = await controller.selectLossMappingByLinebodyId(213,6);
    res.end (JSON.stringify (alldata, null, 4));
});

//test
router.get('/linebodyKpitwo', async function(req, res, next) {
	const alldata = await controller.baseSelectKpitwoByLinebodyId(213,6);
    res.end (JSON.stringify (alldata, null, 4));
});

//test
router.get('/linebodyLoss', async function(req, res, next) {
	const alldata = await controller.baseSelectLosscategoryByLinebodyId(213,6);
    res.end (JSON.stringify (alldata, null, 4));
});

//test
router.post('/selectAllByUserIdAndLinebodyIds', async function(req, res, next) {
	controller.selectAllByUserIdAndLinebodyIds(req , res , next);
});
module.exports = router;
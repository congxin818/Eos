/*
 	auther:Android,
 	NOTE:losstier4表的controller层,
 	time:20171122
 */
var service = require('../services/losstier4_service');
var errorUtil = require('../utils/errorUtil');
var losstier3_controller = require('../controllers/losstier3_controller');
var dataSuccess = {
	status: '0',
	msg: '请求成功',
	data: 'fas'
};
/*
	查询所有
 */
async function selectLosstier4All(req, res, next) {
	if (req == null || res == null) {
		return errorUtil.parameterError;
	}
	let losstier4Data = await service.selectLossAll();
	if (losstier4Data == undefined || losstier4Data == null || losstier4Data == '') {
		res.end(JSON.stringify(errorUtil.noExistError));
	} else {

		res.end(JSON.stringify(losstier4Data));
	}
}
exports.selectLosstier4All = selectLosstier4All;

/*
	添加子目录
 */
async function addLosstier4One(req, res, next) {
	if (req == null || res == null) {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	const lossname = req.body.name;
	const pid = req.body.pId;
	if (lossname == undefined || lossname == null || lossname == ''
		|| pid == undefined || pid == null || pid == '') {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	if (isNaN(pid)) {
		// const kpiTwoId = pid.slice(1);
		// if (kpiTwoId == undefined || kpiTwoId == null || kpiTwoId == '') {
		// 	res.end(JSON.stringify(errorUtil.parameterError));
		// }
		const loss = await service.selectLossByName(lossname, pid);
		if (loss == undefined || loss == null || loss == '') {
			const data = await service.addLossOne(lossname, pid);
			if (data == undefined || data == null || data == '') {
				res.end(JSON.stringify(errorUtil.serviceError));
			}
			dataSuccess.data = data;
			res.end(JSON.stringify(dataSuccess));
		} else {
			res.end(JSON.stringify(errorUtil.existError));
		}
	} else {
		await kpiall_controller.addKPItwoLev(req, res);
	}
}
exports.addLosstier4One = addLosstier4One;

/*
	根据ID删除
 */
async function deleteLosstier4ById(req, res, next) {
	if (req == null || res == null
		|| req.query.id == undefined || req.query.id == null || req.query.id == '') {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	const type = req.query.id.slice(0, 1);
	const ID = req.query.id.slice(1);
	if (type == '' || type == null || type == undefined
		|| ID == undefined || ID == null || ID == '') {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	if (type == 't') {
		await kpiall_controller.deleteKPItwoLev(req, res);
	} else {
		const falg = await service.deleteLossById(ID);
		//console.log('yuzhizhe_falg---->'+ falg);
		if (falg == undefined || falg == null || falg == '') {
			res.end(JSON.stringify(errorUtil.noExistError));
		} else {
			dataSuccess.data = falg;
			res.end(JSON.stringify(dataSuccess));
		}
	}
}
exports.deleteLosstier4ById = deleteLosstier4ById;

/*
	根据ID跟新
 */
async function updateLosstier4ById(req, res, next) {
	if (req == null || res == null) {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	const lossname = req.body.name;
	const pid = req.body.pId;
	const ID = req.body.id;
	if (lossname == undefined || lossname == null || lossname == ''
		|| pid == undefined || pid == null || pid == ''
		|| ID == undefined || ID == null || ID == '') {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	if (isNaN(pid)) {
		const lossid = ID.slice(1);
		if (lossid == undefined || lossid == null || lossid == '') {
			res.end(JSON.stringify(errorUtil.parameterError));
		}
		const loss = await service.selectLossById(lossid);
		if (loss == undefined || loss == null || loss == '') {
			res.end(JSON.stringify(errorUtil.noExistError));
		}
		const data = await service.updateLossById(lossid, lossname, pid);
		if (data == undefined || data == null || data == '' || data != 1) {
			res.end(JSON.stringify(errorUtil.serviceError));
		}
		dataSuccess.data = data;
		res.end(JSON.stringify(dataSuccess));
	} else {
		await kpiall_controller.updateKPItwoLev(req, res);
	}
}
exports.updateLosstier4ById = updateLosstier4ById;
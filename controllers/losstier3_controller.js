
/*
 	auther:Android,
 	NOTE:loss表的controller层,
 	time:20171030
 */
var service = require('../services/losstier3_service');
var losstier4_service = require('../services/losstier4_service');
var errorUtil = require('../utils/errorUtil');
var kpiall_controller = require('../controllers/kpiall_controller');

let Kpitwolev = require('../models').Kpitwolev;
let Losstier3 = require('../models').Losstier3;
let Losstier4 = require('../models').Losstier4;

var dataSuccess = {
	status: '0',
	msg: '请求成功',
	data: 'fas'
};
/*
	查询所有
 */
async function selectLossAll(req, res, next) {
	if (req == null || res == null) {
		return errorUtil.parameterError;
	}
	let kpiData = await kpiall_controller.selectKPIAll(req, res);
	let lossData = await service.selectLossAll();
	let losstier4Data = await losstier4_service.selectLosstier4All();
	if (kpiData == undefined || kpiData == null || kpiData == '') {
		res.end(JSON.stringify(errorUtil.noExistError));
	}
	if (lossData == undefined || lossData == null || lossData == '') {
		dataSuccess.data = kpiData;
		res.end(JSON.stringify(kpiData));
	} else {
		const data = kpiData.concat(lossData);
		if (losstier4Data == undefined || losstier4Data == null || losstier4Data == '') {
			dataSuccess.data = data;
			res.end(JSON.stringify(data));
		} else {
			const value = data.concat(losstier4Data);
			dataSuccess.data = value;
			res.end(JSON.stringify(dataSuccess));
		}
	}
}
exports.selectLossAll = selectLossAll;

/*
	添加子目录
 */
async function addLossOne(req, res, next) {
	if (req == null || res == null) {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	const lossname = req.body.name;
	const pid = req.body.pId;
	if (lossname == undefined || lossname == null || lossname == ''
		|| pid == undefined || pid == null || pid == '') {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	if (isNaN(req.body.pId)) {
		const pFlag = await req.body.pId.slice(0, 1);
		const pId = await req.body.pId.slice(1);
		if (isNaN(pFlag)) {
			if (pFlag == 't') {
				const kpitwo = await Kpitwolev.findById(pId);
				if (kpitwo == undefined || kpitwo == null || kpitwo == '') {
					res.end(JSON.stringify(errorUtil.noExistError));
				} else {
					const losstier3 = await Losstier3.findOne({ where: { name: req.body.name } });
					if (losstier3 == undefined || losstier3 == null || losstier3 == '') {
						const newLosstier3 = {
							name: req.body.name,
							kpitwolevKpitwoid: pId,
							pId: 't' + pId
						};
						const flag = await Losstier3.create(newLosstier3);
						if (flag == undefined || flag == null || flag == '') {
							res.end(JSON.stringify(errorUtil.serviceError));
						} else {
							const newLoss = {
								id: 'l' + flag.lossid
							};
							const value = await Losstier3.update(newLoss, { where: { lossid: flag.lossid } });
							if (value == undefined || value == null || value == '' || value != 1) {
								const de_flag = await Losstier3.destroy({ where: { lossid: flag.lossid } });
								res.end(JSON.stringify(errorUtil.serviceError));
								return;
							}
							flag.id = 'l' + flag.lossid;
							dataSuccess.data = flag;
							res.end(JSON.stringify(dataSuccess));
						}
					} else {
						res.end(JSON.stringify(errorUtil.existError));
					}
				}
			} else if (pFlag == 'l') {
				const losstier3 = await Losstier3.findById(pId);
				if (losstier3 == undefined || losstier3 == null || losstier3 == '') {
					res.end(JSON.stringify(errorUtil.noExistError));
				} else {
					const losstier4 = await Losstier4.findOne({ where: { name: req.body.name } });
					if (losstier4 == undefined || losstier4 == null || losstier4 == '') {
						const newLosstier4 = {
							name: req.body.name,
							losstier3Lossid: pId,
							pId: 'l' + pId
						};
						const flag = await Losstier4.create(newLosstier4);
						if (flag == undefined || flag == null || flag == '') {
							res.end(JSON.stringify(errorUtil.serviceError));
						} else {
							const newLoss = {
								id: 'h' + flag.tier4id
							};
							const value = await Losstier4.update(newLoss, { where: { tier4id: flag.tier4id } });
							if (value == undefined || value == null || value == '' || value != 1) {
								const de_flag = await Losstier4.destroy({ where: { tier4id: flag.tier4id } });
								res.end(JSON.stringify(errorUtil.serviceError));
								return;
							}
							flag.id = 'h' + flag.tier4id;
							dataSuccess.data = flag;
							res.end(JSON.stringify(dataSuccess));
						}
					} else {
						res.end(JSON.stringify(errorUtil.existError));
					}
				}
			} else {
				res.end(JSON.stringify(errorUtil.parameterError));
			}
		} else {
			res.end(JSON.stringify(errorUtil.parameterError));
		}
	} else {
		await kpiall_controller.addKPItwoLev(req, res);
	}
}
exports.addLossOne = addLossOne;

/*
	根据ID删除
 */
async function deleteLossById(req, res, next) {
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
		const falg = await Kpitwolev.destroy({ where: { kpitwoid: ID } });
		//console.log('yuzhizhe_falg---->'+ falg);
		if (falg == undefined || falg == null || falg == '') {
			res.end(JSON.stringify(errorUtil.noExistError));
		} else {
			await service.lossClear();
			await losstier4_service.losstier4Clear();
			dataSuccess.data = falg;
			res.end(JSON.stringify(dataSuccess));
		}
	} else if (type == 'l') {
		const falg = await service.deleteLossById(ID);
		//console.log('yuzhizhe_falg---->'+ falg);
		if (falg == undefined || falg == null || falg == '') {
			res.end(JSON.stringify(errorUtil.noExistError));
		} else {
			await service.lossClear();
			await losstier4_service.losstier4Clear();
			dataSuccess.data = falg;
			res.end(JSON.stringify(dataSuccess));
		}
	} else if (type == 'h') {
		const falg = await Losstier4.destroy({ where: { tier4id: ID } });
		//console.log('yuzhizhe_falg---->'+ falg);
		if (falg == undefined || falg == null || falg == '') {
			res.end(JSON.stringify(errorUtil.noExistError));
		} else {
			dataSuccess.data = falg;
			res.end(JSON.stringify(dataSuccess));
		}
	}
}
exports.deleteLossById = deleteLossById;

/*
	根据ID跟新
 */
async function updateLossById(req, res, next) {
	if (req == null || res == null) {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	const lossname = req.body.name;
	const ID = req.body.id;
	if (lossname == undefined || lossname == null || lossname == ''
		|| ID == undefined || ID == null || ID == '') {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	if (isNaN(ID)) {
		const pFlag = await ID.slice(0, 1);
		const pId = await ID.slice(1);
		if (isNaN(pFlag)) {
			if (pFlag == 't') {
				const kpitwo = await Kpitwolev.findById(pId);
				if (kpitwo == undefined || kpitwo == null || kpitwo == '') {
					res.end(JSON.stringify(errorUtil.noExistError));
				} else {
					const newKpitwo = {
						name: req.body.name,
					};
					const flag = await Kpitwolev.update(newKpitwo, { where: { kpitwoid: pId } });
					if (flag == undefined || flag == null || flag == '' || flag != 1) {
						res.end(JSON.stringify(errorUtil.serviceError));
					} else {
						dataSuccess.data = flag;
						res.end(JSON.stringify(dataSuccess));
					}
				}
			} else if (pFlag == 'l') {
				const losstier3 = await Losstier3.findById(pId);
				if (losstier3 == undefined || losstier3 == null || losstier3 == '') {
					res.end(JSON.stringify(errorUtil.noExistError));
				} else {
					const newLosstier3 = {
						name: req.body.name,
					};
					const flag = await Losstier3.update(newLosstier3, { where: { lossid: pId } });
					if (flag == undefined || flag == null || flag == '' || flag != 1) {
						res.end(JSON.stringify(errorUtil.serviceError));
					} else {
						dataSuccess.data = flag;
						res.end(JSON.stringify(dataSuccess));
					}
				}
			} else if (pFlag == 'h') {
				const losstier4 = await Losstier4.findById(pId);
				if (losstier4 == undefined || losstier4 == null || losstier4 == '') {
					res.end(JSON.stringify(errorUtil.noExistError));
				} else {
					const newLosstier4 = {
						name: req.body.name,
					};
					const flag = await Losstier4.update(newLosstier4, { where: { tier4id: pId } });
					if (flag == undefined || flag == null || flag == '' || flag != 1) {
						res.end(JSON.stringify(errorUtil.serviceError));
					} else {
						dataSuccess.data = flag;
						res.end(JSON.stringify(dataSuccess));
					}
				}
			} else {
				res.end(JSON.stringify(errorUtil.parameterError));
			}
		} else {
			res.end(JSON.stringify(errorUtil.parameterError));
		}
	} else {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
}
exports.updateLossById = updateLossById;
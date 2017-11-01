/*
 	auther:Android,
 	NOTE:loss表的controller层,
 	time:20171030
 */
var service = require('../services/losscategory_service');
var errorUtil = require('../utils/errorUtil');
var kpiall_controller = require('../controllers/kpiall_controller');
var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};
/*
	查询所有
 */
async function selectLossAll(req , res , next){
	if (req == null || res == null ) {
		return errorUtil.parameterError;
	}
	let kpiData = await kpiall_controller.selectKPIAll(req , res);
	let lossData = await service.selectLossAll();
	if (lossData == undefined || lossData == null || lossData == '') {
        return kpiData;
    }else{
        const data= kpiData.concat(lossData);
		res.end(JSON.stringify(data));
    }
}
exports.selectLossAll = selectLossAll;

/*
	添加子目录
 */
async function addLossOne(req , res , next){
	if (req == null || res == null ) {
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
		const data = await service.addLossOne(lossname , pid);
		if (data == undefined || data == null || data == '') {
			res.end(JSON.stringify(errorUtil.serviceError));
		}
		dataSuccess.data = data;
		res.end(JSON.stringify(dataSuccess));
	}else{
		await kpiall_controller.addKPItwoLev(req , res);
	}
}
exports.addLossOne = addLossOne;

/*
	根据ID删除
 */
async function deleteLossById(req , res , next){
	if (req == null || res == null 
		||req.query.id == undefined || req.query.id == null || req.query.id == '') {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	const type = req.query.id.slice(0,1);
	const ID = req.query.id.slice(1);
	if (type == '' || type == null || type == undefined
		||ID == undefined || ID == null || ID == '') {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	if (type == 't') {
		await kpiall_controller.deleteKPItwoLev(req , res);
	}else{
		const falg = await service.deleteLossById(ID);
		//console.log('yuzhizhe_falg---->'+ falg);
		if (falg == undefined || falg == null || falg == '') {
			res.end(JSON.stringify(errorUtil.noExistError));
		}else{
			dataSuccess.data = falg;
			res.end(JSON.stringify(dataSuccess));
		}
	}
}
exports.deleteLossById = deleteLossById;

/*
	根据ID跟新
 */
async function updateLossById(req , res , next){

}
exports.updateLossById = updateLossById;
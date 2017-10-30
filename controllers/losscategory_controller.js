/*
 	auther:Android,
 	NOTE:loss表的controller层,
 	time:20171030
 */
var service = require('../services/losscategory_service');
var errorUtil = require('../utils/errorUtil');
var kpiall_controller = require('../controllers/kpiall_controller');

/*
	查询所有
 */
async function selectLossAll(req , res , next){
	if (req == null || res == null ) {
		return null;
	}
	let kpiData = await kpiall_controller.selectKPIAll(req , res);
	let lossData = await service.selectLossAll();
	const data= kpiData.concat(lossData);
	res.end(JSON.stringify(data));
}
exports.selectLossAll = selectLossAll;
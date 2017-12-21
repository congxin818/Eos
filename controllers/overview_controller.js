


var service = require('../services/user_service');
var Lossstatus = require('../models').Lossstatus;//引入数据库Lossstatus模块
var Linebody = require('../models').Linebody;//引入数据库Linebody模块
var errorUtil = require('../utils/errorUtil');

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

/*
    根据times和linebodys查询Overview数据
    */
async function selectOverviewByTimesAndLinebodys(req , res , next){
    if (req.body.startTime == undefined || req.body.startTime == ''|| req.body.startTime == null
    	||req.body.endTime == undefined || req.body.endTime == ''|| req.body.endTime == null
    	||req.body.linebodys == undefined || req.body.linebodys == ''|| req.body.linebodys == null) {
        res.end(errorUtil.parameterError);
        return;
    }
    const Ids = req.body.linebodys.split(',');
    if (Ids == undefined || Ids == null || Ids == '' || Ids.length == 0) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }


}
exports.selectOverviewByTimesAndLinebodys = selectOverviewByTimesAndLinebodys;

async function selectBarchartByTimesAndLinebodys(startTime , endTime , Ids){
	if (req.body.startTime == undefined || req.body.startTime == ''|| req.body.startTime == null
    	||req.body.endTime == undefined || req.body.endTime == ''|| req.body.endTime == null
    	||req.body.Ids == undefined || req.body.Ids == ''|| req.body.Ids == null) {
        res.end(errorUtil.parameterError);
        return;
    }
    for (var i = Ids.length - 1; i >= 0; i--) {
    	if (Ids[i] == null) {
    		continue;
    	}
    	const linebody = await Linebody.findById(Ids[i]);
    	const linebodyKpitwo = await linebody.getLinebodyKpitwolev();
    	if (linebody == null || linebody == ''
    		||linebodyKpitwo == null || linebodyKpitwo == '') {
    		continue;
    	}
    	

    }

}
exports.selectBarchartByTimesAndLinebodys = selectBarchartByTimesAndLinebodys;
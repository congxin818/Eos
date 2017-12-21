


var service = require('../services/user_service');
var Lossstatus = require('../models').Lossstatus;//引入数据库Lossstatus模块
var Linebody = require('../models').Linebody;//引入数据库Linebody模块
var Classinformation = require('../models').Classinformation;//引入数据库Classinformation模块
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
    await this.selectBarchartByTimesAndLinebodys(req.body.startTime , req.body.endTime , Ids);

}
exports.selectOverviewByTimesAndLinebodys = selectOverviewByTimesAndLinebodys;

/*
    根据times和linebodys查询Overview中柱状图数据
    */
async function selectBarchartByTimesAndLinebodys(startTime , endTime , Ids){
	if (startTime == undefined || startTime == ''|| startTime == null
    	||endTime == undefined || endTime == ''|| endTime == null
    	||Ids == undefined || Ids == ''|| Ids == null) {
        return;
    }
    let allData = new Array();
    for (var i = Ids.length - 1; i >= 0; i--) {
    	if (Ids[i] == null) {
    		continue;
    	}
    	const linebody = await Linebody.findById(Ids[i]);
    	const linebodyKpitwo = await linebody.getLinebodyKpitwolev();
    	//const classInfo = await linebodyKpitwo.getClassinfKpitwolevData();
    	// if (linebody == null || linebody == ''|| linebody == undefined
    	// 	||linebodyKpitwo == null || linebodyKpitwo == '' || linebodyKpitwo == undefined) {
    	// 	continue;
    	// }
    	for (var h = linebodyKpitwo.length - 1; h >= 0; h--) {
    		const falg = await this.computeByTimes(startTime , endTime , linebodyKpitwo[h]);
	    	console.log("----falg-->"+JSON.stringify(falg , null , 4));
	    	if (falg) {
	    		await allData.push(linebodyKpitwo[h]);
	    	}else{
	    		continue;
	    	}
    	}
    	
    }

    console.log("------>"+JSON.stringify(allData , null , 4));
}
exports.selectBarchartByTimesAndLinebodys = selectBarchartByTimesAndLinebodys;

/*
    根据times和allData过滤Overview中柱状图数据的linebodyKpitwo是否在时间段内
    */
async function computeByTimes(startTime , endTime ,allData){

}
exports.computeByTimes = computeByTimes;
/*
    根据times和allData过滤Overview中柱状图数据的linebodyKpitwo是否在时间段内
*/
async function computeByTimes(startTime , endTime ,linebodyKpitwo){
	if (startTime == undefined || startTime == ''|| startTime == null
    	||endTime == undefined || endTime == ''|| endTime == null
    	||linebodyKpitwo == undefined || linebodyKpitwo == ''|| linebodyKpitwo == null) {
        return false;
    }
    const classInfo = await Classinformation.findById(linebodyKpitwo.classinformationClassinfid);
    if (classInfo == undefined || classInfo == null || classInfo == '') {
    	return false;
    }
    const sTime = new Date(startTime).getTime();
    const eTime = new Date(endTime).getTime();

   	const csTime = new Date(classInfo.classstarttime).getTime();
    const ceTime = new Date(classInfo.classendtime).getTime();
    if (sTime == undefined || sTime == ''|| sTime == null
    	||eTime == undefined || eTime == ''|| eTime == null
    	||csTime == undefined || csTime == ''|| csTime == null
    	||ceTime == undefined || ceTime == ''|| ceTime == null) {
        return false;
    }
    if (eTime < csTime || sTime > ceTime) {
    	return false;
    }else{
    	return true;
    }
}
exports.computeByTimes = computeByTimes;
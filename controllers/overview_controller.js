


var linebody_extend_service = require('../services/linebody_extend_service');
var Lossstatus = require('../models').Lossstatus;//引入数据库Lossstatus模块
var Linebody = require('../models').Linebody;//引入数据库Linebody模块
var Classinformation = require('../models').Classinformation;//引入数据库Classinformation模块
var Kpitwolev = require('../models').Kpitwolev;//引入数据库Kpitwolev模块
var errorUtil = require('../utils/errorUtil');
var moment = require('moment');

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

/*
    根据times和linebodys查询Overview数据
    */
async function selectOverviewByTimesAndLinebodys(req , res , next){
    //console.log("---req.body.startTime--->"+JSON.stringify(req.body.startTime));
    //console.log("---req.body.endTime--->"+JSON.stringify(req.body.endTime));
    //console.log("---req.body.linebodyIds--->"+JSON.stringify(req.body.linebodyIds));
    if (req.body.startTime == undefined || req.body.startTime == ''|| req.body.startTime == null
    	||req.body.endTime == undefined || req.body.endTime == ''|| req.body.endTime == null
    	||req.body.linebodyIds == undefined || req.body.linebodyIds == ''|| req.body.linebodyIds == null) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    const Ids = req.body.linebodyIds.split(',');
   // console.log("---Ids.length--->"+JSON.stringify(Ids.length));
    if (Ids == undefined || Ids == null || Ids == '' || Ids.length == 0) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    //console.log("---req.body.startTime--->"+JSON.stringify(req.body.startTime));
    const data = await this.selectBarchartByTimesAndLinebodys(req.body.startTime , req.body.endTime , Ids);
    res.end(JSON.stringify(data));

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
    	//const linebodyKpitwo = await linebody.getLinebodyKpitwolev({where:{kpitwolevKpitwoid:2}});
        const linebodyKpitwo = await linebody.getLinebodyKpitwolev();
    	//console.log(Ids[i]+"----falg-->"+JSON.stringify(linebodyKpitwo , null , 4));
    	if (linebody == null || linebody == ''|| linebody == undefined
    		||linebodyKpitwo == null || linebodyKpitwo == '' || linebodyKpitwo == undefined) {
    		continue;
    	}
    	for (var h = linebodyKpitwo.length - 1; h >= 0; h--) {
    	 	const flag = await this.computeByTimes(startTime , endTime , linebodyKpitwo[h]);//判断在不在所选时间区间里
	     	//console.log("----falg-->"+JSON.stringify(falg , null , 4));
	     	if (flag) {
	     		await allData.push(linebodyKpitwo[h]);
	     	}
    	}
    }

    const endTime_num = new Date(endTime).getTime();
    //console.log("---endTime_num--->"+JSON.stringify(moment(endTime)));
    
    let sTime_num = new Date(startTime).getTime();
    console.log("---sTime_num--->"+JSON.stringify(sTime_num));
    let eTime_num = Number(sTime_num) + 86400000;
    console.log("---eTime_num--->"+JSON.stringify(eTime_num));
    let returnData = new Array();
    while(eTime_num <= endTime_num){
        //console.log("---sTime--1->"+JSON.stringify(sTime));
        //console.log("---eTime--1->"+JSON.stringify(eTime));
        const value =  await this.computeTodayByTimes(sTime_num , eTime_num , allData , Ids , 'OEE');
        
        if (value === undefined || value === null || value === '') {
            console.log("---yuzhizhe0--->");
        }else{
            await returnData.push(value);
        }
        //console.log("---eTime--->"+JSON.stringify(eTime));
        sTime_num = Number(sTime_num) + 86400000;
        eTime_num = Number(eTime_num) + 86400000;
    }

    return returnData;
}
exports.selectBarchartByTimesAndLinebodys = selectBarchartByTimesAndLinebodys;

/*
    根据times和allData每天计算OEE中柱状图数据
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeTodayByTimes(startTime , endTime ,allData ,  Ids , type){
	if (startTime == undefined || startTime == ''|| startTime == null
    	||endTime == undefined || endTime == ''|| endTime == null
        ||Ids == undefined || Ids == ''|| Ids == null
        ||type == undefined || type == ''|| type == null) {
        console.log("---yuzhizhe1--->");
        return;
    }
    //console.log("---startTime--2->"+JSON.stringify(startTime));
    //console.log("---endTime--2->"+JSON.stringify(endTime));
    const Target = await this.computeTodayTargetByTimes(startTime , endTime , Ids);
    const Vision = await this.computeTodayVisionByTimes(startTime , endTime , Ids);
    const Ideal = await this.computeTodayIdealByTimes(startTime , endTime , Ids);
    
    const sTime = new Date(startTime);
    let sTime_num = startTime;
    //console.log("---sTime--->"+JSON.stringify(sTime));
    const returnTime = sTime.getFullYear() + '/' + Number(sTime.getMonth()+1) + '/' + sTime.getDate();
    //console.log("---eTime--->"+JSON.stringify(eTime));
    let eTime_num = Number(sTime_num) + 900000;
    
    let returnData = new Array();
    //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
    //console.log("---endTime_num--->"+JSON.stringify(endTime_num));
    while(eTime_num <= endTime){
        //console.log("---sTime_num--->"+JSON.stringify(sTime_num));
        //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
        const value =  await this.computeQuarterByTimes(sTime_num , eTime_num , allData  ,  Ids , type);
        
        if (value === undefined || value === null || value === '' || value === -1) {
            //console.log("---yuzhizhe0--->");
        }else{
            console.log("---value--->"+JSON.stringify(value));
            await returnData.push(value);
        }
        sTime_num = Number(sTime_num) + 900000;
        eTime_num = Number(eTime_num) + 900000;
        //console.log("---eTime--->"+JSON.stringify(eTime));
    }
    let sum = 0;
    let average = 0;
    console.log("---returnData--->"+JSON.stringify(returnData));
    if (returnData.length !=0) {
        sum = await returnData.map(a => a).reduce ((pre, cur) => pre + cur);
        average = sum / returnData.length;
    }
    //const returnTime = sTime.date();
    console.log("---returnData.length--->"+JSON.stringify(returnData.length));
    let data = new Array();
    await data.push(returnTime);
    const returnValue = Number(1 - average) * 100;
    await data.push(returnValue.toFixed(2));
    await data.push(await (Number(Target) * 100).toFixed(2));
    await data.push(await (Number(Vision) * 100).toFixed(2));
    await data.push(await (Number(Ideal) * 100).toFixed(2));
    console.log('\n\n')
    return data;
}
exports.computeTodayByTimes = computeTodayByTimes;

/*
    根据times和allData每15分钟计算OEE中柱状图数据
    startTime:15分钟开始时间
    endTime:15分钟结束时间
    */
async function computeQuarterByTimes(startTime , endTime ,allData , Ids , type){
    if (startTime == undefined || startTime == ''|| startTime == null
        ||endTime == undefined || endTime == ''|| endTime == null
        ||allData == undefined || allData == ''|| allData == null
        ||Ids == undefined || Ids == ''|| Ids == null
        ||type == undefined || type == ''|| type == null) {
        //console.log("---yuzhizhe1--->");
        return 0;
    }
    const sTime_num = startTime;
    const eTime_num = endTime;
    let returnData = new Array();

    let valueSum = 0;
    let weightSum = 0;
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        console.log("---sTime_num--->"+JSON.stringify(new Date(sTime_num)));
        console.log("---eTime_num--->"+JSON.stringify(new Date(eTime_num)));
        const classflag = await linebody_extend_service.getClassflag(new Date(sTime_num) , new Date(eTime_num) , Ids[i]);
        weightSum += Number(linebody.weight) * Number(classflag);
    }
    if (weightSum === 0) {
        return -1;
    }
    for (var i = allData.length - 1; i >= 0; i--) {
        const kpitwo = await Kpitwolev.findById(allData[i].kpitwolevKpitwoid);
        if (kpitwo == undefined || kpitwo == ''|| kpitwo == null) {
            //console.log('yuzhizhe02');
            continue;
        }else{
            if (kpitwo.name == type) {
                const csTime = new Date(allData[i].starttime).getTime();
                const ceTime = new Date(allData[i].endtime).getTime();
                //console.log('----sTime_num-->'+JSON.stringify(sTime , null , 4));
                if (csTime == undefined || csTime == ''|| csTime == null
                    ||ceTime == undefined || ceTime == ''|| ceTime == null) {
                    //console.log('yuzhizhe03');
                    continue;
                }
                if (csTime >= sTime_num && ceTime <= eTime_num) {
                    const linebody = await Linebody.findById(allData[i].linebodyLinebodyid,{'attributes': ['weight']});
                    console.log('----linebody.weight-->'+JSON.stringify(linebody.weight , null , 4));
                    const classflag = await linebody_extend_service.getClassflag(new Date(sTime_num) , new Date(eTime_num) , allData[i].linebodyLinebodyid);
                    //weight_sum += linebody.weight;
                    valueSum += Number(allData[i].value) * Number(linebody.weight) * Number(classflag);
                }else{
                    console.log('yuzhizhe04');
                    continue;
                }
            }
        }
    }
    const average = valueSum/weightSum;
    console.log("---valueSum--->"+JSON.stringify(valueSum));
    console.log("---weightSum--->"+JSON.stringify(weightSum));
    return average;
}
exports.computeQuarterByTimes = computeQuarterByTimes;

/*
    根据times和linebodyKpitwo过滤Overview中柱状图数据的linebodyKpitwo是否在时间段内
*/
async function computeByTimes(startTime , endTime ,linebodyKpitwo){
	if (startTime == undefined || startTime == ''|| startTime == null
    	||endTime == undefined || endTime == ''|| endTime == null
    	||linebodyKpitwo == undefined || linebodyKpitwo == ''|| linebodyKpitwo == null) {
        return false;
    }
    const sTime = new Date(startTime).getTime();
    const eTime = new Date(endTime).getTime();

   	const csTime = new Date(linebodyKpitwo.starttime).getTime();
    const ceTime = new Date(linebodyKpitwo.endtime).getTime();
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

/*
    根据times和allData每天计算OEE中柱状图Target数据
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeTodayTargetByTimes(startTime , endTime ,Ids){
    if (startTime == undefined || startTime == ''|| startTime == null
        ||endTime == undefined || endTime == ''|| endTime == null
        ||Ids == undefined || Ids == ''|| Ids == null) {
        console.log("---参数错误--->");
        return 0;
    }
    
    let sTime_num = startTime;
    //console.log("---sTime--->"+JSON.stringify(sTime));
    let eTime_num = endTime;

    let valueSum = 0;
    let weightSum = 0;
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        const csTime_num = new Date(linebody.targetstrattime).getTime();
        const ceTime_num = new Date(linebody.targetendtime).getTime();
        if (sTime_num >= csTime_num && eTime_num < ceTime_num) {
            valueSum += Number(linebody.targetvalue) * Number(linebody.weight);
        }else{
            valueSum += 0;
        }
        weightSum += Number(linebody.weight);
    }
    const average = valueSum / weightSum;
    return average;
}
exports.computeTodayTargetByTimes = computeTodayTargetByTimes;

/*
    根据times和allData每天计算OEE中柱状图vision数据
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeTodayVisionByTimes(startTime , endTime ,Ids){
    if (startTime == undefined || startTime == ''|| startTime == null
        ||endTime == undefined || endTime == ''|| endTime == null
        ||Ids == undefined || Ids == ''|| Ids == null) {
        console.log("---参数错误--->");
        return 0;
    }
    
    let sTime_num = startTime;
    //console.log("---sTime--->"+JSON.stringify(sTime));
    let eTime_num = endTime;

    let valueSum = 0;
    let weightSum = 0;
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        const csTime_num = new Date(linebody.visionstrattime).getTime();
        const ceTime_num = new Date(linebody.visionendtime).getTime();
        if (sTime_num >= csTime_num && eTime_num < ceTime_num) {
            valueSum += Number(linebody.visionvalue) * Number(linebody.weight);
        }else{
            valueSum += 0;
        }
        weightSum += Number(linebody.weight);
    }
    const average = valueSum / weightSum;
    return average;
}
exports.computeTodayVisionByTimes = computeTodayVisionByTimes;

/*
    根据times和allData每天计算OEE中柱状图ideal数据
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeTodayIdealByTimes(startTime , endTime ,Ids){
    if (startTime == undefined || startTime == ''|| startTime == null
        ||endTime == undefined || endTime == ''|| endTime == null
        ||Ids == undefined || Ids == ''|| Ids == null) {
        console.log("---参数错误--->");
        return 0;
    }
    
    let sTime_num = startTime;
    //console.log("---sTime--->"+JSON.stringify(sTime));
    let eTime_num = endTime;

    let valueSum = 0;
    let weightSum = 0;
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        const csTime_num = new Date(linebody.idealstrattime).getTime();
        const ceTime_num = new Date(linebody.idealendtime).getTime();
        if (sTime_num >= csTime_num && eTime_num < ceTime_num) {
            valueSum += Number(linebody.idealvalue) * Number(linebody.weight);
        }else{
            valueSum += 0;
        }
        weightSum += Number(linebody.weight);
    }
    const average = valueSum / weightSum;
    return average;
}
exports.computeTodayIdealByTimes = computeTodayIdealByTimes;
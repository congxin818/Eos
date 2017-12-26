


var service = require('../services/user_service');
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
    if (req.body.startTime == undefined || req.body.startTime == ''|| req.body.startTime == null
    	||req.body.endTime == undefined || req.body.endTime == ''|| req.body.endTime == null
    	||req.body.linebodIds == undefined || req.body.linebodIds == ''|| req.body.linebodIds == null) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    const Ids = req.body.linebodIds.split(',');
    if (Ids == undefined || Ids == null || Ids == '' || Ids.length == 0) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    console.log("---req.body.startTime--->"+JSON.stringify(req.body.startTime));
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
    	 	const falg = await this.computeByTimes(startTime , endTime , linebodyKpitwo[h]);//判断在不在所选时间区间里
	     	//console.log("----falg-->"+JSON.stringify(falg , null , 4));
	     	if (falg) {
	     		await allData.push(linebodyKpitwo[h]);
	     	}
    	}
    }

    const endTime_num = moment(endTime);
    //console.log("---endTime_num--->"+JSON.stringify(endTime_num));
    let sTime = moment(startTime);
    console.log("---sTime12--->"+JSON.stringify(sTime));
    let eTime = sTime.endOf('month');
    console.log("---sTime--->"+JSON.stringify(sTime));
    let eTime_num = eTime.valueOf();

    let returnData = new Array();
    while(eTime_num <= endTime_num.valueOf()){

        const value =  await this.computeOEETodayByTimes(sTime , eTime , allData);
        
        if (value === undefined || value === null || value === '') {
            continue;
        }else{
            await returnData.push(value);
        }
        sTime = sTime.add(1 , 'days');
        eTime = sTime.endOf('day');
        //console.log("---eTime--->"+JSON.stringify(eTime));
        eTime_num = eTime.valueOf();
    }
    //const data = await this.computeTodayByTimes(startTime , endTime , allData);
    return allData;
    //console.log("------>"+JSON.stringify(allData , null , 4));
}
exports.selectBarchartByTimesAndLinebodys = selectBarchartByTimesAndLinebodys;

/*
    根据times和allData过滤Overview中柱状图数据的linebodyKpitwo是否在当天时间段内
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeOEETodayByTimes(startTime , endTime ,allData){
	if (startTime == undefined || startTime == ''|| startTime == null
    	||endTime == undefined || endTime == ''|| endTime == null
    	||allData == undefined || allData == ''|| allData == null) {
        return;
    }
    const sTime = moment(startTime);
    //console.log('----sTime-->'+JSON.stringify(sTime , null , 4));
    const sTime_num = sTime.valueOf();
    const eTime = moment(endTime);
    const eTime_num = eTime.valueOf();
    if (sTime == undefined || sTime == ''|| sTime == null
    	||eTime == undefined || eTime == ''|| eTime == null
        ||sTime_num == undefined || sTime_num == ''|| sTime_num == null
        ||eTime_num == undefined || eTime_num == ''|| eTime_num == null) {
    	return;
    }

    const returnTime = sTime.year() + '/' + Number(sTime.month()+1) + '/' + sTime.date();
    //const returnTime = sTime.date();
    //console.log("---returnTime--->"+JSON.stringify(returnTime));
    let data = new Array();
    await data.push(returnTime);

    let valueSum = 0;
    let weightSum = 0;
    let weightMap = new Map();
    for (var i = allData.length - 1; i >= 0; i--) {
        const kpitwo = await Kpitwolev.findById(allData[i].kpitwolevKpitwoid);
        if (kpitwo == undefined || kpitwo == ''|| kpitwo == null) {
            //console.log('yuzhizhe02');
            continue;
        }else{
            if (kpitwo.name == 'OEE') {
                const csTime = new Date(allData[i].starttime).getTime();
                const ceTime = new Date(allData[i].endtime).getTime();
                //console.log('----sTime_num-->'+JSON.stringify(sTime , null , 4));
                console.log('----csTime-->'+JSON.stringify(new Date(allData[i].starttime) , null , 4));
                if (csTime == undefined || csTime == ''|| csTime == null
                    ||ceTime == undefined || ceTime == ''|| ceTime == null) {
                    //console.log('yuzhizhe03');
                    continue;
                }
                if (csTime > eTime_num || ceTime < sTime_num) {
                    //console.log('yuzhizhe04');
                    continue;
                }else{
                    const linebody = await Linebody.findById(allData[i].linebodyLinebodyid,{'attributes': ['weight']});
                    console.log('----linebody.weight-->'+JSON.stringify(linebody.weight , null , 4));
                    //weight_sum += linebody.weight;
                    valueSum += Number(allData[i].value) * Number(linebody.weight) * Number(allData[i].classflag);
                    let mapWeightEle = weightMap.get(allData[i].linebodyLinebodyid);
                    if (!mapWeightEle)
                    {
                        mapWeightEle = new Array ();
                    }
                    mapWeightEle.push (linebody.weight);
                    weightMap.set(allData[i].linebodyLinebodyid , mapWeightEle);
                }
            }
        }
    	
    }
    console.log('yuzhizhe01');
    console.log(data);
    console.log('\n');
    return valueSum;
}
exports.computeOEETodayByTimes = computeOEETodayByTimes;

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
/*
 	auther:Android,
 	NOTE:savingbook表的controller层,
 	time:20171219
 */


var Lossstatus = require('../models').Lossstatus;//引入数据库Lossstatus模块
var Linebody = require('../models').Linebody;//引入数据库Linebody模块
var errorUtil = require('../utils/errorUtil');
var moment = require('moment');
var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

/*
    用户登录接口
    */
async function selectSavingBookByTimesAndLinebodys(req , res , next){
    if (req.body.startTime == undefined ||req.body.startTime == ''||req.body.startTime == null
    	||req.body.endTime == undefined ||req.body.endTime == ''||req.body.endTime == null
    	||req.body.linebodyIds == undefined ||req.body.linebodyIds == ''||req.body.linebodyIds == null) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    const Ids = req.body.linebodyIds.split(',');
    if (Ids == undefined || Ids == null || Ids == '' || Ids.length == 0) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    let allData = new Array();
    for (var i = Ids.length - 1; i >= 0; i--) {
    	const linebody = await Linebody.findById(Ids[i]);
    	if (linebody == undefined || linebody == '' || linebody == null) {
    		continue;
    	}
    	const lossstatus = await linebody.getLinebodyLossstatus({where:{status:3}});
    	//console.log("------>"+JSON.stringify(lossstatus));
    	for (var k = lossstatus.length - 1; k >= 0; k--) {
    		if (lossstatus[k] == undefined || lossstatus[k] == null || lossstatus[k] == '') {
	    		continue;
	    	}else{
	    		await allData.push(lossstatus[k]);
	    	}
    	}
    }
    const endTime_num = moment(req.body.endTime);
    console.log("---endTime_num--->"+JSON.stringify(endTime_num));
    let sTime = moment(req.body.startTime);
    let eTime = sTime.endOf('month');
    let eTime_num = eTime.valueOf();

    let returnData = new Array();
    while(eTime_num <= endTime_num.valueOf()){
    	const value =  await this.computeByTimes(sTime , eTime , allData);
    	console.log("---value--->"+JSON.stringify(value));
    	if (value == undefined || value == null || value == '') {
    		continue;
    	}else{
    		await returnData.push(value);
    	}

    	sTime = sTime.add(1 , 'months');
    	eTime = sTime.endOf('month');
		console.log("---eTime--->"+JSON.stringify(eTime));
    	eTime_num = eTime.valueOf();
    }
    dataSuccess.data = returnData;
    res.end(JSON.stringify(dataSuccess));
}
exports.selectSavingBookByTimesAndLinebodys = selectSavingBookByTimesAndLinebodys;


async function computeByTimes(startTime , endTime , allData){
	if (startTime == undefined ||startTime == ''||startTime == null
    	||endTime == undefined ||endTime == ''||endTime == null
    	||allData == undefined ||allData == ''||allData == null) {
        return ;
    }

    const sTime = moment(startTime);
    const eTime = moment(endTime);
    //console.log("---sTime--->"+JSON.stringify(sTime));
    const sTime_num = sTime.valueOf();
    const eTime_num = eTime.valueOf();

    const returnTime = sTime.year() + '/' + Number(sTime.month()+1);
    //console.log("---returnTime--->"+JSON.stringify(returnTime));
 	let data = new Array();
 	await data.push(returnTime);
 	let expectSum = 0;
 	let actualSum = 0;
    for (var i = allData.length - 1; i >= 0; i--) {
    	//console.log("---sTime--->"+JSON.stringify(moment(allData[i].updatedAt)));
    	const csTime = moment(allData[i].updatedAt).add(1, 'months').startOf('month');
    	const csTime_num = csTime.valueOf();

    	//console.log("---csTime--->"+JSON.stringify(csTime.valueOf()));

    	const ceTime = csTime.add(12, 'months');
    	const ceTime_num = ceTime.valueOf();

    	if (sTime_num > ceTime_num || eTime_num < csTime_num) {
    		//console.log("---yuzhizhe--->");
    		continue;
    	}else{
    		expectSum += Number(allData[i].startperformance - allData[i].target) * 168000;
    		actualSum += Number(allData[i].startperformance - allData[i].performance) * 168000;
    	}

    	//console.log("---ceTime--->"+JSON.stringify(ceTime));
    }
    await data.push(Number(actualSum).toFixed(2));
    await data.push(Number(expectSum).toFixed(2));
    return data;
}
exports.computeByTimes = computeByTimes;
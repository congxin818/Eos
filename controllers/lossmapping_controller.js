/*
 	auther:Android,
 	NOTE:lossmapping表的controller层,
 	time:20171108
 */

var service = require('../services/user_service');
var User = require('../models').User;//引入数据库User模块
var Linebody = require('../models').Linebody;
var Workshop = require('../models').Workshop;
var Kpitwolev = require('../models').Kpitwolev;
var Losstier3 = require('../models').Losstier3;
var Losstier4 = require('../models').Losstier4;
var LinebodyKpitwolev = require('../models').LinebodyKpitwolev;
var LinebodyLosstier3 = require('../models').LinebodyLosstier3;
var LinebodyLosstier4 = require('../models').LinebodyLosstier4;
var Classinformation = require('../models').Classinformation;
var errorUtil = require('../utils/errorUtil');
var moment = require('moment');
var linebody_extend_service = require('../services/linebody_extend_service');

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

/*
    根据times和linebodys查询Lossmapping数据
    */
async function selectLossmappingByTimesAndLinebodys(req , res , next){
    //console.log("---req.body.startTime--->"+JSON.stringify(req.body.startTime));
    //console.log("---req.body.endTime--->"+JSON.stringify(req.body.endTime));
    //console.log("---req.body.linebodyIds--->"+JSON.stringify(req.body.linebodyIds));
    if (req.body.startTime == undefined || req.body.startTime == ''|| req.body.startTime == null
    	||req.body.endTime == undefined || req.body.endTime == ''|| req.body.endTime == null
    	||req.body.linebodyIds == undefined || req.body.linebodyIds == ''|| req.body.linebodyIds == null
    	||req.body.userId == undefined || req.body.userId == ''|| req.body.userId == null) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    const user = await User.findById(req.body.userId);
    if (user == undefined || user == ''|| user == null) {
    	res.end(JSON.stringify(errorUtil.noExistError));
    	return;
    }
    const userKpitwo = await user.getUserKpitwolevs();

    const Ids = req.body.linebodyIds.split(',');
    console.log("---Ids.length--->"+JSON.stringify(userKpitwo));
    if (Ids == undefined || Ids == null || Ids == '' || Ids.length == 0) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    //await userKpitwo.sort((n, m) => n.userKpitwolev.sequence - m.userKpitwolev.sequence);
    let returnData = new Array();
    for (var i = userKpitwo.length - 1; i >= 0; i--) {
    	if (userKpitwo[i] == undefined || userKpitwo[i] == null || userKpitwo[i] == '') {
    		continue;
    	}
    	const kpitwo = await Kpitwolev.findById(userKpitwo[i].kpitwoid);
    	if (kpitwo == undefined || kpitwo == null || kpitwo == '') {
    		continue;
    	}
    	const tier2Value = await this.computeAll2ByTimes(req.body.startTime , req.body.endTime , Ids , userKpitwo[i].kpitwoid);

        console.log("---tier2Value--->"+JSON.stringify(tier2Value , null , 4));
        console.log('\n');
    	if (tier2Value == undefined || tier2Value == null || tier2Value == '' || tier2Value == 0) {

    		continue;
    	}
    	let tier2 = {
    		title:userKpitwo[i].name,
    		order:userKpitwo[i].userKpitwolev.sequence,
    		data:new Array(),
    		link:new Array()
    	};
    	const tier2Data = {
    		name:userKpitwo[i].name,
    		value:tier2Value
    	};
    	await tier2.data.push(tier2Data);

    	const losstier3All = await kpitwo.getKpitwolevLosscategory();
    	for (var j = losstier3All.length - 1; j >= 0; j--) {
    		if (losstier3All[j] == undefined || losstier3All[j] == null || losstier3All[j] == '') {
    			continue;
    		}
    		const losstier3 = await Losstier3.findById(losstier3All[j].lossid);
    		if (losstier3 == undefined || losstier3 == null || losstier3 == '') {
	    		continue;
	    	}
	    	const tier3Value = await this.computeAll3ByTimes(req.body.startTime , req.body.endTime , Ids , losstier3All[j].lossid);

            console.log("---tier3Value--->"+JSON.stringify(tier3Value , null , 4));
            console.log('\n');
	    	if (tier3Value == undefined || tier3Value == null || tier3Value == '' || tier3Value == 0) {

	    		continue;
	    	}
	    	const tier3Data = {
	    		name:losstier3All[j].name,
	    		value:tier3Value
	    	};
	    	const tier3Link = {
	    		source:userKpitwo[i].name,
	    		target:losstier3All[j].name,
	    		value:tier3Value
	    	};
	    	await tier2.data.push(tier3Data);
	    	await tier2.link.push(tier3Link);

	    	const losstier4All = await losstier3.getLosscategoryLosstier4();
            //console.log("---yuzhizhe1111-----" + JSON.stringify(losstier4All , null , 4));
	    	for (var k = losstier4All.length - 1; k >= 0; k--) {
                //console.log("---yuzhizhe1-----");
	    		if (losstier4All[k] == undefined || losstier4All[k] == null || losstier4All[k] == '') {
	    			continue;
	    		}
	    		const losstier4 = await Losstier4.findById(losstier4All[k].tier4id);
	    		if (losstier4 == undefined || losstier4 == null || losstier4 == '') {
		    		continue;
		    	}
		    	const tier4Value = await this.computeAll4ByTimes(req.body.startTime , req.body.endTime , Ids , losstier4All[k].tier4id);

                console.log("---tier4Value--->"+JSON.stringify(tier4Value , null , 4));
                console.log('\n');
		    	if (tier4Value == undefined || tier4Value == null || tier4Value == '' || tier4Value == 0) {

		    		continue;
		    	}
		    	const tier4Data = {
		    		name:losstier4All[k].name,
		    		value:tier4Value
		    	};
		    	const tier4Link = {
		    		source:losstier3All[j].name,
		    		target:losstier4All[k].name,
		    		value:tier4Value
		    	};
		    	await tier2.data.push(tier4Data);
		    	await tier2.link.push(tier4Link);
                //console.log("---yuzhizhe22-----");
	    	}
    	}
    	await returnData.push(tier2);
    }

    //console.log("---req.body.startTime--->"+JSON.stringify(req.body.startTime));
    //const data = await this.computeAll2ByTimes(req.body.startTime , req.body.endTime , Ids , '2');
    dataSuccess.data = returnData;
    res.end(JSON.stringify(dataSuccess));

}
exports.selectLossmappingByTimesAndLinebodys = selectLossmappingByTimesAndLinebodys;

/*
    根据times和allData时间区域内计算tire4级
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeAll4ByTimes(startTime , endTime ,Ids , typeId){
	if (startTime == undefined || startTime == ''|| startTime == null
    	||endTime == undefined || endTime == ''|| endTime == null
        ||Ids == undefined || Ids == ''|| Ids == null
        ||typeId == undefined || typeId == ''|| typeId == null) {
        console.log("---yuzhizhe1--->");
        return;
    }
    //console.log("---startTime--2->"+JSON.stringify(startTime));
    //console.log("---endTime--2->"+JSON.stringify(endTime));
    const sTime = new Date(startTime);
    let sTime_num = sTime.getTime();
    //console.log("---sTime--->"+JSON.stringify(sTime));
    //console.log("---eTime--->"+JSON.stringify(eTime));
    let eTime_num = Number(sTime_num) + 900000;

    const endTime_num = new Date(endTime).getTime()
    
    let returnData = new Array();
    //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
    //console.log("---endTime_num--->"+JSON.stringify(endTime_num));
    while(eTime_num <= endTime_num){
        //console.log("---sTime_num--->"+JSON.stringify(sTime_num));
        //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
        const value = await this.computeQuarter4ByTimes(sTime_num , eTime_num , Ids , typeId);
        
        if (value === undefined || value === null || value === '' || value === -1) {
            console.log("---yuzhizhe0--->");
        }else{
            console.log("---value--->"+JSON.stringify(value));
            await returnData.push(value);
        }
        sTime_num = Number(sTime_num) + 900000;
        eTime_num = Number(eTime_num) + 900000;
        //console.log("---eTime--->"+JSON.stringify(eTime));
    }
    //console.log("---returnData--->"+JSON.stringify(returnData));
    let sum = 0;
    let weight = 0;
    if (returnData.length !=0) {
        sum = await returnData.map(a => a.value).reduce ((pre, cur) => pre + cur);
        weight = await returnData.map(a => a.weight).reduce ((pre, cur) => pre + cur);
        //average = sum / returnData.length;
    }
    //const returnTime = sTime.date();
    console.log("---sum--->"+JSON.stringify(sum));
    console.log("---weight--->"+JSON.stringify(weight));
    //console.log('\n\n')
    const average = Number(sum) / Number(weight);
    return average.toFixed(4);
}
exports.computeAll4ByTimes = computeAll4ByTimes;

/*
    根据times和allData每15分钟计算tire4级
    startTime:15分钟开始时间
    endTime:15分钟结束时间
*/
async function computeQuarter4ByTimes(startTime , endTime , Ids , typeId){
    if (startTime == undefined || startTime == ''|| startTime == null
        ||endTime == undefined || endTime == ''|| endTime == null
        ||Ids == undefined || Ids == ''|| Ids == null
        ||typeId == undefined || typeId == ''|| typeId == null) {
        //console.log("---yuzhizhe1--->");
        return 0;
    }
    const sTime_num = startTime;
    const eTime_num = endTime;
    let returnData = new Array();
	//console.log("---sTime_num--->"+JSON.stringify(sTime_num));
    //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
    let valueSum = 0;
    let weightSum = 0;
    //const losstier4 = await Losstier4.findOne({where:{name:type}});
	//console.log("---losstier4--->"+JSON.stringify(losstier4 , null , 4));
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        // console.log("---sTime_num--->"+JSON.stringify(new Date(sTime_num)));
        //console.log("---losstier4.tier4id--->"+JSON.stringify(losstier4.tier4id));
        const classflag = await linebody_extend_service.getClassflag(new Date(sTime_num) , new Date(eTime_num) , Ids[i]);
        const linebodyLosstier4 = await linebody.getLinebodyLosstier4({where:{losstier4Tier4id:typeId}});
        //console.log("---linebodyLosstier4--->"+JSON.stringify(linebodyLosstier4 , null , 4));
        const value = await this.computeQuarterValueByTimes(sTime_num , eTime_num , linebodyLosstier4);

        const weight = linebody.weight;
        console.log("---classflag--->"+JSON.stringify(classflag));
        console.log("---weight--->"+JSON.stringify(weight));
        console.log("---valuedfsd--->"+JSON.stringify(value));
        valueSum += Number(classflag) * Number(value) * Number(weight);
        weightSum += Number(classflag) * Number(weight);
    }
    const data = {
    	value:valueSum,
    	weight:weightSum
    }
    return data;
}
exports.computeQuarter4ByTimes = computeQuarter4ByTimes;
 

/*
    根据times和allData时间区域内计算tire3级
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeAll3ByTimes(startTime , endTime ,Ids , typeId){
	if (startTime == undefined || startTime == ''|| startTime == null
    	||endTime == undefined || endTime == ''|| endTime == null
        ||Ids == undefined || Ids == ''|| Ids == null
        ||typeId == undefined || typeId == ''|| typeId == null) {
        console.log("---yuzhizhe1--->");
        return;
    }
    //console.log("---startTime--2->"+JSON.stringify(startTime));
    //console.log("---endTime--2->"+JSON.stringify(endTime));
    const sTime = new Date(startTime);
    let sTime_num = sTime.getTime();
    //console.log("---sTime--->"+JSON.stringify(sTime));
    //console.log("---eTime--->"+JSON.stringify(eTime));
    let eTime_num = Number(sTime_num) + 900000;

    const endTime_num = new Date(endTime).getTime()
    
    let returnData = new Array();
    //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
    //console.log("---endTime_num--->"+JSON.stringify(endTime_num));
    while(eTime_num <= endTime_num){
        //console.log("---sTime_num--->"+JSON.stringify(sTime_num));
        //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
        const value = await this.computeQuarter3ByTimes(sTime_num , eTime_num , Ids , typeId);
        
        if (value === undefined || value === null || value === '' || value === -1) {
            //console.log("---yuzhizhe0--->");
        }else{
            //console.log("---value--->"+JSON.stringify(value));
            await returnData.push(value);
        }
        sTime_num = Number(sTime_num) + 900000;
        eTime_num = Number(eTime_num) + 900000;
        //console.log("---eTime--->"+JSON.stringify(eTime));
    }
    //console.log("---returnData.length--->"+JSON.stringify(returnData.length));
    let sum = 0;
    let weight = 0;
    //let classflag = 0;
    if (returnData.length !=0) {
        sum = await returnData.map(a => a.value).reduce ((pre, cur) => pre + cur);
        weight = await returnData.map(a => a.weight).reduce ((pre, cur) => pre + cur);
        //classflag = await returnData.map(a => a.classflag).reduce ((pre, cur) => pre + cur);
        //average = sum / returnData.length;
    }
    //const returnTime = sTime.date();
    // console.log("---sum--->"+JSON.stringify(sum));
    // console.log("---weight--->"+JSON.stringify(weight));
    // console.log("---classflag--->"+JSON.stringify(classflag));
    //console.log('\n\n')
    const average = Number(sum) / Number(weight);
    return average.toFixed(4);
}
exports.computeAll3ByTimes = computeAll3ByTimes;

/*
    根据times和allData每15分钟计算tire3级
    startTime:15分钟开始时间
    endTime:15分钟结束时间
*/
async function computeQuarter3ByTimes(startTime , endTime , Ids , typeId){
    if (startTime == undefined || startTime == ''|| startTime == null
        ||endTime == undefined || endTime == ''|| endTime == null
        ||Ids == undefined || Ids == ''|| Ids == null
        ||typeId == undefined || typeId == ''|| typeId == null) {
        //console.log("---yuzhizhe1--->");
        return 0;
    }
    const sTime_num = startTime;
    const eTime_num = endTime;
    let returnData = new Array();
	//console.log("---sTime_num--->"+JSON.stringify(sTime_num));
    //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
    let valueSum = 0;
    let weightSum = 0;
    //const losstier3 = await Losstier3.findOne({where:{name:type}});
	//console.log("---losstier4--->"+JSON.stringify(losstier4 , null , 4));
	// let value = 0;
 //    let weight = 0;
 //    let classflag = 0;
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        // console.log("---sTime_num--->"+JSON.stringify(new Date(sTime_num)));
        //console.log("---losstier4.tier4id--->"+JSON.stringify(losstier4.tier4id));
        const classflag = await linebody_extend_service.getClassflag(new Date(sTime_num) , new Date(eTime_num) , Ids[i]);
        const linebodyLosstier3 = await linebody.getLinebodyLosstier3({where:{losstier3Lossid:typeId}});
        //console.log("---linebodyLosstier3--->"+JSON.stringify(linebodyLosstier3 , null , 4));
        const value = await this.computeQuarterValueByTimes(sTime_num , eTime_num , linebodyLosstier3);

        const weight = linebody.weight;
        //console.log("---classflag--->"+JSON.stringify(classflag));
        //console.log("---weight--->"+JSON.stringify(weight));
        //console.log("---valuedfsd--->"+JSON.stringify(value));
        valueSum += Number(classflag) * Number(value) * Number(weight);
        weightSum += Number(classflag) * Number(weight);
  //       const data = {
		//     value:value,
		//     weight:weight,
		//     classflag:classflag
		// }
		// returnData.push(data);
    }
    const data = {
    	value:valueSum,
    	weight:weightSum
    }

    // const data = {
    // 	value:value,
    // 	weight:weight,
    // 	classflag:classflag
    // }
    return data;
}
exports.computeQuarter3ByTimes = computeQuarter3ByTimes;


/*
    根据times和allData时间区域内计算tire2级
    startTime:当天开始时间
    endTime:当天结束时间
    */
async function computeAll2ByTimes(startTime , endTime ,Ids , typeId){
	if (startTime == undefined || startTime == ''|| startTime == null
    	||endTime == undefined || endTime == ''|| endTime == null
        ||Ids == undefined || Ids == ''|| Ids == null
        ||typeId == undefined || typeId == ''|| typeId == null) {
        console.log("---yuzhizhe1--->");
        return;
    }
    //console.log("---startTime--2->"+JSON.stringify(startTime));
    //console.log("---endTime--2->"+JSON.stringify(endTime));
    const sTime = new Date(startTime);
    let sTime_num = sTime.getTime();
    //console.log("---sTime--->"+JSON.stringify(sTime));
    //console.log("---eTime--->"+JSON.stringify(eTime));
    let eTime_num = Number(sTime_num) + 900000;

    const endTime_num = new Date(endTime).getTime()
    
    let returnData = new Array();
    //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
    //console.log("---endTime_num--->"+JSON.stringify(endTime_num));
    while(eTime_num <= endTime_num){
        //console.log("---sTime_num--->"+JSON.stringify(sTime_num));
        //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
        const value = await this.computeQuarter2ByTimes(sTime_num , eTime_num , Ids , typeId);
        
        if (value === undefined || value === null || value === '' || value === -1) {
            //console.log("---yuzhizhe0--->");
        }else{
            //console.log("---value--->"+JSON.stringify(value));
            await returnData.push(value);
        }
        sTime_num = Number(sTime_num) + 900000;
        eTime_num = Number(eTime_num) + 900000;
        //console.log("---eTime--->"+JSON.stringify(eTime));
    }
    //console.log("---returnData--->"+JSON.stringify(returnData));
    let sum = 0;
    let weight = 0;
    if (returnData.length !=0) {
        sum = await returnData.map(a => a.value).reduce ((pre, cur) => pre + cur);
        weight = await returnData.map(a => a.weight).reduce ((pre, cur) => pre + cur);
        //average = sum / returnData.length;
    }
    //const returnTime = sTime.date();
    //console.log("---sum--->"+JSON.stringify(sum));
    //console.log("---weight--->"+JSON.stringify(weight));
    //console.log('\n\n')
    const average = Number(sum) / Number(weight);
    return average.toFixed(4);
}
exports.computeAll2ByTimes = computeAll2ByTimes;

/*
    根据times和allData每15分钟计算tire2级
    startTime:15分钟开始时间
    endTime:15分钟结束时间
*/
async function computeQuarter2ByTimes(startTime , endTime , Ids , typeId){
    if (startTime == undefined || startTime == ''|| startTime == null
        ||endTime == undefined || endTime == ''|| endTime == null
        ||Ids == undefined || Ids == ''|| Ids == null
        ||typeId == undefined || typeId == ''|| typeId == null) {
        //console.log("---yuzhizhe1--->");
        return 0;
    }
    const sTime_num = startTime;
    const eTime_num = endTime;
    let returnData = new Array();
	//console.log("---sTime_num--->"+JSON.stringify(sTime_num));
    //console.log("---eTime_num--->"+JSON.stringify(eTime_num));
    let valueSum = 0;
    let weightSum = 0;
    // let value = 0;
    // let weight = 0;
    // let classflag = 0;
    //const kpitwo = await Kpitwolev.findOne({where:{name:type}});
	//console.log("---losstier4--->"+JSON.stringify(losstier4 , null , 4));
    for (var i = Ids.length - 1; i >= 0; i--) {
        const linebody = await Linebody.findById(Ids[i]);
        if (linebody === undefined || linebody === null || linebody === '') {
            continue;
        }
        // console.log("---sTime_num--->"+JSON.stringify(new Date(sTime_num)));
        //console.log("---losstier4.tier4id--->"+JSON.stringify(losstier4.tier4id));
        const classflag = await linebody_extend_service.getClassflag(new Date(sTime_num) , new Date(eTime_num) , Ids[i]);
        const kinebodyKpitwolev = await linebody.getLinebodyKpitwolev({where:{kpitwolevKpitwoid:typeId}});
        //console.log("---kinebodyKpitwolev--->"+JSON.stringify(kinebodyKpitwolev , null , 4));
        const value = await this.computeQuarterValueByTimes(sTime_num , eTime_num , kinebodyKpitwolev);

        const weight = linebody.weight;
        //console.log("---classflag--->"+JSON.stringify(classflag));
        //console.log("---weight--->"+JSON.stringify(weight));
        //console.log("---valuedfsd--->"+JSON.stringify(value));
        valueSum += Number(classflag) * Number(value) * Number(weight);
        weightSum += Number(classflag) * Number(weight);
    }
    const data = {
    	value:valueSum,
    	weight:weightSum
    	// ,
    	// classflag:classflag
    }
    return data;
}
exports.computeQuarter2ByTimes = computeQuarter2ByTimes;

/*
    根据times和allData每15分钟计算tire2级值
    startTime:15分钟开始时间
    endTime:15分钟结束时间
    */
async function computeQuarterValueByTimes(startTime , endTime , allData){
	if (startTime == undefined || startTime == ''|| startTime == null
	        ||endTime == undefined || endTime == ''|| endTime == null
	        ||allData == undefined || allData == ''|| allData == null) {
	        //console.log("---allData为空--->");
	        return 0;
	}
	const sTime_num = startTime;
    const eTime_num = endTime;
	let valueSum = 0;
	for (var i = allData.length - 1; i >= 0; i--) {
		if (allData[i] === null || allData[i] === '') {
			continue;
		}
		const csTime = new Date(allData[i].starttime).getTime();
        const ceTime = new Date(allData[i].endtime).getTime();
        //console.log('----sTime_num-->'+JSON.stringify(sTime , null , 4));
        if (csTime == undefined || csTime == ''|| csTime == null
            ||ceTime == undefined || ceTime == ''|| ceTime == null) {
            //console.log('yuzhizhe03');
            continue;
        }
        if (csTime >= sTime_num && ceTime <= eTime_num) {
        	valueSum += Number(allData[i].value);
        }else{
            //console.log('yuzhizhe04');
            continue;
        }
	}
	return valueSum;
}
exports.computeQuarterValueByTimes = computeQuarterValueByTimes;
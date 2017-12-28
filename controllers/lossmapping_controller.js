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

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

/*
	根据线体ID查询Kpitwo的数据
 */
async function baseSelectKpitwoByLinebodyId(userId , linebodyId){
	if (linebodyId == undefined || linebodyId == null || linebodyId == ''
		||userId == undefined || userId == null || userId == '') {
		return ;
	}
	const user = await User.findById(userId);
	const linebody = await Linebody.findById(linebodyId);
	//console.log(JSON.stringify(linebody , null , 4));
	//console.log(JSON.stringify(user , null , 4));
	if (linebody == undefined || linebody == null || linebody == ''
		||user == undefined || user == null || user == '') {
		return ;
	}
	let  tier2 = await user.getUserKpitwolevs({'attributes': ['name', 'kpitwoid']});
	//const kpitwos = await linebody.getLinebodyKpitwolev({'attributes': ['name', 'kpitwoid' , 'id' , 'value']});
	const kpitwos = await linebody.getLinebodyKpitwolev();
	//console.log(JSON.stringify(kpitwos , null , 4));
	if (kpitwos == undefined || kpitwos == null || kpitwos == ''
		||tier2 == undefined || tier2 == null || tier2 == '') {
		return ;
	}
	// for (var i = kpitwos.length - 1; i >= 0; i--) {
	// 	const kpitwoid = kpitwos[i].kpitwoid;
	// 	for (var m = tier2.length - 1; m >= 0; m--) {
	// 		if (kpitwoid == tier2[m].kpitwoid) {
	// 			kpitwos[i]['order'] = tier2[m].userKpitwolev.sequence;
	// 		}
	// 	}
	// }

	//kpitwos.sort ((a, b) => a.order - b.order);

	// const size = kpitwos.length
	// const sum = kpitwos.map (a => a.value * a.kpitwoid).reduce ((pre, cur) => pre + cur)

	// console.log ('sum ->' + sum)
	// const weight_sum = kpitwos.map (a => a.kpitwoid).reduce ((pre, cur) => pre + cur)

	// console.log ('weight_sum -> ' + weight_sum)

	// console.log ('average -> ' + sum / weight_sum)

	//console.log(JSON.stringify(kpitwos , null , 4));
	return kpitwos;
}
exports.baseSelectKpitwoByLinebodyId = baseSelectKpitwoByLinebodyId;

/*
	根据线体ID查询losstier3的数据
 */
async function baseSelectLosstier3ByLinebodyKpitwoId(linebodyKpitwoId){
	if (linebodyKpitwoId == undefined || linebodyKpitwoId == null || linebodyKpitwoId == '') {
		return ;
	}
	//const user = await User.findById(userId);
	const linebodyKpitwolev = await LinebodyKpitwolev.findById(linebodyKpitwoId);
	if (linebodyKpitwolev == undefined || linebodyKpitwolev == null || linebodyKpitwolev == '') {
		return ;
	}
	const linebodyLosstier3s = await linebodyKpitwolev.getKpitwolevLosstier3Data();
	return linebodyLosstier3s;
}
exports.baseSelectLosstier3ByLinebodyKpitwoId = baseSelectLosstier3ByLinebodyKpitwoId;


/*
	根据线体ID查询losstier4的数据
 */
async function baseSelectLosstier4ByLinebodyLosstier3Id(linebodyLosstier3Id){
	if (linebodyLosstier3Id == undefined || linebodyLosstier3Id == null || linebodyLosstier3Id == '') {
		return ;
	}
	//const user = await User.findById(userId);
	const linebodyLosstier3 = await LinebodyLosstier3.findById(linebodyLosstier3Id);
	if (linebodyLosstier3 == undefined || linebodyLosstier3 == null || linebodyLosstier3 == '') {
		return ;
	}
	const linebodyLosstier4s = await linebodyLosstier3.getLosstier3Losstier4Data();
	return linebodyLosstier4s;
}
exports.baseSelectLosstier4ByLinebodyLosstier3Id = baseSelectLosstier4ByLinebodyLosstier3Id;

/*
	处理（根据所有的线体ID查询LossMapping的数据）的请求
 */
async function selectAllByUserIdAndLinebodyIds(req , res ,next ){
	 console.log(JSON.stringify(req.body.userId , null , 4));
	 console.log(JSON.stringify(req.body.linebodyIds , null , 4));
	if (req.body.userId == undefined || req.body.userId == null || req.body.userId == ''
		||req.body.linebodyIds == undefined || req.body.linebodyIds == null || req.body.linebodyIds == ''
		||req.body.endTime == undefined || req.body.endTime == null || req.body.endTime == ''
		||req.body.startTime == undefined || req.body.startTime == null || req.body.startTime == '') {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	const alldata = await this.selectLossMappingByLinebodyIds(req.body.userId , req.body.linebodyIds , req.body.startTime , req.body.endTime);
	res.end(JSON.stringify(alldata));
}
exports.selectAllByUserIdAndLinebodyIds = selectAllByUserIdAndLinebodyIds;
/**
 * 	根据所有的线体ID查询LossMapping的数据
 */
async function selectLossMappingByLinebodyIds(userId , linebodyIds , startTime , endTime){
	//console.log(JSON.stringify(startTime , null , 4));
	//console.log(JSON.stringify(endTime , null , 4));
	if (linebodyIds == undefined || linebodyIds == null || linebodyIds == ''
		||userId == undefined || userId == null || userId == ''
		||startTime == undefined || startTime == null || startTime == ''
		||endTime == undefined || endTime == null || endTime == '') {
		return errorUtil.parameterError;
	}
	const user = await User.findById(userId);
	//let type = 0;
	//console.log(JSON.stringify(user , null , 4));
	if (user == undefined || user == null || user == '') {
		return errorUtil.noExistError;
	}
	const Ids = await linebodyIds.split(",");
	let weight_sum = 0;
	let  tier2 = await user.getUserKpitwolevs({'attributes': ['name', 'kpitwoid']});
	//console.log(JSON.stringify(tier2 , null , 4));
	if (Ids == undefined || Ids == null || Ids == ''
		||tier2 == undefined || tier2 == null || tier2 == '') {
		return errorUtil.serviceError;
	}
	for (var i = Ids.length - 1; i >= 0; i--) {
		const linebody = await Linebody.findById(Ids[i],{'attributes': ['weight']});
		if (linebody != undefined && linebody != null && linebody != '') {
			weight_sum += linebody.weight;
		}
	}
	if (weight_sum == 0) {
		return errorUtil.serviceError;
	}
	let allKpitwo = [];
	let allLosstier3 = [];
	let allLosstier4 = [];
	for (var i = Ids.length - 1; i >= 0; i--) {
		//console.log(JSON.stringify(Ids[i]));
		const kpitwos = await this.baseSelectKpitwoByLinebodyId(userId,Ids[i]);
		if (kpitwos != undefined && kpitwos != null && kpitwos != '') {
			allKpitwo.push(kpitwos);
		}
	}
	let alldata = [];
	//console.log('-----fadsfadfad--->'+JSON.stringify(allKpitwo , null , 4));
	const kpitwoTime = await computeKpitwoBytime(allKpitwo , startTime , endTime);
	// console.log(JSON.stringify('allKpitwo.length---------->'+allKpitwo.length , null , 4));
	//console.log('-------->'+JSON.stringify(allKpitwo , null , 4));
	if (kpitwoTime == undefined || kpitwoTime == null || kpitwoTime == '') {
		return errorUtil.parameterError;
	}
	if (allKpitwo.length == 0) {
		return errorUtil.noExistError;
	}
	for (var i = allKpitwo.length - 1; i >= 0; i--) {
		for (var j = allKpitwo[i].length - 1; j >= 0; j--) {
			const losstier3s = await this.baseSelectLosstier3ByLinebodyKpitwoId(allKpitwo[i][j].id);
			if (losstier3s != undefined && losstier3s != null && losstier3s != '') {
				allLosstier3.push(losstier3s);
			}
		}
	}
	//console.log(JSON.stringify(allLosstier3 , null , 4));
	for (var i = allLosstier3.length - 1; i >= 0; i--) {
		for (var j = allLosstier3[i].length - 1; j >= 0; j--) {
			const losstier4s = await this.baseSelectLosstier4ByLinebodyLosstier3Id(allLosstier3[i][j].id);
			if (losstier4s != undefined && losstier4s != null && losstier4s != '') {
				allLosstier4.push(losstier4s);
			}
		}
	}
	
	//console.log('=============>'+JSON.stringify(allLosstier3 , null , 4));
	const kpitwoMap = await computeKpitwo(allKpitwo , weight_sum);
	
 	const lossTier3Map = await computeLosstier3(allLosstier3 ,  weight_sum);
	//console.log('-=============');
 	const lossTier4Map = await computeLosstier4(allLosstier4 , weight_sum);
 	
 	// console.log(kpitwoMap);
 	// console.log(lossTier3Map);
 	// console.log(lossTier4Map);
	for(var [key, value] of kpitwoMap) {
		const kpitwo = await Kpitwolev.findById(key);
		let pushkpitwo = {
			name:kpitwo.name,
			value:value
		};
		let orderStr;
		for (var m = tier2.length - 1; m >= 0; m--) {
			if (key == tier2[m].kpitwoid) {
				orderStr = tier2[m].userKpitwolev.sequence;
			}
		}
		let array = {
			title:kpitwo.name,
			order:orderStr,
			data: new Array (),
			link: new Array ()
		};
		let datas = new Array ();
		let links = new Array ();
		datas.push(pushkpitwo);
		for(var [key1 , value1] of lossTier3Map) {
			const losstier3 = await Losstier3.findById(key1);
			//console.log(JSON.stringify(losstier3.kpitwolevKpitwoid , null , 4));
			//console.log(JSON.stringify(key , null , 4));
			if (losstier3.kpitwolevKpitwoid == key) {
				let pushlosstier3 = {
					name:losstier3.name,
					value:value1
				};
				let link = {
					source:kpitwo.name,
					target:losstier3.name,
					value:value1
				};
				datas.push(pushlosstier3);
				links.push(link);
				for(var [key2 , value2] of lossTier4Map) {
					const losstier4 = await Losstier4.findById(key2);
					//console.log(JSON.stringify(losstier4.losstier3Lossid , null , 4));
					//console.log(JSON.stringify(key , null , 4));
					if (losstier4.losstier3Lossid == key1) {
					let pushlosstier4 = {
						name:losstier4.name,
						value:value2
					};
					let link = {
						source:losstier3.name,
						target:losstier4.name,
						value:value2
					};
					datas.push(pushlosstier4);
					links.push(link);
				
					}
				}
			}
		}
		array.data = datas;
		array.link = links;
		alldata.push(array);
		alldata.sort ((a, b) => a.order - b.order);
		//alldata.sort((a) => a.data.sort((m, n) => m.value - n.value))
		for (var i = alldata.length - 1; i >= 0; i--) {
			await alldata[i].data.sort((m, n) => n.value - m.value);
			await alldata[i].link.sort((m, n) => n.value - m.value);
		}
	}
	//console.log(lossTier4Map);
	//console.log(JSON.stringify(alldata , null , 4));
	dataSuccess.data = alldata;
	return dataSuccess;
}
exports.selectLossMappingByLinebodyIds = selectLossMappingByLinebodyIds;

/*
	计算KPItwo的每一项的平均数
 */
async function computeKpitwo(allKpitwo , weight_sum){
	//console.log(JSON.stringify('allKpitwo----->'+ weight_sum , null , 4));
	if (allKpitwo == undefined || allKpitwo == null || allKpitwo == '') {
		return ;
	}
	let resultMap = new Map ();
 	let weightMap = new Map();
	for (var i = allKpitwo.length - 1; i >= 0; i--) {
		if (allKpitwo[i] == null || allKpitwo[i] == '') {
			continue;
		}
		for (var j = allKpitwo[i].length - 1; j >= 0; j--) {
			if (allKpitwo[i][j] == null || allKpitwo[i][j] == '') {
				continue;
			}
			const linebody = await Linebody.findById(allKpitwo[i][j].linebodyLinebodyid,{'attributes': ['weight']});
			//console.log('------>'+JSON.stringify(linebody.weight , null , 4));
			//weight_sum += linebody.weight;
			let mapEle = resultMap.get (allKpitwo[i][j].kpitwolevKpitwoid);
			let mapWeightEle = weightMap.get(allKpitwo[i][j].kpitwolevKpitwoid);
			if (!mapEle)
			{
				mapEle = new Array ();
			}
			if (!mapWeightEle)
			{
				mapWeightEle = new Array ();
			}
			mapEle.push (allKpitwo[i][j].value * linebody.weight);
			mapWeightEle.push (linebody.weight);
			resultMap.set (allKpitwo[i][j].kpitwolevKpitwoid , mapEle);
			weightMap.set(allKpitwo[i][j].kpitwolevKpitwoid , mapWeightEle);
		}
	}
	console.log('yuzhizhe01');
	console.log(weightMap);
	console.log(resultMap);
	console.log('\n');
	let map = new Map();
	for(var [key, value] of resultMap) {
		const sum = await value.map(a => a).reduce ((pre, cur) => pre + cur);
		// let weight_sum = 0 ;
		// //let weight_sum = value.length;
		// for(var [key1, value1] of weightMap) {
		// 	if (key == key1) {
		// 		weight_sum = await value1.map(a => a).reduce ((pre, cur) => pre + cur);
		// 	}
		// }
		//console.log(JSON.stringify(sum , null , 4));
		//console.log(JSON.stringify(weight_sum , null , 4));
		if (weight_sum != 0) {
			value = sum / weight_sum;
		}
		await map.set(key , new Number(value).toFixed(4));
		//console.log("属性：" + key + ",值：" + value);
	}
	console.log(map);
	return map;
}

/*
	计算losstier3的每一项的平均数
 */
async function computeLosstier3(allLosstier3 , weight_sum){
	//console.log(JSON.stringify('allLosstier3----->'+ weight_sum , null , 4));
	if (allLosstier3 == undefined || allLosstier3 == null || allLosstier3 == '') {
		return ;
	}
	let resultMap = new Map ();
	let weightMap = new Map();
	for (var i = allLosstier3.length - 1; i >= 0; i--) {
		if (allLosstier3[i] == null || allLosstier3[i] == '') {
			continue;
		}

		for (var j = allLosstier3[i].length - 1; j >= 0; j--) {
			if (allLosstier3[i][j] == null || allLosstier3[i][j] == '') {
				continue;
			}
			const linebody = await Linebody.findById(allLosstier3[i][j].linebodyLinebodyid,{'attributes': ['weight']});
			let mapEle = resultMap.get (allLosstier3[i][j].losstier3Lossid);
			let mapWeightEle = weightMap.get(allLosstier3[i][j].losstier3Lossid);
			if (!mapEle)
			{
				mapEle = new Array ();
			}
			if (!mapWeightEle)
			{
				mapWeightEle = new Array ();
			}
			mapEle.push (allLosstier3[i][j].value * linebody.weight);
			mapWeightEle.push (linebody.weight);
			resultMap.set (allLosstier3[i][j].losstier3Lossid, mapEle);
			weightMap.set(allLosstier3[i][j].losstier3Lossid , mapWeightEle);
		}
	}
	console.log('yuzhizhe02');
	console.log(weightMap);
	console.log(resultMap);
	console.log('\n');
	let map = new Map();
	for(var [key, value] of resultMap) {
		const sum = await value.map(a => a).reduce ((pre, cur) => pre + cur);
		//let weight_sum = 0 ;
		//let weight_sum = value.length;
		// if (type == 1) {
		// 	for(var [key1, value1] of weightMap) {
		// 	//if (key == key1) {
		// 		weight_sum += await value1.map(a => a).reduce ((pre, cur) => pre + cur);
		// 	//}
		// 	}
		// }else{
			// for(var [key1, value1] of weightMap) {
			// 	if (key == key1) {
			// 		weight_sum = await value1.map(a => a).reduce ((pre, cur) => pre + cur);
			// 	}
			// }
		//}
		//console.log(JSON.stringify(sum , null , 4));
		//console.log(JSON.stringify(weight_sum , null , 4));
		if (weight_sum != 0) {
			value = sum / weight_sum;
		}
		//console.log("属性：" + key + ",值：" + value);
		await map.set(key , new Number(value).toFixed(4));
		
	}
	console.log(map);
	return map;
}

/*
	计算losstier4的每一项的平均数
 */
async function computeLosstier4(allLosstier4 , weight_sum){
	//console.log(JSON.stringify('allLosstier4----->'+ weight_sum , null , 4));
	if (allLosstier4 == undefined || allLosstier4 == null || allLosstier4 == '') {
		return ;
	}
	let resultMap = new Map ();
	let weightMap = new Map();
	for (var i = allLosstier4.length - 1; i >= 0; i--) {
		if (allLosstier4[i] == null || allLosstier4[i] == '') {
			continue;
		}
		for (var j = allLosstier4[i].length - 1; j >= 0; j--) {
			if (allLosstier4[i][j] == null || allLosstier4[i][j] == '') {
				continue;
			}
			const linebody = await Linebody.findById(allLosstier4[i][j].linebodyLinebodyid,{'attributes': ['weight']});
			let mapEle = resultMap.get (allLosstier4[i][j].losstier4Tier4id);
			let mapWeightEle = weightMap.get(allLosstier4[i][j].losstier4Tier4id);
			if (!mapEle)
			{
				mapEle = new Array ();
			}
			if (!mapWeightEle)
			{
				mapWeightEle = new Array ();
			}
			mapEle.push (allLosstier4[i][j].value * linebody.weight);
			resultMap.set (allLosstier4[i][j].losstier4Tier4id, mapEle);
			mapWeightEle.push (linebody.weight);
			weightMap.set(allLosstier4[i][j].losstier4Tier4id , mapWeightEle);
		}
	}
	console.log('yuzhizhe03');
	console.log(weightMap);
	console.log(resultMap);
	console.log('\n');
	let map = new Map();
	for(var [key, value] of resultMap) {
		const sum = await value.map(a => a).reduce ((pre, cur) => pre + cur);
		//let weight_sum = 0 ;
		// if (type == 1) {
		// 	for(var [key1, value1] of weightMap) {
		// 	//if (key == key1) {
		// 		weight_sum += await value1.map(a => a).reduce ((pre, cur) => pre + cur);
		// 	//}
		// 	}
		// }else{
			// for(var [key1, value1] of weightMap) {
			// 	if (key == key1) {
			// 		weight_sum = await value1.map(a => a).reduce ((pre, cur) => pre + cur);
			// 	}
			// }
		//}
		//let weight_sum = value.length;
		
		//console.log(JSON.stringify(sum , null , 4));
		//console.log(JSON.stringify(weight_sum , null , 4));
		if (weight_sum != 0) {
			value = sum / weight_sum;
		}
		await map.set(key , new Number(value).toFixed(4));
		//console.log("属性：" + key + ",值：" + value);
	}
	console.log(map);
	return map;
}

function getResultMap (alldata, resultMap) {

	alldata.forEach (ele => {
		if (ele instanceof Array) {
			getResultMap (ele, resultMap)
		}
		else if (!ele) {
			return
		}

		let mapEle = resultMap.get (ele.name)
		if (!mapEle) {
			mapEle = new Array ()
		}

		mapEle.push (ele.value)
		resultMap.set (ele.name, mapEle)
	})
}

/*
	根据时间范围过滤KPItwo数据
 */
async function computeKpitwoBytime(allKpitwo , startTimeValue , endTimeValue){
	if (allKpitwo == undefined || allKpitwo == null || allKpitwo == ''
		||startTimeValue == undefined || startTimeValue == null || startTimeValue == ''
		||endTimeValue == undefined || endTimeValue == null || endTimeValue == ''
		) {
		return ;
	}

	// console.log('==========>startTimeValue'+startTimeValue);
	// console.log('==========>endTimeValue'+endTimeValue);
	// const startTime = moment(startTimeValue);
	// const endTime = moment(endTimeValue);
	const startTime = new Date(startTimeValue).getTime();
	const endTime = new Date(endTimeValue).getTime();
	// console.log('==========>startTime----'+startTime);
	// console.log('==========>endTime----'+endTime);
	for (var i = allKpitwo.length - 1; i >= 0; i--) {
		if (allKpitwo[i] == null || allKpitwo[i] == '') {
			allKpitwo.splice(i , 1);//删除该元素
			continue;
		}
		for (var j = allKpitwo[i].length - 1; j >= 0; j--) {
			if (allKpitwo[i][j] == null || allKpitwo[i][j] == '') {
				allKpitwo[i].splice(j , 1);
				continue;
			}
			const classInfId = allKpitwo[i][j].classinformationClassinfid;
			if (classInfId == undefined || classInfId == null || classInfId == '') {
				allKpitwo[i].splice(j , 1);
				continue;
			}
			const classInf = await Classinformation.findById(classInfId);
			if (classInf == undefined || classInf == null || classInf == '') {
				allKpitwo[i].splice(j , 1);
				continue;
			}
			const classstarttime = classInf.classstarttime;
			const classendtime = classInf.classendtime;
			if (classstarttime == null || classstarttime == ''
				||classendtime == null || classendtime == '') {
				allKpitwo[i].splice(j , 1);//删除该元素
				continue;
			}
			//console.log('==========>classstarttime'+classstarttime.format('yyyy-MM-dd hh:mm:ss'));
			//console.log('==========>classendtime'+classendtime.format('yyyy-MM-dd hh:mm:ss'));
			// const mStartTime = moment(classstarttime);
			// const mEndTime = moment(classendtime);

			const mStartTime = new Date(classstarttime).getTime();
			const mEndTime = new Date(classendtime).getTime();

			const mTime = mEndTime - mStartTime;//单位是毫秒
			
			if (mStartTime > endTime || mEndTime < startTime) {
				// console.log(JSON.stringify(startTime , null , 4));
				// console.log(JSON.stringify(endTime , null , 4));
				// console.log('\n');
				// console.log(JSON.stringify(mStartTime , null , 4));
				// console.log(JSON.stringify(mEndTime , null , 4));
				// console.log('\n\n\n\n\n');
				// console.log('==================');
				// console.log('========>'+allKpitwo[i][j].id);
				allKpitwo[i].splice(j , 1);//删除该元素
				continue;
			}else{
				// console.log(JSON.stringify(startTime , null , 4));
				// console.log(JSON.stringify(endTime , null , 4));
				// console.log('\n');
				// console.log(new Date('2017-10-01 00:00:00'));
				// console.log(mStartTime);
				// console.log(mEndTime);
				// console.log('\n\n\n\n\n');
				// console.log('==================');
				// console.log('========>'+allKpitwo[i][j].id);
				if (!(mStartTime < startTime) && !(mEndTime>endTime)) {
					allKpitwo[i][j]['flag'] = 1;
				}else{
					if (mStartTime < startTime) {
						const minTime = mEndTime-startTime;//的时间段,单位为毫秒
						allKpitwo[i][j].flag = minTime / mTime;
					}else{
						const minTime = endTime-mStartTime;//所在的时间段,单位为毫秒
						allKpitwo[i][j].flag = minTime / mTime;
					}
				}
			}
		}
	}
	//console.log(startTime);
	//console.log(endTime);
	//console.log(JSON.stringify(startTime , null , 4));
	//console.log(JSON.stringify(endTime , null , 4));
	return endTime;
}

 


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
var errorUtil = require('../utils/errorUtil');

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};
/*
	linebody级别为本次查询计算的最高级
 */
async function selectLossMappingByLinebodyId(userId , linebodyId) {
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
	const kpitwos = await linebody.getLinebodyKpitwolev({'attributes': ['name', 'kpitwoid' , 'id' , 'value']});
	//console.log(JSON.stringify(tier2 , null , 4));
	if (kpitwos == undefined || kpitwos == null || kpitwos == ''
		||tier2 == undefined || tier2 == null || tier2 == '') {
		return ;
	}
	let alldata = [];
	for (var i = kpitwos.length - 1; i >= 0; i--) {
		let kpitwo = {
			name:kpitwos[i].name,
			value:kpitwos[i].value
		};
		const kpitwoid = kpitwos[i].kpitwoid;
		let orderStr;
		for (var m = tier2.length - 1; m >= 0; m--) {
			if (kpitwoid == tier2[m].kpitwoid) {
				orderStr = tier2[m].userKpitwolev.sequence;
			}
		}
		//console.log(JSON.stringify(orderStr , null , 4));
		let array = {
			title:kpitwos[i].name,
			order:orderStr,
			data: new Array (),
			link: new Array ()
		};
		let datas = new Array ();
		let links = new Array ();
		datas.push(kpitwo);
		const losscategorys = await kpitwos[i].getKpitwolevLosscategory({'attributes': ['name', 'lossid' , 'id' , 'value']});

		for (var j = losscategorys.length - 1; j >= 0; j--) {
			let losscategory = {
				name:losscategorys[j].name,
				value:losscategorys[j].value
			};
			let link = {
				source:kpitwos[i].name,
				target:losscategorys[j].name,
				value:losscategorys[j].value
			};
			datas.push(losscategory);
			links.push(link);
			const losstier4s = await losscategorys[j].getLosscategoryLosstier4({'attributes': ['name',  'id' , 'value']});
			for (var k = losstier4s.length - 1; k >= 0; k--) {
				let losstier4 = {
					name:losstier4s[k].name,
					value:losstier4s[k].value
				};
				let link1 = {
					source:losscategorys[j].name,
					target:losstier4s[k].name,
					value:losstier4s[k].value
				};
				datas.push(losstier4);
				links.push(link1);
			}
			//console.log(JSON.stringify(losstier4s , null , 4));
		}
		array.data = datas;
		array.link = links;
		alldata.push(array);
		alldata.sort ((a, b) => a.order - b.order)
		// console.log ('/n/n/n/n/n/n')
		// alldata.forEach (a => console.log (a.order))
		//console.log(JSON.stringify(losscategorys , null , 4));
	}
	dataSuccess.data = alldata;
	return dataSuccess;
}
exports.selectLossMappingByLinebodyId = selectLossMappingByLinebodyId;

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
	const kpitwos = await linebody.getLinebodyKpitwolev({'attributes': ['name', 'kpitwoid']});
	//console.log(JSON.stringify(kpitwos , null , 4));
	if (kpitwos == undefined || kpitwos == null || kpitwos == ''
		||tier2 == undefined || tier2 == null || tier2 == '') {
		return ;
	}
	for (var i = kpitwos.length - 1; i >= 0; i--) {
		const kpitwoid = kpitwos[i].kpitwoid;
		for (var m = tier2.length - 1; m >= 0; m--) {
			if (kpitwoid == tier2[m].kpitwoid) {
				kpitwos[i]['order'] = tier2[m].userKpitwolev.sequence;
			}
		}
	}

	kpitwos.sort ((a, b) => a.order - b.order);

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
async function baseSelectLosstier3ByLinebodyId(linebodyId){
	if (linebodyId == undefined || linebodyId == null || linebodyId == '') {
		return ;
	}
	//const user = await User.findById(userId);
	const linebody = await Linebody.findById(linebodyId);
	if (linebody == undefined || linebody == null || linebody == '') {
		return ;
	}
	const losstier3s = await linebody.getLinebodyLosstier3({'attributes': ['name', 'lossid']});
	return losstier3s;
}
exports.baseSelectLosstier3ByLinebodyId = baseSelectLosstier3ByLinebodyId;

/**
 * 	根据所有的线体ID查询KPItwo的数据
 */
async function selectLossMappingByLinebodyIds(userId , linebodyIds){
	if (linebodyIds == undefined || linebodyIds == null || linebodyIds == ''
		||userId == undefined || userId == null || userId == '') {
		return ;
	}
	const user = await User.findById(userId);
	//console.log(JSON.stringify(user , null , 4));
	if (user == undefined || user == null || user == '') {
		return ;
	}
	const Ids = await linebodyIds.split(",");
	let  tier2 = await user.getUserKpitwolevs({'attributes': ['name', 'kpitwoid']});
	if (Ids == undefined || Ids == null || Ids == ''
		||tier2 == undefined || tier2 == null || tier2 == '') {
		return ;
	}
	let allKpitwo = [];
	let allLosstier3 = [];
	//let allLosstier4 = [];
	for (var i = Ids.length - 1; i >= 0; i--) {
		//console.log(JSON.stringify(Ids[i]));
		const kpitwos = await this.baseSelectKpitwoByLinebodyId(userId,Ids[i]);
		if (kpitwos != undefined && kpitwos != null && kpitwos != '') {
			allKpitwo.push(kpitwos);
		}
		const losstier3s = await this.baseSelectLosstier3ByLinebodyId(Ids[i]);
		if (losstier3s != undefined && losstier3s != null && losstier3s != '') {
			allLosstier3.push(losstier3s);
		}
		// const losstier4 = await this.baseSelectLosstier3ByLinebodyId(Ids[i]);
		// if (losstier3s != undefined && losstier3s != null && losstier3s != '') {
		// 	allLosstier3.push(losstier3s);
		// }
	}
	let alldata = [];
	//console.log(JSON.stringify(allLosstier3 , null , 4));
	const kpitwoMap = await computeKpitwo(allKpitwo);
 	const lossTier3Map = await computeLosstier3(allLosstier3);
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
			console.log(JSON.stringify(losstier3.kpitwolevKpitwoid , null , 4));
			console.log(JSON.stringify(key , null , 4));
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
			}
		}
		array.data = datas;
		array.link = links;
		alldata.push(array);
		alldata.sort ((a, b) => a.order - b.order)
	}
	//console.log(lossTier3Map);
	//console.log(JSON.stringify(alldata , null , 4));
	
	return alldata;
}
exports.selectLossMappingByLinebodyIds = selectLossMappingByLinebodyIds;

/*
	计算KPItwo的每一项的平均数
 */
async function computeKpitwo(allKpitwo){
	//console.log(JSON.stringify(allKpitwo , null , 4));
	if (allKpitwo == undefined || allKpitwo == null || allKpitwo == '') {
		return ;
	}
	let resultMap = new Map ();

	for (var i = allKpitwo.length - 1; i >= 0; i--) {
		if (allKpitwo[i] == null || allKpitwo[i] == '') {
			continue;
		}
		for (var j = allKpitwo[i].length - 1; j >= 0; j--) {
			if (allKpitwo[i][j] == null || allKpitwo[i][j] == '') {
				continue;
			}
			let mapEle = resultMap.get (allKpitwo[i][j].kpitwoid);
			if (!mapEle)
			{
				mapEle = new Array ();
			}
			mapEle.push (allKpitwo[i][j].linebodyKpitwolev.value);
			resultMap.set (allKpitwo[i][j].kpitwoid, mapEle);
		}
	}
	//console.log(resultMap);
	let map = new Map();
	for(var [key, value] of resultMap) {
		const sum = await value.map(a => a).reduce ((pre, cur) => pre + cur);
		const length = value.length;
		if (length != 0) {
			value = sum / length;
		}
		map.set(key , value);
		//console.log("属性：" + key + ",值：" + value);
	}
	//console.log(map);
	return map;
}

/*
	计算losstier3的每一项的平均数
 */
async function computeLosstier3(allLosstier3){
	//console.log(JSON.stringify(allLosstier3 , null , 4));
	if (allLosstier3 == undefined || allLosstier3 == null || allLosstier3 == '') {
		return ;
	}
	let resultMap = new Map ();

	for (var i = allLosstier3.length - 1; i >= 0; i--) {
		if (allLosstier3[i] == null || allLosstier3[i] == '') {
			continue;
		}
		for (var j = allLosstier3[i].length - 1; j >= 0; j--) {
			if (allLosstier3[i][j] == null || allLosstier3[i][j] == '') {
				continue;
			}
			let mapEle = resultMap.get (allLosstier3[i][j].lossid);
			if (!mapEle)
			{
				mapEle = new Array ();
			}
			mapEle.push (allLosstier3[i][j].linebodylosstier3.value);
			resultMap.set (allLosstier3[i][j].lossid, mapEle);
		}
	}
	console.log('resultMap');
	let map = new Map();
	for(var [key, value] of resultMap) {
		const sum = await value.map(a => a).reduce ((pre, cur) => pre + cur);
		const length = value.length;
		if (length != 0) {
			value = sum / length;
		}
		map.set(key , value);
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


/*
 auther:Android,
 NOTE:lossmapping表的controller层,
 time:20171108
 */

var service = require('../services/user_service');
var User = require('../models').User;//引入数据库User模块
var Linebody = require('../models').Linebody;
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

async function baseSelectLossMappingByLinebodyId(userId , linebodyId){
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
	console.log(JSON.stringify(kpitwos , null , 4));
	return kpitwos;
}
exports.baseSelectLossMappingByLinebodyId = baseSelectLossMappingByLinebodyId;



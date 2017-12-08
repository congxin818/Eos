/*
 	auther:Android,
 	NOTE:产品表的controller层,
 	time:20171019
 */

var Productname_service = require('../services/productname_service');
var Productsubclass_service = require('../services/productsubclass_service');
var Productbigclass_service = require('../services/productbigclass_service');

var Productname = require('../models').Productname;
var Productsubclass = require('../models').Productsubclass;
var Productbigclass = require('../models').Productbigclass;

var errorUtil = require('../utils/errorUtil');

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};



/*
	查询所有产品
 */
async function selectProductAll(req , res , next){
	const allProductbigclass = await Productbigclass.findAll();
	if (allProductbigclass == undefined || allProductbigclass == null ||allProductbigclass == '') {
		return errorUtil.noExistError;
	}
	//console.log(JSON.stringify(allProductbigclass , null , 4));
	//const allProductsubclass = await Productsubclass.findAll();
	//const allProductname = await Productname.findAll();
	let bigClass_array = new Array();
	for (var i = allProductbigclass.length - 1; i >= 0; i--) {
		let bigclass = {
			id:'',
			name:'',
			pId:''
		};
		bigclass.id = allProductbigclass[i].id;
		bigclass.name = allProductbigclass[i].name;
		bigclass.pId = null;
		//console.log(JSON.stringify(bigclass , null , 4));
		bigClass_array.push(bigclass);
	}

	res.end(JSON.stringify(allProductbigclass));

}
exports.selectProductAll = selectProductAll;
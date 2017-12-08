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
var Productbigclass_service = require('../models').Productbigclass_service;

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
	console.log(JSON.stringify(allProductbigclass , null , 4));
	//const allProductsubclass = await Productsubclass.findAll();

	//const allProductname = await Productname.findAll();
	

}
exports.selectProductAll = selectProductAll;
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
		res.end(JSON.stringify(errorUtil.noExistError));
	}
	//console.log(JSON.stringify(allProductbigclass , null , 4));
	//const allProductsubclass = await Productsubclass.findAll();
	//const allProductname = await Productname.findAll();
	let allData = new Array();
	const rootdata = {
		id:1,
		name:'产品列表',
		pId:null
	}
	allData.push(rootdata);
	for (var i = allProductbigclass.length - 1; i >= 0; i--) {
		let bigclass = {
			id:'',
			name:'',
			pId:''
		};
		bigclass.id = 'b' + allProductbigclass[i].id;
		bigclass.name = allProductbigclass[i].name;
		bigclass.pId = 1;
		//console.log(JSON.stringify(bigclass , null , 4));
		allData.push(bigclass);
	}
	const allProductsubclass = await Productsubclass.findAll();
	if (allProductsubclass == undefined || allProductsubclass == null ||allProductsubclass == '') {
		dataSuccess.data = allData;
		res.end(JSON.stringify(dataSuccess));
	}else{
		//console.log(JSON.stringify('yuzhizhe'));
		for (var i = allProductsubclass.length - 1; i >= 0; i--) {
			let subclass = {
				id:'',
				name:'',
				pId:''
			};
			subclass.id = 's' + allProductsubclass[i].id;
			subclass.name = allProductsubclass[i].name;
			subclass.pId = 'b' + allProductsubclass[i].productbigclassId;
			//console.log(JSON.stringify(bigclass , null , 4));
			allData.push(subclass);
		}
		const allProductname = await Productname.findAll();
		if (allProductname == undefined || allProductname == null ||allProductname == '') {
			dataSuccess.data = allData;
			res.end(JSON.stringify(dataSuccess));
		}else{
			for (var i = allProductname.length - 1; i >= 0; i--) {
				let product = {
					id:'',
					name:'',
					pId:''
				};
				product.id = 'n' + allProductname[i].id;
				product.name = allProductname[i].name;
				product.pId = 's' + allProductname[i].productsubclassId;
				//console.log(JSON.stringify(bigclass , null , 4));
				allData.push(product);
			}
			dataSuccess.data = allData;
			res.end(JSON.stringify(dataSuccess));
		}
	}
}
exports.selectProductAll = selectProductAll;

/*
	添加产品
 */
async function addProduct(req , res , next){
	if (req.body.name == undefined || req.body.name == null || req.body.name == ''
		||req.body.pId == undefined || req.body.pId == null || req.body.pId == '') {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	if (isNaN(req.body.pId)) {
		const pFlag = await req.body.pId.slice(0,1);
		const pId = await req.body.pId.slice(1);
		if (isNaN(pFlag)) {
			if (pFlag == 'b') {
				const subclass = {
					name:req.body.name,
					productbigclassId:pId
				};
				const falg = await Productsubclass.create(subclass);
				if (falg == undefined || falg == null || falg == '') {
					res.end(JSON.stringify(errorUtil.serviceError));
				}else{
					dataSuccess.data = falg;
					res.end(JSON.stringify(dataSuccess));
				}
			}else if(pFlag == 's'){
				const product = {
					name:req.body.name,
					productsubclassId:pId
				};
				const falg = await Productname.create(product);
				if (falg == undefined || falg == null || falg == '') {
					res.end(JSON.stringify(errorUtil.serviceError));
				}else{
					dataSuccess.data = falg;
					res.end(JSON.stringify(dataSuccess));
				}
			}else{
				res.end(JSON.stringify(errorUtil.parameterError));
			}
		}else{
			res.end(JSON.stringify(errorUtil.parameterError));
		}
	}else{
		const bigclass = {
			name:req.body.name
		};
		const falg = await Productbigclass.create(bigclass);
		if (falg == undefined || falg == null || falg == '') {
			res.end(JSON.stringify(errorUtil.serviceError));
		}else{
			dataSuccess.data = falg;
			res.end(JSON.stringify(dataSuccess));
		}
	}

}
exports.addProduct = addProduct;
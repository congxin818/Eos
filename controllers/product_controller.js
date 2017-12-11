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
async function addProductOne(req , res , next){
	if (req.body.name == undefined || req.body.name == null || req.body.name == ''
		||req.body.pId == undefined || req.body.pId == null || req.body.pId == '') {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	if (isNaN(req.body.pId)) {
		const pFlag = await req.body.pId.slice(0,1);
		const pId = await req.body.pId.slice(1);
		if (isNaN(pFlag)) {
			if (pFlag == 'b') {
				const bigclass = await Productbigclass.findById(pId);
				if (bigclass == undefined || bigclass == null || bigclass == '') {
					res.end(JSON.stringify(errorUtil.noExistError));
				}else{
					const existSubclass = await Productsubclass.findOne({where:{name:req.body.name}});
					if (existSubclass == undefined || existSubclass == null || existSubclass == '') {
						const subclass = {
							name:req.body.name,
							productbigclassId:pId
						};
						const falg = await Productsubclass.create(subclass);
						if (falg == undefined || falg == null || falg == '') {
							res.end(JSON.stringify(errorUtil.serviceError));
						}else{
							let returnsubclass = {
								id:'',
								name:'',
								pId:''
							};
							returnsubclass.id = 's' + falg.id;
							returnsubclass.name = falg.name;
							returnsubclass.pId = 'b' + falg.productbigclassId;
							dataSuccess.data = returnsubclass;
							res.end(JSON.stringify(dataSuccess));
						}
					}else{
						res.end(JSON.stringify(errorUtil.existError));
					}
				}
			}else if(pFlag == 's'){
				const subclass = await Productsubclass.findById(pId);
				if (subclass == undefined || subclass == null || subclass == '') {
					res.end(JSON.stringify(errorUtil.noExistError));
				}else{
					const existProduct = await Productname.findOne({where:{name:req.body.name}});
					if (existProduct == undefined || existProduct == null || existProduct == '') {
						const product = {
							name:req.body.name,
							productsubclassId:pId
						};
						const falg = await Productname.create(product);
						if (falg == undefined || falg == null || falg == '') {
							res.end(JSON.stringify(errorUtil.serviceError));
						}else{
							let returnProduct = {
								id:'',
								name:'',
								pId:''
							};
							returnProduct.id = 'n' + falg.id;
							returnProduct.name = falg.name;
							returnProduct.pId = 's' + falg.productsubclassId;
							dataSuccess.data = returnProduct;
							res.end(JSON.stringify(dataSuccess));
						}
					}else{
						res.end(JSON.stringify(errorUtil.existError));
					}
				}
			}else{
				res.end(JSON.stringify(errorUtil.parameterError));
			}
		}else{
			res.end(JSON.stringify(errorUtil.parameterError));
		}
	}else{
		const existBigclass = await Productbigclass.findOne({where:{name:req.body.name}});
		if (existBigclass == undefined || existBigclass == null || existBigclass == '') {
			const bigclass = {
				name:req.body.name
			};
			const falg = await Productbigclass.create(bigclass);
			if (falg == undefined || falg == null || falg == '') {
				res.end(JSON.stringify(errorUtil.serviceError));
			}else{
				let returnBigclass = {
					id:'',
					name:'',
					pId:''
				};
				returnBigclass.id = 'b' + falg.id;
				returnBigclass.name = falg.name;
				returnBigclass.pId = 1;
				dataSuccess.data = returnBigclass;
				res.end(JSON.stringify(dataSuccess));
			}	
		}else{
			res.end(JSON.stringify(errorUtil.existError));
		}
	}

}
exports.addProductOne = addProductOne;

/*
	编辑产品
 */
async function updateProductById(req , res , next){
	if (req.body.name == undefined || req.body.name == null || req.body.name == ''
		||req.body.id == undefined || req.body.id == null || req.body.id == '') {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	if (isNaN(req.body.id)) {
		const pFlag = await req.body.id.slice(0,1);
		const pId = await req.body.id.slice(1);
		if (isNaN(pFlag)) {
			if (pFlag == 'b') {
				const bigclass = await Productbigclass.findById(pId);
				if (bigclass == undefined || bigclass == null || bigclass == '') {
					res.end(JSON.stringify(errorUtil.noExistError));
				}else{
					const existBigclass = await Productbigclass.findOne({where:{name:req.body.name}});
					if (existBigclass == undefined || existBigclass == null || existBigclass == '') {
						const newBigclass = {
							name:req.body.name
						};
						const falg = await Productbigclass.update(newBigclass,{where:{id:pId}});
						if (falg == undefined || falg == null || falg == '' || falg != 1) {
							res.end(JSON.stringify(errorUtil.serviceError));
						}else{
							dataSuccess.data = falg;
							res.end(JSON.stringify(dataSuccess));
						}
					}else{
						res.end(JSON.stringify(errorUtil.existError));
					}
				}
			}else if(pFlag == 's'){
				const subclass = await Productsubclass.findById(pId);
				if (subclass == undefined || subclass == null || subclass == '') {
					res.end(JSON.stringify(errorUtil.noExistError));
				}else{
					const existSubclass = await Productsubclass.findOne({where:{name:req.body.name}});
					if (existSubclass == undefined || existSubclass == null || existSubclass == '') {
						const newSubclass = {
							name:req.body.name
						};
						const falg = await Productsubclass.update(newSubclass,{where:{id:pId}});
						if (falg == undefined || falg == null || falg == '' || falg != 1) {
							res.end(JSON.stringify(errorUtil.serviceError));
						}else{
							dataSuccess.data = falg;
							res.end(JSON.stringify(dataSuccess));
						}
					}else{
						res.end(JSON.stringify(errorUtil.existError));
					}
				}
			}else if(pFlag == 'n'){
				const product = await Productname.findById(pId);
				if (product == undefined || product == null || product == '') {
					res.end(JSON.stringify(errorUtil.noExistError));
				}else{
					const existSubclass = await Productname.findOne({where:{name:req.body.name}});
					if (existSubclass == undefined || existSubclass == null || existSubclass == '') {
						const newProduct = {
							name:req.body.name
						};
						const falg = await Productname.update(newProduct,{where:{id:pId}});
						if (falg == undefined || falg == null || falg == '' || falg != 1) {
							res.end(JSON.stringify(errorUtil.serviceError));
						}else{
							dataSuccess.data = falg;
							res.end(JSON.stringify(dataSuccess));
						}
					}else{
						res.end(JSON.stringify(errorUtil.existError));
					}
				}
			}else{
				res.end(JSON.stringify(errorUtil.parameterError));
			}
		}else{
			res.end(JSON.stringify(errorUtil.parameterError));
		}
	}else{
		res.end(JSON.stringify(errorUtil.parameterError));
	}
}
exports.updateProductById = updateProductById;

/*
	删除产品
 */
async function deleteProductById(req , res , next){
	if (req.body.id == undefined || req.body.id == null || req.body.id == '') {
		res.end(JSON.stringify(errorUtil.parameterError));
	}
	if (isNaN(req.body.id)) {
		const pFlag = await req.body.id.slice(0,1);
		const pId = await req.body.id.slice(1);
		if (isNaN(pFlag)) {
			if (pFlag == 'b') {
				const bigclass = await Productbigclass.findById(pId);
				if (bigclass == undefined || bigclass == null || bigclass == '') {
					res.end(JSON.stringify(errorUtil.noExistError));
				}else{
					const falg = await Productbigclass.destroy({where:{id:pId}});
					if (falg == undefined || falg == null || falg == '') {
						res.end(JSON.stringify(errorUtil.serviceError));
					}else{
						await Productsubclass_service.ProductsubclassClear();
						await Productname_service.ProductnameClear();
						dataSuccess.data = falg;
						res.end(JSON.stringify(dataSuccess));
					}
				}
			}else if(pFlag == 's'){
				const subclass = await Productsubclass.findById(pId);
				if (subclass == undefined || subclass == null || subclass == '') {
					res.end(JSON.stringify(errorUtil.noExistError));
				}else{
					const falg = await Productsubclass.destroy({where:{id:pId}});
					if (falg == undefined || falg == null || falg == '' || falg != 1) {
						res.end(JSON.stringify(errorUtil.serviceError));
					}else{
						await Productname_service.ProductnameClear();
						dataSuccess.data = falg;
						res.end(JSON.stringify(dataSuccess));
					}
				}
			}else if(pFlag == 'n'){
				const product = await Product.findById(pId);
				if (product == undefined || product == null || product == '') {
					res.end(JSON.stringify(errorUtil.noExistError));
				}else{
					const falg = await Product.destroy({where:{id:pId}});
					if (falg == undefined || falg == null || falg == '' || falg != 1) {
						res.end(JSON.stringify(errorUtil.serviceError));
					}else{
						dataSuccess.data = falg;
						res.end(JSON.stringify(dataSuccess));
					}
				}
			}else{
				res.end(JSON.stringify(errorUtil.parameterError));
			}
		}else{
			res.end(JSON.stringify(errorUtil.parameterError));
		}
	}else{
		res.end(JSON.stringify(errorUtil.parameterError));
	}
}
exports.deleteProductById = deleteProductById;

/*
 	auther:Android,
 	NOTE:产品三级表（productname）的service,
 	time:20171019
 */

let Productname = require('../models').Productname;

var errorUtil = require('../utils/errorUtil');

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

/*
	查询所有
 */
async function selectPtoductnameAll(){
	const allData = await Productname.findAll();
	return allData;
}
exports.selectPtoductnameAll = selectPtoductnameAll;

/*
	根据id查询
 */
async function selectPtoductnameById(id){
	if (id == undefined || id == null || id == '') {
		return errorUtil.parameterError;
	}
	const data = await Productname.findById(id);
	return data;
	
}
exports.selectPtoductnameById = selectPtoductnameById;

/**
 	添加
 */
async function addProductnameOne(name , price , pId){
	if (name == undefined || name == null || name == ''
		||price == undefined || price == null || price == ''
		||pId == undefined || pId == null || pId == '') {
		return errorUtil.parameterError;
	}
	let productname = {
		name:name,
		price:price,
		productsubclassId:pId
	};
	const data = await Productname.create(productname);
	return data;
}
exports.addProductnameOne = addProductnameOne;

/*
	根据ID删除
 */
async function deleteProductnameById(id){
	if (id == undefined || id == null || id == '') {
		return errorUtil.parameterError;
	}
	const productname = await Productname.findById(id);
    if (productname == undefined || productname == null || productname == '') {
        return errorUtil.noExistError;
    }
    const falg = await Productname.destroy({where:{id:id}});
    if (falg == null || falg != 1) {
        return errorUtil.serviceError;
    }
	return falg;
}
exports.deleteProductnameById = deleteProductnameById;

/*
	根据Id跟新
 */
async function updateProductnameById(id , price){
	if (id == undefined || id == null || id == '') {
		return errorUtil.parameterError;
	}
	const productname = await Productname.findById(id);
    if (productname == undefined || productname == null || productname == '') {
        return errorUtil.noExistError;
    }
    let productname = {
		price:price
	};
	const falg = await Productname.update(productname,{where:{id:id}});
	if (falg == null || falg != 1) {
        return errorUtil.serviceError;
    }
	return falg;
}
exports.updateProductnameById = updateProductnameById;

/*
	清理函数
 */
async function ProductnameClear(){
    const product = await Productname.findAll({where:{ productsubclassId:null}});
    //console.log(JSON.stringify(subclass.length));
    for (var i = product.length - 1; i >= 0; i--) {
        await product[i].destroy();
    }
}
exports.ProductnameClear = ProductnameClear;
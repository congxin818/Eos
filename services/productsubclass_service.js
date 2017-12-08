/*
 	auther:Android,
 	NOTE:产品二级表（productsubclass）的service,
 	time:20171019
 */

let Productsubclass = require('../models').Productsubclass;

var errorUtil = require('../utils/errorUtil');

/*
	查询所有
 */
async function selectPtoductsubclassAll(){
	const allData = await Productsubclass.findAll();
	return allData;
}
exports.selectPtoductsubclassAll = selectPtoductsubclassAll;

/*
	根据id查询
 */
async function selectPtoductsubclassById(id){
	if (id == undefined || id == null || id == '') {
		return errorUtil.parameterError;
	}
	const data = await Productsubclass.findById(id);
	return data;
}
exports.selectPtoductsubclassById = selectPtoductsubclassById;

/**
 	添加
 */
async function addProductsubclassOne(name , pId){
	if (name == undefined || name == null || name == ''
		||pId == undefined || pId == null || pId == '') {
		return errorUtil.parameterError;
	}
	let productsubclass = {
		name:name,
		productbigclassId:pId
	};
	const data = await Productsubclass.create(productsubclass);
	return data;
}
exports.addProductsubclassOne = addProductsubclassOne;

/*
	根据ID删除
 */
async function deleteProductsubclassById(id){
	if (id == undefined || id == null || id == '') {
		return errorUtil.parameterError;
	}
	const productsubclass = await Productsubclasse.findById(id);
    if (productsubclass == undefined || productsubclass == null || productsubclass == '') {
        return errorUtil.noExistError;
    }
    const falg = await Productsubclass.destroy({where:{id:id}});
    if (falg == null || falg != 1) {
        return errorUtil.serviceError;
    }
	return falg;
}
exports.deleteProductsubclassById = deleteProductsubclassById;

/*
	根据Id跟新
 */
async function updateProductsubclassById(id , name , price){
	if (id == undefined || id == null || id == '') {
		return errorUtil.parameterError;
	}
	const productsubclass = await Productsubclass.findById(id);
    if (productsubclass == undefined || productsubclass == null || productsubclass == '') {
        return errorUtil.noExistError;
    }
    let productsubclass = {
		name:name
	};
	const falg = await Productsubclass.update(productsubclass,{where:{id:id}});
	if (falg == null || falg != 1) {
        return errorUtil.serviceError;
    }
	return falg;
}
exports.updateProductsubclassById = updateProductsubclassById;
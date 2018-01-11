/*
 	auther:Android,
 	NOTE:产品一级表（productbigclass）的service,
 	time:20171019
 */

let Productbigclass = require('../models').Productbigclass;

var errorUtil = require('../utils/errorUtil');

/*
	查询所有
 */
async function selectPtoductbigclassAll() {
	const allData = await Productbigclass.findAll();
	return allData;
}
exports.selectPtoductbigclassAll = selectPtoductbigclassAll;

/*
	根据id查询
 */
async function selectPtoductbigclassById(id) {
	if (id == undefined || id == null || id == '') {
		return errorUtil.parameterError;
	}
	const data = await Productbigclass.findById(id);
	return data;
}
exports.selectPtoductbigclassById = selectPtoductbigclassById;

/**
 	添加
 */
async function addProductbigclassOne(name, price, pId) {
	if (name == undefined || name == null || name == '') {
		return errorUtil.parameterError;
	}
	let productbigclass = {
		name: name,
	};
	const data = await Productbigclass.create(productbigclass);
	return data;
}
exports.addProductbigclassOne = addProductbigclassOne;

/*
	根据ID删除
 */
async function deleteProductbigclassById(id) {
	if (id == undefined || id == null || id == '') {
		return errorUtil.parameterError;
	}
	const productbigclass = await Productbigclass.findById(id);
	if (productbigclass == undefined || productbigclass == null || productbigclass == '') {
		return errorUtil.noExistError;
	}
	const falg = await Productbigclass.destroy({ where: { id: id } });
	if (falg == null || falg != 1) {
		return errorUtil.serviceError;
	}
	return falg;
}
exports.deleteProductbigclassById = deleteProductbigclassById;

/*
	根据Id跟新
 */
async function updateProductbigclassById(id, name, price) {
	if (id == undefined || id == null || id == '') {
		return errorUtil.parameterError;
	}
	const productbigclass = await Productbigclass.findById(id);
	if (productbigclass == undefined || productbigclass == null || productbigclass == '') {
		return errorUtil.noExistError;
	}
	let productbig = {
		name: name
	};
	const falg = await Productbigclass.update(productbig, { where: { id: id } });
	if (falg == null || falg != 1) {
		return errorUtil.serviceError;
	}
	return falg;
}
exports.updateProductbigclassById = updateProductbigclassById;
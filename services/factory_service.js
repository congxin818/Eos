/*
	工厂表的一些sql查找
	创建人：Three
	时间：2017/10/19
*/

//引入数据库Message模块
var Factory = require('../models').Factory;

/*
	查找所有工厂数据
*/
exports.selectFactoryAll = function(req , res) {
    var p = new Promise(function(resolve, reject) {
        Factory.findAll().then(function(data) {
            resolve(data);
        });
    });
	return p;
}
/*
	根据id查找一条工厂数据
*/
exports.selectFactoryById = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        Factory.findOne({
            where:{
                factoryid:req.body.factoryId
            }
        }).then(function(data){
            resolve(data);
        });
    });
    return p;
}
/*
	添加一条工厂数据
*/
exports.addFactoryOne = function(req , res) {
    var factory = {
        factoryname: req.body.name,
        factorybelong: req.body.pId
    };
    var p = new Promise(function(resolve, reject) {
        //创建一条记录,创建成功后跳转回首页
        Factory.create(factory).then(function(data){
            resolve(data);
        });
    });
    return p;
}

/*
	根据id删除一条工厂数据
*/
exports.deleteFactoryById = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        //先查找,再调用删除,最后返回首页
        Factory.findOne({
            where:{
                factoryid:req.query.factoryId
            }
        }).then(function(data){
        	data.destroy().then(function(data){
            resolve(data);
            });     
        });
    });
    return p;
}

/*
	根据id更新工厂数据
*/
exports.updateFactoryById = function(req , res) {
	var factory = {
        factoryname: req.body.name
    };
    var p = new Promise(function(resolve , reject) {
        //更新一条记录,创建成功后跳转回首页
        Factory.update(factory,{
            where:{
                factoryid:req.body.factoryId
            }
        }).then(function(data){
            resolve(data);
        });
    });
    return p;
}

async function factoryClear(){
    const factory = await Factory.findAll({where:{ groupGroupid:''}});
    if (factory.length == 0) {
        return ;
    }
    for (var i = factory.length - 1; i >= 0; i--) {
        await factory[i].destroy();
    }
    return 1;
}
exports.factoryClear = factoryClear;
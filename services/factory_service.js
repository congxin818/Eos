/*
	工厂表的一些sql查找
	创建人：Three
	时间：2017/10/19
    */

//引入数据库Message模块
var Factory = require('../models').Factory;
var Group = require('../models').Group;
var errorUtil = require('../utils/errorUtil');
var workshop_service = require('../services/workshop_service');
var linebody_service = require('../services/linebody_service');
/*
	查找所有工厂数据
    */
exports.selectFactoryAll = function (req, res) {
    var p = new Promise(function (resolve, reject) {
        Factory.findAll().then(function (data) {
            resolve(data);
        });
    });
    return p;
}
/*
	根据id查找一条工厂数据
    */
exports.selectFactoryById = function (req, res) {
    var p = new Promise(function (resolve, reject) {
        Factory.findOne({
            where: {
                factoryid: req.body.factoryId
            }
        }).then(function (data) {
            resolve(data);
        });
    });
    return p;
}
/*
	添加一条工厂数据
    */
exports.addFactoryOne = async function (req, res) {
    var factory = {
        factoryname: req.body.name,
        factorybelong: req.body.pId
        // ,
        // weight:req.body.weight
    };
    const group = await Group.findById(req.body.pId);
    if (group == null || group == '') {
        return;
    }
    //增加一个工厂
    const data = await Factory.create(factory)
    await group.addGroupFactory(data);
    return data;
}

/*
	根据id删除一条工厂数据
    */
exports.deleteFactoryById = async function (req, res) {
    //先查找,再调用删除,最后返回首页
    const factory = await Factory.findById(req.query.factoryId);
    if (factory == null || factory == '') {
        return errorUtil.noExistError;
    }
    const falg = await factory.destroy();
    console.log('---------' + falg)
    if (falg == null || falg == '') {
        return errorUtil.noExistError;
    }
    await workshop_service.workshopClear();
    await linebody_service.linebodyClear();
    return falg;
}

/*
	根据id更新工厂数据
    */
exports.updateFactoryById = function (req, res) {
    var factory = {
        factoryname: req.body.name
        // ,
        // weight:req.body.weight
    };
    var p = new Promise(function (resolve, reject) {
        //更新一条记录,创建成功后跳转回首页
        Factory.update(factory, {
            where: {
                factoryid: req.body.factoryId
            }
        }).then(function (data) {
            resolve(data);
        });
    });
    return p;
}

async function factoryClear() {
    const factory = await Factory.findAll({
        where: {
            groupGroupid: null
        }
    });
    //console.log(JSON.stringify(factory.length));
    for (var i = factory.length - 1; i >= 0; i--) {
        await factory[i].destroy();
    }
}
exports.factoryClear = factoryClear;
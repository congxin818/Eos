/*
	车间表的一些sql查找
	创建人：Three
	时间：2017/10/19
    */

//引入数据库Message模块
const Workshop = require('../models').Workshop;
var Factory = require('../models').Factory;
const linebody_service = require('../services/linebody_service');

/*
	查找所有车间数据
    */
exports.selectWorkshopAll = function (req, res) {
    var p = new Promise(function (resolve, reject) {
        Workshop.findAll().then(function (data) {
            resolve(data);
        });
    });
    return p;
}
/*
	根据id查找一条车间数据
    */
exports.selectWorkshopById = function (req, res) {
    var p = new Promise(function (resolve, reject) {
        Workshop.findOne({
            where: {
                workshopid: req.body.workshopId
            }
        }).then(function (data) {
            resolve(data);
        });
    });
    return p;
}
/*
	添加一条车间数据
    */
exports.addWorkshopOne = async function (req, res) {
    var workshop = {
        workshopname: req.body.name,
        workshopbelong: req.body.pId
        // ,
        // weight:req.body.weight
    };
    var factoryId = req.body.pId.slice(1, );
    const factory = await Factory.findById(factoryId);
    if (factory == null || factory == '') {
        return;
    }
    //创建一条记录,创建成功后跳转回首页
    const data = await Workshop.create(workshop)
    await factory.addFactoryWorkshop(data);
    return data;
}

/*
	根据id删除一条车间数据
    */
exports.deleteWorkshopById = async function (req, res) {
    //先查找,再调用删除,最后返回首页
    const workshop = await Workshop.findById(req.query.workshopId);
    console.log('workshop--->' + JSON.stringify(workshop));
    if (workshop == null || workshop == '') {
        return errorUtil.noExistError;
    }
    const falg = await workshop.destroy();
    console.log('falg--->' + JSON.stringify(falg));
    if (falg == null || falg == '') {
        return errorUtil.noExistError;
    }
    await linebody_service.linebodyClear();
    return falg;
}

/*
	根据id更新车间数据
    */
exports.updateWorkshopById = function (req, res) {
    var workshop = {
        workshopname: req.body.name
        // ,
        //   weight:req.body.weight
    };
    var p = new Promise(function (resolve, reject) {
        //更新一条记录,创建成功后跳转回首页
        Workshop.update(workshop, {
            where: {
                workshopid: req.body.workshopId
            }
        }).then(function (data) {
            resolve(data);
        });
    });
    return p;
}

async function workshopClear() {
    const workshop = await Workshop.findAll({ where: { factoryFactoryid: null } });
    console.log(JSON.stringify(workshop.length));
    for (var i = workshop.length - 1; i >= 0; i--) {
        await workshop[i].destroy();
    }
}
exports.workshopClear = workshopClear;
/*
    工厂控制处理
    创建人：Three
    时间：2017/10/19
    */

//引入数据库Message模块
const Factory = require('../models/factory');
const services = require('../services/factory_service');
const nameEtdService = require('../services/factory_extend_service');
const workEtdService = require('../services/workshop_extend_service');
const workshopController = require('./workshop_controller');

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

var parameterError = {
    status: '1', 
    msg: '参数错误'
};
var namehasError = {
   status: '101', 
   msg: '工厂已存在'
}

/*
	展示所有工厂
    */
    exports.selectFactoryAll = function(req , res) {
        if (req == '') {
            res.end(JSON.stringify(parameterError));
            return;
        }
        services.selectFactoryAll(req , res).then(function(data){
        //console.log(data);
        if (data == '' || data == undefined || data == null) {
            dataSuccess.data = null;
            res.end(JSON.stringify(dataSuccess));
        }else{
            dataSuccess.data = data;
            res.end(JSON.stringify(dataSuccess));
        }
        
    });
    }

/*
	根据id查找一个工厂
    */
    exports.selectFactoryById = function(req , res) {
	//如果没有id或者id为空,直接返回
    if (req.body.factoryId == undefined || req.body.factoryId == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    services.selectFactoryById(req , res).then(function(data){
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
	添加一个工厂
    */
    exports.addFactoryOne = async function(req , res) {
      const data = await nameEtdService.selectFactoryByName(req , res)
      // 对工厂名字是否重复进行判断
      if(data == null||data == ''||data == undefined){
        //创建一条记录,创建成功后返回json数据
        const addData = await services.addFactoryOne(req , res)
        return addData;
    }
    return namehasError;
}
/*
	根据id删除工厂
    */
    exports.deleteFactoryById = async function(req , res) {
    //先查找,再调用删除,最后返回json数据
    const data = await services.deleteFactoryById(req , res)
    return data;
}

/*
	根据id更新工厂
    */
    exports.updateFactoryById = async function(req , res) {
    //更新一条记录,更新成功后跳转回首页
    const data = await nameEtdService.selectFactoryByName(req , res)
      // 对工厂名字是否重复进行判断
      if(data == null||data == ''||data == undefined){
        const data = await services.updateFactoryById(req , res)
        return data;
    }
    return namehasError;
}

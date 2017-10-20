/*
    工厂控制处理
    创建人：Three
    时间：2017/10/19
*/

//引入数据库Message模块
var Factory = require('../models/factory');
var service = require('../service/factory_service');
var nameEtdService = require('../service/factory_extend_service');
var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

var parameterError = {
    status: '1', 
    msg: '参数错误'
};

/*
	展示所有工厂
*/
exports.selectFactoryAll = function(req , res) {
    if (req == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
	service.selectFactoryAll(req , res).then(function(data){
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
        res.end(JOSN.stringify(parameterError));
        return;
    }
    service.selectFactoryById(req , res).then(function(data){
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
	添加一个工厂
*/
exports.addFactoryOne = function(req , res) {
	//如果没有post数据或者数据为空,直接返回
    if (req.body.factoryName == undefined ||req.body.factoryName == ''
        ||req.body.factoryBelong==undefined||req.body.factoryBelong== '') {
              res.end(JSON.stringify(parameterError));
        return;
    }
    nameEtdService.selectFactoryByName(req , res).then(
        function(data){
            // 对工厂名字是否重复进行判断
            if(data == null||data == ''||data == undefined){
                //创建一条记录,创建成功后返回json数据
                service.addFactoryOne(req , res).then(function(data){
                dataSuccess.data = data;
                res.end(JSON.stringify(dataSuccess));
                });
            }else{
                 var namehasError = {
                     status: '101', 
                     msg: '工厂已存在'
                };
                 res.end(JSON.stringify(namehasError));
                 return;
            }
       });
}

/*
	根据id删除工厂
*/
exports.deleteFactoryById = function(req , res) {
	//如果没有username字段,返回404
    if (req.query.factoryId == undefined ||req.query.factoryId == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    //先查找,再调用删除,最后返回json数据
    service.deleteFactoryById(req , res).then(function(data){
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
	根据id更新工厂
*/
exports.updateFactoryById = function(req , res) {
	//如果没有post数据或者数据为空,直接返回
    if (req.body.factoryId == undefined ||req.body.factoryId == ''
        ||req.body.factoryName == undefined ||req.body.factoryName == ''
        ||req.body.factoryBelong==undefined||req.body.factoryBelong== '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    //更新一条记录,更新成功后跳转回首页
    service.updateFactoryById(req , res).then(function(data){
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

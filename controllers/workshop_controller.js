/*
    车间控制处理
    创建人：Three
    时间：2017/10/19
*/

//引入数据库Message模块
var Workshop = require('../models/workshop');

var service = require('../services/workshop_service');
var nameEtdService = require('../services/workshop_extend_service');


var services = require('../services/workshop_service');
var nameEtdService = require('../services/workshop_extend_service');
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
	展示所有车间
*/
exports.selectWorkshopAll = function(req , res) {
    if (req == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
	services.selectWorkshopAll(req , res).then(function(data){
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
	根据id查找一个车间
*/
exports.selectWorkshopById = function(req , res) {
	//如果没有id或者id为空,直接返回
    if (req.body.workshopId == undefined || req.body.workshopId == '') {
        res.end(JOSN.stringify(parameterError));
        return;
    }
    services.selectWorkshopById(req , res).then(function(data){
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
	添加一个车间
*/
exports.addWorkshopOne = function(req , res) {
	//如果没有post数据或者数据为空,直接返回
    if (req.body.workshopName == undefined ||req.body.workshopName == ''
        ||req.body.workshopBelong==undefined||req.body.workshopBelong== '') {
              res.end(JSON.stringify(parameterError));
        return;
    }
    nameEtdService.selectWorkshopByName(req , res).then(
        function(data){
            // 对车间名字是否重复进行判断
            if(data == null||data == ''||data == undefined){
                //创建一条记录,创建成功后返回json数据
                services.addWorkshopOne(req , res).then(function(data){
                dataSuccess.data = data;
                res.end(JSON.stringify(dataSuccess));
                });
            }else{
                 var namehasError = {
                     status: '101', 
                     msg: '车间已存在'
                };
                 res.end(JSON.stringify(namehasError));
                 return;
            }
       });
}

/*
	根据id删除车间
*/
exports.deleteWorkshopById = function(req , res) {
	//如果没有id字段,返回404
    if (req.query.workshopId == undefined ||req.query.workshopId == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    //先查找,再调用删除,最后返回json数据
    services.deleteWorkshopById(req , res).then(function(data){
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
	根据id更新车间
*/
exports.updateWorkshopById = function(req , res) {
	//如果没有post数据或者数据为空,直接返回
    if (req.body.workshopId == undefined ||req.body.workshopId == ''
        ||req.body.workshopName == undefined ||req.body.workshopName == ''
        ||req.body.workshopBelong==undefined||req.body.workshopBelong== '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    //更新一条记录,更新成功后跳转回首页
    services.updateWorkshopById(req , res).then(function(data){
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
    集团控制处理
    创建人：THree
    时间：2017/10/18
*/

//引入数据库Message模块
var Group = require('../models/group');

var service = require('../services/group_service');
var nameEtdService = require('../services/group_extend_service');

var services = require('../services/group_service');
var nameEtdService = require('../services/group_extend_service');
var facServices = require('../services/factory_service');
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
msg: '集团已存在'
};



/* 
	展示所有集团
*/
exports.selectGroupAll = function(req , res) {
    if (req == '') {
        res.end(JOSN.stringify(parameterError));
        return;
    }
	services.selectGroupAll(req , res).then(function(data){
        //console.log(data);
        if (data == '' || data == undefined || data == null) {
            dataSuccess.data = null;
        }else{dataSuccess.data = data;}
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
	根据id查找一个集团
*/
exports.selectGroupById = function(req , res) {
	//如果没有id或者id为空,直接返回
    if (req.body.groupId == undefined || req.body.groupId == '') {
        res.end(JOSN.stringify(parameterError));
        return;
    }
    services.selectGroupById(req , res).then(function(data){
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
	添加一个集团
*/
exports.addGroupOne = function(req , res) {
	//如果没有post数据或者数据为空,直接返回
    if (req.body.groupName == undefined ||req.body.groupName == '') {
        res.end(JOSN.stringify(parameterError));
        return;
    }

    nameEtdService.selectGroupByName(req , res).then(
        function(data){
            // 对集团名字是否成功进行判断
            if(data == null||data == ''||data == undefined){
                //创建一条记录,创建成功后返回json数据
                services.addGroupOne(req , res).then(function(data){
                dataSuccess.data = data;
                res.end(JSON.stringify(dataSuccess));
                });
            }else{
                 var namehasError = {
                     status: '101', 
                     msg: '集团已存在'
                };
                 res.end(JSON.stringify(namehasError));
                 return;
            }
       });
     
}

/*
	根据id删除集团
*/
exports.deleteGroupById = function(req , res) {
	//如果没有username字段,返回404
    if (req.query.groupId == undefined ||req.query.groupId == '') {
        res.end(JOSN.stringify(parameterError));
        return;
    }
    //先查找,再调用删除,最后返回json数据
    services.deleteGroupById(req , res).then(function(data){
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
	根据id更新集团
*/
exports.updateGroupById = function(req , res) {
    //如果没有post数据或者数据为空,直接返回
    if (req.body.groupId == undefined ||req.body.groupId == ''
        ||req.body.groupName == undefined ||req.body.groupName == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    //更新一条记录,更新成功后跳转回首页
    services.updateGroupById(req , res).then(function(data){
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
    查询所有集团和工厂
*/
 


exports.selectAreaAll = function(req , res) {
    if (req == '') {
        res.end(JOSN.stringify(parameterError));
        return;
    }
    services.selectGroupAll(req , res).then(function(groupData){
        //把集团表通过一定格式展示出来
        var treeShowGroupData = [];
        groupData.forEach(function(groupDataOne) {

            var data1=groupValSet(groupDataOne);
            treeShowGroupData.push(data1);

  
       });

        //把工厂表通过一定格式展示出来
        facServices.selectFactoryAll(req , res).then(function(factoryData){

            var treeShowFacData = [];
            factoryData.forEach(function(factoryDataOne) {
            var data2=factoryValSet(factoryDataOne);
            treeShowFacData.push(data2);
            });  
            var contGFData = treeShowGroupData.concat(treeShowFacData);
            res.end(JSON.stringify(contGFData));
        });
    });  
}

var groupValSet =function(groupDataOne){
    var treeShow = {
      id:'fas',
      name:'fas',
      pId:0
    };
    treeShow.id= groupDataOne.groupid;
    treeShow.name= groupDataOne.groupname;
    return treeShow;
}
var factoryValSet =function(factoryDataOne){
    var treeShow = {
      id:'fas',
      name:'fas',
      pId:''
    };
    treeShow.id = factoryDataOne.id;
    treeShow.name = factoryDataOne.factoryname;
    treeShow.pId = factoryDataOne.factorybelong;
    return treeShow;
}
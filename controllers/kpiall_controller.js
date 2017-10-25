/*
    KPI控制处理
    创建人：THree
    时间：2017/10/18
*/

//引入数据库Message模块
var onelevServices = require('../services/kpionelev_service');
var twolevServices = require('../services/kpitwolev_service');

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
    查询所有KPI目录
*/
 
exports.selectKPIAll = function(req , res) {
    if (req == '') {
        res.end(JOSN.stringify(parameterError));
        return;
    }
    onelevServices.selectOneLevAll(req , res).then(function(oneLevData){
        console.log(twolevServices);
        //把一级目录和二级目录一起展示出来
        twolevServices.selectTwoLevAll(req , res).then(function(twoLevData){
            var contGFData = oneLevData.concat(twoLevData);
            res.end(JSON.stringify(contGFData));
        });
    });  
}

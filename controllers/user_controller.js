/*
 auther:Android,
 NOTE:用户表的controller层,
 time:20171019
 */

var service = require('../services/user_service');

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

var parameterError = {
    status: '1', 
    msg: '参数错误'
};

var loginError = {
    status:'2',
    msg:'用户名或密码验证失败'
};

var existError = {
    status:'3',
    msg:'用户名已存在！'
};

/*
	查找所有User
*/
exports.selectUserAll = function(req , res) {
    if (req == '' || req == undefined) {
        res.end(JSON.stringify(parameterError));
        return;
    }
	service.selectUserAll(req , res).then(function(data){
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
 	根据username查找一个User
*/
exports.selectUserByName = function(req , res) {
	if (req == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    
	//如果没有username或者username为空,直接返回
    if (req.body.userName == undefined || req.body.userName == '') {
        res.end(JOSN.stringify(parameterError));
        return;
    }
    service.selectUserByName(req , res).then(function(data){
        //console.log(data);
        if (data == null || data == '' || data == undefined) {
            res.end(JSON.stringify(parameterError));
        }else{
            dataSuccess.data = data;
            res.end(JSON.stringify(dataSuccess));
        }
    });
}

/*
 	根据userId查找一个User
*/
exports.selectUserById = function(req , res) {
	if (req == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
	//如果没有username或者username为空,直接返回
    if (req.body.userId == undefined || req.body.userId == '') {
        res.end(JOSN.stringify(parameterError));
        return;
    }
    service.selectUserById(req , res).then(function(data){
        //console.log(data);
        if (data == null || data == '' || data == undefined) {
            res.end(JSON.stringify(parameterError));
        }else{
            dataSuccess.data = data;
            res.end(JSON.stringify(dataSuccess));
        }
    });
}

/*
	添加一个User
*/
exports.addUserOne = function(req , res , next) {
	if (req == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
	//如果没有post数据或者数据为空,直接返回
    if (req.body.userName == undefined ||req.body.userName == ''
        || req.body.userPsd == undefined || req.body.userPsd == ''
        || req.body.userAbbName == undefined|| req.body.userJob == undefined
        || req.body.userLeader == undefined) {
        res.end(JSON.stringify(parameterError));
        return;
    }
    //创建一条记录,创建成功后返回json数据
    service.addUserOne(req , res).then(function(data){
        //dataSuccess.data = data;
        res.end(JSON.stringify(data));
    })
}

/*
	根据userId删除User
*/
exports.deleteUserById = function(req , res) {
	//如果没有username字段,返回404
    if (req.query.userId == undefined ||req.query.userId == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    //先查找,再调用删除,最后返回json数据
    service.deleteUserById(req , res).then(function(data){
        console.log(JSON.stringify(data));
        if (data == null || data == undefined || data == '') {
            res.end(JSON.stringify(parameterError));
        }else{
            //dataSuccess.data = data;
            res.end(JSON.stringify(data));
        }
    });
}

//根据userId跟新User
exports.updateUserById = function(req , res) {
	//如果没有post数据或者数据为空,直接返回
    if (req.body.userId == undefined ||req.body.userId == ''
        ||req.body.userName == undefined ||req.body.userName == ''
        || req.body.userPsd == undefined || req.body.userPsd == ''
        || req.body.userAbbName == undefined|| req.body.userJob == undefined
        || req.body.userLeader == undefined) {
        res.end(JSON.stringify(parameterError));
        return;
    }
    //创建一条记录,创建成功后跳转回首页
    service.updateUserById(req , res).then(function(data){
        //console.log(data);
        res.end(JSON.stringify(data));
    });
}
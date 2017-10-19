/*
 auther:Android,
 NOTE:用户表的service,
 time:20171019
 */

var User = require('../models/user');//引入数据库User模块

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

/*
	查找所有User
*/
exports.selectUserAll = function(req , res) {
    var p = new Promise(function(resolve, reject) {
        //console.log('yuzhizhe04->' + req);
        User.findAll().then(function(data) {
            resolve(data);
        });
    });
	return p;
}

/*
 	根据username查找一个User
*/
exports.selectUserByName = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        User.findOne({
            where:{
                username:req.body.userName
            }
        }).then(function(data){
            resolve(data);
        });
    });
    return p;
}

/*
    根据id查找一个User
*/
exports.selectUserById = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        User.findOne({
            where:{
                userid:req.body.userId
            }
        }).then(function(data){
            resolve(data);
        });
    });
    return p;
}

/*
	添加一个Administrator
*/
exports.addUserOne = function(req , res) {
    var user = {
        username: req.body.userName,
        userpsd: req.body.userPsd,
        userabbname:req.body.userAbbName,
        userjob:req.body.userJob,
        userleader:req.body.userLeader
    };
    var p = new Promise(function(resolve, reject) {
        //创建一条记录,创建成功后跳转回首页
        User.create(user).then(function(data){
            resolve(data);
        });
    });
    return p;
}

/*
	根据userId删除User
*/
exports.deleteUserById = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        //先查找,再调用删除,最后返回首页
        User.findOne({
            where:{
                userId:req.query.userId
            }
        }).then(function(msg){
            console.log('yuzhizhe->' + JSON.stringify(msg));
            if (msg == '' || msg == undefined) {
                console.log('yuzhizhe01');
                resolve(null);
            }else{
                console.log('yuzhizhe02');
                msg.destroy().then(function(data){
                    dataSuccess.data = data;
                    resolve(dataSuccess);
                });
            }
        });
    });
    return p;
}

//根据userId跟新User
exports.updateUserById = function(req , res) {
    var user = {
        username: req.body.userName,
        userpsd: req.body.userPsd,
        useraddname:req.body.userAddName,
        userjob:req.body.userJob,
        userleader:req.body.userLeader
    };
    var p = new Promise(function(resolve , reject) {
        //创建一条记录,创建成功后跳转回首页
        User.update(user,{
            where:{
                userId:req.body.userId
            }
        }).then(function(data){
            resolve(data);
        });
    });
    return p;
}
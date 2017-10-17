var Administrator = require('../models/administrator');//引入数据库Message模块
var dataSuccess = {
    status: '0', 
    msg: '请求成功'
};

var parameterError = {
    status: '1', 
    msg: '参数错误'
};

//查找所有Administrator
exports.selectList = function(req , res) {
    var p = new Promise(function(resolve, reject) {
        Administrator.findAll().then(function(msg) {
            resolve(msg);
        });
    });
	return p;
}

//根据username查找一个Administrator
exports.selectByUserName = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        Administrator.findOne({
            where:{
                username:req.query.username
            }
        }).then(function(data){
            resolve(data);
        });
    });
    return p;
}

//添加一个Administrator
exports.addOne = function(req , res) {
    var admin = {
        username: req.body.username,
        password: req.body.password
    };
    var p = new Promise(function(resolve, reject) {
        //创建一条记录,创建成功后跳转回首页
        Administrator.create(admin).then(function(msg){
            resolve(msg);
        });
    });
    return p;
}

//根据username删除Administrator
exports.deleteByUserName = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        //先查找,再调用删除,最后返回首页
        Administrator.findOne({
            where:{
                username:req.query.username
            }
        }).then(function(msg){
            msg.destroy().then(function(msg){
                resolve(msg);
            });
        });
    });
    return p;
}

//根据username跟新Administrator
exports.updateByUserName = function(req , res) {
    var admin = {
        username: req.body.username,
        password: req.body.password
    };
    var p = new Promise(function(resolve , reject) {
            //创建一条记录,创建成功后跳转回首页
        Administrator.update(admin,{
            where:{
                username:req.body.username
            }
        }).then(function(data){
            resolve(data);
        });
    });
    return p;
}
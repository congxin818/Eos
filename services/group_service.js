/*
	集团表的一些sql查找
	创建人：Three
	时间：2017/10/19
*/

//引入数据库Message模块
var Group = require('../models/group');

/*
	查找所有集团数据
*/
exports.selectGroupAll = function(req , res) {
    var p = new Promise(function(resolve, reject) {
        Group.findAll().then(function(data) {
            resolve(data);
        });
    });
	return p;
}
/*
	根据id查找一条集团数据
*/
exports.selectGroupById = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        Group.findOne({
            where:{
                groupid:req.body.groupId
            }
        }).then(function(data){
            resolve(data);
        });
    });
    return p;
}
/*
	添加一条集团数据
*/
exports.addGroupOne = function(req , res) {
    var group = {
        groupname: req.body.groupName
    };
    var p = new Promise(function(resolve, reject) {
        //创建一条记录,创建成功后跳转回首页
        Group.create(group).then(function(data){
            resolve(data);
        });
    });
    return p;
}

/*
	根据id删除一条集团数据
*/
exports.deleteGroupById = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        //先查找,再调用删除,最后返回首页
        Group.findOne({
            where:{
                groupid:req.query.groupId
            }
        }).then(function(data){
        	data.destroy().then(function(data){
            resolve(data);
            });     
        });
    });
    return p;
}

/*
	根据id更新集团数据
*/
exports.updateGroupById = function(req , res) {
	var group = {
		groupid: req.body.groupId,
        groupname: req.body.groupName
    };
    var p = new Promise(function(resolve , reject) {
        //更新一条记录,创建成功后跳转回首页
        Group.update(group,{
            where:{
                groupid:req.body.groupId
            }
        }).then(function(data){
            resolve(data);
        });
    });
    return p;
}

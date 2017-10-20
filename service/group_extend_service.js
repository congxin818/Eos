/*
	关于集团表的添加姓名不能重复的sql查找限制
	创建人：Three
	时间：2017/10/20
*/

//引入数据库Message模块
var Group = require('../models/group');

/*
	根据集团名字查找一条集团数据
*/
exports.selectGroupByName = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        Group.findOne({
            where:{
                groupname:req.body.groupName
            }
        }).then(function(data){
            resolve(data);
        });
    });
    return p;
}
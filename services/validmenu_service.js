/*
	有效菜单表的一些sql查找
	创建人：Three
	时间：2017/10/23
*/

//引入数据库Message模块
var Validmenu = require('../models/validmenu');

/*
	查找某个用户所有有效菜单数据，根据用户id
    用于init显示
*/
exports.selectValmeuAlByUId = function(req , res) {
    var p = new Promise(function(resolve, reject) {
        Validmenu.findAll({
            where:{
                userid:req.query.userId
            }
        }).then(function(data) {
            resolve(data);
        });
    });
	return p;
}

/*
	根据有效菜单id和用户id添加一条有效菜单数据
*/
exports.addValidmenuOne = function(req , res) {
    var validmenu = {
        validmenuname: req.body.validmenuName,
        userid: req.body.userId
    };
    var p = new Promise(function(resolve, reject) {
        //创建一条记录,创建成功后跳转回首页
        Validmenu.create(validmenu).then(function(data){
            resolve(data);
        });
    });
    return p;
}

/*
	根据有效菜单id删除一条有效菜单数据
*/
exports.deleteValidmenuById = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        //先查找,再调用删除,最后返回首页
        Validmenu.findOne({
            where:{
                validmenuid:req.query.validmenuId
            }
        }).then(function(data){
        	data.destroy().then(function(data){
            resolve(data);
            });     
        });
    });
    return p;
}

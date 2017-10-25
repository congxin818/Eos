/*
	kpi目录一级表的一些sql查找
	创建人：Three
	时间：2017/10/24
*/

//引入数据库Message模块
var Kpionelev = require('../models').Kpionelev;


/*
    显示一级目录
*/
exports.selectOneLevAll = function(req , res) {
    var p = new Promise(function(resolve, reject) {
        Kpionelev.findAll().then(function(data) {
            resolve(data);
        });
    });
    return p;
}

/*
	添加一条KPI一级目录数据
*/
exports.addOneLevOne = function(req , res) {
    var oneLev = {
        name: req.body.kpiOneLevName
    };
    var p = new Promise(function(resolve, reject) {
        //创建一条记录,创建成功后跳转回首页
        Kpionelev.create(oneLev).then(function(data){
            resolve(data);
        });
    });
    return p;
}

/*
	根据KPI一级目录id删除一条KPI一级目录数据
*/
exports.deleteOneLevById = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        //先查找,再调用删除,最后返回首页
        Kpionelev.findOne({
            where:{
                id:req.query.kpiOneLevId
            }
        }).then(function(data){
        	data.destroy().then(function(data){
            resolve(data);
            });     
        });
    });
    return p;
}

/*
	kpi目录二级表的一些sql查找
	创建人：Three
	时间：2017/10/24
*/

//引入数据库Message模块
var Kpitwolev = require('../models').Kpitwolev;


/*
    显示二级目录
*/
exports.selectTwoLevAll = function(req , res) {
    var p = new Promise(function(resolve, reject) {
        Kpitwolev.findAll().then(function(data) {
            resolve(data);
        });
    });
    return p;
}

/*
	添加一条KPI二级目录数据
*/
exports.addTwoLevOne = function(req , res) {
    var twoLev = {
        name: req.body.kpiTwoLevName
    };
    var p = new Promise(function(resolve, reject) {
        //创建一条记录,创建成功后跳转回首页
        Kpitwolev.create(twoLev).then(function(data){
            resolve(data);
        });
    });
    return p;
}

/*
	根据KPI二级目录id删除一条KPI二级目录数据
*/
exports.deleteTwoLevById = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        //先查找,再调用删除,最后返回首页
        Kpitwolev.findOne({
            where:{
                id:req.query.kpiTwoLevId
            }
        }).then(function(data){
        	data.destroy().then(function(data){
            resolve(data);
            });     
        });
    });
    return p;
}

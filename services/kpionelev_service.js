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
exports.selectOneLevAll = function (req, res) {
    var p = new Promise(function (resolve, reject) {
        Kpionelev.findAll().then(function (data) {
            resolve(data);
        });
    });
    return p;
}
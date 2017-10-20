/*
	关于线体表的添加姓名不能重复的sql查找限制
	创建人：Three
	时间：2017/10/20
*/

//引入数据库Message模块
var Linebody = require('../models/linebody');

/*
	根据线体名字查找一条线体数据
*/
exports.selectLinebodyByName = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        Linebody.findOne({
            where:{
                linebodyname:req.body.linebodyName,
                linebodybelong:req.body.linebodyBelong
            }
        }).then(function(data){
            resolve(data);
        });
    });
    return p;
}
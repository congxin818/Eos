/*
	线体表的一些sql查找
	创建人：Three
	时间：2017/10/19
    */

//引入数据库Message模块
var Linebody = require('../models').Linebody;

/*
	查找所有线体数据
    */
    exports.selectLinebodyAll = function(req , res) {
        var p = new Promise(function(resolve, reject) {
            Linebody.findAll().then(function(data) {
                resolve(data);
            });
        });
        return p;
    }
/*
	根据id查找一条线体数据
    */
    exports.selectLinebodyById = function(req , res) {
        var p = new Promise(function(resolve , reject) {
            Linebody.findOne({
                where:{
                    linebodyid:req.body.linebodyId
                }
            }).then(function(data){
                resolve(data);
            });
        });
        return p;
    }
/*
	添加一条线体数据
    */
    exports.addLinebodyOne = function(req , res) {
        var linebody = {
            linebodyname: req.body.linebodyName,
            linebodybelong: req.body.perId
        };
        var p = new Promise(function(resolve, reject) {
        //创建一条记录,创建成功后跳转回首页
        Linebody.create(linebody).then(function(data){
            resolve(data);
            var linebodyUpdate={id:'l'+ data.linebodyid};
            Linebody.update(linebodyUpdate,{where:{
                linebodyid:data.linebodyid
            }});
        });
    });
        return p;
    }

/*
	根据id删除一条线体数据
    */
    exports.deleteLinebodyById = function(req , res) {
        var p = new Promise(function(resolve , reject) {
        //先查找,再调用删除,最后返回首页
        Linebody.findOne({
            where:{
                linebodyid:req.query.linebodyId
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
	根据id更新线体数据
    */
    exports.updateLinebodyById = function(req , res) {
       var linebody = {
          linebodyid: req.body.linebodyId,
          linebodyname: req.body.linebodyName,
          linebodybelong:req.body.linebodyBelong
      };
      var p = new Promise(function(resolve , reject) {
        //更新一条记录,创建成功后跳转回首页
        Linebody.update(linebody,{
            where:{
                linebodyid:req.body.linebodyId
            }
        }).then(function(data){
            resolve(data);
        });
    });
      return p;
  }

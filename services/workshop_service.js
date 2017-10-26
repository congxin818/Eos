/*
	车间表的一些sql查找
	创建人：Three
	时间：2017/10/19
    */

//引入数据库Message模块
var Workshop = require('../models').Workshop;

/*
	查找所有车间数据
    */
    exports.selectWorkshopAll = function(req , res) {
        var p = new Promise(function(resolve, reject) {
            Workshop.findAll().then(function(data) {
                resolve(data);
            });
        });
        return p;
    }
/*
	根据id查找一条车间数据
    */
    exports.selectWorkshopById = function(req , res) {
        var p = new Promise(function(resolve , reject) {
            Workshop.findOne({
                where:{
                    workshopid:req.body.workshopId
                }
            }).then(function(data){
                resolve(data);
            });
        });
        return p;
    }
/*
	添加一条车间数据
    */
    exports.addWorkshopOne = function(req , res) {
        var workshop = {
            workshopname: req.body.name,
            workshopbelong: req.body.pId
        };
        var p = new Promise(function(resolve, reject) {
        //创建一条记录,创建成功后跳转回首页
        Workshop.create(workshop).then(function(data){
            resolve(data);
        });
    });
        return p;
    }

/*
	根据id删除一条车间数据
    */
    exports.deleteWorkshopById = function(req , res) {
        var p = new Promise(function(resolve , reject) {
        //先查找,再调用删除,最后返回首页
        Workshop.findOne({
            where:{
                workshopid:req.query.workshopId
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
	根据id更新车间数据
    */
    exports.updateWorkshopById = function(req , res) {
       var workshop = {
          workshopname: req.body.name
      };
      var p = new Promise(function(resolve , reject) {
        //更新一条记录,创建成功后跳转回首页
        Workshop.update(workshop,{
            where:{
                workshopid:req.body.workshopId
            }
        }).then(function(data){
            resolve(data);
        });
    });
      return p;
  }

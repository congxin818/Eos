/*
	关于工厂表的添加姓名不能重复的sql查找限制
	创建人：Three
	时间：2017/10/20
    */

//引入数据库Message模块
var Factory = require('../models').Factory;

/*
	根据工厂名字查找一条工厂数据
    */
    exports.selectFactoryByName = function(req , res) {
        var p = new Promise(function(resolve , reject) {
            Factory.findOne({
                where:{
                    factoryname:req.body.name
                }
            }).then(function(data){
                resolve(data);
            });
        });
        return p;
    }

/*
    根据pId查找一条工厂数据
    */
    exports.selectFactoryBypId = async function(req , res) {
      const data= await  Factory.findAll({
        where:{
            factorybelong:req.body.pId
        }
    })
      return data;
  }
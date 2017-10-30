/*
	线体表的一些sql查找
	创建人：Three
	时间：2017/10/19
    */

//引入数据库Message模块
var Linebody = require('../models').Linebody;
var errorUtil = require('../utils/errorUtil');
var factory_service = require('../services/factory_service');
var workshop_service = require('../services/workshop_service');
var linebody_service = require('../services/linebody_service');
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
            linebodyname: req.body.name,
            linebodybelong: req.body.pId
        };
        var p = new Promise(function(resolve, reject) {
        //创建一条记录,创建成功后跳转回首页
        Linebody.create(linebody).then(function(data){
            resolve(data);
        });
    });
        return p;
    }

/*
	根据id删除一条线体数据
    */
    exports.deleteLinebodyById = async function(req , res) {
        const Linebody  = await Linebody.findById(req.query.linebodyId);
        console.log('Linebody--->'+ JSON.stringify(Linebody));
        if (Linebody == null || Linebody == '') {
            return errorUtil.noExistError;
        }
        const falg = await Linebody.destroy();
        console.log('falg--->' + JSON.stringify(falg));
        if (falg == null || falg == '') {
            return errorUtil.noExistError;
        }
        return falg;
    }

/*
	根据id更新线体数据
    */
    exports.updateLinebodyById = function(req , res) {
       var linebody = {
          linebodyname: req.body.name
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

async function  linebodyClear(){
    const linebody = await Linebody.findAll({where:{ workshopWorkshopid:null}});
    console.log(JSON.stringify(linebody.length));
    for (var i = linebody.length - 1; i >= 0; i--) {
        await linebody[i].destroy();
    }
}
exports.linebodyClear = linebodyClear;
/*
	线体表的一些sql查找
	创建人：Three
	时间：2017/10/19
    */

//引入数据库Message模块
const Linebody = require('../models').Linebody;
const Workshop = require('../models').Workshop;
const errorUtil = require('../utils/errorUtil');

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
    exports.addLinebodyOne = async function(req , res) {
        var linebody = {
            linebodyname: req.body.name,
            linebodybelong: req.body.pId,
            targetvalue: req.body.targetValue,
            targetstrattime: req.body.targetStrattime,
            targetendtime: req.body.targetEndtime,
            visionvalue: req.body.visionValue,
            visionstrattime:req.body.visionStrattime,
            visionendtime: req.body.visionEndtime,
            idealvalue: req.body.idealValue,
            idealstrattime: req.body.idealStrattime,
            idealendtime: req.body.idealEndtime
        };
        var workshopId = req.body.pId.slice(1,);
        const workshop = await Workshop.findById(workshopId);
        if (workshop == null || workshop == '') {
            return ;
        }
        //创建一条记录,创建成功后跳转回首页
        const data = await Linebody.create(linebody)
        await workshop.addWorkshopLinebody(data);
        return data;
    }

/*
	根据id删除一条线体数据
    */
    exports.deleteLinebodyById = async function(req , res) {
        const linebody  = await Linebody.findById(req.query.linebodyId);

        if (linebody == null || linebody == '') {
            return errorUtil.noExistError;
        }
        const falg = await linebody.destroy();
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

/*
    根据id更新线体详细数据
    */
    exports.updateLinebodyInfById = async function(req , res) {
        // string 转化为Data格式
        
        const targetStrattime = new Date(req.body.targetStrattime)
        const targetEndtime = new Date(req.body.targetEndtime)
        const visionStrattime = new Date(req.body.visionStrattime)
        const visionEndtime = new Date(req.body.visionEndtime)
        const idealStrattime = new Date(req.body.idealStrattime)
        const idealEndtime = new Date(req.body.idealEndtime)

        var linebody = {
            targetvalue: req.body.targetValue,
            targetstrattime: targetStrattime,
            targetendtime: targetEndtime,
            visionvalue: req.body.visionValue,
            visionstrattime: visionStrattime,
            visionendtime: visionEndtime,
            idealvalue: req.body.idealValue,
            idealstrattime: idealStrattime,
            idealendtime: idealEndtime
      }
        //更新一条记录,创建成功后跳转回首页
        const data = await Linebody.update(linebody,{
            where:{
                linebodyid:req.body.linebodyId
            }
        })
        return data;
    }

    async function  linebodyClear(){
        const linebody = await Linebody.findAll({where:{ workshopWorkshopid:null}});
        console.log(JSON.stringify(linebody.length));
        for (var i = linebody.length - 1; i >= 0; i--) {
            await linebody[i].destroy();
        }
    }
    exports.linebodyClear = linebodyClear;
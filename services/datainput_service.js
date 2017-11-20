/*
	集团表的一些sql查找
	创建人：Three
	时间：2017/10/19
    */

//引入数据库Message模块
const Kpitwolev = require('../models').Kpitwolev;
const Losstier3 = require('../models').Losstier3;
const Losstier4 = require('../models').Losstier4;
const Linebody = require('../models').Linebody;
const lossServices = require('../services/losstier3_service');
const sequelize = require('../mysql').sequelize();


const LinebodyLosstier4 = require('../models').LinebodyLosstier4;
/*
	根据二级目录名字创建一条二级目录数据
    */
    exports.addKpitwolevByname = async function(req) {
        const kpitwolevdata = {
            classstarttime: req.body.classStarttime,
            classendtime: req.body.classEndtime
        }
        const kpitwolev = await Kpitwolev.findOne({where:{name:req.body.twolevName}})
        const linebody = await Linebody.findById(req.body.linebodyId)
       // await linebody.addLinebodyKpitwolev(kpitwolev)
        await linebody.addLinebodyKpitwolev (kpitwolev,{through:kpitwolevdata});
        return
    }
/*
    根据二级目录名字找到对应二级目录
    */
    exports.selectTwoLevByName = async function(twolevName) {
        const kpitwolevdata = await Kpitwolev.findOne({where:{name:twolevName}})
        return kpitwolevdata;
    }
/*
    根据二级目录id找到对应三级目录结构
    */
    exports.selectLosstier3BytwoId = async function(twolevid) {
        const losstier3data = await Losstier3.findAll({'attributes': ['name'],where:{kpitwolevKpitwoid:twolevid}})
        return losstier3data;
    }
    /*
    根据三级目录名字找到对应三级目录
    */
    exports.selectLosstier3ByName = async function(tier3Name) {
        const losstier3data = await Losstier3.findOne({where:{name:tier3Name}})
        return losstier3data;
    }
/*
    根据三级目录id找到对应四级目录结构
    */
    exports.selectLosstier4Bytier3Id = async function(tier3id) {
        const losstier4data = await Losstier4.findAll({'attributes': ['name'],where:{losstier3Lossid:tier3id}})
        return losstier4data;
    }

/*
    根据四级目录名字找到对应四级目录结构
    */
    exports.selectLosstier4Bytier4name = async function(tier4Name) {
        const losstier4data = await Losstier4.findAll({where:{name:tier4Name}})
        return losstier4data;
    }
/*
    根据四级目录名字和时间创建一条四级目录数据
    */
    exports.addLosstier4data = async function(req,losstier4) {
  
        var losstier4data = {
            starttime: req.body.starttime,
            endtime: req.body.endtime
        }
       
        const linebody = await Linebody.findById(req.body.linebodyId)
        const addReturn = await linebody.addLinebodyLosstier4(losstier4,{through:losstier4data});
        return addReturn
    }

/*
    根据四级目录名字和时间创建一条四级目录数据
    */
    exports.add2=  async function() {
         const data = await LinebodyLosstier4.findById('29')
          console.log( '2----->'+data.starttime)
         return data
    }
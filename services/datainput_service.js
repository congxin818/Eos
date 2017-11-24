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
const sequelize = require('../mysql').sequelize();
const LinebodyKpitwolev = require('../models').LinebodyKpitwolev;
const LinebodyLosstier3 = require('../models').LinebodyLosstier3;
const LinebodyLosstier4 = require('../models').LinebodyLosstier4;
/*
	根据二级目录名字创建一条二级目录数据
    */
    exports.addKpitwolevByname = async function(req) {

        const classStarttime = new Date(req.body.classStarttime)
        const classEndtime = new Date(req.body.classEndtime)
        const kpitwolevdata = {
            classstarttime: classStarttime,
            classendtime: classEndtime
        }
        const kpitwolev = await Kpitwolev.findOne({where:{name:req.body.twolevName}})
        const linebody = await Linebody.findById(req.body.linebodyId)
       // await linebody.addLinebodyKpitwolev(kpitwolev)
       // 添加数据
       var linebodyKpitwolev =  await kpitwolev.createLinebodyKpitwolev(kpitwolevdata)
       await linebody.addLinebodyKpitwolev(linebodyKpitwolev)
       return linebodyKpitwolev
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
        const losstier3data = await Losstier3.findAll({'attributes': ['lossid','name'],where:{kpitwolevKpitwoid:twolevid}})
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
        const losstier4data = await Losstier4.findAll({'attributes': ['id','name'],where:{losstier3Lossid:tier3id}})
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
    根据二级loss数据创建一条三级loss数据
    */
    exports.addLosstier3data = async function(twolevDataid,losstier3Id,linebodyId) {

        var losstier3data = {}
        const twolevData = await LinebodyKpitwolev.findById(twolevDataid)
        const losstier3 = await Losstier3.findById(losstier3Id)
        const linebody = await Linebody.findById(linebodyId)
        losstier3data =  await losstier3.createLinebodyLosstier3(losstier3data)
        await twolevData.addKpitwolevLosstier3Data(losstier3data)
        await linebody.addLinebodyLosstier3(losstier3data)
        return losstier3data
    }
    /*
    根据三级loss数据创建一条四级loss数据
    */
    exports.addLosstier4data = async function(losstier3Dataid,losstier4Id,linebodyId) {

        var losstier4data = {}
        const losstier3Data = await LinebodyLosstier3.findById(losstier3Dataid)
        const losstier4 = await Losstier4.findById(losstier4Id)
        const linebody = await Linebody.findById(linebodyId)
        losstier4data =  await losstier4.createLinebodyLosstier4(losstier4data)
        await losstier3Data.addLosstier3Losstier4Data(losstier4data)
        await linebody.addLinebodyLosstier4(losstier4data)
        return losstier4data
    }
/*
    添加四级loss数据的开始时间和结束时间
    */
    exports.addLosstier4datatime = async function(req , res) {
      const starttime = new Date(req.body.starttime)
      const endtime = new Date(req.body.endtime)
      var losstier4data = {
        starttime: starttime,
        endtime: endtime
    }
    const addReturn = await LinebodyLosstier4.update(losstier4data,{where:{id:req.body.losstier4Dataid}});

    exports.addLosstier4datavalue(starttime , endtime ,req.body.losstier4Dataid)

    return addReturn
}
/*
    添加四级数据value值
    */
    exports.addLosstier4datavalue = async function(starttime , endtime ,losstier4Dataid) {
        // 持续时间（毫秒）
        const duration = endtime.getTime() - starttime.getTime()
        // 找到开班时间（毫秒）
        const losstier4Data =  await LinebodyLosstier4.findById(losstier4Dataid)
        const losstier3Data = await LinebodyLosstier3.findById(losstier4Data.linebodylosstier3Id)
        const kpitwolevData = await LinebodyKpitwolev.findById(losstier3Data.linebodyKpitwolevId)
        const classstarttime = kpitwolevData.classstarttime
        const classendtime = kpitwolevData.classendtime
        console.log('-------------' + classstarttime)
        const classDuration = classendtime.getTime() - classstarttime.getTime() 
        const tier4value = (duration/classDuration).toFixed(4)
        console.log('3------------->' + tier4value)
        var losstier4data = {value: tier4value}
        await LinebodyLosstier4.update(losstier4data,{where:{id:losstier4Dataid}})
    }
    /*
        根据四级数据id查到这个四级数据
    */
 exports.selectLosstier4DataByid = async function(losstier4Dataid) {
    return LinebodyLosstier4.findById(losstier4Dataid)
 }
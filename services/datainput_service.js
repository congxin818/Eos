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
const UserKpitwolev = require('../models').UserKpitwolev;

/*
    根据用户设置的顺序查找二级结构
    */
    exports.selectKpitwolevidByuser = async function(userId) {      
        return await UserKpitwolev.findAll({attributes: ['kpitwolevKpitwoid'],
           where:{userUserid: userId},order: [['sequence','ASC']]})
    }

/*
    二级loss结构id找到二级目录的名字
    */
    exports.selectKpitwolevNameByid = async function(kpitwoid) {
        return await Kpitwolev.findById(kpitwoid)
    }

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
        const losstier4data = await Losstier4.findAll({'attributes': ['tier4id','name','losstier3Lossid'],where:{losstier3Lossid:tier3id}})
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

    await exports.addLosstier4datavalue(starttime , endtime ,req.body.losstier4Dataid)
    await exports.addLosstier3datavalue(req.body.losstier4Dataid)
    await exports.addLosstier2datavalue(req.body.losstier4Dataid)

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
        const classDuration = classendtime.getTime() - classstarttime.getTime()
        const tier4value = (duration/classDuration).toFixed(4)
        var losstier4data = {value: tier4value}
        await LinebodyLosstier4.update(losstier4data,{where:{id:losstier4Dataid}})
    }
/*
    根据四级数据id查到这个四级数据
    */
    exports.selectLosstier4DataByid = async function(losstier4Dataid) {
        return LinebodyLosstier4.findById(losstier4Dataid)
    }
/*
    添加三级数据value值
    */
    exports.addLosstier3datavalue = async function(losstier4Dataid) {
        //把这个四级value的值加到对应的三级目录上
        const losstier4Data =  await LinebodyLosstier4.findById(losstier4Dataid)
        const losstier3Data = await LinebodyLosstier3.findById(losstier4Data.linebodylosstier3Id)
        losstier3DataValue = losstier3Data.value + losstier4Data.value
        var losstier3data = {value: losstier3DataValue}
        await LinebodyLosstier3.update(losstier3data,{where:{id:losstier4Data.linebodylosstier3Id}})
    }

/*
    添加二级数据value值
    */
    exports.addLosstier2datavalue = async function(losstier4Dataid) {
        //把这个三级value的值加到对应的三级目录上
        const losstier4Data =  await LinebodyLosstier4.findById(losstier4Dataid)
        const losstier3Data = await LinebodyLosstier3.findById(losstier4Data.linebodylosstier3Id)
        const kpitwolevData = await LinebodyKpitwolev.findById(losstier3Data.linebodyKpitwolevId)
        kpitwolevDataValue = kpitwolevData.value + losstier3Data.value
        var kpitwolevdata = {value: kpitwolevDataValue}
        await LinebodyKpitwolev.update(kpitwolevdata,{where:{id:kpitwolevData.id}})
    }

/*
    验证添加的这个二级loss数据是否重复
    */
    exports.selectKpitwolevDataBy = async function(req , res) {
        const kpitwolev = await Kpitwolev.findOne({where:{name:req.body.twolevName}})
        return await LinebodyKpitwolev.findOne({where:{
            classstarttime: req.body.classStarttime,
            classendtime: req.body.classEndtime,
            linebodyLinebodyid: req.body.linebodyId,
            kpitwolevKpitwoid: kpitwolev.kpitwoid
        }})
    }

/*
    验证添加的这个四级loss数据是否重复
    */
    exports.selectLosstier3By = async function(twolevDataid,losstier3Id,linebodyId) {
        return await LinebodyLosstier3.findOne({where:{
            linebodyLinebodyid: linebodyId,
            losstier3Lossid: losstier3Id,
            linebodyKpitwolevId: twolevDataid
        }})
    }
/*
    验证添加的这个四级loss数据是否重复
    */
    exports.selectLosstier4DataBy = async function(req , res) {
        return await LinebodyLosstier4.findOne({where:{
            starttime: req.body.starttime,
            endtime: req.body.endtime,
            linebodyLinebodyid: req.body.linebodyId,
            losstier4Tier4id: req.body.losstier4Id,
            linebodylosstier3Id: req.body.losstier3Dataid
        }})
    }
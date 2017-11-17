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
        const losstier3data = await Losstier3.findOne({'attributes': ['name'],where:{kpitwolevKpitwoid:twolevid}})
        return losstier3data;
    }

/*
    根据三级目录id找到对应四级目录结构
    */
    exports.selectLosstier4Byloss4Id = async function(loss3id) {
        const losstier4data = await Losstier4.findOne({'attributes': ['name'],where:{losstier3Lossid:loss3id}})
        return losstier4data;
    }
/*
    把二级目录对应的loss三级目录按value查找出来
    */
    exports.selectLossByKpitwo = async function(linebodyid,kpitwoid) {
        linebody = await Linebody.findOne({ where:{linebodyid:linebodyid }})

        let  tier3 = await linebody.getLinebodyLosstier3({'attributes': ['name', 'lossid']});
        tier3.sort ((a, b) => {return a.linebodylosstier3.value - b.linebodylosstier3.value});
        return tier3;
    }

 /*
    根据lossid把该项目添加到现进行项目
    */
    exports.addObjectnowBylossid = async function(lossid) {
        const linebodyLosstier3={
            addobjectnow: true
        }
        const data = await LinebodyLosstier3.update(linebodyLosstier3,{where:{losstier3Lossid: lossid}});
        return data;
    }

    /*
    根据lossid把该项目添加到现进行项目
    */
    exports.deleteObjectnowBylossid = async function(lossid) {
        const losstier3={
            addobjectnow: false
        }
        const data = await LinebodyLosstier3.update(losstier3,{where:{losstier3Lossid: lossid}});
        return data;
    }

/*
	集团表的一些sql查找
	创建人：Three
	时间：2017/10/19
    */

//引入数据库Message模块
const Kpitwolev = require('../models').Kpitwolev;
const Losstier3 = require('../models').Losstier3;
const LinebodyLosstier3 = require('../models').LinebodyLosstier3;
const Linebody = require('../models').Linebody;
const lossServices = require('../services/losstier3_service');
const sequelize = require('../mysql').sequelize();

/*
	根据线体id把loss二级查找出来
    */
    exports.selectKpitwoBylinebyid = async function(req , res) {
        const data = await Kpitwolev.findAll();
        return data;
    }
    /*
    根据二级lossid把添加到现进行项目中的loss查找出来
    */
    exports.selectObjectnowBytwolevid = async function(linebodyid,twolevid) {
        /*linebody = await Linebody.findOne({ where:{linebodyid:linebodyid }})
        tier3 = await linebody.getLinebodyLosstier3({'attributes': ['name', 'lossid'],
         where:{kpitwolevKpitwoid:twolevid}})*/

        result = await sequelize.query(
            'SELECT losstier3.name, losstier3.lossid,linebodylosstier3.addobjectnow FROM losstier3s AS losstier3 INNER JOIN linebodylosstier3s AS linebodylosstier3 ON losstier3.lossid = linebodylosstier3.losstier3Lossid AND linebodylosstier3.linebodyLinebodyid = :linebodyLinebodyid WHERE (losstier3.kpitwolevKpitwoid = :kpitwolevKpitwoid AND linebodylosstier3.addobjectnow = :addobjectnow);',
            { replacements: { linebodyLinebodyid: linebodyid, kpitwolevKpitwoid:twolevid,addobjectnow:true }, type: sequelize.QueryTypes.SELECT }
            );
        return result;
    }
/*
    把二级目录对应的loss三级目录按value查找出来
    */
    exports.selectLossByKpitwo = async function(linebodyid,kpitwoid) {
        linebody = await Linebody.findOne({ where:{linebodyid:linebodyid }})

        let  tier3 = await linebody.getLinebodyLosstier3({'attributes': ['name', 'lossid'],where:{kpitwolevKpitwoid:kpitwoid}});
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

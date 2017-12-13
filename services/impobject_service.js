/*
	集团表的一些sql查找
	创建人：Three
	时间：2017/10/19
    */

//引入数据库Message模块
const sequelize = require('../mysql').sequelize();
const Kpitwolev = require('../models').Kpitwolev;
const Losstier3 = require('../models').Losstier3;
const Linebody = require('../models').Linebody;
const Lossstatus = require('../models').Lossstatus;
const errorUtil = require('../utils/errorUtil');
const UserKpitwolev = require('../models').UserKpitwolev;
const Lossstatuslog = require('../models').Lossstatuslog;
const moment = require('moment');


/*
    根据用户设置的顺序查找二级结构
    */
    exports.selectKpitwolevidByuser = async function(userId) {      
        return  await UserKpitwolev.findAll({attributes: ['kpitwolevKpitwoid'],
         where:{userUserid: userId},order: [['sequence','ASC']]})
    }

/*
    二级loss结构id找到二级目录的名字
    */
    exports.selectKpitwolevNameByid = async function(kpitwoid) {
        return await Kpitwolev.findById(kpitwoid)
    }
    
/*
	把loss二级结构查找出来
    */
    exports.selectKpitwoAll = async function() {
        const data = await Kpitwolev.findAll();
        return data;
    }

/*
    根据loss二级查询loss三级结构名字
    */
    exports.selectLosstier3Bytwoid = async function (twoid){
        const losstier3 = await Losstier3.findAll({'attributes': ['name','lossid'],
            where:{kpitwolevKpitwoid:twoid}})
        return losstier3
    }
    /*
    根据二级lossid把添加到现进行项目中的loss查找出来
    */
    exports.selectObjectnowBytwolevid = async function(linebodyid,twolevid) {
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
    根据lossid增加一条lossstatus数据
    */
    exports.addObjectnowBylossid = async function(linebodyid,lossid) {

        const linebody = await Linebody.findById(linebodyid)
        const losstier3 = await Losstier3.findById(lossid)
        const nowtime = moment().format('YYYY-MM-DD')
        const concatname = linebody.linebodyname + losstier3.name + nowtime
        const lostatusdata={
            projectname: concatname,
            losscategory: losstier3.name,
            status : 1
        }
        // 验证数据是否已经存在
        const data = await Lossstatus.findOne({where:{linebodyLinebodyid:linebodyid,losstier3Lossid:lossid}})
        if(data!=null){
            return errorUtil.existError;
        }
        // 添加数据
        var lossstatus =  await losstier3.createLossstatus(lostatusdata)
        addReturn = await linebody.addLinebodyLossstatus(lossstatus)
        return addReturn
    }

/*
    对项目状态log表进行增加
    */
    exports.addLostatuslog = async function (req , res,beforStatus,beforStage){
        var lossstatuslog = {
            projectnumber:req.body.projectnumber,
            projectname:req.body.projectname,
            losscategory:req.body.losscategory,
            beforstatus:beforStatus,
            status:req.body.status,
            startperformance :req.body.startperformance,
            target:req.body.target,
            performance :req.body.performance,
            objectstarttime:req.body.objectstarttime,
            planendtime:req.body.planendtime,
            beforstage:beforStage,
            stage:req.body.stage
        }
        const linebody = await Linebody.findById(req.body.linebodyId)
        lossstatuslog =  await linebody.createLinebodyLossstatuslog(lossstatuslog)
        return lossstatuslog
    }

/*
    improvment展示历史信息 查找log表
    */
    exports.showImpItemhistory = async function(linebodyId) {      
        return  await Lossstatuslog.findAll({attributes: ['beforstatus','status','beforstage','stage','createdAt'],
         where:{linebodyLinebodyid: linebodyId}})
    }

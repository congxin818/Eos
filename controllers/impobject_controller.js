/*
    改进方案处理
    创建人：THree
    时间：2017/11/3
    */

//引入数据库Message模块
const twolevServices = require('../services/kpitwolev_service');
const lossstatusServices = require('../services/lossstatus_service');
const impobjServices = require('../services/impobject_service');
const Kpitwolev = require('../models').Kpitwolev;
const Losstier3 = require('../models').Losstier3;

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

const parameterError = {
    status: '1', 
    msg: '参数错误'
};

const addObjectError = {
    status: '201', 
    msg: '添加失败'
};

const kpiTwoShow = {
    id: 'fas', 
    name: 'fas',
    pId:'fas'
};

/*
    improvment展示项目池信息
    */ 
    exports.showImpItempool = async function(req , res) {
        if(req.body.linebodyId == null||req.body.linebodyId == ''){
           res.end(JSON.stringify(parameterError))
       }
        // 根据线体id把loss二级目录id查找出来
        const kpitwolev = await impobjServices.selectKpitwoAll(req.body.linebodyId);
        var showNameList =[];
        var losstier3NameList = [];
        for(var i = 0;i < kpitwolev.length; i++){
            var itempoolOutput = { 
                name:'',
                data:''
            }
            itempoolOutput.name = kpitwolev[i].name
            // 把loss三级目录名字查找出来
            losstier3NameList = await impobjServices.selectLosstier3Bytwoid(kpitwolev[i].kpitwoid)
            itempoolOutput.data =  losstier3NameList
            await showNameList.push(itempoolOutput)
        }
        res.end(JSON.stringify(showNameList))     
    }
/*
    improvment编辑项目状态
    */
    exports.updateImpItemstatus = async function(req , res) {
        if(req.body.lossId == null||req.body.lossId == ''){
            res.end(JSON.stringify(parameterError))
        }
        const updateData = await lossstatusServices.updateLostatusById(req , res)
        if(updateData.length == 1){
            res.end(JSON.stringify(dataSuccess))
        }else{
            res.end(JSON.stringify(updateError))
        }     
    }

/*
    improvment展示项目状态
    */
    exports.showImpItemstatus = async function(req , res) {
        if(req.body.lossId == null||req.body.lossId == ''||
            req.body.linebodyId == null||req.body.linebodyId == ''){
            res.end(JSON.stringify(parameterError))
        }
        const data = await lossstatusServices.selectLostatusById(req.body.lossId,req.body.linebodyId)
        dataSuccess.data = data 
        res.end(JSON.stringify(dataSuccess))
    }


/*
    根据线体id展示现进行项目
    */
    exports.showObjectnowBylinedyid = async function(req , res) {
        if(req.body.linebodyId == null||req.body.linebodyId == ''){
           res.end(JSON.stringify(parameterError))
       }
       // 根据线体id把loss二级目录查找出来
       /* const KpitwolevList = await impobjServices.selectKpitwoBylinebyid(req , res);
        var losstier3List = [];
         for(var i = 0;i < KpitwolevList.length; i++){
            // 把对应的loss三级查找出来
            data = await impobjServices.selectObjectnowBytwolevid(req.body.linebodyId,
                KpitwolevList[i].kpitwoid);
            if(data.length > 0){
                losstier3List = data.concat(losstier3List)
            }
        }
       res.end(JSON.stringify(losstier3List))
       */
       // 根据线体id把loss状态表中所有项目名字查找出来
        const lostatusNameList = await lossstatusServices.selectLostatusBylineid(req.body.linebodyId)
        dataSuccess.data = lostatusNameList
        res.end(JSON.stringify(dataSuccess)) 
   }

/*
    根据loss id增加现进行项目
    */
    exports.addObjectnowBylossid = async function(req , res) {
        if(req.body.lossIdList == null||req.body.lossIdList.length == 0
            ||req.body.lossIdList == ''||req.body.linebodyId == null
            ||req.body.linebodyId == ''){
           res.end(JSON.stringify(parameterError))
       }
       var lossIdList = req.body.lossIdList.split(",")
       for(var i=0;i<lossIdList.length;i++){
        const lossidList = await impobjServices.addObjectnowBylossid(req.body.linebodyId,lossIdList[i])
        if(lossidList == null||lossidList == ''){
            res.end(JSON.stringify(addObjectError))
        }
       }
       res.end(JSON.stringify(dataSuccess))
   }

/*
    根据线体id删除现进行项目
    */
    exports.deleteObjectnowBylossid = async function(req , res) {
        if(req.body.lossId == null||req.body.lossId == ''){
           res.end(JSON.stringify(parameterError))
       }
       const lossidList = await impobjServices.deleteObjectnowBylossid(req.body.lossId)
       res.end(JSON.stringify(dataSuccess))
   }

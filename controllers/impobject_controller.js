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
const Losscategory = require('../models').Losscategory;

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
        // 根据线体id把loss二级目录名字查找出来
        const KpitwolevList = await impobjServices.selectKpitwoBylinebyid(req , res);
        var showNameList =[];
        var LosscategoryNameList = [];
        for(var i = 0;i < KpitwolevList.length; i++){
            var itempoolOutput = { 
                name:'',
                data:''
            }
            itempoolOutput.name = KpitwolevList[i].name
            // 把loss三级目录名字查找出来
            LosscategoryNameList = await impobjServices.selectLossByKpitwo(KpitwolevList[i]);
            itempoolOutput.data =  LosscategoryNameList
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
        if(req.body.lossId == null||req.body.lossId == ''){
            res.end(JSON.stringify(parameterError))
        }
        const data = await lossstatusServices.selectLostatusById(req.body.lossId)
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
       const lossidList = await impobjServices.selectObjectnowBylinebyid(req.body.linebodyId)
       res.end(JSON.stringify(lossidList))
   }

/*
    根据loss id增加现进行项目
    */
    exports.addObjectnowBylossid = async function(req , res) {
        if(req.body.lossIdList.length == 0){
           res.end(JSON.stringify(parameterError))
       }
       var lossIdList = req.body.lossIdList.split(",")
       for(var i=0;i<lossIdList.length;i++){
        const lossidList = await impobjServices.addObjectnowBylossid(lossIdList[i])
        if(lossidList != 1 ){
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

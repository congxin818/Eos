/*
    数据输入处理
    创建人：THree
    时间：2017/11/15
    */

//引入数据库Message模块
const twolevServices = require('../services/kpitwolev_service');
const lossstatusServices = require('../services/lossstatus_service');
const datainputServices = require('../services/datainput_service');
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
    添加本班次时间
    */ 
    exports.addClasstime = async function(req , res) {
        if(req.body.classStarttime == null||req.body.classStarttime == ''
            ||req.body.classEndtime == null||req.body.classEndtime == ''
            ||req.body.twolevName == null||req.body.twolevName == ''
            ||req.body.linebodyId == null||req.body.linebodyId == ''){
         res.end(JSON.stringify(parameterError))
 }
        // 根据二级目录名字创建一条二级目录数据
        const KpitwolevNameList = await datainputServices.addKpitwolevByname(req);
        res.end(JSON.stringify(dataSuccess))     
    }


/*
    datainput 添加loss展示三级和对应四级的结构
    */
    exports.showLosstier3 = async function(req , res) {
        if(req.body.twolevName == null||req.body.twolevName == ''){
            res.end(JSON.stringify(parameterError))
        }
        // 找到对应的三级目录结构
        const twolevdata = await datainputServices.selectTwoLevByName(req.body.twolevName)
        const losstier3 = await datainputServices.selectLosstier3BytwoId(twolevdata.kpitwoid);
        dataSuccess.data = losstier3 
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
    根据线体id增加现进行项目
    */
    exports.addObjectnowBylossid = async function(req , res) {
        if(req.body.linebodyId == null||req.body.linebodyId == ''){
         res.end(JSON.stringify(parameterError))
     }
     const lossidList = await impobjServices.addObjectnowBylossid(req.body.linebodyId)
     res.end(JSON.stringify(dataSuccess))
 }

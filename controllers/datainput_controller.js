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
    datainput 添加loss中展示三级目录结构结构
    */
    exports.showLosstier3 = async function(req , res) {
        if(req.body.twolevName == null||req.body.twolevName == ''){
            res.end(JSON.stringify(parameterError))
        }
        // 找到对应的三级目录结构
        const twolevdata = await datainputServices.selectTwoLevByName(req.body.twolevName)
        const losstier3Name = await datainputServices.selectLosstier3BytwoId(twolevdata.kpitwoid)
        dataSuccess.data = losstier3Name
        res.end(JSON.stringify(dataSuccess))
    }

/*
    datainput 添加loss中展示四级目录结构结构
    */
    exports.showLosstier4 = async function(req , res) {
        if(req.body.tier3Name == null||req.body.tier3Name == ''){
            res.end(JSON.stringify(parameterError))
        }
        // 找到对应的三级目录结构
        const losstier3 = await datainputServices.selectLosstier3ByName(req.body.tier3Name)
        const losstier4Name = await datainputServices.selectLosstier4Bytier3Id(losstier3.lossid)
        dataSuccess.data = losstier4Name
        res.end(JSON.stringify(dataSuccess))
    }

/*
    添加四级loss发生的时间及持续时间
    */
    exports.addLosstier4time = async function(req , res) {
        //根据四级loss名字找出四级loss对应的结构id=>losstier4Id
        if(req.body.tier4Name == null||req.body.tier4Name == ''
            ||req.body.linebodyId == null||req.body.linebodyId == ''
            ||req.body.starttime == null||req.body.starttime == ''
            ||req.body.endtime == null||req.body.endtime == ''){
            res.end(JSON.stringify(parameterError))
        }
        // 找到对应四级目录结构
        const losstier4 = await datainputServices.selectLosstier4Bytier4name(req.body.tier4Name)
        const addReturn = await datainputServices.addLosstier4data(req,losstier4)
        if(addReturn == 1){
            res.end(JSON.stringify(dataSuccess))
        }
        res.end(JSON.stringify(addObjectError))
    }


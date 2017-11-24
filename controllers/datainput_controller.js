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
const errorUtil = require('../utils/errorUtil');



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


const showLosstier34 = {
    losstier3:'' ,
    losstier4:''
}

/*
    根据用户设置的顺序展示二级结构
    */
    exports.showKpitwolev = async function(req , res) {
        if(req.body.userId == null||req.body.userId == '')
           res.end(JSON.stringify(parameterError))
       const kpitwolevidList = await datainputServices.selectKpitwolevidByuser(req.body.userId)
       console.log('-----'+JSON.stringify(kpitwolevidList,null,4))
       var showList = []
       for(var i = 0; i < kpitwolevidList.length ; i++){
          var kpitwolev =  await datainputServices.selectKpitwolevNameByid(kpitwolevidList[i].kpitwolevKpitwoid)
          showList.push(kpitwolev.name)
      }
      dataSuccess.data = showList
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
        const losstier3DataList = await datainputServices.selectLosstier3BytwoId(twolevdata.kpitwoid)
        for(var i=0 ;i<losstier3DataList.length ;i++){
            const losstier4NameList = await datainputServices.selectLosstier4Bytier3Id(losstier3DataList[i].lossid)
            showLosstier34.losstier4 = losstier4NameList
        }
        showLosstier34.losstier3 = losstier3DataList
        dataSuccess.data = showLosstier34
        res.end(JSON.stringify(dataSuccess))     
    }

// /*
//     添加本班次时间
//     */ 
//     exports.addClasstime = async function(req , res) {
//         if(req.body.classStarttime == null||req.body.classStarttime == ''
//             ||req.body.classEndtime == null||req.body.classEndtime == ''
//             ||req.body.twolevName == null||req.body.twolevName == ''
//             ||req.body.linebodyId == null||req.body.linebodyId == ''){
//            res.end(JSON.stringify(parameterError))
//    }
//         // 根据二级目录名字创建一条二级目录数据
//         const kpitwolev = await datainputServices.addKpitwolevByname(req);
//         dataSuccess.data = kpitwolev
//         res.end(JSON.stringify(dataSuccess))     
//     }

// /*
//     三级下拉框结束，添加一条三级loss数据
//     */
//     exports.addLosstier3data = async function(req , res) {
//         if(req.body.twolevDataid == null||req.body.twolevDataid == ''
//             ||req.body.losstier3Id == null||req.body.losstier3Id == ''
//             ||req.body.linebodyId == null||req.body.linebodyId == ''){
//             res.end(JSON.stringify(parameterError))
//     }
//     // 验证这个3级loss有没有重复
//     var losstier3Data = await datainputServices.selectLosstier3By(req.body.twolevDataid,
//         req.body.losstier3Id,req.body.linebodyId)
//     if(losstier3Data == null){
//      losstier3Data = await datainputServices.addLosstier3data(req.body.twolevDataid,
//         req.body.losstier3Id,req.body.linebodyId)
//      dataSuccess.data = losstier3Data
//  }
//  dataSuccess.data = losstier3Data
//  res.end(JSON.stringify(dataSuccess))
// }

// /*
//     四级下拉框结束，添加一条四级loss数据
//     */
//     exports.addLosstier4data = async function(req , res) {
//         if(req.body.losstier3Dataid == null||req.body.losstier3Dataid == ''
//             ||req.body.losstier4Id == null||req.body.losstier4Id == ''
//             ||req.body.linebodyId == null||req.body.linebodyId == ''){
//             res.end(JSON.stringify(parameterError))
//     }
//     const addReturn = await datainputServices.addLosstier4data(req.body.losstier3Dataid,
//         req.body.losstier4Id,req.body.linebodyId)
//     dataSuccess.data = addReturn
//     res.end(JSON.stringify(dataSuccess))
// }

// /*
//     添加四级loss发生的开始时间和结束时间
//     */
//     exports.addLosstier4time = async function(req , res) {
//         //根据四级loss名字找出四级loss对应的结构id=>losstier4Id
//         if(req.body.losstier4Dataid == null||req.body.losstier4Dataid == ''
//             ||req.body.starttime == null||req.body.starttime == ''
//             ||req.body.endtime == null||req.body.endtime == ''){
//             res.end(JSON.stringify(parameterError))
//     }

//         // 找到对应四级目录结构
//         const addReturn = await datainputServices.addLosstier4datatime(req , res)
//         if(addReturn == 1){
//             const showReturn = await datainputServices.selectLosstier4DataByid(req.body.losstier4Dataid)
//             dataSuccess.data = showReturn
//             res.end(JSON.stringify(dataSuccess))
//         }
//         res.end(JSON.stringify(addObjectError))
//     }

/*
    点击确定按钮，创建一条数据并添加时间
    */
    exports.addLosstier4time2 = async function(req , res) {
       if(req.body.classStarttime == null||req.body.classStarttime == ''
        ||req.body.classEndtime == null||req.body.classEndtime == ''
        ||req.body.twolevName == null||req.body.twolevName == ''
        ||req.body.losstier3Id == null||req.body.losstier3Id == ''
        ||req.body.losstier4Id == null||req.body.losstier4Id == ''
        ||req.body.linebodyId == null||req.body.linebodyId == ''
        ||req.body.starttime == null||req.body.starttime == ''
        ||req.body.endtime == null||req.body.endtime == '')
        res.end(JSON.stringify(parameterError))

        // 验证这个2级loss有没有重复
        var kpitwolevData = await datainputServices.selectKpitwolevDataBy(req , res)
        console.log('check2----------------->' + JSON.stringify(kpitwolevData,null,4))
        if(kpitwolevData == null){
         kpitwolevData = await datainputServices.addKpitwolevByname(req , res);
     }

        // 验证这个3级loss有没有重复
        var losstier3Data = await datainputServices.selectLosstier3By(kpitwolevData.id,
            req.body.losstier3Id,req.body.linebodyId)
        if(losstier3Data == null){
           losstier3Data = await datainputServices.addLosstier3data(kpitwolevData.id,
            req.body.losstier3Id,req.body.linebodyId)
       }

        // 验证添加的这个四级loss数据是否重复
        req.body.losstier3Dataid = losstier3Data.id
        var losstier4Data = await datainputServices.selectLosstier4DataBy(req , res)
        if(losstier4Data == null){
        // 添加一条四级loss数据
        losstier4Data = await datainputServices.addLosstier4data(losstier3Data.id,
            req.body.losstier4Id,req.body.linebodyId)

        // 添加四级loss发生的开始时间和结束时间
        req.body.losstier4Dataid = losstier4Data.id
        const addReturn = await datainputServices.addLosstier4datatime(req , res)
        if(addReturn == 1){
            const showReturn = await datainputServices.selectLosstier4DataByid(req.body.losstier4Dataid)
            dataSuccess.data = showReturn
            res.end(JSON.stringify(dataSuccess))
        }
        res.end(JSON.stringify(addObjectError))
    }else{
        res.end(JSON.stringify(errorUtil.existError))
    }
}
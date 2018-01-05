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
const moment = require('moment');

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
      if(req.body.userId == null||req.body.userId == ''){
        res.end(JSON.stringify(parameterError))
      }

        // 把loss二级目录id查找出来
        const kpitwolevidList = await impobjServices.selectKpitwolevidByuser(req.body.userId)
        var showNameList =[];
        var losstier3NameList = [];
        for(var i = 0; i < kpitwolevidList.length ; i++){
          var kpitwolev =  await impobjServices.selectKpitwolevNameByid(kpitwolevidList[i].kpitwolevKpitwoid)
          var itempoolOutput = { 
            name:'',
            data:''
          }
          itempoolOutput.name = kpitwolev.name
            // 把loss三级目录名字查找出来
            losstier3NameList = await impobjServices.selectLosstier3Bytwoid(kpitwolev.kpitwoid)
            itempoolOutput.data =  losstier3NameList
            await showNameList.push(itempoolOutput)
          }
          res.end(JSON.stringify(showNameList))     
        }
/*
    improvment编辑项目状态
    */
    exports.updateImpItemstatus = async function(req , res) {
      if(req.body.id == null||req.body.id == ''
        || req.body.linebodyId == null||req.body.linebodyId == ''){
        res.end(JSON.stringify(parameterError))
    }
        // 对项目状态表进行更改
        var updateDatalog = 1
        const beforlossStatus = await lossstatusServices.selectLostatusBySid(req.body.id)
        if(beforlossStatus == null){
          res.end(JSON.stringify(updateError))
        }
        const beforStatus = await beforlossStatus.status 
        const beforStage = await beforlossStatus.stage
        const updateData = await lossstatusServices.updateLostatusById(req , res)

        // 对项目状态log表进行增加
        if(beforStatus != updateData.status||beforStage != updateData.stage){
          updateDatalog = await impobjServices.addLostatuslog(req , res,beforStatus,beforStage,updateData.id)
        }
        if(updateData != null && updateDatalog != null){
          dataSuccess.data  = updateData
          res.end(JSON.stringify(dataSuccess))
        }else{
          res.end(JSON.stringify(updateError))
        }   

      }

/*
    improvment展示历史信息
    */
    exports.showImpItemhistory = async function(req , res) {
      if(req.body.lossstatusId == null||req.body.lossstatusId == ''){
        res.end(JSON.stringify(parameterError))
      }
        // 对项目状态log表进行查找
        const data = await impobjServices.showImpItemhistory(req.body.lossstatusId)
        if(data.length > 0){
          for(var i = 0;i < data.length;i++){
            data[i].createdAt  = moment(data[i].createdAt).format('YYYY-MM-DD')
          }
        }
        dataSuccess.data  = data
        res.end(JSON.stringify(dataSuccess))  
      }


/*
    improvment展示项目状态
    */
    exports.showImpItemstatus = async function(req , res) {
      if(req.body.lossId == null||req.body.lossId == ''||
        req.body.linebodyId == null||req.body.linebodyId == ''){
        res.end(JSON.stringify(parameterError))
    }
    var data = await lossstatusServices.selectLostatusById(req.body.lossId,req.body.linebodyId)
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
       // 根据线体id把loss状态表中所有项目名字查找出来
       var lostatusNameList = await lossstatusServices.selectLostatusBylineid(req.body.linebodyId)
       if(lostatusNameList != null){
        var showObjectnowList = []
        for(var i = 0;i < lostatusNameList.length;i++){
          var showObjectnow = {
            projectname : '',
            losstier3Lossid : '',
            status : '',
            reviewdata : ''
          }
          if(lostatusNameList[i].status != 4){
            if(lostatusNameList[i].objectstarttime != null){
              const reviewday =  moment(lostatusNameList[i].createdAt).date()
              var reviewdata =  moment().set({'date': reviewday})
              if(reviewdata < moment()){
                reviewdata =  moment().set({'month': moment().month() + 1 ,'date': reviewday})
              }
              // review日期
              showObjectnow.reviewdata = moment(reviewdata).format('YYYY-MM-DD') 
            }

          // 封装格式
          showObjectnow.projectname = lostatusNameList[i].projectname
          showObjectnow.losstier3Lossid = lostatusNameList[i].losstier3Lossid
          showObjectnow.status = lostatusNameList[i].status
          showObjectnowList.push(showObjectnow)
        }
      }
    }
    dataSuccess.data = showObjectnowList
    res.end(JSON.stringify(dataSuccess)) 
  }

/*
    根据loss id增加现进行项目
    */
    exports.addObjectnowBylossid = async function(req , res) {
      if(req.body.lossIdList == null||req.body.lossIdList.length == 0
        ||req.body.lossIdList == ''||req.body.linebodyId == null
        ||req.body.linebodyId == '')
       res.end(JSON.stringify(parameterError))

     var addReturn
     var lossIdList = req.body.lossIdList.split(",")
     var addReturnList = []
     // 验证数据是否已经存在
     var checkAddflag = false
     var checkAddErr
     for(var i=0;i<lossIdList.length;i++){
       checkAddErr = await impobjServices.checkAddexist(req.body.linebodyId,lossIdList[i])
       if(checkAddErr != null){
        if(checkAddErr.status == 101){
          checkAddflag = true
          break
        }
      }
    }
    if(checkAddflag == false){
      // 添加现进行项目
      for(var i=0;i<lossIdList.length;i++){
        addReturn = await impobjServices.addObjectnowBylossid(req.body.linebodyId,lossIdList[i])
        addReturnList.push(addReturn)
        if(addReturn == null||addReturn == ''){
          res.end(JSON.stringify(addObjectError))
        }
      }
      dataSuccess.data = addReturnList
      res.end(JSON.stringify(dataSuccess))
    }else{
      res.end(JSON.stringify(checkAddErr))
    }
  }

/*
    根据线体id删除现进行项目
    */
    exports.deleteObjectnowBylossid = async function(req , res) {
      if(req.body.lossId == null||req.body.lossId == ''){
       res.end(JSON.stringify(parameterError))
     }
     const lossidList = await lossstatusServices.deleteObjectnowBylossid(req.body.linebodyId,req.body.lossId)
     res.end(JSON.stringify(dataSuccess))
   }

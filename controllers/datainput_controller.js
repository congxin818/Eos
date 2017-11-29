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


const showLosstier34 = {
    losstier3:'' ,
    losstier4:''
}

var showAddloss4After = {
    losstier2name:'',
    losstier3name:'',
    losstier4name:'',
    losstier4Dataid:'',
    starttime:'',
    endtime:'',
}

/*
    根据用户设置的顺序展示二级结构
    */
    exports.showKpitwolev = async function(req , res) {
        if(req.body.userId == null||req.body.userId == '')
           res.end(JSON.stringify(parameterError))
       const kpitwolevidList = await datainputServices.selectKpitwolevidByuser(req.body.userId)
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

/*
    点击确定按钮，创建一条数据并添加时间
    */
    exports.addLosstier4time2 = async function(req , res) {
       if(req.body.classinfIdList == null||req.body.classinfIdList == ''
        ||req.body.twolevName == null||req.body.twolevName == ''
        ||req.body.losstier3Id == null||req.body.losstier3Id == ''
        ||req.body.losstier4Id == null||req.body.losstier4Id == ''
        ||req.body.linebodyId == null||req.body.linebodyId == ''
        ||req.body.starttime == null||req.body.starttime == ''
        ||req.body.endtime == null||req.body.endtime == '')
        res.end(JSON.stringify(parameterError))

        // 判断这个四级loss属于哪一天的开班时间
        var classinfIdList = req.body.classinfIdList.split(",")
        var addReturn = null
        for(var i = 0;i < classinfIdList.length;i++){
            var classinforData = await datainputServices.classinforSelectById(classinfIdList[i])
            if(moment(req.body.starttime).isAfter(classinforData.classstarttime)
                && moment(req.body.endtime).isBefore(classinforData.classendtime)){
                    // loss四级时间在这一天的开班时间内
                req.body.classinfId = classinfIdList[i]
                addReturn = await exports.addLosstierData(req , res)
                break
            }
            if(moment(req.body.starttime).isAfter(classinforData.classstarttime)
                && moment(req.body.endtime).isAfter(classinforData.classendtime)){
                    // loss四级时间横跨了这一天和下一天
               const thisendtime = req.body.endtime //把req.body.endtime保存下来
                // 这一天的添加loss四级时间
                req.body.classinfId = classinfIdList[i]
                req.body.endtime = moment(req.body.starttime).set({'hour': 23, 'minute': 59 ,'second': 59})
                addReturn1 = await exports.addLosstierData(req , res)

                //下一天的添加loss四级时间
                req.body.classinfId = classinfIdList[i + 1]
                req.body.endtime = thisendtime
                req.body.starttime = moment(thisendtime).set({'hour': 0, 'minute': 0 ,'second': 0})
                addReturn2 = await exports.addLosstierData(req , res)

                // 返回值的验证及组合设定 =1:这段时间重复
                if(addReturn1 != null && addReturn2 != null){
                    if(addReturn1 == 1 && addReturn2 == 1){
                        addReturn = 1
                    }else if(addReturn1 == 1){
                        addReturn = addReturn2
                    }else if(addReturn2 == 1){
                        addReturn = addReturn1
                    }else{
                        var result = []
                        result.push(addReturn1)
                        result.push(addReturn2)
                        addReturn = result
                    }
                }else{
                    addReturn = null
                }
                break
            }

        }

        // 返回值设定
        if(addReturn != null &&addReturn != 1 ){
            dataSuccess.data = addReturn
            res.end(JSON.stringify(dataSuccess))
        }else if(addReturn == 1){
            res.end(JSON.stringify(errorUtil.existError))
        }else{
            res.end(JSON.stringify(addObjectError))
        }

    }

/*
    创建并增加二级-四级loss value数据
    */
    exports.addLosstierData= async function(req , res) {

        // 验证这个2级loss有没有重复
        var kpitwolevData = await datainputServices.selectKpitwolevDataBy(req , res)
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
        var addReturn = null
        if(losstier4Data == null){
            // 添加一条四级loss数据
            losstier4Data = await datainputServices.addLosstier4data(losstier3Data.id,
                req.body.losstier4Id,req.body.linebodyId)

            // 添加四级loss发生的开始时间和结束时间
            req.body.losstier4Dataid = losstier4Data.id
            addReturn = await datainputServices.addLosstier4datatime(req , res)
            if(addReturn != 1){
                losstier4Data = null
            }


            // 封装成前台需要的格式
            showAddloss4After = await datainputServices.showNameByloss4dataId(losstier4Data.id,showAddloss4After)
            losstier4Data = showAddloss4After

        }else{

           // 四级loss数据重复
           losstier4Data = 1
       }
       return losstier4Data
   }

/*
    增加产品信息
    */
    exports.addProduct = async function(req , res) {
        if(req.body.productType == null||req.body.productType == ''
            ||req.body.conformProduct == null||req.body.conformProduct == ''
            ||req.body.normalCycletime == null||req.body.normalCycletime == ''
            ||req.body.classinfIdList == null||req.body.classinfIdList == '')
            res.end(JSON.stringify(parameterError))
        else{
            var classinfIdList = req.body.classinfIdList.split(",")
            var showData = []
            for(var i = 0;i < classinfIdList.length;i++){
                req.body.classinfId = classinfIdList[i]
                // 增加一条产品信息数据
                const addReturn = await datainputServices.addProduct(req , res)
                showData.push(addReturn)
            }
            dataSuccess.data = addReturn
            res.end(JSON.stringify(dataSuccess))
        }   
    }

/*
    更改产品信息
    */
    exports.updateProduct = async function(req , res) {
        if(req.body.conformProduct == null||req.body.conformProduct == ''
            ||req.body.normalCycletime == null||req.body.normalCycletime == ''
            ||req.body.productId == null||req.body.productId == '')
            res.end(JSON.stringify(parameterError))
        else{
            // 增加一条产品信息数据
            const updateReturn = await datainputServices.updateProduct(req , res)
            dataSuccess.data = updateReturn
            res.end(JSON.stringify(dataSuccess))
        }

    }

/*
    增加开班详细信息
    */
    exports.addClassinf = async function(req , res) {
        if(req.body.classStarttime == null||req.body.classStarttime == ''
            ||req.body.classEndtime == null||req.body.classEndtime == ''
            ||req.body.shouldAttendance == null||req.body.shouldAttendance == ''
            ||req.body.actualAttendance == null||req.body.actualAttendance == '')
            res.end(JSON.stringify(parameterError))
        else{
            // 开班开始---天
            const classStartDay = moment(req.body.classStarttime).dayOfYear()
            // 开班结束---天
            const classEndDay = moment(req.body.classEndtime).dayOfYear()

            if(classStartDay == classEndDay){
                // 增加一条产品信息数据
                const addReturn = await datainputServices.addClassinf(req.body.classStarttime,
                    req.body.classEndtime,req.body.shouldAttendance,req.body.actualAttendance)
                dataSuccess.data = addReturn
                res.end(JSON.stringify(dataSuccess))
            }else{
                var showdataList = []
                for(var i = classStartDay;i <= classEndDay;i++){
                    if(i == classStartDay){
                        // 第一天
                        // 开班结束时间
                        var classEndtime = moment(req.body.classStarttime).set({'hour': 23, 'minute': 59 ,'second': 59})
                        // 增加一条产品信息数据
                        const addReturn = await datainputServices.addClassinf(req.body.classStarttime,
                            classEndtime,req.body.shouldAttendance,req.body.actualAttendance)
                        showdataList.push(addReturn)
                    } else if(i == classEndDay){
                        // 最后一天
                        // 开班开始时间
                        var classStarttime = moment(req.body.classEndtime).set({'hour': 00, 'minute': 00 ,'second': 00})
                        // 增加一条产品信息数据
                        const addReturn = await datainputServices.addClassinf(classStarttime,
                            req.body.classEndtime,req.body.shouldAttendance,req.body.actualAttendance)
                        showdataList.push(addReturn)
                    }else{
                        // 中间的那些天
                        var classStarttime = moment(req.body.classEndtime).set({'date': i,'hour': 00, 'minute': 00 ,'second': 00})
                        var classEndtime = moment(req.body.classStarttime).set({'date': i,'hour': 23, 'minute': 59 ,'second': 59})
                        // 增加一条产品信息数据
                        const addReturn = await datainputServices.addClassinf(classStarttime,
                            classEndtime,req.body.shouldAttendance,req.body.actualAttendance)
                        showdataList.push(addReturn)
                    }
                }
                // 
                dataSuccess.date = showdataList
                res.end(JSON.stringify(dataSuccess))
            }
        }  
    }
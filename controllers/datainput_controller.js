/*
    数据输入处理
    创建人：THree
    时间：2017/11/15
    */

//引入数据库Message模块
const twolevServices = require('../services/kpitwolev_service');
const lossstatusServices = require('../services/lossstatus_service');
const datainputServices = require('../services/datainput_service');
const textServices = require('../services/linebody_extend_service');
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

const updateError = {
    status: '301', 
    msg: '更新数据错误'
};

const showLosstier34 = {
    losstier3:'' ,
    losstier4:''
}

var showAddPrpductData = {
    productid:'',
    productname:'',
    conformproduct:'',
    normalcycletime:''
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
        var losstier4List =[]
        var flag = true
        for(var i=0 ;i<losstier3DataList.length ;i++){
            var losstier4NameList = await datainputServices.selectLosstier4Bytier3Id(losstier3DataList[i].lossid)
            if(losstier4NameList != null){
                if(flag == true){
                    losstier4List = losstier4NameList
                    flag = false
                }else{
                 losstier4List = await losstier4List.concat(losstier4NameList)
             }
         }
     }
     showLosstier34.losstier4 = losstier4List
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
            const starttimeday =  moment(req.body.starttime).dayOfYear()
            const endtimeday =  moment(req.body.endtime).dayOfYear()
            if((moment(req.body.starttime).isAfter(classinforData.classstarttime)||
                moment(req.body.starttime).isSame(classinforData.classstarttime))

                && (moment(req.body.endtime).isBefore(classinforData.classendtime)
                    ||moment(req.body.endtime).isSame(classinforData.classendtime))){
                    // loss四级时间在这一天的开班时间内
                req.body.classinfId = classinfIdList[i]
                addReturn = await exports.addLosstierData(req , res)
                break
            }
            if((moment(req.body.starttime).isAfter(classinforData.classstarttime)||
                moment(req.body.starttime).isSame(classinforData.classstarttime))
                && moment(req.body.endtime).isAfter(classinforData.classendtime)&&
                moment(req.body.starttime).isBefore(classinforData.classendtime)){
                // loss四级时间横跨了这一天和下一天
                const thisendtime = req.body.endtime //把req.body.endtime保存下来
                // 这一天的添加loss四级时间
                req.body.classinfId = classinfIdList[i]
                req.body.endtime = moment(req.body.starttime).set({'hour': 24, 'minute': 00 ,'second': 00})
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

       //  // 验证这个2级loss有没有重复
       //  var kpitwolevData = await datainputServices.selectKpitwolevDataBy(req , res)
       //  if(kpitwolevData == null){
       //      kpitwolevData = await datainputServices.addKpitwolevByname(req , res);
       //  }

       //  // 验证这个3级loss有没有重复
       //  var losstier3Data = await datainputServices.selectLosstier3By(kpitwolevData.id,
       //      req.body.losstier3Id,req.body.linebodyId)
       //  if(losstier3Data == null){
       //      losstier3Data = await datainputServices.addLosstier3data(kpitwolevData.id,
       //          req.body.losstier3Id,req.body.linebodyId)
       //  }

        // 验证添加的这个四级loss数据是否重复
        var checkFlag = await datainputServices.selectLosstier4DataBy(req , res)
        if(checkFlag == 1){
           return checkFlag
       }
     //----------------------------------------------------------------------01/02

        // 添加四级loss发生的开始时间和结束时间
        var losstier4dataList =  await datainputServices.addLosstier4datatime(req , res)
        var showAddloss4After = {
            losstier2name:'',
            losstier3name:'',
            losstier4name:'',
            losstier4Dataid:'',
            starttime:'',
            endtime:'',
        }

        // 封装成前台需要的格式
        for(var i = 0;i < losstier4dataList.length;i++){
            showAddloss4After.losstier4Dataid = showAddloss4After.losstier4Dataid +','+ losstier4dataList[i].id
        }
        // 把多余的 ，去掉
        showAddloss4After.losstier4Dataid =  showAddloss4After.losstier4Dataid.slice(1,)
        showAddloss4After.starttime = req.body.starttime
        showAddloss4After.endtime = req.body.endtime
        showAddloss4After = await datainputServices.showNameByloss4dataId(
            showAddloss4After,req.body.losstier4Id,req.body.losstier3Id,req.body.twolevName)
        return showAddloss4After
    }

/*
    展示产品名字（最小的产品类）下拉列表
    */
    exports.showProductName = async function(req , res) {
        if(req.body.linebodyId == null||req.body.linebodyId == '')
            res.end(JSON.stringify(parameterError))
        else{
            const data = await datainputServices.selectProductnameById(req.body.linebodyId)
            dataSuccess.data = data
            res.end(JSON.stringify(dataSuccess))
        }
    }

/*
    增加产品信息
    */
    exports.addProduct = async function(req , res) {
        if(req.body.productNameId == null||req.body.productNameId == ''
            ||req.body.conformProduct == null||req.body.conformProduct == ''
            ||req.body.classinfIdList == null||req.body.classinfIdList == ''
            ||req.body.linebodyId == null||req.body.linebodyId == ''
            )
            res.end(JSON.stringify(parameterError))
        else{
            var classinfIdList = req.body.classinfIdList.split(",")
            var addReturn
            var checkFlag = false
            for(var i = 0;i < classinfIdList.length;i++){
                req.body.classinfId = classinfIdList[i]
                // 验证产品信息是否重复
                const checkData = await datainputServices.selectProductdataBy(req.body.linebodyId,classinfIdList[i],req.body.productNameId)
                if(checkData == ''||checkData == null||checkData == undefined){
                     // 增加一条产品信息数据
                     addReturn = await datainputServices.addProduct(req , res)
                     checkFlag = true
                 }
             }
             if(addReturn!=null){
                // 调用展示全部产品信息
                exports.showProduct(req , res)
            }
            if(checkFlag == false){
                res.end(JSON.stringify(errorUtil.existError))
            }
        }   
    }

/*
    展示产品信息
    */
    exports.showProduct = async function(req , res) {
        if(req.body.classinfIdList == null||req.body.classinfIdList == ''
            ||req.body.linebodyId == null||req.body.linebodyId == '')
            res.end(JSON.stringify(parameterError))
        else{
            var classinfIdList = req.body.classinfIdList.split(",")  
            const showProduct = await exports.showProductinf(classinfIdList,req.body.linebodyId)
            dataSuccess.data = showProduct
            res.end(JSON.stringify(dataSuccess))
        }
    }
/*
    展示产品信息
    */

    exports.showProductinf = async function(classinfIdList , linebodyId) {
        var showProduct =[]
            // 查找一条产品信息     
            const data = await datainputServices.selectProductByclassId(classinfIdList[0])
            for(var j = 0;j < data.length;j++){
                var samenamedata = []
                var flag = true
                for(var i = 0;i < classinfIdList.length;i++){
                    const smdata = await datainputServices.selectProductDataByName(
                        data[j].linebodyproductnameId,classinfIdList[i])
                    if(smdata != null){
                        if(flag == true){
                            samenamedata = smdata
                            flag = false
                        }else{
                         samenamedata = await samenamedata.concat(smdata)
                     }
                 }
             }
             var showAddPrpductData = {
                productid:'',
                productname:'',
                conformproduct:'',
                normalcycletime:''
            }
            for(var k = 0;k < samenamedata.length;k++){
                    // 设置展示的list 的值
                    showAddPrpductData.productid = showAddPrpductData.productid +','+ samenamedata[k].productid
                    var flag = true
                    if(flag == true){
                     const concatName = await datainputServices.selectconcatNameById(samenamedata[k].linebodyproductnameId)
                     showAddPrpductData.productname = concatName
                     showAddPrpductData.conformproduct = samenamedata[k].conformproduct
                     const lineproname = await datainputServices.selectCCYtimeById(samenamedata[k].linebodyproductnameId)
                     showAddPrpductData.normalcycletime = lineproname.normalcycletime
                     flag = false
                 }

             }
                // 把多余的 ，去掉
                showAddPrpductData.productid = await showAddPrpductData.productid.slice(1,)
                showProduct.push(showAddPrpductData)

            }
            return showProduct   
        }

/*
    编辑产品信息
    */
    exports.updateProduct = async function(req , res) {
        if(req.body.conformProduct == null||req.body.conformProduct == ''
            ||req.body.productIdList == null||req.body.productIdList == ''
            ||req.body.classinfIdList == null||req.body.classinfIdList == '')
            res.end(JSON.stringify(parameterError))
        else{
            var productIdList = req.body.productIdList.split(",")
            for(var i = 0;i < productIdList.length;i++){
                // 更改一条产品信息
                req.body.productId = productIdList[i]
                const updateReturn = await datainputServices.updateProduct(req , res)
                if (updateReturn != 1 ){
                    res.end(JSON.stringify(updateError))
                }
            }
            // 调用展示全部产品信息
            exports.showProduct(req , res)
        }

    }

/*
    删除产品信息
    */
    exports.deleteProduct = async function(req , res) {
        if(req.body.productIdList == null||req.body.productIdList == ''
            ||req.body.classinfIdList == null||req.body.classinfIdList == '')
            res.end(JSON.stringify(parameterError))
        else{
           var productIdList = req.body.productIdList.split(",")
           for(var i = 0;i < productIdList.length;i++){
                // 删除一条产品信息
                const deleteReturn = await datainputServices.deleteProduct(productIdList[i])
                if (deleteReturn == null||deleteReturn == '' ){
                    res.end(JSON.stringify(updateError))
                }
            }
            // 调用展示全部产品信息
            exports.showProduct(req , res)
        }
    }


/*
    增加开班详细信息
    */
    exports.addClassinf = async function(req , res) {
        if(req.body.classStarttime == null||req.body.classStarttime == ''
            ||req.body.classEndtime == null||req.body.classEndtime == ''
            ||req.body.shouldAttendance == null||req.body.shouldAttendance == ''
            ||req.body.actualAttendance == null||req.body.actualAttendance == ''
            ||req.body.linebodyId == null||req.body.linebodyId == '')
            res.end(JSON.stringify(parameterError))
        else{
            // 判断开班时间是否重合
            var checkFlag = await datainputServices.checkClassData(req.body.linebodyId , req.body.classStarttime , req.body.classEndtime)
            if(checkFlag == 1){
                res.end(JSON.stringify(errorUtil.existError))
            }else{
                // 格式化开始时间和结束时间
                const formatStartDay = moment(req.body.classStarttime).set({'hour': 00, 'minute': 00 ,'second': 00})
                const formatEndDay = moment(req.body.classEndtime).set({'hour': 00, 'minute': 00 ,'second': 00})
                // 格式化的时间戳
                const classStartDay = moment(formatStartDay).unix()
                const classEndDay = moment(formatStartDay).unix()

                var showdataList = []

                if(classStartDay == classStartDay){
                    // 增加一条产品信息数据
                    const addReturn = await datainputServices.addClassinf(req.body.classStarttime,
                        req.body.classEndtime,req.body.shouldAttendance,req.body.actualAttendance,req.body.linebodyId)
                    showdataList.push(addReturn)
                }else{
                    // 添加班级的个数 
                    var loopindex = (classEndDay - classStartDay)/(24*60*60) + 1
                    if(moment(req.body.classEndtime).hour() == 0 &&moment(req.body.classEndtime).minute() ==0
                        && moment(req.body.classEndtime).second() == 0){
                        loopindex = (classEndDay - classStartDay)/(24*60*60)}

                    // 第一天
                    var classEndtime = moment(req.body.classStarttime).set({'hour': 24, 'minute': 00 ,'second': 00})
                    var addReturn = await datainputServices.addClassinf(req.body.classStarttime,
                        classEndtime,req.body.shouldAttendance,req.body.actualAttendance,req.body.linebodyId)
                    showdataList.push(addReturn)
                    // 最后一天
                    var classStarttime = moment(req.body.classEndtime).set({'hour': 00, 'minute': 00 ,'second': 00})
                    addReturn = await datainputServices.addClassinf(classStarttime,
                        req.body.classEndtime,req.body.shouldAttendance,req.body.actualAttendance,req.body.linebodyId)
                    showdataList.push(addReturn)

                    if(loopindex > 2){
                        for(var i = 0;i < loopindex - 2;i++ ){
                            // 中间的那些天
                            var classStarttime = moment(req.body.classStarttime).set({'date': i,'hour': 00, 'minute': 00 ,'second': 00})
                            var classEndtime = moment(req.body.classEndtime).set({'date': i,'hour': 24, 'minute': 00 ,'second': 00})
                            // 增加一条产品信息数据
                            addReturn = await datainputServices.addClassinf(classStarttime,
                                classEndtime,req.body.shouldAttendance,req.body.actualAttendance,req.body.linebodyId)
                            showdataList.push(addReturn)
                        }
                    }         
                }
                dataSuccess.data = showdataList
                res.end(JSON.stringify(dataSuccess))
            }
        }  
    }

/*
    编辑添加loss后的三级四级项目时间
    */
    exports.updateObjectimeAfteradd = async function(req , res) {
        if(req.body.losstier4DataidList == null||req.body.losstier4DataidList == ''
            ||req.body.starttime == null||req.body.starttime == ''
            ||req.body.endtime == null||req.body.endtime == ''){
            res.end(JSON.stringify(parameterError))
    }else{
        var showAddloss4After = {
            losstier2name:'',
            losstier3name:'',
            losstier4name:'',
            losstier4Dataid:'',
            starttime:'',
            endtime:''
        }
        var losstier4DataidList = req.body.losstier4DataidList.split(",")
        const reqEndtime = req.body.endtime // 传入的结束日期，存值
        const reqStarttime = req.body.starttime // 传入的结束日期，存值

        // 更改之前loss是否跨15分钟
        if(losstier4DataidList.length == 1){
            // 开始和结束的值
            const losstier4Data0 = await datainputServices.selectLosstier4DataByid(losstier4DataidList[0])

            if(moment(reqStarttime).unix() < moment(losstier4Data0.starttime).unix()){
                // 参数设定
                req.body.starttime = reqStarttime
                req.body.endtime = losstier4Data0.starttime

                req.body.linebodyId = losstier4Data0.linebodyLinebodyid
                req.body.losstier4Id = losstier4Data0.losstier4Tier4id
                var lossreq = await datainputServices.selectreqByloss4data(losstier4Data0)
                req.body.losstier3Id = lossreq.losstier3Id
                req.body.classinfIdList = lossreq.linebodyLinebodyid
                req.body.losstier2name = lossreq.losstier4Tier4id
                showAddloss4After = await exports.addLosstierData(req , res)
            }
            if(moment(reqEndtime).unix() > moment(losstier4Data0.endtime).unix()){
                var oneIfloss4Dataid = ''
                if(showAddloss4After.losstier4Dataid == null||showAddloss4After.losstier4Dataid == ''){
                    // 没有执行第一个if
                }else{
                    oneIfloss4Dataid = showAddloss4After.losstier4Dataid
                }

                // 参数设定
                req.body.starttime = losstier4Data0.endtime
                req.body.endtime = reqEndtime

                req.body.linebodyId = losstier4Data0.linebodyLinebodyid
                req.body.losstier4Id = losstier4Data0.losstier4Tier4id
                var lossreq = await datainputServices.selectreqByloss4data(losstier4Data0)
                req.body.losstier3Id = lossreq.losstier3Id
                req.body.classinfIdList = lossreq.linebodyLinebodyid
                req.body.losstier2name = lossreq.losstier4Tier4id
                showAddloss4After = await exports.addLosstierData(req , res)
                if(oneIfloss4Dataid != null || oneIfloss4Dataid != ''){
                    showAddloss4After.losstier4Dataid = oneIfloss4Dataid + ',' + showAddloss4After.losstier4Dataid 
                }
            }
            if(moment(reqStarttime).unix() > moment(losstier4Data0.starttime).unix()){          
                // 小于15分钟，直接update
                const updateReturn = await datainputServices.updateLoss4data(
                    losstier4Data0,reqStarttime,reqEndtime)
                
            }
            if(moment(reqEndtime).unix() < moment(losstier4Data0.endtime).unix()){
                // 小于15分钟，直接update
                const updateReturn = await datainputServices.updateLoss4data(
                    losstier4Data0,reqStarttime,reqEndtime)
            }
            // 判断是否加过loss,设置返回值
            if(showAddloss4After.losstier2name == ''||showAddloss4After.losstier2name == null){
                showAddloss4After = await datainputServices.updateNoLossdataReturn(losstier4Data0,showAddloss4After)
            }else{
                // 走过上面的添加
                showAddloss4After.losstier4Dataid = losstier4Data0.id + ',' + showAddloss4After.losstier4Dataid
            }
            showAddloss4After.starttime = reqStarttime
            showAddloss4After.endtime = reqEndtime
            dataSuccess.data = showAddloss4After
            res.end(JSON.stringify(dataSuccess))

        }else{
            // 开始和结束的值
            const losstier4Data0 = await datainputServices.selectLosstier4DataByid(losstier4DataidList[0])
            const losstier4Data1 = await datainputServices.selectLosstier4DataByid(losstier4DataidList[1])

            if(moment(reqStarttime).unix() < moment(losstier4Data0.starttime).unix()){
                //console.log('1------------------>')
                // 参数设定
                req.body.starttime = reqStarttime
                req.body.endtime = losstier4Data0.starttime

                req.body.linebodyId = losstier4Data0.linebodyLinebodyid
                req.body.losstier4Id = losstier4Data0.losstier4Tier4id
                var lossreq = await datainputServices.selectreqByloss4data(losstier4Data0)
                req.body.losstier3Id = lossreq.losstier3Id
                req.body.classinfIdList = lossreq.linebodyLinebodyid
                req.body.losstier2name = lossreq.losstier4Tier4id
                showAddloss4After = await exports.addLosstierData(req , res)
                
                // // losstier4DataidList // 旧的list  req.body.losstier4DataidList
                // const losstier4DataidList2 = showAddloss4After.losstier4Dataid.split(",") // 新的list
                // console.log('losstier4DataidList2-------------->'+JSON.stringify(losstier4DataidList2,null,4))
                // if(losstier4DataidList2.length == 1){
                //     losstier4DataidList2.push('')
                // }else{
                //     losstier4DataidList2.push(losstier4DataidList2[1])
                // }
                // console.log('logsstier4DataidList2-------------->'+JSON.stringify(losstier4DataidList2,null,4))
                // var newLosstier4DataidList = []
                // oldlosstier4Dataid1 = losstier4DataidList[1]
                // newLosstier4DataidList = losstier4DataidList2.concat(losstier4DataidList.splice(1,1))
                // console.log('newLosstier4DataidList-------------->'+JSON.stringify(newLosstier4DataidList,null,4))
                // newLosstier4DataidList.push(oldlosstier4Dataid1,1)
                
                // console.log('return-------------->'+JSON.stringify(newLosstier4DataidList,null,4)

                showAddloss4After.losstier4Dataid = showAddloss4After.losstier4Dataid + ',' + req.body.losstier4DataidList
            }
            if(moment(reqEndtime).unix() > moment(losstier4Data1.endtime).unix()){
                var oneIfloss4Dataid = ''
                if(showAddloss4After.losstier4Dataid == null||showAddloss4After.losstier4Dataid == ''){
                    // 没有执行第一个if
                }else{
                    oneIfloss4Dataid = showAddloss4After.losstier4Dataid
                }

                // 参数设定
                req.body.starttime = losstier4Data1.endtime
                req.body.endtime = reqEndtime

                req.body.linebodyId = losstier4Data0.linebodyLinebodyid
                req.body.losstier4Id = losstier4Data0.losstier4Tier4id
                var lossreq = await datainputServices.selectreqByloss4data(losstier4Data0)
                req.body.losstier3Id = lossreq.losstier3Id
                req.body.classinfIdList = lossreq.linebodyLinebodyid
                req.body.losstier2name = lossreq.losstier4Tier4id
                showAddloss4After = await exports.addLosstierData(req , res)
                if(oneIfloss4Dataid  == null || oneIfloss4Dataid == ''){
                    showAddloss4After.losstier4Dataid = showAddloss4After.losstier4Dataid + ',' + req.body.losstier4DataidList   
                }else{
                    showAddloss4After.losstier4Dataid = oneIfloss4Dataid + ',' + showAddloss4After.losstier4Dataid 
                }
            }
            if(moment(reqStarttime).unix() > moment(losstier4Data0.starttime).unix()){
                var ccyTimeindex = ''
                // 超过15分钟 ccyTimeindex
                for(var i = 0;i < losstier4DataidList.length;i++){
                    if(i == 1){
                        continue
                    }
                    const losstier4Data = await datainputServices.selectLosstier4DataByid(losstier4DataidList[i])
                    if(moment(reqStarttime).unix() >= moment(losstier4Data.endtime).unix()){
                        //删除超过的部分
                        await datainputServices.deleteLoss32data(losstier4DataidList[i])
                        await datainputServices.deleteLoss4data(losstier4DataidList[i])
                    }else{
                        ccyTimeindex = i
                        break
                    }
                }
                if(ccyTimeindex == ''){
                    ccyTimeindex = 1
                }
                // 更改余下的部分
                const losstier4Data = await datainputServices.selectLosstier4DataByid(losstier4DataidList[ccyTimeindex])
                const updateReturn = await datainputServices.updateLoss4data(
                    losstier4Data,reqStarttime,losstier4Data.endtime)
                showAddloss4After = await datainputServices.updateNoLossdataReturn(losstier4Data,showAddloss4After)
            }
            if(moment(reqEndtime).unix() < moment(losstier4Data1.endtime).unix()){
                var ccyTimeindex = ''
                // 超过15分钟 超过的整个删除
                for(var i = losstier4DataidList.length-1;i >= 0;i--){
                    if(i == 1)
                        continue 
                    var loopFlag = false
                    if (loopFlag == false){
                        if(moment(reqEndtime).unix() <= moment(losstier4Data1.starttime).unix()){
                            await datainputServices.deleteLoss32data(losstier4DataidList[1])
                            await datainputServices.deleteLoss4data(losstier4DataidList[1])

                        }else{
                            ccyTimeindex = 1
                            break
                        }
                        loopFlag = true
                    }                  
                    const losstier4Data = await datainputServices.selectLosstier4DataByid(losstier4DataidList[i])
                    if(moment(reqEndtime).unix() <= moment(losstier4Data.starttime).unix()){
                        //删除超过的部分
                        await datainputServices.deleteLoss32data(losstier4DataidList[i])
                        await datainputServices.deleteLoss4data(losstier4DataidList[i])
                    }else{
                        ccyTimeindex = i
                        break
                    }
                }
                // 更改余下的部分
                const losstier4Data = await datainputServices.selectLosstier4DataByid(losstier4DataidList[ccyTimeindex])
                const updateReturn = await datainputServices.updateLoss4data(
                    losstier4Data,losstier4Data.starttime,reqEndtime)
                showAddloss4After = await datainputServices.updateNoLossdataReturn(losstier4Data,showAddloss4After)

            }
            // 设置返回值
            showAddloss4After.starttime = reqStarttime
            showAddloss4After.endtime = reqEndtime
            dataSuccess.data = showAddloss4After
            res.end(JSON.stringify(dataSuccess))
        }
    }
}

/*
    删除loss信息
    */
    exports.deleteLoss4data = async function(req , res) {
        if(req.body.losstier4DataidList == null||req.body.losstier4DataidList == ''){
            res.end(JSON.stringify(parameterError))
        }else{
            var deleteReturn
            var losstier4DataidList = req.body.losstier4DataidList.split(",")
            for(var i = 0;i < losstier4DataidList.length;i++){
                await datainputServices.deleteLoss32data(losstier4DataidList[i])
                deleteReturn = await datainputServices.deleteLoss4data(losstier4DataidList[i])
            }
            if(deleteReturn!=null){
                dataSuccess.data = ''
                res.end(JSON.stringify(dataSuccess))
            }else{
            // 删除失败
        }     
    }
}

exports.getClassflag = async function(req , res){
    var  classflag =  await textServices.getClassflag(req.body.classStarttime , req.body.classEndtime , req.body.linebodyId);
    dataSuccess.data = classflag
    res.end(JSON.stringify(dataSuccess))
}

/*
    开班历史信息展示接口
    */
    exports.showClassinfHistory = async function(req , res) {
        if(req.body.linebodyId == null||req.body.linebodyId == ''){
            res.end(JSON.stringify(parameterError))
        }else{
            const showClassinfdata = await datainputServices.selectClassinfBylineby(req.body.linebodyId)
            dataSuccess.data = showClassinfdata
            res.end(JSON.stringify(dataSuccess))
        }
    }

/*
    开班历史信息删除接口
    */
    exports.deleteClassinfHistory = async function(req , res) {
        if(req.body.classinfId == null||req.body.classinfId == '')
            res.end(JSON.stringify(parameterError))
        else{
            // 删除一条开班历史信息
            const deleteReturn = await datainputServices.deleteClassinfHistory(req.body.classinfId)
            if (deleteReturn == null||deleteReturn == '' ){
                res.end(JSON.stringify(updateError))
            }else{
                dataSuccess.data = deleteReturn
                res.end(JSON.stringify(dataSuccess))
            }
        }
    }

/*
    展示右侧产品loss班次
    */
    exports.showClassinfHisRight = async function(req , res) {
        if(req.body.classinfId == null||req.body.classinfId == ''
            ||req.body.userId == null||req.body.userId == ''
            ||req.body.linebodyId == null||req.body.linebodyId == ''){
            res.end(JSON.stringify(parameterError))
    }else{
        var classinfHisRight = {
            classstarttime : '',
            classendtime : '',
            shouldattendance : '',
            actualattendance : '',
            product : '',
            loss : ''
        }
            // 查找班次信息
            const classinfData =  await datainputServices.classinforSelectById(req.body.classinfId)
            classinfHisRight.classstarttime = classinfData.classstarttime
            classinfHisRight.classendtime = classinfData.classendtime
            classinfHisRight.shouldattendance = classinfData.shouldattendance
            classinfHisRight.actualattendance = classinfData.actualattendance
            // 查找产品信息
            const productinf = await exports.showProductinf(req.body.classinfId,req.body.linebodyId)
            classinfHisRight.product = productinf
            // 查找loss信息

            var lossinfW = []
            const kpitwolevidList = await datainputServices.selectKpitwolevidByuser(req.body.userId)
            for(var i = 0; i < kpitwolevidList.length ; i++){
                var lossinf = {}
                var kpitwolev =  await datainputServices.selectKpitwolevNameByid(kpitwolevidList[i].kpitwolevKpitwoid)
                lossinf[kpitwolev.name] = '';
                var loss4inf = await datainputServices.showloss4inf(req.body.classinfId,req.body.linebodyId,kpitwolev.name)
                lossinf[kpitwolev.name] = loss4inf
                lossinfW.push(lossinf)
            }
            classinfHisRight.loss = lossinfW

            dataSuccess.data = classinfHisRight
            res.end(JSON.stringify(dataSuccess))
        }   
    }
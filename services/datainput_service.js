/*
	集团表的一些sql查找
	创建人：Three
	时间：2017/10/19
    */

//引入数据库Message模块
const Kpitwolev = require('../models').Kpitwolev;
const Losstier3 = require('../models').Losstier3;
const Losstier4 = require('../models').Losstier4;
const Linebody = require('../models').Linebody;
const sequelize = require('../mysql').sequelize();
const LinebodyKpitwolev = require('../models').LinebodyKpitwolev;
const LinebodyLosstier3 = require('../models').LinebodyLosstier3;
const LinebodyLosstier4 = require('../models').LinebodyLosstier4;
const UserKpitwolev = require('../models').UserKpitwolev;
const Classinformation = require('../models').Classinformation;
const Productdata = require('../models').Productdata;
const Productbigclass = require('../models').Productbigclass;
const Productsubclass = require('../models').Productsubclass;
const Productname = require('../models').Productname;
const LinebodyProductname = require('../models').LinebodyProductname;
const moment = require('moment');

/*
    根据用户设置的顺序查找二级结构
    */
    exports.selectKpitwolevidByuser = async function(userId) {      
        return await UserKpitwolev.findAll({attributes: ['kpitwolevKpitwoid'],
         where:{userUserid: userId},order: [['sequence','ASC']]})
    }

/*
    二级loss结构id找到二级目录的名字
    */
    exports.selectKpitwolevNameByid = async function(kpitwoid) {
        return await Kpitwolev.findById(kpitwoid)
    }

/*
	根据二级目录名字创建一条二级目录数据
    */
    exports.addKpitwolevByname = async function(kpitwolev,linebodyId,classinfId) {

        const kpitwolevdata = {}
        const linebody = await Linebody.findById(linebodyId)
        const classinformation = await Classinformation.findById(classinfId)    
        // 添加数据
        var linebodyKpitwolev =  await kpitwolev.createLinebodyKpitwolev(kpitwolevdata)
        await classinformation.addClassinfKpitwolevData(linebodyKpitwolev)
        await linebody.addLinebodyKpitwolev(linebodyKpitwolev)
        return linebodyKpitwolev
    }

/*
    根据二级目录名字找到对应二级目录
    */
    exports.selectTwoLevByName = async function(twolevName) {
        const kpitwolevdata = await Kpitwolev.findOne({where:{name:twolevName}})
        return kpitwolevdata;
    }

/*
    根据二级目录id找到对应三级目录结构
    */
    exports.selectLosstier3BytwoId = async function(twolevid) {
        const losstier3data = await Losstier3.findAll({'attributes': ['lossid','name'],where:{kpitwolevKpitwoid:twolevid}})
        return losstier3data;
    }

/*
    根据三级目录id找到对应四级目录结构
    */
    exports.selectLosstier4Bytier3Id = async function(tier3id) {
        const losstier4data = await Losstier4.findAll({'attributes': ['tier4id','name','losstier3Lossid'],where:{losstier3Lossid:tier3id}})
        return losstier4data;
    }

/*
    根据二级loss数据创建一条三级loss数据
    */
    exports.addLosstier3data = async function(losstier3Id,linebodyId) {
        var losstier3data = {}

        const losstier3 = await Losstier3.findById(losstier3Id)
        const linebody = await Linebody.findById(linebodyId)
        losstier3data =  await losstier3.createLinebodyLosstier3(losstier3data)
        await linebody.addLinebodyLosstier3(losstier3data)
        return losstier3data
    }

/*
    根据三级loss数据创建一条四级loss数据
    */
    exports.addLosstier4data = async function(losstier4Id,linebodyId) {

        var losstier4data = {}
        const losstier4 = await Losstier4.findById(losstier4Id)
        const linebody = await Linebody.findById(linebodyId)
        losstier4data =  await losstier4.createLinebodyLosstier4(losstier4data)
        await linebody.addLinebodyLosstier4(losstier4data)
        return losstier4data
    }

/*
    添加四级三级二级loss结构及value值
    */
    exports.addLosstier4datatime = async function(req , res) {
       const LinebodyLosstier4List = await exports.addLosstier4datavalue(req , res)
       const LinebodyLosstier3List = await exports.addLosstier3datavalue(req , res ,LinebodyLosstier4List)
       await exports.addLosstier2datavalue(req , res ,LinebodyLosstier3List)
       return LinebodyLosstier4List
   }

/*
    添加四级数据value值
    */
    exports.addLosstier4datavalue = async function(req , res) {
        const starttime = new Date(req.body.starttime)
        const endtime = new Date(req.body.endtime)
        //中间有多少个完整的15分钟

        var ccyTimeindex    //完整的15分钟个数
        var LinebodyLosstier4List =[] //返回增加的loss4值

        // 格式化
        var formatTimeReturn = await exports.formatTime(starttime,endtime)
        var  formatStarttime = formatTimeReturn.formatStarttime //格式化开始时间
        var formatEndtime = formatTimeReturn.formatEndtime  // 格式化结束时间
        ccyTimeindex = (formatEndtime.unix() - formatStarttime.unix())/(15*60) - 2
        // 判断持续时间

        if(ccyTimeindex >= 0){
            // 把开始时间到15分钟添加到表里
            var losstier4data = {
                value: (formatStarttime.unix() - moment(starttime).unix())/(15*60) + 1,
                starttime: starttime,
                endtime:  moment(formatStarttime).add(15, 'minutes')
            }
            var addLosstier4data = await exports.addLosstier4data(req.body.losstier4Id,req.body.linebodyId)
            await LinebodyLosstier4.update(losstier4data,{where:{id:addLosstier4data.id}})
            addLosstier4data = await LinebodyLosstier4.findById(addLosstier4data.id)
            LinebodyLosstier4List.push(addLosstier4data)    

            // 把15分钟到结束时间添加到表里
            var losstier4dataEnd = {
                value: (moment(endtime).unix()- formatEndtime.unix())/(15*60) + 1,
                starttime: moment(formatEndtime).subtract(15, 'minutes'),
                endtime: endtime
            }
            var addLosstier4dataEnd = await exports.addLosstier4data(req.body.losstier4Id,req.body.linebodyId)
            await LinebodyLosstier4.update(losstier4dataEnd,{where:{id:addLosstier4dataEnd.id}})
            addLosstier4dataEnd = await LinebodyLosstier4.findById(addLosstier4dataEnd.id)
            LinebodyLosstier4List.push(addLosstier4dataEnd)
            if(ccyTimeindex > 0){
                // 把中间的完整15分钟value添加到表里
                for(var i = 0;i < ccyTimeindex;i++){
                    var losstier4data = {
                        value: 1,
                        starttime: moment(formatStarttime).add(15*(i + 1), 'minutes'),
                        endtime:  moment(formatStarttime).add(15*(i + 2), 'minutes')
                    }
                    var addLosstier4data = await exports.addLosstier4data(req.body.losstier4Id,req.body.linebodyId)
                    await LinebodyLosstier4.update(losstier4data,{where:{id:addLosstier4data.id}})
                    addLosstier4data = await LinebodyLosstier4.findById(addLosstier4data.id)
                    LinebodyLosstier4List.push(addLosstier4data)

                }
            }
        }else{
            // 持续时间不到15分钟
            var losstier4data = {
                value: (endtime.getTime() - starttime.getTime())/(15*60000),
                starttime: starttime,
                endtime: endtime
            }
            var addLosstier4data = await exports.addLosstier4data(req.body.losstier4Id,req.body.linebodyId)
            await LinebodyLosstier4.update(losstier4data,{where:{id:addLosstier4data.id}})
            addLosstier4data = await LinebodyLosstier4.findById(addLosstier4data.id)
            LinebodyLosstier4List.push(addLosstier4data)
        }
        return LinebodyLosstier4List
    }



/*
    根据四级数据id查到这个四级数据
    */
    exports.selectLosstier4DataByid = async function(losstier4Dataid) {
        return LinebodyLosstier4.findById(losstier4Dataid)
    }

/*
    添加三级数据value值
    */
    exports.addLosstier3datavalue = async function(req , res , linebodyLosstier4List) {
        var linebodyLosstier3List = []
        if(linebodyLosstier4List != null){
            for(var i = 0;i < linebodyLosstier4List.length;i++){
                // 四级loss 的时间是否格式化
                var formatTimeReturn ={
                    formatStarttime : '',
                    formatEndtime : ''
                }
                // 格式化传来的四级loss data开始和结束时间
                if(linebodyLosstier4List[i].starttime.getTime()%(15*6000)==0 &&linebodyLosstier4List[i].endtime.getTime()%(15*6000)==0){
                    formatTimeReturn.formatStarttime = linebodyLosstier4List[i].starttime
                    formatTimeReturn.formatEndtime = linebodyLosstier4List[i].endtime
                }else{
                    formatTimeReturn = await exports.formatTime(linebodyLosstier4List[i].starttime,linebodyLosstier4List[i].endtime)
                }
                const losstier3Data =  await LinebodyLosstier3.findOne({
                    where:{starttime : formatTimeReturn.formatStarttime,
                        endtime : formatTimeReturn.formatEndtime,
                        losstier3Lossid : req.body.losstier3Id}})
                if(losstier3Data == null){
                    // 这个四级loss的时间在三级loss不存在，新建三级lossdata
                    var losstier3data = {
                        value: linebodyLosstier4List[i].value,
                        starttime: formatTimeReturn.formatStarttime,
                        endtime: formatTimeReturn.formatEndtime
                    }
                    var addLosstier3data = await exports.addLosstier3data(req.body.losstier3Id,req.body.linebodyId)
                    await LinebodyLosstier3.update(losstier3data,{where:{id:addLosstier3data.id}})
                    addLosstier3data = await LinebodyLosstier3.findById(addLosstier3data.id)
                    linebodyLosstier3List.push(addLosstier3data)

                    // 在四级data中更新所属的三级data
                    await addLosstier3data.addLosstier3Losstier4Data(linebodyLosstier4List[i])

                }else{
                    // 这个四级loss的时间在三级loss，把四级的value值加到三级上
                    var newValue = linebodyLosstier4List[i].value + losstier3Data.value
                    if(newValue > 1) {
                        newValue = 1
                    }
                    //-----------------------------
                    var losstier3data = {value: newValue}
                    await LinebodyLosstier3.update(losstier3data,{where:{id:losstier3Data.id}})
                    addLosstier3data = await LinebodyLosstier3.findById(losstier3Data.id)
                    linebodyLosstier3List.push(addLosstier3data)

                    // 在四级data中更新所属的三级data
                    await losstier3Data.addLosstier3Losstier4Data(linebodyLosstier4List[i])
                }
            }
        }
        return linebodyLosstier3List
    }

/*
    格式化loss data的开始时间和结束时间
    例： 开始时间 16:05:00 --> 16:00:00 结束时间 16:05:00 --> 16:15:00
    */
    exports.formatTime = async function(starttime,endtime) {
    var formatStarttime //格式化开始时间
    var formatEndtime   // 格式化结束时间

    var timesetFlag = false
    var timeendsetFlag = false
    for(var l = 0;l < 4;l++){
        if(moment(starttime).unix()%(15*60) == 0 && timesetFlag == false){
            formatStarttime = moment(starttime)
            timesetFlag = true
        }
        if(moment(endtime).unix()%(15*60) == 0 && timeendsetFlag == false){
            formatEndtime = moment(endtime)
            timeendsetFlag = true
        }

        if(moment(starttime).minute() < 15*(l + 1) && timesetFlag == false){
            formatStarttime = moment(starttime).set({'minute': 15*l ,'second': 00})
            timesetFlag = true

        }  
        if(moment(endtime).minute() < 15*(l + 1)&& timeendsetFlag == false){
            formatEndtime = moment(endtime).set({'minute': 15*(l + 1) ,'second': 00})
            break
        }
    }

    // 返回值设定
    return formatTimeReturn ={
        formatStarttime : formatStarttime,
        formatEndtime : formatEndtime
    }
}


/*
    添加二级数据value值
    */
    exports.addLosstier2datavalue = async function(req , res , linebodyLosstier3List) {

        if(linebodyLosstier3List != null){
            for(var i = 0;i < linebodyLosstier3List.length;i++){
                // 四级loss 的时间是否格式化
                var formatTimeReturn ={
                    formatStarttime : '',
                    formatEndtime : ''
                }
                // 格式化传来的三级loss data开始和结束时间
                if(linebodyLosstier3List[i].starttime.getTime()%(15*6000)==0 &&linebodyLosstier3List[i].endtime.getTime()%(15*6000)==0){
                    formatTimeReturn.formatStarttime = linebodyLosstier3List[i].starttime
                    formatTimeReturn.formatEndtime = linebodyLosstier3List[i].endtime
                }else{
                    formatTimeReturn = await exports.formatTime(linebodyLosstier3List[i].starttime,linebodyLosstier3List[i].endtime)
                }
                const kpitwolev = await Kpitwolev.findOne({where:{name:req.body.twolevName}})
                const kpitwolevData =  await LinebodyKpitwolev.findOne({
                    where:{starttime : formatTimeReturn.formatStarttime,
                        endtime : formatTimeReturn.formatEndtime,
                        kpitwolevKpitwoid : kpitwolev.kpitwoid}})
                if(kpitwolevData == null){
                    // 这个三级loss的时间在二级loss不存在，新建三级lossdata
                    var kpitwolevdata = {
                        value: linebodyLosstier3List[i].value,
                        starttime: formatTimeReturn.formatStarttime,
                        endtime: formatTimeReturn.formatEndtime
                    }
                    var addKpitwolevdata= await exports.addKpitwolevByname(kpitwolev,req.body.linebodyId,req.body.classinfId)
                    await LinebodyKpitwolev.update(kpitwolevdata,{where:{id:addKpitwolevdata.id}})

                    // 在三级data中更新所属的二级data
                    await addKpitwolevdata.addKpitwolevLosstier3Data(linebodyLosstier3List[i])
                }else{
                    // 这个三级loss的时间在二级loss，把三级的value值加到二级上
                    var newValue = linebodyLosstier3List[i].value + kpitwolevData.value
                    if(newValue > 1) {
                        newValue = 1
                    }
                    // ------------------
                    var kpitwolevdata = {value: newValue}
                    await LinebodyKpitwolev.update(kpitwolevdata,{where:{id:kpitwolevData.id}})

                    // 在三级data中更新所属的二级data
                    await kpitwolevData.addKpitwolevLosstier3Data(linebodyLosstier3List[i])
                }
            }
        }

    }

/*
    验证添加的这个二级loss数据是否重复
    */
    exports.selectKpitwolevDataBy = async function(req , res) {
        const kpitwolev = await Kpitwolev.findOne({where:{name:req.body.twolevName}})
        return await LinebodyKpitwolev.findOne({where:{
            classinformationClassinfid: req.body.classinfId,
            linebodyLinebodyid: req.body.linebodyId,
            kpitwolevKpitwoid: kpitwolev.kpitwoid
        }})
    }

/*
    验证添加的这个三级loss数据是否重复
    */
    exports.selectLosstier3By = async function(twolevDataid,losstier3Id,linebodyId) {
        return await LinebodyLosstier3.findOne({where:{
            linebodyLinebodyid: linebodyId,
            losstier3Lossid: losstier3Id,
            linebodyKpitwolevId: twolevDataid
        }})
    }
/*
    验证添加的这个四级loss数据是否重复
    */
    exports.selectLosstier4DataBy = async function(req , res) {
        return await LinebodyLosstier4.findOne({where:{
            starttime: req.body.starttime,
            endtime: req.body.endtime,
            linebodyLinebodyid: req.body.linebodyId,
            losstier4Tier4id: req.body.losstier4Id,
            linebodylosstier3Id: req.body.losstier3Dataid
        }})
    }

/*
    展示产品名字（最小的产品类）下拉列表
    */
    exports.selectProductnameById = async function(linebodyId) {
       const lineproductnameList = await LinebodyProductname.findAll({where:{linebodyLinebodyid:linebodyId}})

       var productnameIdList = []
       var productsubIdList = []
       var productbigIdList = []

       var sproductbigIdList = []
       if(lineproductnameList != null){
        for(var i = 0;i < lineproductnameList.length;i++){

            const productname = await Productname.findById(lineproductnameList[i].productnameId)
            productnameIdList.push(productname.id)

            const productsubclass = await Productsubclass.findById(productname.productsubclassId)
            productsubIdList.push(productsubclass.id)

            const productbigclass = await Productbigclass.findById(productsubclass.productbigclassId)
            productbigIdList.push(productbigclass.id)
        }
    }

    // 查重后的数组
    var productnameIdListNo = await exports.unique2(productnameIdList)
    var productsubIdListNo = await exports.unique2(productsubIdList)
    var productbigIdListNo = await exports.unique2(productbigIdList)
    if(productbigIdListNo != null){
        for(var i = 0;i < productbigIdListNo.length;i++){
            var sproductsubIdList = []
            var childData ={
                value : '',
                label : '',
                children : ''}
        // 把大类放到显示格式里
        const productbigclass = await Productbigclass.findById(productbigIdListNo[i])
        childData.value = productbigclass.id
        childData.label = productbigclass.name

        // 查询大类下的产品小类
        const productsubclass = await Productsubclass.findAll({where:{productbigclassId:productbigIdListNo[i]}})
        if(productsubclass != null){
           for(var j = 0;j < productsubclass.length;j++){
            var sproductnameIdList = []
            var childsubData ={
                value : '',
                label : '',
                children : ''}       
                if(productsubIdListNo.indexOf(productsubclass[j].id) > -1){
                    childsubData.value = productsubclass[j].id
                    childsubData.label = productsubclass[j].name 

                // 查询产品小类下的产品名称
                const productname = await Productname.findAll({where:{productsubclassId:productsubclass[j].id}})
                if(productname != null){
                    for(var k = 0;k < productname.length;k++){
                      var childrenname ={
                        value : '',
                        label : ''}
                        if(productnameIdListNo.indexOf(productname[k].id) > -1){
                            childrenname.value = productname[k].id
                            childrenname.label = productname[k].name 
                            sproductnameIdList.push(childrenname)
                        }
                    }
                }
                childsubData.children = sproductnameIdList
                sproductsubIdList.push(childsubData)
            }
        }
    }

    childData.children = sproductsubIdList
    sproductbigIdList.push(childData)
}
}


return  sproductbigIdList

}

/*
    数组查重
    */
    exports.unique2 = async function(thisList) {
        thisList.sort();
        var res = [thisList[0]];
        for(var i = 1; i < thisList.length; i++){
          if(thisList[i] !== res[res.length - 1]){
           res.push(thisList[i]);
       }
   }
   return res
}

/*
    展示产品数据信息数据
    */
    exports.selectProductByclassId = async function(classinfId) {
        return  await Productdata.findAll({where:{classinformationClassinfid:classinfId}})  
    }

/*
    验证添加的产品信息是否重复
    */
    exports.selectProductdataBy = async function(linebodyId,classinfId,productnameId) {
        const lineproductname = await LinebodyProductname.findOne({
            where:{productnameId:productnameId,linebodyLinebodyid:linebodyId}})
        return  await Productdata.findOne({
            where: {classinformationClassinfid:classinfId,linebodyproductnameId:lineproductname.id}})
    }

/*
    添加产品信息数据
    */
    exports.addProduct = async function(req , res) {
        var productdata = {
            conformproduct : req.body.conformProduct
        }
        const classinformation = await Classinformation.findById(req.body.classinfId) 
        const lineproductname = await LinebodyProductname.findOne({
            where:{productnameId:req.body.productNameId,linebodyLinebodyid:req.body.linebodyId}})
        productdata = await Productdata.create(productdata)
        await lineproductname.addLineProductnameproductdata(productdata)
        await classinformation.addClassinfProductData(productdata)
        return productdata
    }

/*
    根据id查找组合名字： 产品大类/产品小类/产品名字
    */
    exports.selectconcatNameById = async function(linebodyproductnameId) {
        const lineproductname = await LinebodyProductname.findById(linebodyproductnameId)
        const productname =  await Productname.findById(lineproductname.productnameId)
        const productsubclass = await Productsubclass.findById(productname.productsubclassId)
        const productbigclass = await Productbigclass.findById(productsubclass.productbigclassId)
        return productbigclass.name +'/'+ productsubclass.name +'/'+productname.name
    }

/*
    根据线体id和产品名称id查找产品ccy时间
    */
    exports.selectCCYtimeById = async function(linebodyproductnameId) {
       return await LinebodyProductname.findById(linebodyproductnameId)  
   }

/*
    根据productnameId查找产品数据
    */
    exports.selectProductDataByName = async function(linebodyproductnameId,classinfId) {
        return  await Productdata.findAll({where:{linebodyproductnameId:linebodyproductnameId,classinformationClassinfid:classinfId}})
    }

/*
    删除产品信息数据
    */
    exports.deleteProduct = async function(productId) {

      const productdata =  await Productdata.findById(productId)
      const deleteReturn = await productdata.destroy()
      return deleteReturn
  }

/*
    更改产品信息数据
    */
    exports.updateProduct = async function(req , res) {
        productdata = {
            conformproduct:req.body.conformProduct
        }

        const updateReturn =  await Productdata.update(productdata,
            {where:{productid:req.body.productId}})
        return updateReturn
    }

/*
    添加开班时间详细信息数据
    */
    exports.addClassinf = async function(classStarttime,classEndtime,
        shouldAttendance,actualAttendance) {
        var classinforData = {
            classstarttime : classStarttime,
            classendtime : classEndtime,
            shouldattendance : shouldAttendance,
            actualattendance : actualAttendance
        }
        classinforData =  await Classinformation.create(classinforData)
        return classinforData
    }

/*
    根据classid找到开班数据
    */
    exports.classinforSelectById = async function(classinfId) {
     return classinforData =  await Classinformation.findById(classinfId)
 }

/*
    根据四级的id找到二级三级名字
    */
    exports.showNameByloss4dataId = async function(losstier4Dataid,showAddloss4After) {

        const losstier4Data = await LinebodyLosstier4.findById(losstier4Dataid)
        showAddloss4After.losstier4Dataid = losstier4Dataid
        showAddloss4After.starttime = losstier4Data.starttime
        showAddloss4After.endtime = losstier4Data.endtime
        const losstier4 = await Losstier4.findById(losstier4Data.losstier4Tier4id)
        showAddloss4After.losstier4name = losstier4.name
        const losstier3Data = await LinebodyLosstier3.findById(losstier4Data.linebodylosstier3Id)
        const losstier3 = await Losstier3.findById(losstier3Data.losstier3Lossid)
        showAddloss4After.losstier3name = losstier3.name
        const kpitwolevData = await LinebodyKpitwolev.findById(losstier3Data.linebodyKpitwolevId)
        const kpitwolev = await Kpitwolev.findById(kpitwolevData.kpitwolevKpitwoid)
        showAddloss4After.losstier2name = kpitwolev.name
        return showAddloss4After
    }

/*
    删除loss4级data
    */
    exports.deleteLoss4data = async function(losstier4Dataid) {

        const loss4data =  await LinebodyLosstier4.findById(losstier4Dataid)
        var data =  await loss4data.destroy();
        return data
    }
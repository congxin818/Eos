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
const Productname = require('../models').Productname;
const LinebodyProductname = require('../models').LinebodyProductname;

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
    exports.addKpitwolevByname = async function(req) {

        const kpitwolevdata = {}
        const kpitwolev = await Kpitwolev.findOne({where:{name:req.body.twolevName}})
        const linebody = await Linebody.findById(req.body.linebodyId)
        const classinformation = await Classinformation.findById(req.body.classinfId)    
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
    exports.addLosstier3data = async function(twolevDataid,losstier3Id,linebodyId) {
        var losstier3data = {}
        const twolevData = await LinebodyKpitwolev.findById(twolevDataid)
        const losstier3 = await Losstier3.findById(losstier3Id)
        const linebody = await Linebody.findById(linebodyId)
        losstier3data =  await losstier3.createLinebodyLosstier3(losstier3data)
        await twolevData.addKpitwolevLosstier3Data(losstier3data)
        await linebody.addLinebodyLosstier3(losstier3data)
        return losstier3data
    }

/*
    根据三级loss数据创建一条四级loss数据
    */
    exports.addLosstier4data = async function(losstier3Dataid,losstier4Id,linebodyId) {

        var losstier4data = {}
        const losstier3Data = await LinebodyLosstier3.findById(losstier3Dataid)
        const losstier4 = await Losstier4.findById(losstier4Id)
        const linebody = await Linebody.findById(linebodyId)
        losstier4data =  await losstier4.createLinebodyLosstier4(losstier4data)
        await losstier3Data.addLosstier3Losstier4Data(losstier4data)
        await linebody.addLinebodyLosstier4(losstier4data)
        return losstier4data
    }

/*
    添加四级loss数据的开始时间和结束时间
    */
    exports.addLosstier4datatime = async function(req , res) {
      const starttime = new Date(req.body.starttime)
      const endtime = new Date(req.body.endtime)
      var losstier4data = {
        starttime: starttime,
        endtime: endtime
    }
    const addReturn = await LinebodyLosstier4.update(losstier4data,{where:{id:req.body.losstier4Dataid}});

    await exports.addLosstier4datavalue(starttime , endtime ,req.body.losstier4Dataid)
    await exports.addLosstier3datavalue(req.body.losstier4Dataid)
    await exports.addLosstier2datavalue(req.body.losstier4Dataid)

    return addReturn
}

/*
    添加四级数据value值
    */
    exports.addLosstier4datavalue = async function(starttime , endtime ,losstier4Dataid) {
        // 持续时间（毫秒）
        const duration = endtime.getTime() - starttime.getTime()
        // 找到开班时间（毫秒）
        const losstier4Data =  await LinebodyLosstier4.findById(losstier4Dataid)
        const losstier3Data = await LinebodyLosstier3.findById(losstier4Data.linebodylosstier3Id)
        const kpitwolevData = await LinebodyKpitwolev.findById(losstier3Data.linebodyKpitwolevId)
        const classinformation = await Classinformation.findById(kpitwolevData.classinformationClassinfid)
        const classstarttime = classinformation.classstarttime
        const classendtime = classinformation.classendtime
        const classDuration = classendtime.getTime() - classstarttime.getTime()
        const tier4value = (duration/classDuration).toFixed(4)
        var losstier4data = {value: tier4value}
        await LinebodyLosstier4.update(losstier4data,{where:{id:losstier4Dataid}})
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
    exports.addLosstier3datavalue = async function(losstier4Dataid) {
        //把这个四级value的值加到对应的三级目录上
        const losstier4Data =  await LinebodyLosstier4.findById(losstier4Dataid)
        const loss4DataList = await  LinebodyLosstier4.findAll({'attributes': ['value'],where:{
            linebodylosstier3Id: losstier4Data.linebodylosstier3Id
        }})
        var loss4Datasum = []
        for(var i = 0;i<loss4DataList.length;i++){
            loss4Datasum.push(loss4DataList[i].value)
        }
        const sumloss4Datavalue = await loss4Datasum.reduce(function(pre,cur){return pre + cur})
        var losstier3data = {value: sumloss4Datavalue}
        await LinebodyLosstier3.update(losstier3data,{where:{id:losstier4Data.linebodylosstier3Id}})
    }

/*
    添加二级数据value值
    */
    exports.addLosstier2datavalue = async function(losstier4Dataid) {
        //把这个三级value的值加到对应的二级目录上
        const losstier4Data =  await LinebodyLosstier4.findById(losstier4Dataid)
        const losstier3Data = await LinebodyLosstier3.findById(losstier4Data.linebodylosstier3Id)
        const loss3DataList = await  LinebodyLosstier3.findAll({'attributes': ['value'],where:{
            linebodyKpitwolevId: losstier3Data.linebodyKpitwolevId}})
        var loss3Datasum = []
        for(var i = 0;i<loss3DataList.length;i++){
            loss3Datasum.push(loss3DataList[i].value)
        }
        const sumloss3Datavalue = await loss3Datasum.reduce(function(pre,cur){return pre + cur})
        var kpitwolevdata = {value: sumloss3Datavalue}
        await LinebodyKpitwolev.update(kpitwolevdata,{where:{id:losstier3Data.linebodyKpitwolevId}})
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
         var productnameList = []
         for(var i=0;i<lineproductnameList.length;i++){
            const productname = await Productname.findById(lineproductnameList[i].productnameId)
            productnameList.push(productname)    
         }  
        return  productnameList

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
    根据id查找产品名字
    */
    exports.selectProductNameById = async function(linebodyproductnameId) {
        const lineproductname = await LinebodyProductname.findById(linebodyproductnameId)
        return  await Productname.findById(lineproductname.productnameId)
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
/*
    区域控制处理
    创建人：THree
    时间：2017/10/26
    */

//引入数据库Message模块
var Group = require('../models/group');
const groupconler = require('./group_controller');
const factoryconler = require('./factory_controller');
const workshopconler = require('./workshop_controller');
const linebodyconler = require('./linebody_controller');
const services = require('../services/group_service');
const facServices = require('../services/factory_service');
const wksServices = require('../services/workshop_service');
const linbyServices = require('../services/linebody_service');

const dataSuccess = {

    status: '0', 
    msg: '请求成功',
    data:'fas'
};

const parameterError = {
    status: '1', 
    msg: '参数错误'
};

const namehasError = {
    status: '101', 
    msg: '集团已存在'
};

/*
    查询所有集团和工厂
    */
    exports.selectAreaAll = async (req , res) => {
        console.log ('开始查找')
        if (req == '') {
            return parameterError
        }
        var treeShowGroupData = [];
        var treeShowFacData = [];
        var treeShowWosData = [];
        var treeShowLinbyData = [];

        const groupData = await services.selectGroupAll(req , res)
        //把集团表通过一定格式展示出来
        groupData.forEach(groupDataOne => {
            const data1 = areaValSet(groupDataOne.groupid,groupDataOne.groupname,null,groupDataOne.checked)
            treeShowGroupData.push(data1)
        })

        const factoryData = await facServices.selectFactoryAll(req , res)
        factoryData.forEach(factoryDataOne => {
            const data2 = areaValSet(factoryDataOne.factoryid +'f',factoryDataOne.factoryname,
                factoryDataOne.factorybelong,factoryDataOne.checked)
            treeShowFacData.push(data2)
        })

        const workshopData = await wksServices.selectWorkshopAll(req , res)
        //把车间表通过一定格式展示出来
        workshopData.forEach(workshopDataOne => {
            const data3 = areaValSet(workshopDataOne.workshopid + 'w',workshopDataOne.workshopname,
                workshopDataOne.workshopbelong,workshopDataOne.checked);
            treeShowWosData.push(data3)
        })

        const linebodyData = await linbyServices.selectLinebodyAll(req , res)
        //把线体表通过一定格式展示出来
        linebodyData.forEach(linebodyDataOne => {
            const data4 = areaValSet(linebodyDataOne.linebodyid + 'l',linebodyDataOne.linebodyname,
                linebodyDataOne.linebodybelong,linebodyDataOne.checked);
            treeShowLinbyData.push(data4)
        })
        var contGFData = treeShowGroupData.concat(treeShowFacData)
        .concat(treeShowWosData).concat(treeShowLinbyData)

        return contGFData
    }

/*
    把区域的格式设置为树图格式
    */
    var areaValSet =function(id,name,pId,checked){
        var treeShow = {
          id:'fas',
          name:'fas',
          pId:null,
          checked:'fas'
      };

      treeShow.id = id;
      treeShow.name = name;
      treeShow.pId = pId;
      treeShow.checked = checked;
      return treeShow;
  }

/*
    判断要更改的表（集团、工厂、车间、线体）
    调用相对应的update函数
    */
    exports.updateAreafrist = async function(req , res){
        //如果没有post数据或者数据为空,直接返回
        if(req.body.id == null || req.body.id == '' || req.body.name == null 
          || req.body.name == ''){
            return parameterError
    }
    if (req.body.perId == null){
        // 更改一个集团
        const updateReturn = await groupconler.updateGroupById(req , res);
        return updateReturn
    }
    var areaFlag = await req.body.perId.slice(0,1);
    if(!isNaN(areaFlag)){
        // 更改一个工厂
        req.body.id.factoryId = req.body.id.slice(1,);
        const updateReturn = await factoryconler.addFactoryOne(req , res);
        return updateReturn
        
    }else{
        if(areaFlag == 'f'){
            // 更改一个车间
            const updateReturn = await workshopconler.addWorkshopOne(req , res);
            return updateReturn
        }else if(areaFlag == 'w'){
            // 更改一个车间
            const updateReturn = await linebodyconler.addLinebodyOne(req , res);
            return updateReturn
        }
    }
}

/*
    判断要增加的表（集团、工厂、车间、线体）
    调用相对应的增加函数
    */
    exports.addAreaOnefrist = async function(req , res){
    //如果没有post数据或者数据为空,直接返回
    if( req.body.name == null || req.body.name == ''){
        return parameterError
    }
    if (areaFlag == null){
        // 添加一个集团
        const addReturn = await groupconler.addGroupOne(req , res);
        return addReturn
    }
    var areaFlag = await req.body.perId.slice(0,1);
    if(!isNaN(areaFlag)){  
        // 添加一个工厂
        const addReturn = await factoryconler.addFactoryOne(req , res);
        return addReturn     
    }else{
        if(areaFlag == 'f'){
            // 添加一个车间
            const addReturn = await workshopconler.addWorkshopOne(req , res);
            return addReturn
        }else if(areaFlag == 'w'){
            // 添加一个车间
            const addReturn = await linebodyconler.addLinebodyOne(req , res);
            return addReturn
        }
    }
}

/*
    把区域的树状图展示出来
    */
    exports.showAreaAll =  async function(req , res){
        const allData =  await exports.selectAreaAll(req , res);
        res.end(JSON.stringify(allData));
    }

/*
    添加一个区域并重新刷新整个树图 合并
    */
    exports.addAreaOne = async function(req , res){
        const addReturn = await exports.addAreaOnefrist(req , res,);
        if(addReturn== undefined ||addReturn == ''||addReturn == null){
            const allData = await exports.selectAreaAll(req , res);
            res.end(JSON.stringify(allData));
        }
        res.end(JSON.stringify(addReturn));
        
    }
/*
    更改一个区域并重新刷新整个树图 合并
    */
    exports.updateArea = async function(req , res){
        const updateReturn = await exports.updateAreafrist(req , res,);
        if(updateReturn== undefined ||updateReturn == ''||updateReturn == null){
            const allData = await exports.selectAreaAll(req , res);
            res.end(JSON.stringify(allData));
        }
        res.end(JSON.stringify(updateReturn));
        
    }
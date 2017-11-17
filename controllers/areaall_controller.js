/*
    区域控制处理
    创建人：THree
    时间：2017/10/26
    */

//引入数据库Message模块
const groupconler = require('./group_controller');
const factoryconler = require('./factory_controller');
const workshopconler = require('./workshop_controller');
const linebodyconler = require('./linebody_controller');
const services = require('../services/group_service');
const facServices = require('../services/factory_service');
const wksServices = require('../services/workshop_service');
const linbyServices = require('../services/linebody_service');
const errorUtil = require('../utils/errorUtil');

const dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

const parameterError = {
    status: '1', 0
    msg: '参数错误'
};

const namehasError = {
    status: '101', 
    msg: '集团已存在'
};

const addAreaError = {
    status: '201', 
    msg: '添加数据错误'
};
const updateAreaError = {
    status: '301', 
    msg: '更新数据错误'
};

/*
    查询所有集团和工厂
    */
    async function selectAreaAll(req , res){
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
            const data2 = areaValSet('f' + factoryDataOne.factoryid,factoryDataOne.factoryname,

                factoryDataOne.factorybelong,factoryDataOne.checked)
            treeShowFacData.push(data2)
        })

        const workshopData = await wksServices.selectWorkshopAll(req , res)
        //把车间表通过一定格式展示出来
        workshopData.forEach(workshopDataOne => {
            const data3 = areaValSet('w'+ workshopDataOne.workshopid,workshopDataOne.workshopname,

                workshopDataOne.workshopbelong,workshopDataOne.checked);
            treeShowWosData.push(data3)
        })

        const linebodyData = await linbyServices.selectLinebodyAll(req , res)
        //把线体表通过一定格式展示出来
        linebodyData.forEach(linebodyDataOne => {
            const data4 = areaValSet('l' + linebodyDataOne.linebodyid,linebodyDataOne.linebodyname,
                linebodyDataOne.linebodybelong,linebodyDataOne.checked);
            treeShowLinbyData.push(data4)
        })
        var contGFData = await treeShowGroupData.concat(treeShowFacData)
        .concat(treeShowWosData).concat(treeShowLinbyData)

        return contGFData
    }
    exports.selectAreaAll = selectAreaAll;
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
    exports.updateArea = async function(req , res){
        //如果没有post数据或者数据为空,直接返回
        if(req.body.id == null || req.body.id == '' || req.body.name == null 
          || req.body.name == ''){
            return parameterError
    }
    var areaFlag = await req.body.id.slice(0,1);
    var areaId = req.body.id.slice(1,);
    if (!isNaN(areaFlag)){
        // 更改一个集团
        const updateReturn = await groupconler.updateGroupById(req , res);
        // 验证更改的名字是否重复
        if(updateReturn.status=='101')
            res.end(JSON.stringify(updateReturn));
        if(updateReturn == 1){
         res.end(JSON.stringify(dataSuccess))
     }else{
         res.end(JSON.stringify(updateAreaError))
     }
 }   
 
 if(areaFlag == 'f'){
        // 更改一个工厂
        req.body.factoryId = areaId;
        const updateReturn = await factoryconler.updateFactoryById(req , res);
        // 验证更改的名字是否重复
        if(updateReturn.status=='101')
            res.end(JSON.stringify(updateReturn));
        if(updateReturn.length == 1){
         res.end(JSON.stringify(dataSuccess))
     }else{
         res.end(JSON.stringify(updateAreaError))
     }
 }
 if(areaFlag == 'w'){
        // 更改一个车间
        req.body.workshopId = areaId;
        const updateReturn = await workshopconler.updateWorkshopById(req , res);
        // 验证更改的名字是否重复
        if(updateReturn.status=='101')
            res.end(JSON.stringify(updateReturn));
        if(updateReturn == '1'){
         res.end(JSON.stringify(dataSuccess))
     }else{
         res.end(JSON.stringify(updateAreaError))
     }
 } 
 if(areaFlag == 'l'){
        // 更改一个线体           
        req.body.linebodyId = areaId;
        const updateReturn = await linebodyconler.updateLinebodyById(req , res);
        // 验证更改的名字是否重复
        if(updateReturn.status=='101')
            res.end(JSON.stringify(updateReturn));
        if(updateReturn == 1){
         res.end(JSON.stringify(dataSuccess))
     }else{
         res.end(JSON.stringify(updateAreaError))
     }
 }
}

/*  
    判断要增加的表（集团、工厂、车间、线体）
    调用相对应的增加函数
    */
    exports.addAreaOne = async function(req , res){
    //如果没有post数据或者数据为空,直接返回
    if( req.body.name == null || req.body.name == ''||req.body.pId == ''){
        res.end(JSON.stringify(parameterError));
    }else{
        if (req.body.pId == null){
        // 添加一个集团
        const addData = await groupconler.addGroupOne(req , res);
        // 增加的验证
        if(addData.status=='101')
            res.end(JSON.stringify(addData));
        if(addData == null || addData == '')
            res.end(JSON.stringify(addAreaError));
        // 按格式显示
        const addRetrun = await areaValSet(addData.groupid,addData.groupname,null,addData.checked);
        res.end(JSON.stringify(addRetrun));
    }
    var areaFlag = await req.body.pId.slice(0,1);
    if(!isNaN(areaFlag)){  
        // 添加一个工厂
        const addData = await factoryconler.addFactoryOne(req , res);
        // 增加的验证
        if(addData.status=='101'||addData.status=='1')
            res.end(JSON.stringify(addData));
        if(addData == null || addData == '')
            res.end(JSON.stringify(addAreaError));
        // 按格式显示
        const addRetrun = await areaValSet('f'+addData.factoryid,addData.factoryname,
            addData.factorybelong,addData.checked);
        res.end(JSON.stringify(addRetrun));   
    }else{
        if(areaFlag == 'f'){
            // 添加一个车间
            const addData = await workshopconler.addWorkshopOne(req , res);
            // 增加的验证
            if(addData.status=='101'||addData.status=='1')
                res.end(JSON.stringify(addData));
            if(addData == null || addData == '')
                res.end(JSON.stringify(addAreaError));
            // 按格式显示
            const addRetrun = await areaValSet('w'+addData.workshopid,addData.workshopname,
                addData.workshopbelong,addData.checked);
            res.end(JSON.stringify(addRetrun));
        }else if(areaFlag == 'w'){
            // 添加一个线体
            const addData = await linebodyconler.addLinebodyOne(req , res);
            // 增加的验证
            if(addData.status=='101'||addData.status=='1')
                res.end(JSON.stringify(addData));
            if(addData == null || addData == '')
                res.end(JSON.stringify(addAreaError));
              // 按格式显示
              const addRetrun = await areaValSet('l'+addData.linebodyid,addData.linebodyname,
                addData.linebodybelong,addData.checked);
              res.end(JSON.stringify(addRetrun));
          }
      }
  }

}


/*
    判断要删除的表（集团、工厂、车间、线体）
    调用相对应的update函数
    */
    exports.deleteArea = async function(req , res){
        //如果没有post数据或者数据为空,直接返回
        if(req.query.id == null || req.query.id == ''){
            res.end(JSON.stringify(parameterError));
        }
        var deleteReturn;
        var areaFlag = await req.query.id.slice(0,1);
        var areaId = req.query.id.slice(1,);
        if (!isNaN(areaFlag)){
            // 删除一个集团
             deleteReturn = await groupconler.deleteGroupById(req , res);
        }   
        else if(areaFlag == 'f'){
            // 删除一个工厂
            req.query.factoryId = areaId;
             deleteReturn = await factoryconler.deleteFactoryById(req , res);
        }
        else if(areaFlag == 'w'){
            // 删除一个车间
            req.query.workshopId = areaId;
             deleteReturn = await workshopconler.deleteWorkshopById(req , res);
        }
        else if(areaFlag == 'l'){
            // 删除一个线体           
            req.query.linebodyId = areaId;
             deleteReturn = await linebodyconler.deleteLinebodyById(req , res);       
        }else {
            deleteReturn = errorUtil.noExistError
        }
        if(deleteReturn == ''||deleteReturn == null||deleteReturn == undefined){
            res.end(JSON.stringify(dataSuccess));
        }else{            
            res.end(JSON.stringify(deleteReturn));
        }

    }

/*
    把区域的树状图展示出来
    */
    exports.showAreaAll =  async function(req , res){
        const allData =  await exports.selectAreaAll(req , res);
        res.end(JSON.stringify(allData));
    }



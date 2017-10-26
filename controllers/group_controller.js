/*
    集团控制处理
    创建人：THree
    时间：2017/10/18
    */

//引入数据库Message模块
const Group = require('../models/group');

const service = require('../services/group_service');
const nameEtdService = require('../services/group_extend_service');
const services = require('../services/group_service');
const facServices = require('../services/factory_service');
const wksServices = require('../services/workshop_service');
const linbyServices = require('../services/linebody_service');
const factoryconler = require('./factory_controller');
const workshopconler = require('./workshop_controller');
const linebodyconler = require('./linebody_controller');

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
	展示所有集团
    */
    exports.selectGroupAll = function(req , res) {
        if (req == '') {
            res.end(JOSN.stringify(parameterError));
            return;
        }
        services.selectGroupAll(req , res).then(function(data){
        //console.log(data);
        if (data == '' || data == undefined || data == null) {
            dataSuccess.data = null;
        }else{dataSuccess.data = data;}
        res.end(JSON.stringify(dataSuccess));
    });
    }

/*
	根据id查找一个集团
    */
    exports.selectGroupById = function(req , res) {
	//如果没有id或者id为空,直接返回
    if (req.body.groupId == undefined || req.body.groupId == '') {
        res.end(JOSN.stringify(parameterError));
        return;
    }
    services.selectGroupById(req , res).then(function(data){
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
	添加一个集团
    */
    exports.addGroupOne = async function(req , res) {

	//如果没有post数据或者数据为空,直接返回
    if (req.body.groupName == undefined ||req.body.groupName == '') {
        return parameterError;
    }

    const data = await nameEtdService.selectGroupByName(req , res)
            // 对集团名字是否成功进行判断
            if(data == null||data == ''||data == undefined){
                //创建一条记录,创建成功后返回json数据
                const p = await services.addGroupOne(req , res)
                if(p == null||p == ''||p == undefined){
                    return parameterError;
                }
            }else{
               const namehasError = {
                   status: '101', 
                   msg: '集团已存在'
               };
               return namehasError;
           }

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
    添加一个区域（集团、工厂、车间、线体）
    */
    exports.addAreaOnefrist = async function(req , res){
     //如果没有post数据或者数据为空,直接返回
     if (req.body.perId == undefined ||req.body.perId == '') {
        return parameterError
    }
    var areaFlag = req.body.perId.slice(0,1);
    if(!isNaN(areaFlag)){
        if (areaFlag == 0){
        // 添加一个集团
        const addReturn = await exports.addGroupOne(req , res);
        return addReturn
    }else{
        // 添加一个工厂
        factoryconler.addFactoryOne(req , res);
    }
}else{
    if(areaFlag == 'f'){
        // 添加一个车间
        workshopconler.addWorkshopOne(req , res);
    }else if(areaFlag == 'w'){
        // 添加一个车间
        linebodyconler.addLinebodyOne(req , res);
    }
}
}

/*
	根据id删除集团
    */
    exports.deleteGroupById = function(req , res) {
	//如果没有username字段,返回404
    if (req.query.groupId == undefined ||req.query.groupId == '') {
        res.end(JOSN.stringify(parameterError));
        return;
    }
    //先查找,再调用删除,最后返回json数据
    services.deleteGroupById(req , res).then(function(data){
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
	根据id更新集团
    */
    exports.updateGroupById = function(req , res) {
    //如果没有post数据或者数据为空,直接返回
    if (req.body.groupId == undefined ||req.body.groupId == ''
        ||req.body.groupName == undefined ||req.body.groupName == '') {
        res.end(JSON.stringify(parameterError));
    return;
}
    //更新一条记录,更新成功后跳转回首页
    services.updateGroupById(req , res).then(function(data){
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
    查询所有集团和工厂
    */
    exports.selectAreaAll = async (req , res) => {
        console.log ('开始查找')
        if (req == '') {
            return JOSN.stringify(parameterError)
        }

        var treeShowGroupData = [];
        var treeShowFacData = [];
        var treeShowWosData = [];
        var treeShowLinbyData = [];

        const groupData = await services.selectGroupAll(req , res)
        //把集团表通过一定格式展示出来

        groupData.forEach(groupDataOne => {
            const data1 = areaValSet(groupDataOne.groupid,groupDataOne.groupname,0,groupDataOne.groupid)
            treeShowGroupData.push(data1)
        })

        const factoryData = await facServices.selectFactoryAll(req , res)
        factoryData.forEach(factoryDataOne => {
            const data2 = areaValSet(factoryDataOne.factoryid +'f',factoryDataOne.factoryname,
                factoryDataOne.factorybelong,factoryDataOne.factoryid)
            treeShowFacData.push(data2)
        })

        const workshopData = await wksServices.selectWorkshopAll(req , res)
            //把车间表通过一定格式展示出来
            workshopData.forEach(workshopDataOne => {
                const data3 = areaValSet(workshopDataOne.workshopid + 'w',workshopDataOne.workshopname,
                    workshopDataOne.workshopbelong,workshopDataOne.workshopid);
                treeShowWosData.push(data3)
            })

            const linebodyData = await linbyServices.selectLinebodyAll(req , res)
            //把线体表通过一定格式展示出来
            linebodyData.forEach(linebodyDataOne => {
                const data4 = areaValSet(linebodyDataOne.linebodyid + 'l',linebodyDataOne.linebodyname,
                    linebodyDataOne.linebodybelong,linebodyDataOne.linebodyid);
                treeShowLinbyData.push(data4)
            })

            var contGFData = treeShowGroupData.concat(treeShowFacData)
            .concat(treeShowWosData).concat(treeShowLinbyData)

            return contGFData
        }

/*
    把区域的格式设置为树图格式
    */
    var areaValSet =function(id,name,pId,areaid){
        var treeShow = {
          id:'fas',
          name:'fas',
          pId:''
      };

      treeShow.id = id;
      treeShow.name = name;
      treeShow.pId = pId;
      return treeShow;
  }
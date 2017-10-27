/*
    KPI控制处理
    创建人：THree
    时间：2017/10/18
    */

//引入数据库Message模块
var onelevServices = require('../services/kpionelev_service');
var twolevServices = require('../services/kpitwolev_service');

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

var parameterError = {
    status: '1', 
    msg: '参数错误'
};

var namehasError = {
    status: '101', 
    msg: '二级目录已存在'
};

/*
    查询所有KPI目录
    */ 
    exports.selectKPIAll = async function(req , res) {
        if (req == '') {
            return parameterError
        }
        //把一级目录和二级目录一起展示出来
        const oneLevData = await onelevServices.selectOneLevAll(req , res)
        const twoLevData = await twolevServices.selectTwoLevAll(req , res)
        var contGFData = oneLevData.concat(twoLevData);
        return contGFData

    }

/*
    增加KPI二级目录
    */ 
    exports.addKPItwoLevfrist = async function(req , res) {
        if(req.body.name == ''||req.body.name == null || 
            req.body.pId == ''||req.body.pId == null){
            return parameterError;
    }
    const data = await twolevServices.selectTwoLevByName(req , res)
        // 对线体名字是否重复进行判断
        if(data == null||data == ''||data == undefined){
            //创建一条记录,创建成功后返回json数据
            await twolevServices.addTwoLevOne(req , res);
            return
        }else{
         return namehasError;
     }
 }
/*
    展示所有KPI目录
    */ 
    exports.showKPIAll = async function(req , res) {
      const allData = await exports.selectKPIAll(req , res);
      res.end(JSON.stringify(allData));
  }

 /*
    添加KPI二级目录并重新刷新整个树图 合并
    */
    exports.addKPItwoLev = async function(req , res){
        const addReturn = await exports.addKPItwoLevfrist(req , res,);
        if(addReturn== undefined ||addReturn == ''||addReturn == null){
            const allData = await exports.selectKPIAll(req , res);
            res.end(JSON.stringify(allData));
        }
        res.end(JSON.stringify(addReturn));
        
    }

/*
    修改KPI二级目录并重新刷新整个树图
    */
    exports.updateKPItwoLev = async function(req , res){
        if(req.body.id == ''||req.body.id == null ||
            req.body.name == ''||req.body.name == null || 
            req.body.pId == ''||req.body.pId == null){
            res.end(JSON.stringify(parameterError));
    }
    const data = await twolevServices.selectTwoLevByName(req , res)
        // 对名字是否重复进行判断
        if(data == null||data == ''||data == undefined){
            //更改一条记录,成功后刷新整个树图
            await twolevServices.updateTwoLevById(req , res);
            const allData = await exports.selectKPIAll(req , res);
            res.end(JSON.stringify(allData));
        }else{
         res.end(JSON.stringify(namehasError));
     }
 }

/*
    删除KPI二级目录并重新刷新整个树图
    */
    exports.deleteKPItwoLev = async function(req , res){
        if(req.query.id == ''||req.query.id == null){
            res.end(JSON.stringify(parameterError));
        }
        //删除一条记录,成功后刷新整个树图
        const kpitwoid = req.query.id.substring(1,);
        if(kpitwoid == ''||kpitwoid == null||kpitwoid ==undefined){
          res.end(JSON.stringify(parameterError));
      }else{
        req.query.kpitwoid = kpitwoid;
        const deleteReturn = await twolevServices.deleteTwoLevById(req , res);
        const allData = await exports.selectKPIAll(req , res);
        res.end(JSON.stringify(allData));
    }
}
/*
    KPI控制处理
    创建人：THree
    时间：2017/10/18
    */

//引入数据库Message模块
const onelevServices = require('../services/kpionelev_service');
const twolevServices = require('../services/kpitwolev_service');

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
    msg: '二级目录已存在'
};

const kpiTwoShow = {
    id: 'fas', 
    name: 'fas',
    pId:'fas'
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
        const contGFData = oneLevData.concat(twoLevData);
        return contGFData
        
    }

/*
    增加KPI二级目录
    */ 
    exports.addKPItwoLev = async function(req , res) {
        if(req.body.name == ''||req.body.name == null || 
            req.body.pId == ''||req.body.pId == null){
            res.end(JSON.stringify(parameterError));
    }
    const data = await twolevServices.selectTwoLevByName(req.body.name , req.body.pId)
        // 对名字是否重复进行判断
        if(data == null||data == ''||data == undefined){
            //创建一条记录,创建成功后返回json数据
            const data = await twolevServices.addTwoLevOne(req , res);
            if(data != null){
                kpiTwoShow.id = 't' + data.kpitwoid
                kpiTwoShow.name = data.name
                kpiTwoShow.pId = data.pId
                res.end(JSON.stringify(kpiTwoShow)); 
            }
                res.end(JSON.stringify(parameterError)); 
        }else{
           res.end(JSON.stringify(namehasError));
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
    修改KPI二级目录并重新刷新整个树图
    */
    exports.updateKPItwoLev = async function(req , res){
        if(req.body.id == ''||req.body.id == null ||
            req.body.name == ''||req.body.name == null || 
            req.body.pId == ''||req.body.pId == null){
            res.end(JSON.stringify(parameterError));
    }
    const data = await twolevServices.selectTwoLevByName(req.body.name , req.body.pId)
        // 对名字是否重复进行判断
        if(data == null||data == ''||data == undefined){
            //更改一条记录
            const data =await twolevServices.updateTwoLevById(req , res);
            if(data == 1){
                res.end(JSON.stringify(dataSuccess)); 
            }
            res.end(JSON.stringify(parameterError));
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
        //判断kpi二级目录id
        const kpitwoid = req.query.id.substring(1,);
        if(kpitwoid == ''||kpitwoid == null||kpitwoid ==undefined){
          res.end(JSON.stringify(parameterError));
      }else{
        req.query.kpitwoid = kpitwoid;
        const deleteReturn = await twolevServices.deleteTwoLevById(req , res);
        if(deleteReturn != null){
            res.end(JSON.stringify(dataSuccess));
        }
        res.end(JSON.stringify(parameterError));
    }
}
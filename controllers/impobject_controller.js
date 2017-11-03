/*
    改进方案处理
    创建人：THree
    时间：2017/11/3
    */

//引入数据库Message模块
const onelevServices = require('../services/kpionelev_service');
const twolevServices = require('../services/kpitwolev_service');
const Losscategory = require('../models').Losscategory;

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
    text
    */ 
    exports.selectImpobjectT = async function(req , res) {
  
        const data = await Losscategory.findAll({attributes: ['name']});
        console.log(data)
        textoutput.data = data
        res.end(JSON.stringify(textoutput))
    }

    const textoutput = { 
        name:'OEE',
        data:''
    }

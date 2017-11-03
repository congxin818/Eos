/*
    线体控制处理
    创建人：Three
    时间：2017/10/19
    */

//引入数据库Message模块
const Linebody = require('../models/linebody');
const moment = require('moment');
const services = require('../services/linebody_service');
const nameEtdService = require('../services/linebody_extend_service');

const dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

var parameterError = {
    status: '1', 
    msg: '参数错误'
};

const namehasError = {
 status: '101', 
 msg: '线体已存在'
}

const showLinbodyInf = {
    status: '0', 
    msg: '请求成功',
    id:'',
    targetvalue: '',
    targetstrattime:'',
    targetendtime:'',
    visionvalue:'',
    visionstrattime:'',
    visionendtime:'',
    idealvalue:'',
    idealstrattime:'',
    idealendtime:'',
}

/*
	根据id查找一个线体
    */
    exports.selectLinebodyById = async function(req , res) {
	//如果没有id或者id为空,直接返回
    if (req.body.id == null || req.body.id == '') {
        res.end(JSON.stringify(parameterError));
    }
    req.body.linebodyId = req.body.id.substring(1,);
    const data = await services.selectLinebodyById(req , res)
        //console.log(data);
        showLinbodyInf.id = 'l' + data.linebodyid
        showLinbodyInf.targetvalue = data.targetvalue
        showLinbodyInf.targetstrattime = moment(data.targetstrattime).format('YYYY-MM-DD');
        showLinbodyInf.targetendtime = moment(data.targetendtime).format('YYYY-MM-DD');
        showLinbodyInf.visionvalue = data.visionvalue
        showLinbodyInf.visionstrattime = moment(data.visionstrattime).format('YYYY-MM-DD');
        showLinbodyInf.visionendtime = moment(data.visionendtime).format('YYYY-MM-DD');
        showLinbodyInf.idealvalue = data.idealvalue
        showLinbodyInf.idealstrattime = moment(data.idealstrattime).format('YYYY-MM-DD');
        showLinbodyInf.idealendtime = moment(data.idealendtime).format('YYYY-MM-DD');

        res.end(JSON.stringify(showLinbodyInf));
    }

/*
	添加一个线体
    */
    exports.addLinebodyOne = async function(req , res) {
        const data = await nameEtdService.selectLinebodyByName(req , res)
        // 对线体名字是否重复进行判断
        if(data == null||data == ''||data == undefined){
            // 给线体详细信息附初始值
            req.body.targetValue = '00'
            req.body.targetStrattime = '2000-01-01'
            req.body.targetEndtime = '2000-01-01'
            req.body.visionValue = '00'
            req.body.visionStrattime = '2000-01-01'
            req.body.visionEndtime = '2000-01-01'
            req.body.idealValue = '00'
            req.body.idealStrattime = '2000-01-01'
            req.body.idealEndtime = '2000-01-01'
            //创建一条记录,创建成功后返回json数据
            const addData = await services.addLinebodyOne(req , res);
            if(addData == null||addData == ''){
                return parameterError
            }
            return addData
        }else{
         return namehasError;
     }
 }

/*
	根据id删除线体
    */
    exports.deleteLinebodyById = async function(req , res) {
    //先查找,再调用删除,最后返回json数据
    const data = await services.deleteLinebodyById(req , res)
    return data; 
}

/*
	根据id更新线体
    */
    exports.updateLinebodyById = async function(req , res) {
    console.log()
    //更新一条记录,更新成功后跳转回首页
    const data = await nameEtdService.selectLinebodyByName(req , res)
        // 对线体名字是否重复进行判断
        if(data == null||data == ''||data == undefined){
            const data = await services.updateLinebodyById(req , res)
            return data;
        }else{
         return namehasError;
     } 
 }

 /*
    编辑线体详细信息
    */ 
    exports.updateLinebodyInfById = async function(req , res) {
       if (req.body.id == undefined || req.body.id == '') {
        res.end(JSON.stringify(parameterError));
    }
    req.body.linebodyId = req.body.id.substring(1,);
    if(req.body != null||req.body != ''){
        const data = await services.updateLinebodyInfById(req , res)
        if(data == 1){
            dataSuccess.data = data
            res.end(JSON.stringify(dataSuccess));
        }
    }
    res.end(JSON.stringify(parameterError));
}
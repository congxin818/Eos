/*
    线体控制处理
    创建人：Three
    时间：2017/10/19
    */

//引入数据库Message模块
const Linebody = require('../models/linebody');
const services = require('../services/linebody_service');
const nameEtdService = require('../services/linebody_extend_service');

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
   msg: '线体已存在'
}
/*
	展示所有线体
    */
    exports.selectLinebodyAll = function(req , res) {
        if (req == '') {
            res.end(JSON.stringify(parameterError));
            return;
        }
        services.selectLinebodyAll(req , res).then(function(data){
        //console.log(data);
        if (data == '' || data == undefined || data == null) {
            dataSuccess.data = null;
            res.end(JSON.stringify(dataSuccess));
        }else{
            dataSuccess.data = data;
            res.end(JSON.stringify(dataSuccess));
        }
        
    });
    }

/*
	根据id查找一个线体
    */
    exports.selectLinebodyById = function(req , res) {
	//如果没有id或者id为空,直接返回
    if (req.body.linebodyId == undefined || req.body.linebodyId == '') {
        res.end(JOSN.stringify(parameterError));
        return;
    }
    services.selectLinebodyById(req , res).then(function(data){
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
	添加一个线体
    */
    exports.addLinebodyOne = async function(req , res) {
        const data = await nameEtdService.selectLinebodyByName(req , res)
        // 对线体名字是否重复进行判断
        if(data == null||data == ''||data == undefined){
            //创建一条记录,创建成功后返回json数据
            const p = await services.addLinebodyOne(req , res);
            if(p == null||p == ''||p == undefined){
                return parameterError;
            }
        }else{
           return namehasError;
       }
   }

/*
	根据id删除线体
    */
    exports.deleteLinebodyById = async function(req , res) {
    //先查找,再调用删除,最后返回json数据
    await services.deleteLinebodyById(req , res)
    return
}

/*
	根据id更新线体
    */
    exports.updateLinebodyById = async function(req , res) {
    //更新一条记录,更新成功后跳转回首页
    const data = await services.updateLinebodyById(req , res)
    return data;
}
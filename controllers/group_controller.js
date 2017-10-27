/*
    集团控制处理
    创建人：THree
    时间：2017/10/18
    */

//引入数据库Message模块
var Group = require('../models/group');
const nameEtdService = require('../services/group_extend_service');
const services = require('../services/group_service');

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
    exports.selectGroupById = async function(req , res) {
	//如果没有id或者id为空,直接返回
    if (req.body.id == undefined || req.body.id == '') {
        return parameterError;
    }
    const data = await services.selectGroupById(req , res)
    return data;
}

/*
	添加一个集团
    */
    exports.addGroupOne = async function(req , res) {
    const data = await nameEtdService.selectGroupByName(req , res)
            // 对集团名字是否成功进行判断
            if(data == null||data == ''||data == undefined){
                //创建一条记录,创建成功后返回json数据
                const p = await services.addGroupOne(req , res)
                if(p == null||p == ''||p == undefined){
                    return parameterError;
                }
            }else{
             return namehasError;
         }

     }

/*
	根据id删除集团
    */
    exports.deleteGroupById = async function(req , res) {
    //先查找,再调用删除,最后返回json数据
     const data = await services.deleteGroupById(req , res)
     return;
}

/*
	根据id更新集团
    */
    exports.updateGroupById = async function(req , res) {
    //更新一条记录,更新成功后跳转回首页
    const data = await services.updateGroupById(req , res)
    return data;
}
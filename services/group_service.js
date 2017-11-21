/*
	集团表的一些sql查找
	创建人：Three
	时间：2017/10/19
    */

//引入数据库Message模块
//var Group = require('../models/group');
var Group = require('../models').Group;
var errorUtil = require('../utils/errorUtil');
var factory_service = require('../services/factory_service');
var workshop_service = require('../services/workshop_service');
var linebody_service = require('../services/linebody_service');

/*
	查找所有集团数据
    */
    exports.selectGroupAll = function(req , res) {
        var p = new Promise(function(resolve, reject) {
            Group.findAll().then(function(data) {
                resolve(data);
            });
        });
        return p;
    }
/*
	根据id查找一条集团数据
    */
    exports.selectGroupById = function(req , res) {
        var p = new Promise(function(resolve , reject) {
            Group.findOne({
                where:{
                    groupid:req.body.id
                }
            }).then(function(data){
                resolve(data);
            });
        });
        return p;
    }
/*
	添加一条集团数据
    */
    exports.addGroupOne = async function(req , res) {
        var group = {
            groupname: req.body.name
            // ,
            // weight:req.body.weight
        };
        //创建一条记录,创建成功后跳转回首页
        const data = await Group.create(group)
        return data;
    }

/*
	根据id删除一条集团数据
    */
    exports.deleteGroupById = async function (req , res) {
        const group  = await Group.findById(req.query.id);
        if (group == null || group == '') {
            return errorUtil.noExistError;
        }
        const falg = await group.destroy();
        if (falg == null || falg == '') {
            return errorUtil.noExistError;
        }
        await factory_service.factoryClear();
        await workshop_service.workshopClear();
        await linebody_service.linebodyClear();
        return falg;
    }

/*
	根据id更新集团数据
    */
    exports.updateGroupById = async function(req , res) {
        var group = {
            groupname: req.body.name
            // ,
            // weight:req.body.weight
        };   
        //更新一条记录,创建成功后跳转回首页
        const data = await Group.update(group,{
            where:{
                groupid:req.body.id
            }
        })
        return data
    }


/*
	集团表的一些sql查找
	创建人：Three
	时间：2017/10/19
    */

//引入数据库Message模块
const Kpitwolev = require('../models').Kpitwolev;
const Losscategory = require('../models').Losscategory;
const Objectnow = require('../models').Objectnow;
const lossServices = require('../services/losscategory_service');

/*
	根据线体id把loss查找出来
    */
    exports.selectKpitwoBylinebyid = async function(req , res) {
        const data = await Kpitwolev.findAll({ where:{linebodyLinebodyid: req.body.linebodyId}});
        return data;
    }
    /*
    根据线体id把添加到现进行项目中的loss查找出来
    */
    exports.selectObjectnowBylinebyid = async function(linebodyid) {
        const data = await Losscategory.findAll({ where:{linebodyLinebodyid: linebodyid,addobjectnow: true}});
        return data;
    }
/*
    根据线体id把二级目录对应的loss三级目录名字查找出来
    并按照loss大小排列
    */
    exports.selectLossByKpitwo = async function(twolevdata) {
        const data = await Losscategory.findAll({attributes: ['name','lossid'],
            where:{pId: twolevdata.id},order: [['value', 'ASC']]})
        return data;
    }
 /*
    根据lossid把该项目添加到现进行项目
    */
    exports.addObjectnowBylossid = async function(lossid) {
        const losscategory={
            addobjectnow: 1
        }
        const data = await Losscategory.update(losscategory,{where:{lossid: lossid}});
        return data;
    }

    /*
    根据lossid把该项目添加到现进行项目
    */
    exports.deleteObjectnowBylossid = async function(lossid) {
        const losscategory={
            addobjectnow: 0
        }
        const data = await Losscategory.update(losscategory,{where:{lossid: lossid}});
        return data;
    }

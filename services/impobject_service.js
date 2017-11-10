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
	根据线体id把loss二级目录名字查找出来
    */
    exports.selectKpitwoBylinebyid = async function(req , res) {
        const data = await Kpitwolev.findAll({ where:{linebodyLinebodyid: req.body.linebodyId}});
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
    根据线体id查找loss三级目录所有id
    */
    exports.selectLossidBylinedyid = async function(req , res) {
        const data = await Losscategory.findAll({attributes: ['lossid'],
            where:{linebodyLinebodyid: req.body.linebodyId}})
        return data
    }
/*
    根据loss三级id展示现进行项目
    */
    exports.showObjectnowBylossid = async function(lossid) {
        const data = await Objectnow.findAll({where:{losscategoryLossid: lossid}})
        return data
    }
/*
    根据loss三级id添加现进行项目
    */
    exports.addObjectnowBylossid = async function(req , res) {
        const losscategory = await lossServices.selectLossById(req.body.lossId)
        var objectnow = Objectnow.build({
            name: losscategory.name
        })
        // const data = await Objectnow.create(objectnow)
        const data  = await losscategory.setObjectnow(objectnow)
        return data
    }
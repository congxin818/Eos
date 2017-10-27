/*
	关于车间表的添加姓名不能重复的sql查找限制
	创建人：Three
	时间：2017/10/20
    */

//引入数据库Message模块
var Workshop = require('../models').Workshop;

/*
	根据车间名字查找一条车间数据
    */
    exports.selectWorkshopByName = function(req , res) {
        var p = new Promise(function(resolve , reject) {
            Workshop.findOne({
                where:{
                    workshopname:req.body.name,
                    workshopbelong:req.body.pId
                }
            }).then(function(data){
                resolve(data);
            });
        });
        return p;
    }

/*
    根据pId查找一条车间数据
    */
    exports.selectWorkshopBypId = async function(req , res) {
     const data= await Workshop.findAll({
        where:{
            workshopbelong:req.query.pId
        }
    })
     return data;
 }
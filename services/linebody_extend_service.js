/*
	关于线体表的添加姓名不能重复的sql查找限制
	创建人：Three
	时间：2017/10/20
    */

//引入数据库Message模块
var Linebody = require('../models').Linebody;
const LinebodyKpitwolev = require('../models').LinebodyKpitwolev;
const Classinformation = require('../models').Classinformation;
const moment = require('moment');

/*
	根据线体名字查找一条线体数据
    */
    exports.selectLinebodyByName = function(req , res) {
        var p = new Promise(function(resolve , reject) {
            Linebody.findOne({
                where:{
                    linebodyname:req.body.name,
                    linebodybelong:req.body.pId
                }
            }).then(function(data){
                resolve(data);
            });
        });
        return p;
    }

/*
    根据线体pId查找一条线体数据
    */
    exports.selectLinebodyBypId = async function(req , res) {
        const data =  await Linebody.findAll({
            where:{
                linebodybelong:req.query.pId
            }
        })
        return data;
    }


/*
    得到开班系数
    */
    exports.getClassflag = async function(classstarttime , classendtime , linebodyid) {
        var classflag
        var classidList = await Classinformation.findAll({
            'attributes': ['classinfid'],where:{linebodyLinebodyid:linebodyid}})
        var classidList2 =[]
        if(classidList == null||classidList == ''){
            classflag = 0
            return classflag
        }else{
            for(var i=0; i< classidList.length;i++){
                classidList2.push(classidList[i].classinfid)  
            }
        }

        // 查重后的class数组
        classidList2 = await exports.unique2(classidList2)

        for(var i=0; i< classidList2.length;i++){
         
            const classinfdata = await Classinformation.findById(classidList2[i])

            // 传来的时间是否在开班时间内
            if( moment(classstarttime).unix() >= moment(classinfdata.classstarttime).unix()
                && moment(classendtime).unix() <= moment(classinfdata.classendtime).unix()){
                classflag = 1
                break
        }else{
            classflag = 0
        }

    }
    return classflag
}

/*
    数组查重
    */
    exports.unique2 = async function(thisList) {
        thisList.sort();
        var res = [thisList[0]];
        for(var i = 1; i < thisList.length; i++){
            if(thisList[i] !== res[res.length - 1]){
                res.push(thisList[i]);
            }
        }
        return res
    }
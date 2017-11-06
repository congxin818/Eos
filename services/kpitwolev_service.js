/*
	kpi目录二级表的一些sql查找
	创建人：Three
	时间：2017/10/24
    */

//引入数据库Message模块
var Kpitwolev = require('../models').Kpitwolev;
var losscategory_service = require('../services/losscategory_service');
var errorUtil = require('../utils/errorUtil');
/*
    显示二级目录
    */
    exports.selectTwoLevAll = function(req , res) {
        var p = new Promise(function(resolve, reject) {
            Kpitwolev.findAll().then(function(data) {
                resolve(data);
            });
        });
        return p;
    }

/*
	添加一条KPI二级目录数据
    */
    exports.addTwoLevOne =async function(req , res) {

        const twoLev = {
            name: req.body.name,
            pId: req.body.pId
        };
        //创建一条记录,创建成功后跳转回首页
        const data = await Kpitwolev.create(twoLev)         
            // id:data.kpitwoid
            var kpitwoUpdate={id:'t'+ data.kpitwoid};
            await Kpitwolev.update(kpitwoUpdate, {where:{ kpitwoid:data.kpitwoid}})
            return data
        }

/*
	根据KPI二级目录id删除一条KPI二级目录数据
    */
    exports.deleteTwoLevById = async function(req , res) {
    //先查找,再调用删除,最后返回首页
    const kpiTwo = await Kpitwolev.findById(req.query.kpitwoid);
    //console.log('factory--->'+ JSON.stringify(kpiTwo));
    if (kpiTwo == null || kpiTwo == '' || kpiTwo == undefined) {
        return errorUtil.noExistError;
    }
    const falg = await kpiTwo.destroy();
    //console.log('falg--->' + JSON.stringify(falg));
    if (falg == null || falg == '' || falg == undefined) {
        return errorUtil.noExistError;
    }
    await losscategory_service.lossClear();
    return falg;
}

    /*
    根据id更新KPI二级目录数据
    */
    exports.updateTwoLevById = function(req , res) {
     var twoLev = {
      name: req.body.name
  };
  var p = new Promise(function(resolve , reject) {
        //更新一条记录,创建成功后跳转回首页
        const kpitwoid = req.body.id.slice(1,);
        Kpitwolev.update(twoLev,{
            where:{
                kpitwoid:kpitwoid
            }
        }).then(function(data){
            resolve(data);
        });
    });
  return p;
}


/*
    根据二级目录名字查找一条KPI二级目录数据
    */
    exports.selectTwoLevByName = async function(name , pId) {

      const data = await  Kpitwolev.findOne({
        where:{
            name:name,
            pId:pId
        }
    })
      return data;
  }
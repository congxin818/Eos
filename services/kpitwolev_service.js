/*
	kpi目录二级表的一些sql查找
	创建人：Three
	时间：2017/10/24
    */

//引入数据库Message模块
var Kpitwolev = require('../models').Kpitwolev;


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
    exports.addTwoLevOne = function(req , res) {
        var twoLev = {
            name: req.body.name,
            pId: req.body.pId
        };
        var p = new Promise(function(resolve, reject) {
        //创建一条记录,创建成功后跳转回首页
        Kpitwolev.create(twoLev).then(function(data){          
            // id:data.kpitwoid
             var kpitwoUpdate={id:'t'+ data.kpitwoid};
             Kpitwolev.update(kpitwoUpdate,{where:{
                 kpitwoid:data.kpitwoid
           }});
            resolve(data);
        });
     });
        return p;
    }

/*
	根据KPI二级目录id删除一条KPI二级目录数据
    */
    exports.deleteTwoLevById = function(req , res) {
        var p = new Promise(function(resolve , reject) {
        //先查找,再调用删除,最后返回首页
        Kpitwolev.findOne({
            where:{
                kpitwoid:req.query.kpitwoid
            }
        }).then(function(data){
        	data.destroy().then(function(data){
                resolve(data);
            });     
        });
    });
        return p;
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
    exports.selectTwoLevByName = function(req , res) {
        var p = new Promise(function(resolve , reject) {
            Kpitwolev.findOne({
                where:{
                    name:req.body.name,
                    pId:req.body.pId
                }
            }).then(function(data){
                resolve(data);
            });
        });
        return p;
    }
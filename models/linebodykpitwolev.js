/*
    linebody表和kpitwolev表的自定义关联表
    创建人：Android
    时间：2017/11/15
    */
var Sequelize = require('sequelize');
var sequelize = require('../mysql').sequelize();

 module.exports = function(sequelize , DataTypes){
   return sequelize.define('linebodyKpitwolev' , {
	   id:{ //自增长id,主键,整形
            type:Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey: true
        },
        value:{
            type:Sequelize.FLOAT
        },
        classstarttime:{
            type:Sequelize.DATE
        },
        classendtime:{
            type:Sequelize.DATE
        },
        starttime:{
            type:Sequelize.DATE
        },
        endtime:{
            type:Sequelize.DATE
        }
    });
}
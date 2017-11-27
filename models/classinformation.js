/*
    班次信息表
    创建人：THree
    时间：2017/11/27
    */
    var Sequelize = require('sequelize');
    var sequelize = require('../mysql').sequelize();


    module.exports = function(sequelize , DataTypes){
    return sequelize.define('classinformation' , {
    // 自增长id,主键,整形
    classinfid:{ 
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
        // 开班开始时间
        classstarttime: { 
            type: Sequelize.DATE
        },
        // 开班结束时间
        classendtime: { 

            type: Sequelize.DATE
        },
        //应出勤人数
        shouldattendance:{
            type:Sequelize.INTEGER
        },
        //实际出勤人数
        actualattendance:{
            type:Sequelize.INTEGER
        }
    });
}
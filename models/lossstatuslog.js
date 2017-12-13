/*
    improvement project 中现进行项目状态
    创建人：Three
    时间：2017/11/6
    */
    var Sequelize = require('sequelize');
    var sequelize = require('../mysql').sequelize();

    module.exports = function(sequelize , DataTypes){
//var Validmenu = sequelize.define('validmenu' , {
 return sequelize.define('lossstatuslog' , {
    id:{ 
        //自增长id,主键,整形
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
        // 改进项目编号
        projectnumber:{
            type:Sequelize.INTEGER
        },
        // 改进项目的名称
        projectname:{
            type: Sequelize.STRING(50)
        },
        // 针对的损失类别
        losscategory:{
            type: Sequelize.STRING(50)
        },
        // 更改前项目状态
        beforstatus:{
            type:Sequelize.INTEGER
        },
        // 更改后项目状态
        status:{
            type:Sequelize.INTEGER
        },
        //起点绩效值
        startperformance:{
            type: Sequelize.FLOAT
        },
        // 目标
        target:{
            type: Sequelize.FLOAT
        },
        // 当前绩效
        performance:{
            type: Sequelize.FLOAT
        },
        // 项目开始日期
        objectstarttime:{
            type:Sequelize.DATEONLY
        },
        // 项目预期结束日期
        planendtime:{
            type:Sequelize.DATEONLY
        },
        // 更改前项目运行阶段
        beforstage:{
            type: Sequelize.STRING(50)
        },
        // 更改后项目运行阶段
        stage:{
            type: Sequelize.STRING(50)
        },
    },{
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
}
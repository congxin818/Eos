/*
    improvement project 中现进行项目状态
    创建人：Three
    时间：2017/11/6
    */
var Sequelize = require('sequelize');
var sequelize = require('../mysql').sequelize();

 module.exports = function(sequelize , DataTypes){
//var Validmenu = sequelize.define('validmenu' , {
   return sequelize.define('lossstatus' , {
	   id:{ //自增长id,主键,整形
            type:Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey: true
        },
        // 状态
        status:{
            type:Sequelize.INTEGER
        },
        // 项目编号
         projectnumber:{
            type:Sequelize.INTEGER
        },
        // 项目名称
         projectname:{
            type: Sequelize.STRING(50)
        },
        // 所属区域
         areablong:{
            type: Sequelize.STRING(50)
        },
        // 项目方法
         projectmethod:{
            type: Sequelize.STRING(50)
        },
        // 项目负责人
         projectmanager:{
            type: Sequelize.STRING(50)
        },
        // 团队成员
         teammember:{
            type: Sequelize.STRING(50)
        },
        // 计划开始
         planstart:{
            type: Sequelize.STRING(50)
        },
        // 实际开始
         actualstart:{
            type: Sequelize.STRING(50)
        },
        // 计划结束
         planend:{
            type: Sequelize.STRING(50)
        },
        // 实际结束
         actualend:{
            type: Sequelize.STRING(50)
        },
        // 目标
         target:{
            type: Sequelize.FLOAT
        },
        // 当前值
         actualvalue:{
            type: Sequelize.FLOAT
        }
    },{
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
}
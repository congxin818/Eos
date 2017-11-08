/*
    loss目录表
    创建人：Three
    时间：2017/11/8
    */
    var Sequelize = require('sequelize');
    var sequelize = require('../mysql').sequelize();

    module.exports = function(sequelize , DataTypes){
    	return sequelize.define('losstier4' , {
	   	id:{ // kpi第四级id
	   		type:Sequelize.INTEGER,
	   		autoIncrement:true,
	   		primaryKey: true
	   	},
        name: { // kpi第四级名字
        	type: Sequelize.STRING(50),
        	charset:'utf8',
        	collate:'utf8_general_ci'
        },
        value: { // kpi第四级树状图loss值
        	type: Sequelize.FLOAT
        },
        duration:{ // 持续时间
            type: Sequelize.FLOAT
        },
        classstarttime:{ // 班次开始时间
            type: Sequelize.DATE
        },
        classendtime:{ // 班次结束时间
            type: Sequelize.DATE
        },
    });
    }
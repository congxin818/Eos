/*
    loss目录表
    创建人：Android
    时间：2017/10/24
    */
    var Sequelize = require('sequelize');
    var sequelize = require('../mysql').sequelize();

    module.exports = function(sequelize , DataTypes){
    	return sequelize.define('tier4' , {
	   	id:{ //kpi第二级id
	   		type:Sequelize.INTEGER,
	   		autoIncrement:true,
	   		primaryKey: true
	   	},
        name: { //kpi第二级名字
        	type: Sequelize.STRING(50),
        	charset:'utf8',
        	collate:'utf8_general_ci'
        },
        value: { //kpi第二级树状图id
        	type: Sequelize.FLOAT
        }
    });
    }
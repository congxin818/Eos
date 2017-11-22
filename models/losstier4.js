/*
    loss目录表
    创建人：Three
    时间：2017/11/8
    */
    var Sequelize = require('sequelize');
    var sequelize = require('../mysql').sequelize();

    module.exports = function(sequelize , DataTypes){
    	return sequelize.define('losstier4' , {
	   	tier4id:{ // kpi第四级id
	   		type:Sequelize.INTEGER,
	   		autoIncrement:true,
	   		primaryKey: true
	   	},
        name: { // kpi第四级名字
        	type: Sequelize.STRING(50),
        	charset:'utf8',
        	collate:'utf8_general_ci'
        },
        pId: { //losstier3级父id
            type: Sequelize.STRING(50),
            charset:'utf8',
            collate:'utf8_general_ci'
        },
        id: {
            type: Sequelize.STRING(50),
            charset:'utf8',
            collate:'utf8_general_ci'
        }
    });
    }
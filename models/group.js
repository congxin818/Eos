/*
    集团表
    创建人：THree
    时间：2017/10/18
*/
var Sequelize = require('sequelize');
var sequelize = require('../mysql').sequelize();

module.exports = function(sequelize , DataTypes){
//var Group = sequelize.define('group' , {
	return sequelize.define('group' , {
    groupid:{ //自增长id,主键,整形
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    groupname: { //集团名字
        type: Sequelize.STRING(50),
        charset:'utf8',
        collate:'utf8_general_ci'
    },
    checked:{
        type:Sequelize.BOOLEAN,
        defaultValue: false
    },
    weight:{
        type:Sequelize.INTEGER,
        defaultValue: 1
    }
},{
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });
}
/*
    集团表
    创建人：THree
    时间：2017/10/18
*/
var Sequelize = require('sequelize');
var sequelize = require('../mysql');

var Group = sequelize.define('group' , {
	groupid:{ //自增长id,主键,整形
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    groupname: { //集团名字
        type: Sequelize.STRING(50),
        charset:'utf8',
        collate:'utf8_general_ci'
    }
},{
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });

//Group.sync();

module.exports = Group;
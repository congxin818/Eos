/*
 auther:Android,
 NOTE:用户表,
 time:20171019
 */

var Sequelize = require('sequelize');
var sequelize = require('../mysql');

var User = sequelize.define('user' , {
	userid:{
		type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true,
        unique : true
	},
	username:{
		type:Sequelize.STRING(100),
		unique : true,
		allowNull: false,
        charset:'utf8',
        collate:'utf8_general_ci'
	},
	userpsd:{
		type: Sequelize.STRING(100),
		charset:'utf8',
		allowNull: false,
        collate:'utf8_general_ci'
	},
	userabbname:{
		type: Sequelize.STRING(100),
        charset:'utf8',
        collate:'utf8_general_ci'
	},
	userjob:{
		type: Sequelize.STRING(100),
        charset:'utf8',
        collate:'utf8_general_ci'
	},
	userleader:{
		type: Sequelize.STRING(100),
        charset:'utf8',
        collate:'utf8_general_ci'
	}
},
{
	//时间戳，启用该配置后会自动添加createdAt、updatedAt两个字段，分别表示创建和更新时间
	timestamps: true,
	//虚拟删除。启用该配置后，数据不会真实删除，而是添加一个deletedAt属性
	//paranoid: true,
	charset: 'utf8',
    collate: 'utf8_general_ci'
});

//User.sync();
module.exports = User;
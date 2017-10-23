/*
    有效菜单表
    创建人：THree
    时间：2017/10/23
*/
var Sequelize = require('sequelize');
var sequelize = require('../mysql').sequelize();

module.exports = function(sequelize , DataTypes){
//var Validmenu = sequelize.define('validmenu' , {
     return sequelize.define('validmenu' , {
	validmenuid:{ //自增长id,主键,整形
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    validmenuname: { //有效菜单名字
        type: Sequelize.STRING(50),
        charset:'utf8',
        collate:'utf8_general_ci'
    },
    userid: { //用户id
        type: Sequelize.INTEGER,
        allowNull: false
    }

});
 }
//Validmenu.sync();

//module.exports = Validmenu;
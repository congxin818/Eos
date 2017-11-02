/*
    线体表
    创建人：THree
    时间：2017/10/19
*/
var Sequelize = require('sequelize');
var sequelize = require('../mysql').sequelize();

module.exports = function(sequelize , DataTypes){
//var Linebody = sequelize.define('linebody' , {
	return sequelize.define('linebody' , {
        linebodyid:{ //自增长id,主键,整形
            type:Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey: true
        },
        linebodyname: { //车间名字
            type: Sequelize.STRING(50),
            charset:'utf8',
            collate:'utf8_general_ci'
        },
        linebodybelong: { //车间所属
            type: Sequelize.STRING(50),
            charset:'utf8',
            collate:'utf8_general_ci'
        },
        checked:{
            type:Sequelize.BOOLEAN,
            defaultValue: false
        },
        targetvalue:{
            type: Sequelize.FLOAT,
        },
        targetstrattime:{
            type: Sequelize.DATE,
        },
        targetendtime:{
            type: Sequelize.DATE,
        },
        visionvalue:{
            type: Sequelize.FLOAT,
        },
        visionstrattime:{
            type: Sequelize.DATE,
        },
        visionendtime:{
            type: Sequelize.DATE,
        },
        idealvalue:{
            type: Sequelize.FLOAT,
        },
        idealstrattime:{
            type: Sequelize.DATE,
        },
        idealendtime:{
            type: Sequelize.DATE,
        }
    });
}
//Linebody.sync();

//module.exports = Linebody;
/*
    工厂表
    创建人：THree
    时间：2017/10/18
*/
var Sequelize = require('sequelize');
var sequelize = require('../mysql').sequelize();

<<<<<<< HEAD
module.exports = function(sequelize , DataTypes){
///var Factory = sequelize.define('factory' , {
    return sequelize.define('factory' , {
	   factoryid:{ //自增长id,主键,整形
            type:Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey: true
        },
        factoryname: { //工厂名字
            type: Sequelize.STRING(50),
            charset:'utf8',
            collate:'utf8_general_ci'
        },
        factorybelong: { //工厂所属
            type: Sequelize.INTEGER
        }
    });
}
//Factory.sync();
=======
var Factory = sequelize.define('factory' , {
	factoryid:{ //自增长id,主键,整形
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
    factoryname: { //工厂名字
        type: Sequelize.STRING(50),
        charset:'utf8',
        collate:'utf8_general_ci'
    },
    factorybelong: { //工厂所属
        type: Sequelize.INTEGER
    },
    tfactoryid:{ //工厂临时id ‘f+id’
        type: Sequelize.STRING(50),
        charset:'utf8',
        collate:'utf8_general_ci'
    }
>>>>>>> 3de5121e0c8b77e6d823104be8d1702659ed8186

//module.exports = Factory;
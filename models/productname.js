/*
    产品名字表
    创建人：THree
    时间：2017/12/4
    */
    var Sequelize = require('sequelize');
    var sequelize = require('../mysql').sequelize();


    module.exports = function(sequelize , DataTypes){
        return sequelize.define('productname' , {
    //自增长id,主键,整形
    id:{ 
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
        //产品名字
        name: { 
            type: Sequelize.STRING(50)
        }
    },{
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
    }
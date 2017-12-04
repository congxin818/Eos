/*
    产品详细信息表
    创建人：THree
    时间：2017/11/27
    */
    var Sequelize = require('sequelize');
    var sequelize = require('../mysql').sequelize();


    module.exports = function(sequelize , DataTypes){
    return sequelize.define('productdata' , {
    //自增长id,主键,整形
    productid:{ 
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey: true
    },
        //每种产品合格品的数量
        conformproduct: { 

            type: Sequelize.INTEGER
        },
        //每种产品的标准循环时间
        normalcycletime:{
            type:Sequelize.TIME
        },
        // 每种产品合格品的总数量
        totalnumber:{
            type:Sequelize.INTEGER
        }
    },{
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
}
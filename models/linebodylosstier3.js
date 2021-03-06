/*
    linebody表和losscategory表的自定义关联表
    创建人：Android
    时间：2017/11/15
    */
var Sequelize = require('sequelize');
var sequelize = require('../mysql').sequelize();

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('linebodylosstier3', {
        id: { //自增长id,主键,整形
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        value: {
            type: Sequelize.FLOAT
        },
        starttime: {
            type: Sequelize.DATE
        },
        endtime: {
            type: Sequelize.DATE
        }
    });
}
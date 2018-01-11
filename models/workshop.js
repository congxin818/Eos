/*
    车间表
    创建人：THree
    时间：2017/10/19
*/

var Sequelize = require('sequelize');
var sequelize = require('../mysql').sequelize();

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('workshop', {
        workshopid: { //自增长id,主键,整形
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        workshopname: { //车间名字
            type: Sequelize.STRING(50),
            charset: 'utf8',
            collate: 'utf8_general_ci'
        },
        workshopbelong: { //车间所属
            type: Sequelize.STRING(50),
            charset: 'utf8',
            collate: 'utf8_general_ci'
        },
        checked: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        weight: {
            type: Sequelize.INTEGER,
            defaultValue: 1
        }
    });
}
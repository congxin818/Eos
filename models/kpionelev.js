/*
    kpi一级目录表
    创建人：THree
    时间：2017/10/24
*/
var Sequelize = require('sequelize');
var sequelize = require('../mysql').sequelize();


module.exports = function (sequelize, DataTypes) {
    ///var Factory = sequelize.define('factory' , {
    return sequelize.define('kpionelev', {
        id: { //kpi第一级id
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: { //kpi第一级名字
            type: Sequelize.STRING(50),
            charset: 'utf8',
            collate: 'utf8_general_ci'
        }
    });
}
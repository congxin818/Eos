var Sequelize = require('sequelize');
var sequelize = require('../mysql').sequelize();

var Administrator = sequelize.define('administrator', {
    id: { //自增长id,主键,整形
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    adminname: { //名字
        type: Sequelize.STRING(50),
        charset: 'utf8',
        collate: 'utf8_general_ci'
    },
    adminpsd: { //密码
        type: Sequelize.STRING(100)
    }
});
Administrator.sync();

module.exports = Administrator;
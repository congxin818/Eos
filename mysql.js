var Sequelize = require('sequelize');
var settings = require('./settings');

// var sequelize = new Sequelize(
//     settings.mysql.database,
//     settings.mysql.user,
//     settings.mysql.password,
//     {
//         'dialect': 'mysql',
//         'host': settings.mysql.host,
//         'port': settings.mysql.port,
//         'charset':'utf8',
//         'collate':'utf8_general_ci'
//     }
// );

// module.exports = sequelize;
// 
exports.sequelize = function() {
    return new Sequelize(
        settings.mysql.database,
        settings.mysql.user,
        settings.mysql.password,
        {
            'dialect': 'mysql',
            'host': settings.mysql.host,
            'port': settings.mysql.port,
            'charset':'utf8',
        });
}
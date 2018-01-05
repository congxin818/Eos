var Sequelize = require('sequelize');
var settings = require('./settings');

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
            'collate':'utf8_general_ci',
            //'logging':false
        });
}
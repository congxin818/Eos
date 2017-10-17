var Sequelize = require('sequelize');
var sequelize = require('../mysql');

var User = new sequelize.define('user' , {

});

User.sync();
module.exports = User;
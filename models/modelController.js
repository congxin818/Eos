var sequelize = require('../mysql');
var User = sequelize.import('./user.js');
var Group = sequelize.import('./group.js');


//建立model之间的关系
User.belongToMany(Group,{through: 'userGroups', as:'UserGroups'});
Group.belongToMany(User,{through: 'userGroups', as:'UserGroups'});

// 同步模型到数据库中
sequelize.sync();

exports.User = User;
exports.Group = Group;
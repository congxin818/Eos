var sequelize = require('../mysql').sequelize();
var User = sequelize.import('./user.js');
var Group = sequelize.import('./group.js');


//建立model之间的关系
User.belongsToMany(Group,{through: 'userGroups', as:'UserGroups'});
Group.belongsToMany(User,{through: 'userGroups', as:'UserGroups'});

// 同步模型到数据库中
sequelize.sync();

exports.User = User;
exports.Group = Group;
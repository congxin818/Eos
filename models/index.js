var sequelize = require('../mysql').sequelize();
var User = sequelize.import('./user.js');
var Group = sequelize.import('./group.js');
var Factory = sequelize.import('./factory.js');
var Workshop = sequelize.import('./workshop.js');
var Linebody = sequelize.import('./linebody.js');
var Validmenu = sequelize.import('./validmenu.js');
var Kpionelev = sequelize.import('./kpionelev.js');
var Kpitwolev = sequelize.import('./kpitwolev.js');

//group和factory之间1：N关系
//Group.hasMany(Factory , {foreignKey:'factorybelong', targetKey:'factoryid', as:'GroupFactory'});

//Factory和Workshop之间1：N关系
//Factory.hasMany(Workshop , {foreignKey:'group_id', targetKey:'factoryid', as:'GroupFactory'});

//user和group之间N:M关系
User.belongsToMany(Group,{through: 'userGroups', as:'UserGroups'});
Group.belongsToMany(User,{through: 'userGroups', as:'UserGroups'});

//user和factory之间N:M关系
User.belongsToMany(Factory,{through: 'userFactorys', as:'UserFactorys'});
Factory.belongsToMany(User,{through: 'userFactorys', as:'UserFactorys'});

//user和Workshop之间N:M关系
User.belongsToMany(Workshop,{through: 'userWorkshops', as:'UserWorkshops'});
Workshop.belongsToMany(User,{through: 'userWorkshops', as:'UserWorkshops'});

//user和Linebody之间N:M关系
User.belongsToMany(Linebody,{through: 'userLinebodys', as:'UserLinebodys'});
Linebody.belongsToMany(User,{through: 'userLinebodys', as:'UserLinebodys'});


//user和Validmenu之间N:M关系
User.belongsToMany(Validmenu,{through: 'userValidmenus', as:'UserValidmenus'});
Validmenu.belongsToMany(User,{through: 'userValidmenus', as:'UserValidmenus'});


// 同步模型到数据库中
sequelize.sync();

exports.User = User;
exports.Group = Group;
exports.Factory = Factory;
exports.Workshop = Workshop;
exports.Linebody = Linebody;
exports.Validmenu = Validmenu;
exports.Kpionelev = Kpionelev;
exports.Kpitwolev = Kpitwolev;
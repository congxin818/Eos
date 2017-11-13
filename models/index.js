var sequelize = require('../mysql').sequelize();
var User = sequelize.import('./user.js');

var Group = sequelize.import('./group.js');
var Factory = sequelize.import('./factory.js');
var Workshop = sequelize.import('./workshop.js');
var Linebody = sequelize.import('./linebody.js');
var Validmenu = sequelize.import('./validmenu.js');

var Kpionelev = sequelize.import('./kpionelev.js');
var Kpitwolev = sequelize.import('./kpitwolev.js');

var UserKpitwolev = sequelize.import('./userkpitwolev.js');

var Losscategory = sequelize.import('./losscategory.js');
var Lossstatus = sequelize.import('./lossstatus.js');
var Losstier4 = sequelize.import('./losstier4.js');
var Objectnow = sequelize.import('./objectnow.js');


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

//user和Kpitwolev之间N:M关系
User.belongsToMany(Kpitwolev,{through: UserKpitwolev, as:'UserKpitwolevs'});
Kpitwolev.belongsToMany(User,{through: UserKpitwolev, as:'UserKpitwolevs'});



//Linebody和Kpitwolev建立1：N关系
Linebody.belongsToMany(Kpitwolev, {through: 'linebodyKpitwolev',as:'LinebodyKpitwolev'});
Kpitwolev.belongsToMany(Linebody, {through: 'linebodyKpitwolev',as:'LinebodyKpitwolev'});
//Linebody和Losscategory建立1：N关系
//Linebody.hasMany(Losscategory, {as:'LinebodyLosscategory' , constraints:true});


//Group和Factory建立1：N关系
Group.hasMany(Factory, {as:'GroupFactory' , constraints:true});
//Group和Workshop建立1：N关系
Factory.hasMany(Workshop, {as:'FactoryWorkshop' ,constraints:true});
//Workshop和Linebody建立1：N关系
Workshop.hasMany(Linebody, {as:'WorkshopLinebody' ,constraints:true});

//Losscategory和Lossstatus建立1：1关系
Losscategory.hasOne(Lossstatus);
//Losscategory和objectnow建立1：1关系
Losscategory.hasOne(Objectnow);


//Kpionelev和Kpitwolev建立1：N关系
Kpionelev.hasMany(Kpitwolev, {as:'KpionelevKpitwolev' , constraints:true});
//Kpitwolev和Losscategory建立1：N关系
Kpitwolev.hasMany(Losscategory, {as:'KpitwolevLosscategory' , constraints:true});
//Tier4和Losscategory建立1：N关系
Losscategory.hasMany(Losstier4, {as:'LosscategoryLosstier4' , constraints:true});

//Linebody和Losscategory建立1：N关系
//Linebody.hasMany(Losstier4, {as:'LinebodyLosstier4' , constraints:true});

sequelize.sync();


exports.User = User;
exports.Group = Group;
exports.Factory = Factory;
exports.Workshop = Workshop;
exports.Linebody = Linebody;
exports.Validmenu = Validmenu;
exports.Kpionelev = Kpionelev;
exports.Kpitwolev = Kpitwolev;
exports.Losscategory = Losscategory;
exports.UserKpitwolev = UserKpitwolev;
exports.Lossstatus = Lossstatus;
exports.Losstier4 = Losstier4;
exports.Objectnow = Objectnow;
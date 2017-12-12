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

var Losstier3 = sequelize.import('./losstier3.js');
var Lossstatus = sequelize.import('./lossstatus.js');
var Losstier4 = sequelize.import('./losstier4.js');

var LinebodyKpitwolev = sequelize.import('./linebodykpitwolev.js');
var LinebodyLosstier3 = sequelize.import('./linebodylosstier3.js');
var LinebodyLosstier4 = sequelize.import('./linebodylosstier4.js');

var Classinformation = sequelize.import('./classinformation.js');
var Productdata = sequelize.import('./productdata.js');

var Productbigclass = sequelize.import('./productbigclass.js');
var Productsubclass = sequelize.import('./productsubclass.js');
var Productname = sequelize.import('./productname.js');
var LinebodyProductname = sequelize.import('./linebodyproductname.js');

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

//线体和产品名字结构建立N:M关系
// Linebody.hasMany(Productname, {as:'LinebodyProductname' , constraints:true});
Linebody.belongsToMany(Productname,{through: LinebodyProductname,as:'LinebodyProductnames'});
//Productname.belongsToMany(Linebody,{through: LinebodyProductname,as:'LinebodyProductnames'});

//Linebody和Kpitwolev建立M：N关系
Linebody.hasMany(LinebodyKpitwolev, {as:'LinebodyKpitwolev' , constraints:true});
Kpitwolev.hasMany(LinebodyKpitwolev, {as:'LinebodyKpitwolev' , constraints:true});

//Linebody和Loss三级建立M：N关系
Linebody.hasMany(LinebodyLosstier3, {as:'LinebodyLosstier3' , constraints:true});
Losstier3.hasMany(LinebodyLosstier3, {as:'LinebodyLosstier3' , constraints:true});

//Linebody和Loss4级建立M：N关系
Linebody.hasMany(LinebodyLosstier4, {as:'LinebodyLosstier4', constraints:true});
Losstier4.hasMany(LinebodyLosstier4, {as:'LinebodyLosstier4', constraints:true});

//LinebodyKpitwolev和LinebodyLosstier3建立1：N关系
LinebodyKpitwolev.hasMany(LinebodyLosstier3, {as:'KpitwolevLosstier3Data' , constraints:true});
//LinebodyKpitwolev和LinebodyLosstier3建立1：N关系
LinebodyLosstier3.hasMany(LinebodyLosstier4, {as:'Losstier3Losstier4Data' , constraints:true});

//Group和Factory建立1：N关系
Group.hasMany(Factory, {as:'GroupFactory' , constraints:true});
//Group和Workshop建立1：N关系
Factory.hasMany(Workshop, {as:'FactoryWorkshop' ,constraints:true});
//Workshop和Linebody建立1：N关系
Workshop.hasMany(Linebody, {as:'WorkshopLinebody' ,constraints:true});

//Linebody和Lossstatus建立1：N关系
Linebody.hasMany(Lossstatus, {as:'LinebodyLossstatus' ,constraints:true});
//Losstier3和Lossstatus建立1：1关系
Losstier3.hasOne(Lossstatus);

//Kpionelev和Kpitwolev建立1：N关系
Kpionelev.hasMany(Kpitwolev, {as:'KpionelevKpitwolev' , constraints:true});
//Kpitwolev和Losscategory建立1：N关系
Kpitwolev.hasMany(Losstier3, {as:'KpitwolevLosscategory' , constraints:true});
//Tier4和Losscategory建立1：N关系
Losstier3.hasMany(Losstier4, {as:'LosscategoryLosstier4' , constraints:true});

//班次表和LinebodyKpitwolev建立1：N关系
Classinformation.hasMany(LinebodyKpitwolev, {as:'ClassinfKpitwolevData' , constraints:true});
//班次表和产品数据表建立1：N关系
Classinformation.hasMany(Productdata, {as:'ClassinfProductData' , constraints:true});

//产品大类和产品小类建立1:N关系
Productbigclass.hasMany(Productsubclass, {as:'ProductbigSubclass' , constraints:true});
//产品小类和产品名字建立1:N关系
Productsubclass.hasMany(Productname, {as:'ProductsubclassName' , constraints:true});
//产品名字线体关联表和产品数据建立1:N关系
LinebodyProductname.hasMany(Productdata, {as:'LineProductnameproductdata' , constraints:true});

sequelize.sync();


exports.User = User;
exports.Group = Group;
exports.Factory = Factory;
exports.Workshop = Workshop;
exports.Linebody = Linebody;
exports.Validmenu = Validmenu;
exports.Kpionelev = Kpionelev;
exports.Kpitwolev = Kpitwolev;
exports.Losstier3 = Losstier3;
exports.UserKpitwolev = UserKpitwolev;
exports.Lossstatus = Lossstatus;
exports.Losstier4 = Losstier4;
exports.LinebodyKpitwolev = LinebodyKpitwolev;
exports.LinebodyLosstier3 = LinebodyLosstier3;
exports.LinebodyLosstier4 = LinebodyLosstier4;
exports.Classinformation = Classinformation;
exports.Productdata = Productdata;
exports.Productbigclass = Productbigclass;
exports.Productsubclass = Productsubclass;
exports.Productname = Productname;
exports.LinebodyProductname = LinebodyProductname;
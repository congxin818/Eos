/*
 auther:Android,
 NOTE:用户表的service,
 time:20171019
 */


var User = require('../models').User;//引入数据库User模块
var Group = require('../models').Group;

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

var parameterError = {
    status: '1', 
    msg: '请求缺少必要参数或参数错误'
};

var loginError = {
    status:'2',
    msg:'用户名或密码验证失败'
};

var existError = {
    status:'3',
    msg:'用户名已存在'
};

var serviceError = {
    status:'-2',
    msg:'服务器错误'
};

/*
    测试关联添加
 */
function createUserGroup(req, res, next) {
    Promise.all([
        User.create({username:'itbilu3', userpsd:'itbilu3.com' , userabbname:'fads' , userjob:'INT' , userleader:'user1'}),
        Group.create({groupname:'管理员3'})
    ]).then(function(results){
        console.log('yuzhizhe01'+results[0]);
        var user = results[0];
        console.log('yuzhizhe02'+results[1]);
        var group = results[1];
        user.setUserGroups(group);
        res.set('Content-Type', 'text/html; charset=utf-8');
        //res.end('创建成功：'+JSON.stringify({user:results[0].dataValues, role:results[1].dataValues}));
        res.end(JSON.stringify(results[0]));
    }).catch(next);
}
exports.createUserGroup = createUserGroup;

/*
    测试关联查询
 */
function selectUserGroup(req , res , next) {
    User.findOne({
            where:{
                userid:req.query.userId
            }
        }).then(function(user){
            user.getUserGroups().then(function(value) {
                res.end(JSON.stringify(value));
            });
            //res.set('Content-Type', 'text/html; charset=utf-8');
            //res.end(JSON.stringify(value));
    });
}
exports.selectUserGroup = selectUserGroup;

/*
	查找所有User
*/
function selectUserAll (req , res) {
    var p = new Promise(function(resolve, reject) {
        //console.log('yuzhizhe04->' + req);
        User.findAll().then(function(data) {
            resolve(data);
        });
    });
    return p;
}

exports.selectUserAll = selectUserAll;

/*
 	根据username查找一个User
*/
exports.selectUserByName = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        User.findOne({
            where:{
                username:req.body.userName
            }
        }).then(function(data){
            resolve(data);
        });
    });
    return p;
}

/*
    根据id查找一个User
*/
exports.selectUserById = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        User.findOne({
            where:{
                userid:req.body.userId
            }
        }).then(function(data){
            resolve(data);
        });
    });
    return p;
}

/*
	添加一个User
*/
exports.addUserOne = function(req , res , next) {
    var user = {
        username: req.body.userName,
        userpsd: req.body.userPsd,
        userabbname:req.body.userAbbName,
        userjob:req.body.userJob,
        userleader:req.body.userLeader
    };
    var p = new Promise(function(resolve, reject) {
        //创建一条记录,创建成功后跳转回首页
        User.create(user).then(function(data){
            dataSuccess.data = data;
            resolve(dataSuccess);
        }).catch (err => {
            if (err.parent.code == 'ER_DUP_ENTRY') {
                resolve(existError);
            }else{
                resolve(serviceError);
            }
            //console.log (err.parent.code)
        });
    });
    return p;
}

/*
	根据userId删除User
*/
exports.deleteUserById = function(req , res) {
    var p = new Promise(function(resolve , reject) {
        //先查找,再调用删除,最后返回首页
        User.findOne({
            where:{
                userId:req.query.userId
            }
        }).then(function(msg){
            //console.log('yuzhizhe->' + JSON.stringify(msg));
            if (msg == '' || msg == undefined) {
                //console.log('yuzhizhe01');
                resolve(null);
            }else{
                //console.log('yuzhizhe02');
                msg.destroy().then(function(data){
                    dataSuccess.data = data;
                    resolve(dataSuccess);
                });
            }
        });
    });
    return p;
}

//根据userId跟新User
exports.updateUserById = function(req , res) {
    var user = {
        userid:req.body.userId,
        username: req.body.userName,
        userpsd: req.body.userPsd,
        useraddname:req.body.userAddName,
        userjob:req.body.userJob,
        userleader:req.body.userLeader
    };
    var p = new Promise(function(resolve , reject) {
        //创建一条记录,创建成功后跳转回首页
        User.update(user,{
            where:{
                userid:req.body.userId
            }
        }).then(function(data){
            if (data == 0) {
                resolve(parameterError);
            }else{
                dataSuccess.data = data;
                resolve(dataSuccess);
            }
        });
    });
    return p;
}
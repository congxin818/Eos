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
    测试关联根据ID查询用户
 */
function selectUserGroup(req , res , next) {
    User.findOne({
            where:{
                userid:req.query.userId
            }
        }).then(function(user){
            extraData.user = user;
            //console.log('yuzhizhe01');
            user.getUserGroups().then(function(group) {
                //console.log('group->' + group);
                extraData.group = group;
            });
            //console.log('yuzhizhe02');
            user.getUserFactorys().then(function(factory) {
                //console.log('factory->' + factory);
                extraData.factory = factory;
                
            });
            //console.log('yuzhizhe03');
            user.getUserWorkshops().then(function(workshop) {
                //console.log('workshop->' + workshop);
                extraData.workshop = workshop;
            });
            // console.log('yuzhizhe04');
            user.getUserLinebodys().then(function(linebody) {
                //console.log('linebody->' + linebody);
                extraData.linebody = linebody;
                //res.end(JSON.stringify(extraData));
            });
            //console.log('yuzhizhe05');
            user.getUserValidmenus().then(function(validmenu) {
                //console.log('validmenu->' + validmenu);
                extraData.validmenu = validmenu;
                res.end(JSON.stringify(extraData));
            });
            //res.set('Content-Type', 'text/html; charset=utf-8');
            //res.end(JSON.stringify(extraData));
    });
}
exports.selectUserGroup = selectUserGroup;

/*
	查找所有User
*/
async function selectUserAll (req , res , next) {
    var array = new Array();
    const users = await User.findAll ();

    if (users == '' || users == undefined || users == null)
    {
        return;
    }
    for(j = 0,len=users.length; j < len; j++) {
        var extraData = {
            user:'',
            group:'group',
            factory:'factory',
            workshop:'workshop',
            linebody:'linebody',
            validmenu:'validmenu'
        };

        const group = await users[j].getUserGroups ();
        const factory = await users[j].getUserFactorys ();
        const workshop = await users[j].getUserWorkshops ();
        const linebody = await users[j].getUserLinebodys ();
        const validmenu = await users[j].getUserValidmenus ();

        extraData.user = users[j];
        extraData.group = group;
        extraData.factory = factory;
        extraData.workshop = workshop;
        extraData.linebody = linebody;
        extraData.validmenu = validmenu;

        array.push(extraData);
    }

    return array;
}

exports.selectUserAll = selectUserAll;

/*
 	根据username查找一个User
*/
exports.selectUserByName = async function(req , res , next) {

    const user = await User.findOne ({ where: { username: req.body.userName}})

    if (user == '' || user == undefined || user == null) {
            return null
    }

    const group = await user.getUserGroups ()
    const factory = await user.getUserFactorys ()
    const workshop = await user.getUserWorkshops ()
    const linebody = await user.getUserLinebodys ()
    const validmenu = await user.getUserValidmenus ()

    var extraData = {
        user: user,
        group:group,
        factory:factory,
        workshop:workshop,
        linebody:linebody,
        validmenu: validmenu
    };

    return extraData
}

/*
    根据id查找一个User
*/
exports.selectUserById =async function(req , res , next) {

    const user = await User.findOne ({ where: { userid: req.body.userId}})

    if (user == '' || user == undefined || user == null) {
            return null
    }

    const group = await user.getUserGroups ()
    const factory = await user.getUserFactorys ()
    const workshop = await user.getUserWorkshops ()
    const linebody = await user.getUserLinebodys ()
    const validmenu = await user.getUserValidmenus ()

    var extraData = {
        user: user,
        group:group,
        factory:factory,
        workshop:workshop,
        linebody:linebody,
        validmenu: validmenu
    };

    return extraData
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
exports.deleteUserById = function(req , res , next) {
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
exports.updateUserById = function(req , res , next) {
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
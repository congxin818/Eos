/*
 auther:Android,
 NOTE:用户表的service,
 time:20171019
 */


var User = require('../models').User;//引入数据库User模块
var Group = require('../models').Group;
let Factory = require('../models').Factory;
let Workshop = require('../models').Workshop;
let Linebody = require('../models').Linebody;
var Validmenu = require('../models').Validmenu;
var stringUtil = require('../utils/stringUtil');

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

const existError = {
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
        // for(j = 0,len=users.length; j < len; j++) {
        //     var extraData = {
        //         user:'',
        //         group:'group',
        //         factory:'factory',
        //         workshop:'workshop',
        //         linebody:'linebody',
        //         validmenu:'validmenu'
        //     };

        //     const group = await users[j].getUserGroups ();
        //     const factory = await users[j].getUserFactorys ();
        //     const workshop = await users[j].getUserWorkshops ();
        //     const linebody = await users[j].getUserLinebodys ();
        //     const validmenu = await users[j].getUserValidmenus ();

        //     extraData.user = users[j];
        //     extraData.group = group;
        //     extraData.factory = factory;
        //     extraData.workshop = workshop;
        //     extraData.linebody = linebody;
        //     extraData.validmenu = validmenu;

        //     array.push(extraData);
        // }
        return users;
    }

    exports.selectUserAll = selectUserAll;

/*
 	根据username查找一个User
    */
    async function selectUserByName(req , res , next) {

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
    exports.selectUserByName = selectUserByName;

/*
    根据id查找一个User
    */
   let areaAll_controller = require('../controllers/areaall_controller');
    async function selectUserById(req , res , next) {

        const user = await User.findOne ({ where: { userid: req.body.userId}})

        if (user == '' || user == undefined || user == null) {
            return null
        }
        let allData = await areaAll_controller.selectAreaAll(req , res);
        console.log('allData.length->' + allData[1].id);
        const allDataJsonStr = JSON.stringify(allData);
        console.log(allDataJsonStr)

        let groupIds = await stringUtil.getIds(allDataJsonStr , '');
        let factoryIds = await stringUtil.getIds(allDataJsonStr , 'f');
        let workshopIds = await stringUtil.getIds(allDataJsonStr , 'w');
        let linebodyIds = await stringUtil.getIds(allDataJsonStr , 'l');

        if (factoryIds.length > 0) {
            for(var i = factoryIds.length - 1; i >= 0; i--) {
                if (factoryIds[i] != null || factoryIds[i] != '') {
                    //console.log('groupIds['+i + ']' +':' +groupIds[i]);
                    try {
                        const ch = 'f' + factoryIds[i];
                        console.log('ch---->'+ch);
                        let value = await Factory.findById(factoryIds[i])
                        let falg = await user.hasUserFactory(value);
                        if (falg) {
                            await updateAreaArray(allData , ch);
                        }
                        console.log(JSON.stringify(falg))
                    }catch (err) {
                        console.log ('error ------>')
                        console.log (err)
                    }

                }
            }
        }
        // const group = await user.getUserGroups ()
        // const factory = await user.getUserFactorys ()
        // const workshop = await user.getUserWorkshops ()
        // const linebody = await user.getUserLinebodys ()
        const validmenu = await user.getUserValidmenus ()

        var extraData = {
            user: user,
            validmenu: validmenu
        };

        return extraData
    }
exports.selectUserById = selectUserById;

async function updateAreaArray(array , id){
    if (array == null || id == null) {
        return null;
    }
    for (var i = array.length - 1; i >= 0; i--) {
        if (array[i].id == id) {
            array[i].checked = true;
        }
    }
}
exports.updateAreaArray = updateAreaArray;

/*
	添加一个User
    */
const addUserOne = async (req , res , next) => {
    let user = {
        username: req.body.userName,
        userpsd: req.body.userPsd,
        userabbname:req.body.userAbbName,
        userjob:req.body.userJob,
        userleader:req.body.userLeader
    };
    let menuids = new Array();

    const menuids_str = req.body.validMenu;

    const jsonString = req.body.validArea;
    //console.log('validArea->'+jsonString);
    //console.log('menuids_str->'+menuids_str);

    let groupIds = await stringUtil.getIds(jsonString , '');
    let factoryIds = await stringUtil.getIds(jsonString , 'f');
    let workshopIds = await stringUtil.getIds(jsonString , 'w');
    let linebodyIds = await stringUtil.getIds(jsonString , 'l');
    
    //console.log('yuzhizhe01->'+groupIds.length);
   // console.log('yuzhizhe02->'+factoryIds.length);
   // console.log('yuzhizhe03->'+workshopIds.length);
    //console.log('yuzhizhe04->'+linebodyIds.length);
    
    if (menuids_str != null || menuids_str != '') {
        menuids = menuids_str.split(",");
    }
    try {
        const data = await User.create (user);
        
        
        if (menuids.length > 0) {
            let values = new Array ()
            for(var i = menuids.length - 1; i >= 0; i--) {
                if (menuids[i] != null || menuids[i] != '') {
                    //console.log('menuids['+i + ']' +':' +menuids[i]);
                    let value = await Validmenu.findById(menuids[i])
                    values.push (value)
                }
            }
            values.forEach (async value => await data.setUserValidmenus (value));
        }
        
        if (groupIds.length > 0) {
            let values = new Array ()
            for(var i = groupIds.length - 1; i >= 0; i--) {
                if (groupIds[i] != null || groupIds[i] != '') {
                    //console.log('groupIds['+i + ']' +':' +groupIds[i]);
                    let value = await Group.findById(groupIds[i])
                    values.push (value)
                }
            }
            values.forEach (async value => await data.setUserGroups (value));
        }
        if (factoryIds.length > 0) {
            let values = new Array ()
            for(var i = factoryIds.length - 1; i >= 0; i--) {
                if (factoryIds[i] != null || factoryIds[i] != '') {
                    //console.log('factoryIds['+i + ']' +':' +factoryIds[i]);
                    let value = await Factory.findById(factoryIds[i])
                    values.push (value)
                }
            }
            values.forEach (async value => await data.setUserFactorys (value));
        }
        if (workshopIds.length > 0) {
            let values = new Array ()
            for(var i = workshopIds.length - 1; i >= 0; i--) {
                if (workshopIds[i] != null || workshopIds[i] != '') {
                    //console.log('workshopIds['+i + ']' +':' +workshopIds[i]);
                    let value = await Workshop.findById(workshopIds[i])
                    values.push (value)
                }
            }
            values.forEach (async value => await data.setUserWorkshops (value));
        }
        if (linebodyIds.length > 0) {
            let values = new Array ()
            for(var i = linebodyIds.length - 1; i >= 0; i--) {
                if (linebodyIds[i] != null || linebodyIds[i] != '') {
                    //console.log('linebodyIds['+i + ']' +':' +linebodyIds[i]);
                    let value = await Linebody.findById(linebodyIds[i])
                    values.push (value)
                }
            }
            values.forEach (async value => await data.setUserLinebodys (value));
        }
        dataSuccess.data = data;
        return dataSuccess
    }
    catch (err) {
        if (err.parent.code == 'ER_DUP_ENTRY') {
            return existError
        }
        else {
            return serviceError
        }
    }
}
exports.addUserOne = addUserOne;

/*
	根据userId删除User
    */
    async function deleteUserById(req , res , next) {
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
    exports.deleteUserById = deleteUserById;

//根据userId跟新User
async function updateUserById(req , res , next) {
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
exports.updateUserById = updateUserById;
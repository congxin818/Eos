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
let areaAll_controller = require('../controllers/areaall_controller');
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
const noExistError = {
    status:'4',
    msg:'用户名不存在'
};
var serviceError = {
    status:'-2',
    msg:'服务器错误'
};

/*
    分页查找
    */
async function findAndCount (req ,res , next){
    const pageSize  = 5;
    let page;
    if(req.query.page != null && req.query.page != ""){
        page = parseInt(req.query.page);
    }
    const data = await User.findAndCountAll({
            where:'',//为空，获取全部，也可以自己添加条件
            offset:(page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
            limit:pageSize//每页限制返回的数据条数
        });
    dataSuccess.data = data;
    return dataSuccess;
}
exports.findAndCount = findAndCount;
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

        // const group = await user.getUserGroups ()
        // const factory = await user.getUserFactorys ()
        // const workshop = await user.getUserWorkshops ()
        // const linebody = await user.getUserLinebodys ()
        // const validmenu = await user.getUserValidmenus ()

        // var extraData = {
        //     user: user,
        //     group:group,
        //     factory:factory,
        //     workshop:workshop,
        //     linebody:linebody,
        //     validmenu: validmenu
        // };
        return user;
    }
    exports.selectUserByName = selectUserByName;

/*
    根据id查找一个User
    */

    async function selectUserById(req , res , next) {

        const user = await User.findOne ({ where: { userid: req.body.userId}})

        if (user == '' || user == undefined || user == null) {
            return null
        }
        let allData = await areaAll_controller.selectAreaAll(req , res);
        //console.log('allData.length->' + allData.length);
       // console.log('allData.length->' + allData[4].id);
       // console.log('allData.length->' + allData[4].checked);
       const allDataJsonStr = JSON.stringify(allData);
        //console.log('allDataJsonStr----->'+allDataJsonStr)

        let groupIds = await stringUtil.getIds(allDataJsonStr , '');
        let factoryIds = await stringUtil.getIds(allDataJsonStr , 'f');
        let workshopIds = await stringUtil.getIds(allDataJsonStr , 'w');
        let linebodyIds = await stringUtil.getIds(allDataJsonStr , 'l');

        if (groupIds.length > 0) {
            for(var i = groupIds.length - 1; i >= 0; i--) {
                if (groupIds[i] != null || groupIds[i] != '') {
                    //console.log('groupIds['+i + ']' +':' +groupIds[i]);
                    try {
                        const ch = groupIds[i];
                        //console.log('ch---->'+ch);
                        let value = await Group.findById(groupIds[i])
                        let falg = await user.hasUserGroup(value);
                        if (falg) {
                            await updateAreaArray(allData , ch);
                        }
                        console.log(JSON.stringify(falg))
                    }catch (err) {
                        console.log ('error ------>')
                        console.log (err)
                        return serviceError;
                    }

                }
            }
        }

        if (factoryIds.length > 0) {
            for(var i = factoryIds.length - 1; i >= 0; i--) {
                if (factoryIds[i] != null || factoryIds[i] != '') {
                    //console.log('groupIds['+i + ']' +':' +groupIds[i]);
                    try {
                        const ch = 'f' + factoryIds[i];
                        //console.log('ch---->'+ch);
                        let value = await Factory.findById(factoryIds[i])
                        let falg = await user.hasUserFactory(value);
                        if (falg) {
                            await updateAreaArray(allData , ch);
                        }
                        console.log(JSON.stringify(falg))
                    }catch (err) {
                        console.log ('error ------>')
                        console.log (err)
                        return serviceError;
                    }

                }
            }
        }

        if (workshopIds.length > 0) {
            for(var i = workshopIds.length - 1; i >= 0; i--) {
                if (workshopIds[i] != null || workshopIds[i] != '') {
                    //console.log('groupIds['+i + ']' +':' +groupIds[i]);
                    try {
                        const ch = 'w' + workshopIds[i];
                        //console.log('ch---->'+ch);
                        let value = await Workshop.findById(workshopIds[i])
                        let falg = await user.hasUserWorkshop(value);
                        if (falg) {
                            await updateAreaArray(allData , ch);
                        }
                        console.log(JSON.stringify(falg))
                    }catch (err) {
                        console.log ('error ------>')
                        console.log (err)
                        return serviceError;
                    }

                }
            }
        }

        if (linebodyIds.length > 0) {
            for(var i = linebodyIds.length - 1; i >= 0; i--) {
                if (linebodyIds[i] != null || linebodyIds[i] != '') {
                    //console.log('groupIds['+i + ']' +':' +groupIds[i]);
                    try {
                        const ch = 'l' + linebodyIds[i];
                        //console.log('ch---->'+ch);
                        let value = await Linebody.findById(linebodyIds[i])
                        let falg = await user.hasUserLinebody(value);
                        if (falg) {
                            await updateAreaArray(allData , ch);
                        }
                        console.log(JSON.stringify(falg))
                    }catch (err) {
                        console.log ('error ------>')
                        console.log (err)
                        return serviceError;
                    }

                }
            }
        }
        const validmenu = await user.getUserValidmenus ()

        var extraData = {
            user: user,
            validmenu: validmenu,
            validarea:allData
        };
        //console.log('yuzhizhe01--------->'+ JSON.stringify(allData));
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
    
    let groupIds = [];
    let factoryIds = [];
    let workshopIds = [];
    let linebodyIds = [];
    if (jsonString != null || jsonString == '') {
        groupIds = await stringUtil.getIds(jsonString , '');
        factoryIds = await stringUtil.getIds(jsonString , 'f');
        workshopIds = await stringUtil.getIds(jsonString , 'w');
        linebodyIds = await stringUtil.getIds(jsonString , 'l');
    }
    console.log('yuzhizhe01->'+groupIds.length);
     console.log('yuzhizhe02->'+factoryIds.length);
     console.log('yuzhizhe03->'+workshopIds.length);
    console.log('yuzhizhe04->'+linebodyIds.length);
    
    if (menuids_str != null || menuids_str != '') {
        menuids = menuids_str.split(",");
    }

    try {
        const data = await User.create (user);
        console.log('yuzhizhe06->'+ data);
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
         console.log('error---yuzhizhe05->' + err);
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
        const user = await User.findById(req.query.userId);
        if (user == undefined || user == null || user == '') {
            return noExistError;
        }
        const falg = await User.destroy({where:{userid:req.query.userId}});
        if (falg == null && falg != 1) {
            return noExistError;
        }
        await user.setUserValidmenus([]);
        await user.setUserGroups([]);
        await user.setUserFactorys([]);
        await user.setUserWorkshops([]);
        await user.setUserLinebodys([]);
        dataSuccess.data = falg;
        return dataSuccess;
    }
    exports.deleteUserById = deleteUserById;

//根据userId跟新User
async function updateUserById(req , res , next) {
    var newUser = {
        userid:req.body.userId,
        username: req.body.userName,
        userpsd: req.body.userPsd,
        useraddname:req.body.userAddName,
        userjob:req.body.userJob,
        userleader:req.body.userLeader
    };
    const user = await User.findById(req.body.userId);
    if (user == undefined || user == null || user == '') {
        return noExistError;
    }

    const falg = await User.update(newUser,{where:{userid:req.body.userId}});
    
    if (falg == null && falg != 1) {
        return noExistError;
    }
    // console.log(falg);
    // console.log(JSON.stringify(falg));
    await user.setUserValidmenus([]);
    await user.setUserGroups([]);
    await user.setUserFactorys([]);
    await user.setUserWorkshops([]);
    await user.setUserLinebodys([]);

    let menuids = new Array();
    const menuids_str = req.body.validMenu;
    const jsonString = req.body.validArea;
    // console.log('validArea->'+jsonString);
    // console.log('menuids_str->'+menuids_str);
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
        if (menuids.length > 0) {
            let values = new Array ()
            for(var i = menuids.length - 1; i >= 0; i--) {
                if (menuids[i] != null || menuids[i] != '') {
                    //console.log('menuids['+i + ']' +':' +menuids[i]);
                    let value = await Validmenu.findById(menuids[i])
                    values.push (value)
                }
            }
            values.forEach (async value => await user.setUserValidmenus (value));
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
            values.forEach (async value => await user.setUserGroups (value));
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
            values.forEach (async value => await user.setUserFactorys (value));
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
            values.forEach (async value => await user.setUserWorkshops (value));
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
            values.forEach (async value => await user.setUserLinebodys (value));
        }
        dataSuccess.data = falg;
        return dataSuccess;
    }
    catch (err) {
        console.log('error---->' + err);
        return serviceError;
    }
}
exports.updateUserById = updateUserById;
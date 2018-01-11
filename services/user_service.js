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
var Kpitwolev = require('../models').Kpitwolev;
var UserKpitwolev = require('../models').UserKpitwolev;

var stringUtil = require('../utils/stringUtil');
var errorUtil = require('../utils/errorUtil');

let areaAll_controller = require('../controllers/areaall_controller');
let userkpitwolev_service = require('../services/userkpitwolev_service.js');

var dataSuccess = {
    status: '0',
    msg: '请求成功',
    data: 'fas'
};

/*
    分页查找
    */
async function findAndCount(req, res, next) {
    const pageSize = 10;
    let page;
    if (req.query.page != null && req.query.page != "") {
        page = parseInt(req.query.page);
    }
    const data = await User.findAndCountAll({
        where: '',//为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize,//开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize//每页限制返回的数据条数
    });
    dataSuccess.data = data;
    return dataSuccess;
}
exports.findAndCount = findAndCount;
/*
	查找所有User
    */
async function selectUserAll(req, res, next) {
    const users = await User.findAll();

    if (users == '' || users == undefined || users == null) {
        return;
    }
    return users;
}
exports.selectUserAll = selectUserAll;

/*
 	根据username查找一个User
    */
async function selectUserByName(req, res, next) {

    const user = await User.findOne({ where: { username: req.body.userName } })

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

async function selectUserById(req, res, next) {

    const user = await User.findOne({ where: { userid: req.body.userId } })

    if (user == '' || user == undefined || user == null) {
        return null
    }
    let allData = await areaAll_controller.selectAreaAll(req, res);
    //console.log('allData.length->' + allData.length);
    // console.log('allData.length->' + allData[4].id);
    // console.log('allData.length->' + allData[4].checked);
    const allDataJsonStr = JSON.stringify(allData);
    //console.log('allDataJsonStr----->'+allDataJsonStr)

    let groupIds = await stringUtil.getIds(allDataJsonStr, '');
    let factoryIds = await stringUtil.getIds(allDataJsonStr, 'f');
    let workshopIds = await stringUtil.getIds(allDataJsonStr, 'w');
    let linebodyIds = await stringUtil.getIds(allDataJsonStr, 'l');

    if (groupIds.length > 0) {
        for (var i = groupIds.length - 1; i >= 0; i--) {
            if (groupIds[i] != null || groupIds[i] != '') {
                //console.log('groupIds['+i + ']' +':' +groupIds[i]);
                try {
                    const ch = groupIds[i];
                    //console.log('ch---->'+ch);
                    let value = await Group.findById(groupIds[i])
                    let falg = await user.hasUserGroup(value);
                    if (falg) {
                        await updateAreaArray(allData, ch);
                    }
                    console.log(JSON.stringify(falg))
                } catch (err) {
                    console.log('error ------>')
                    console.log(err)
                    return errorUtil.serviceError;
                }

            }
        }
    }

    if (factoryIds.length > 0) {
        for (var i = factoryIds.length - 1; i >= 0; i--) {
            if (factoryIds[i] != null || factoryIds[i] != '') {
                //console.log('groupIds['+i + ']' +':' +groupIds[i]);
                try {
                    const ch = 'f' + factoryIds[i];
                    //console.log('ch---->'+ch);
                    let value = await Factory.findById(factoryIds[i])
                    let falg = await user.hasUserFactory(value);
                    if (falg) {
                        await updateAreaArray(allData, ch);
                    }
                    console.log(JSON.stringify(falg))
                } catch (err) {
                    console.log('error ------>')
                    console.log(err)
                    return errorUtil.serviceError;
                }

            }
        }
    }

    if (workshopIds.length > 0) {
        for (var i = workshopIds.length - 1; i >= 0; i--) {
            if (workshopIds[i] != null || workshopIds[i] != '') {
                //console.log('groupIds['+i + ']' +':' +groupIds[i]);
                try {
                    const ch = 'w' + workshopIds[i];
                    //console.log('ch---->'+ch);
                    let value = await Workshop.findById(workshopIds[i])
                    let falg = await user.hasUserWorkshop(value);
                    if (falg) {
                        await updateAreaArray(allData, ch);
                    }
                    console.log(JSON.stringify(falg))
                } catch (err) {
                    console.log('error ------>')
                    console.log(err)
                    return errorUtil.serviceError;
                }

            }
        }
    }

    if (linebodyIds.length > 0) {
        for (var i = linebodyIds.length - 1; i >= 0; i--) {
            if (linebodyIds[i] != null || linebodyIds[i] != '') {
                //console.log('groupIds['+i + ']' +':' +groupIds[i]);
                try {
                    const ch = 'l' + linebodyIds[i];
                    //console.log('ch---->'+ch);
                    let value = await Linebody.findById(linebodyIds[i])
                    let falg = await user.hasUserLinebody(value);
                    if (falg) {
                        await updateAreaArray(allData, ch);
                    }
                    console.log(JSON.stringify(falg))
                } catch (err) {
                    console.log('error ------>')
                    console.log(err)
                    return errorUtil.serviceError;
                }
            }
        }
    }
    const validmenu = await user.getUserValidmenus();
    let tier2 = await user.getUserKpitwolevs({ 'attributes': ['name', 'kpitwoid'] });
    tier2.sort((a, b) => { return a.userKpitwolev.sequence - b.userKpitwolev.sequence });
    //const value = await stringUtil.bubbleSort(tier2);

    var extraData = {
        user: user,
        validmenu: validmenu,
        validarea: allData,
        tier2: tier2
    };
    //console.log('yuzhizhe01--------->'+ JSON.stringify(allData));
    return extraData
}
exports.selectUserById = selectUserById;

async function updateAreaArray(array, id) {
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
async function addUserOne(req, res, next) {
    let user = {
        username: req.body.userName,
        userpsd: req.body.userPsd,
        userabbname: req.body.userAbbName,
        userjob: req.body.userJob,
        userleader: req.body.userLeader
    };
    let menuids = new Array();

    const menuids_str = req.body.validMenu;

    const jsonString = req.body.validArea;
    //console.log('validArea->'+jsonString);
    //console.log('menuids_str->'+menuids_str);

    let groupIds = new Array();
    let factoryIds = new Array();
    let workshopIds = new Array();
    let linebodyIds = new Array();
    if (jsonString != null || jsonString != '') {
        groupIds = await stringUtil.getIds(jsonString, '');
        factoryIds = await stringUtil.getIds(jsonString, 'f');
        workshopIds = await stringUtil.getIds(jsonString, 'w');
        linebodyIds = await stringUtil.getIds(jsonString, 'l');
    }
    // console.log('yuzhizhe01->'+groupIds.length);
    // console.log('yuzhizhe02->'+factoryIds.length);
    // console.log('yuzhizhe03->'+workshopIds.length);
    // console.log('yuzhizhe04->'+linebodyIds.length);

    if (menuids_str != null || menuids_str != '') {
        menuids = menuids_str.split(",");
    }

    try {
        const data = await User.create(user);
        //console.log('yuzhizhe06->'+ data);
        if (menuids.length > 0) {
            let values = new Array()
            for (var i = menuids.length - 1; i >= 0; i--) {
                if (menuids[i] != null || menuids[i] != '') {
                    //console.log('menuids['+i + ']' +':' +menuids[i]);
                    let value = await Validmenu.findById(menuids[i])
                    values.push(value)
                }
            }
            values.forEach(async value => await data.setUserValidmenus(value));
        }

        if (groupIds.length > 0) {
            let values = new Array()
            for (var i = groupIds.length - 1; i >= 0; i--) {
                if (groupIds[i] != null || groupIds[i] != '') {
                    //console.log('groupIds['+i + ']' +':' +groupIds[i]);
                    let value = await Group.findById(groupIds[i])
                    values.push(value)
                }
            }
            values.forEach(async value => await data.setUserGroups(value));
        }
        if (factoryIds.length > 0) {
            let values = new Array()
            for (var i = factoryIds.length - 1; i >= 0; i--) {
                if (factoryIds[i] != null || factoryIds[i] != '') {
                    //console.log('factoryIds['+i + ']' +':' +factoryIds[i]);
                    let value = await Factory.findById(factoryIds[i])
                    values.push(value)
                }
            }
            values.forEach(async value => await data.setUserFactorys(value));
        }
        if (workshopIds.length > 0) {
            let values = new Array()
            for (var i = workshopIds.length - 1; i >= 0; i--) {
                if (workshopIds[i] != null || workshopIds[i] != '') {
                    //console.log('workshopIds['+i + ']' +':' +workshopIds[i]);
                    let value = await Workshop.findById(workshopIds[i])
                    values.push(value)
                }
            }
            values.forEach(async value => await data.setUserWorkshops(value));
        }
        if (linebodyIds.length > 0) {
            let values = new Array()
            for (var i = linebodyIds.length - 1; i >= 0; i--) {
                if (linebodyIds[i] != null || linebodyIds[i] != '') {
                    //console.log('linebodyIds['+i + ']' +':' +linebodyIds[i]);
                    let value = await Linebody.findById(linebodyIds[i])
                    values.push(value)
                }
            }
            values.forEach(async value => await data.setUserLinebodys(value));
        }
        const kpitwoAll = await Kpitwolev.findAll();

        if (kpitwoAll.length > 0) {
            let i = 0;
            kpitwoAll.forEach(async value => {
                i++
                //console.log (`i ====================================> ${i}`)
                //console.log (JSON.stringify (value, null, 4));
                await data.addUserKpitwolevs(value, { through: { sequence: i } });
            });
        }
        dataSuccess.data = data;
        return dataSuccess;
    }
    catch (err) {
        console.log('yuzhizhe_error------>' + err);
        if (err.parent.code == 'ER_DUP_ENTRY') {
            return errorUtil.existError
        }
        else {
            return errorUtil.serviceError
        }
    }
}
exports.addUserOne = addUserOne;

/*
	根据userId删除User
    */
async function deleteUserById(userId) {
    if (userId == undefined || userId == null || userId == '') {
        return errorUtil.parameterError;
    }
    const user = await User.findById(userId);
    if (user == undefined || user == null || user == '') {
        return errorUtil.noExistError;
    }
    const falg = await User.destroy({ where: { userid: userId } });
    if (falg == null || falg != 1) {
        return errorUtil.noExistError;
    }
    await user.setUserValidmenus([]);
    await user.setUserGroups([]);
    await user.setUserFactorys([]);
    await user.setUserWorkshops([]);
    await user.setUserLinebodys([]);
    await user.setUserKpitwolevs([]);
    //dataSuccess.data = user;
    return user;
}
exports.deleteUserById = deleteUserById;

//根据userId跟新User
async function updateUserById(req, res, next) {
    var newUser = {
        userid: req.body.userId,
        username: req.body.userName,
        userpsd: req.body.userPsd,
        useraddname: req.body.userAddName,
        userjob: req.body.userJob,
        userleader: req.body.userLeader
    };
    const user = await User.findById(req.body.userId);
    if (user == undefined || user == null || user == '') {
        return errorUtil.noExistError;
    }

    const falg = await User.update(newUser, { where: { userid: req.body.userId } });

    if (falg == null || falg != 1) {
        return errorUtil.noExistError;
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
    let groupIds = new Array();
    let factoryIds = new Array();
    let workshopIds = new Array();
    let linebodyIds = new Array();
    if (jsonString != null || jsonString != '') {
        groupIds = await stringUtil.getIds(jsonString, '');
        factoryIds = await stringUtil.getIds(jsonString, 'f');
        workshopIds = await stringUtil.getIds(jsonString, 'w');
        linebodyIds = await stringUtil.getIds(jsonString, 'l');
    }
    //console.log('yuzhizhe01->'+groupIds.length);
    // console.log('yuzhizhe02->'+factoryIds.length);
    // console.log('yuzhizhe03->'+workshopIds.length);
    //console.log('yuzhizhe04->'+linebodyIds.length);

    if (menuids_str != null || menuids_str != '') {
        menuids = menuids_str.split(",");
    }
    try {
        if (menuids.length > 0) {
            let values = new Array()
            for (var i = menuids.length - 1; i >= 0; i--) {
                if (menuids[i] != null || menuids[i] != '') {
                    //console.log('menuids['+i + ']' +':' +menuids[i]);
                    let value = await Validmenu.findById(menuids[i])
                    values.push(value)
                }
            }
            values.forEach(async value => await user.setUserValidmenus(value));
        }

        if (groupIds.length > 0) {
            let values = new Array()
            for (var i = groupIds.length - 1; i >= 0; i--) {
                if (groupIds[i] != null || groupIds[i] != '') {
                    //console.log('groupIds['+i + ']' +':' +groupIds[i]);
                    let value = await Group.findById(groupIds[i])
                    values.push(value)
                }
            }
            values.forEach(async value => await user.setUserGroups(value));
        }
        if (factoryIds.length > 0) {
            let values = new Array()
            for (var i = factoryIds.length - 1; i >= 0; i--) {
                if (factoryIds[i] != null || factoryIds[i] != '') {
                    //console.log('factoryIds['+i + ']' +':' +factoryIds[i]);
                    let value = await Factory.findById(factoryIds[i])
                    values.push(value)
                }
            }
            values.forEach(async value => await user.setUserFactorys(value));
        }
        if (workshopIds.length > 0) {
            let values = new Array()
            for (var i = workshopIds.length - 1; i >= 0; i--) {
                if (workshopIds[i] != null || workshopIds[i] != '') {
                    //console.log('workshopIds['+i + ']' +':' +workshopIds[i]);
                    let value = await Workshop.findById(workshopIds[i])
                    values.push(value)
                }
            }
            values.forEach(async value => await user.setUserWorkshops(value));
        }
        if (linebodyIds.length > 0) {
            let values = new Array()
            for (var i = linebodyIds.length - 1; i >= 0; i--) {
                if (linebodyIds[i] != null || linebodyIds[i] != '') {
                    //console.log('linebodyIds['+i + ']' +':' +linebodyIds[i]);
                    let value = await Linebody.findById(linebodyIds[i])
                    values.push(value)
                }
            }
            values.forEach(async value => await user.setUserLinebodys(value));
        }
        dataSuccess.data = falg;
        return dataSuccess;
    }
    catch (err) {
        console.log('yuzhizhe_error---->' + err);
        return errorUtil.serviceError;
    }
}
exports.updateUserById = updateUserById;

//根据userId跟新User
async function updateUserPsdById(userId, userNewPsd) {
    if (userId == undefined || userId == null || userId == ''
        || userNewPsd == undefined || userNewPsd == null || userNewPsd == '') {
        return;
    }
    var newUser = {
        userid: userId,
        userpsd: userNewPsd
    };
    const user = await User.findById(userId);
    if (user == undefined || user == null || user == '') {
        return errorUtil.noExistError;
    }

    const falg = await User.update(newUser, { where: { userid: userId } });
    return falg;
}
exports.updateUserPsdById = updateUserPsdById;

/*
    修改用户关联的KPI二级目录的顺序
 */
async function updateUserKpiTwolveById(userId, kpiTwolevId, newOrder) {
    if (userId == undefined || userId == null || userId == ''
        || newOrder == undefined || newOrder == null || newOrder == '') {
        return errorUtil.parameterError;
    }
    const user = await User.findById(userId);
    //console.log ('user ' + JSON.stringify (user, null, 4) + '\n\n\n\n\n\n')

    const kpitwo = await Kpitwolev.findById(kpiTwolevId);
    //console.log ('kpitwo' + JSON.stringify (kpitwo, null, 4) + '\n\n\n\n\n\n')
    if (user == undefined || user == null || user == ''
        || kpitwo == undefined || kpitwo == null || kpitwo == '') {
        return errorUtil.noExistError;
    }

    const falg = await user.hasUserKpitwolevs(kpitwo);
    //console.log ('falg' + JSON.stringify (falg, null, 4) + '\n\n\n\n\n\n')

    if (falg == false || falg == undefined || falg == null || falg == '') {
        return errorUtil.noExistError;
    }
    try {
        //const intNewOrder = parseInt (newOrder)
        //console.log (typeof intNewOrder)
        //console.log('userId--->' + userId + '\n' +'kpiTwolevId--->' + kpiTwolevId + '\n'+'newOrder--->' + newOrder + '\n');
        const value = await userkpitwolev_service.updateSequenceById(userId, kpiTwolevId, newOrder);
        //console.log ('value ' + JSON.stringify (value, null, 4) + '\n\n\n\n\n\n')
        return value;
    }
    catch (err) {
        console.log(`error --> ${err}`)
    }
}
exports.updateUserKpiTwolveById = updateUserKpiTwolveById;
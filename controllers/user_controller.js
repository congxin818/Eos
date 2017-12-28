/*
 auther:Android,
 NOTE:用户表的controller层,
 time:20171019
 */

var service = require('../services/user_service');
var User = require('../models').User;//引入数据库User模块
var errorUtil = require('../utils/errorUtil');

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

var parameterError = {
    status: '1', 
    msg: '参数错误'
};

var loginError = {
    status:'2',
    msg:'用户名或密码验证失败'
};

var existError = {
    status:'3',
    msg:'用户名已存在！'
};
/*
    用户登录接口
    */
async function findAndCount(req , res , next){
    if (req.query.page == undefined ||req.query.page == ''||req.query.page == null) {
        res.end(parameterError);
        return;
    }
    service.findAndCount(req , res , next).then(function(data){
        res.end(JSON.stringify(data));
    });
}
exports.findAndCount = findAndCount;

/*
    用户登录接口
    */
async function userLogin(req , res , next) {
    //如果没有post数据或者数据为空,直接返回
    const userpsd = req.body.userPsd;
    if (req.body.userName == undefined ||req.body.userName == ''
        || req.body.userPsd == undefined || req.body.userPsd == '') {
        res.end(parameterError);
        return;
    }

    service.selectUserByName(req , res ,next).then(function(data) {
        if (data == undefined || data == '') {
            res.end(JSON.stringify(loginError));
            return;
        }
        if (userpsd == data.userpsd) {
            let SuccessFalg = {
                status: '0', 
                msg: '请求成功',
                data:'fas',
                falg:'001'
            };
            SuccessFalg.data = data;
            res.end(JSON.stringify(SuccessFalg));  
        }else{
            res.end(JSON.stringify(loginError));
        }
    });
}
exports.userLogin = userLogin;

/*
	查找所有User
*/
exports.selectUserAll = function(req , res , next) {
    if (req == '' || req == undefined) {
        res.end(JSON.stringify(parameterError));
        return;
    }
	service.selectUserAll(req , res , next).then(function(data){
        //console.log(data);
        if (data == '' || data == undefined || data == null) {
            dataSuccess.data = null;
        }else{
            dataSuccess.data = data;
        }
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
 	根据username查找一个User
*/
exports.selectUserByName = async function(req , res , next) {
	if (req == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    
	//如果没有username或者username为空,直接返回
    if (req.body.userName == undefined || req.body.userName == '') {
        res.end(JOSN.stringify(parameterError));
        return;
    }
    const data = await service.selectUserByName(req , res , next)

    if (data == null || data == '' || data == undefined) {
            res.end(JSON.stringify(parameterError));
        }else{
            dataSuccess.data = data;
            res.end(JSON.stringify(dataSuccess));
        }
}

/*
 	根据userId查找一个User
*/
exports.selectUserById = function(req , res , next) {
	if (req == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
	//如果没有username或者username为空,直接返回
    if (req.body.userId == undefined || req.body.userId == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    service.selectUserById(req , res , next).then(function(data){
        //console.log(data);
        if (data == null || data == '' || data == undefined) {
            res.end(JSON.stringify(parameterError));
        }else{
            dataSuccess.data = data;
            res.end(JSON.stringify(dataSuccess));
        }
    });
}

/*
	添加一个User
*/
var stringUtil = require('../utils/stringUtil');
async function addUserOne(req , res , next) {
	if (req == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    
	//如果没有post数据或者数据为空,直接返回
    if (req.body.userName == undefined ||req.body.userName == ''
        || req.body.userPsd == undefined || req.body.userPsd == ''
        || req.body.userAbbName == undefined|| req.body.userJob == undefined
        || req.body.userLeader == undefined || req.body.validArea == undefined) {
        res.end(JSON.stringify(parameterError));
        return;
    }
    //创建一条记录,创建成功后返回json数据
    service.addUserOne(req , res , next).then(function(data){
        //dataSuccess.data = data;
        res.end(JSON.stringify(data));
    })
}
exports.addUserOne = addUserOne;
/*
	根据userId删除User
*/
exports.deleteUserById = function(req , res , next) {
	//如果没有username字段,返回404
    if (req.query.userId == undefined ||req.query.userId == '') {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    //先查找,再调用删除,最后返回json数据
    service.deleteUserById(req.query.userId).then(function(data){
        //console.log(JSON.stringify(data));
        if (data == null || data == undefined || data == '') {
            res.end(JSON.stringify(errorUtil.parameterError));
        }else{
            dataSuccess.data = data;
            res.end(JSON.stringify(dataSuccess));
        }
    });
}

/*
    根据所有的userIds批量删除用户
 */
async function massDeleteUserByUserIds(req , res , next){
    if (req.body.userIds == undefined || req.body.userIds == null || req.body.userIds == '') {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    const Ids = req.body.userIds.split(',');
    if (Ids == undefined || Ids == null || Ids == '' || Ids.length == 0) {
        res.end(JSON.stringify(errorUtil.parameterError));
        return;
    }
    let allData = new Array();
    for (var i = Ids.length - 1; i >= 0; i--) {
        const userData = await service.deleteUserById(Ids[i]);
        allData.push(userData);
    }
    dataSuccess.data = allData;
    res.end(JSON.stringify(dataSuccess));
}
exports.massDeleteUserByUserIds = massDeleteUserByUserIds;

//根据userId跟新User
exports.updateUserById = function(req , res , next) {
	//如果没有post数据或者数据为空,直接返回
    if (req.body.userId == undefined ||req.body.userId == ''
        ||req.body.userName == undefined ||req.body.userName == ''
        || req.body.userPsd == undefined || req.body.userPsd == ''
        || req.body.userAbbName == undefined|| req.body.userJob == undefined
        || req.body.userLeader == undefined) {
        res.end(JSON.stringify(parameterError));
        return;
    }
    //创建一条记录,创建成功后跳转回首页
    service.updateUserById(req , res , next).then(function(data){
        //console.log(data);
        res.end(JSON.stringify(data));
    });
}
/*
    根据ID修改用户密码
 */
async function updateUserPsdById(req , res , next){
    if (req == undefined ||　req == null || req == ''
        ||res == undefined || res == null || res == '') {
        res.end(JSON.stringify(errorUtil.parameterError));
    }
    const userId = req.body.userId;
    const userPsd = req.body.userPsd;
    const userNewPsd = req.body.userNewPsd;
    if (userId == undefined ||userId == null || userId == ''
        ||userPsd == undefined || userPsd == null || userPsd == ''
        ||userNewPsd == undefined || userNewPsd == null || userNewPsd == '') {
        res.end(JSON.stringify(errorUtil.parameterError));
    }
    const user = await User.findById(userId);
    if (user == undefined || user == null || user == '') {
        res.end(JSON.stringify(errorUtil.noExistError));
    }
    const userOldPsd = user.userpsd;
    if (userOldPsd == undefined || userOldPsd == null || userOldPsd == '') {
        res.end(JSON.stringify(errorUtil.serviceError));
    }
    if (userOldPsd == userPsd) {
        const falg = await service.updateUserPsdById(userId , userNewPsd);
        if (falg == undefined || falg == '' || falg == null && falg != 1) {
            res.end(JSON.stringify(errorUtil.serviceError));
        }else{
            dataSuccess.data = falg;
            res.end(JSON.stringify(dataSuccess));
        }
    }else{
        res.end(JSON.stringify(loginError));
    }
}
exports.updateUserPsdById = updateUserPsdById;

/*
    根据ID修改用户tier2顺序
 */
async function updateUserKpiTwolveById(req , res , next){
    if (req == undefined ||　req == null || req == ''
        ||res == undefined || res == null || res == '') {
        res.end(JSON.stringify(errorUtil.parameterError));
    }
    const userId = req.body.userId;
    const changeId = req.body.changeId;
    const changedId = req.body.changedId;
    const changeOrder = req.body.changeOrder;
    const changedOrder = req.body.changedOrder;
    if (userId == undefined || userId == null || userId ==''
        ||changeId == undefined || changeId == null || changeId ==''
        ||changedId == undefined || changedId == null || changedId ==''
        ||changeOrder == undefined || changeOrder == null || changeOrder ==''
        ||changedOrder == undefined || changedOrder == null || changedOrder =='') {
        res.end(JSON.stringify(errorUtil.parameterError));
    }
    // console.log('userId----->' + JSON.stringify(userId));
    // console.log('changeId----->' + JSON.stringify(changeId));
    // console.log('changedOrder----->' + JSON.stringify(changedOrder));
    const changeFalg = await service.updateUserKpiTwolveById(userId , changeId , changedOrder);
    //console.log('changeFalg----->' + JSON.stringify(changeFalg));
    if (changeFalg != 1) {
         res.end(JSON.stringify(changeFalg));
    }else{
        // console.log('userId----->' + JSON.stringify(userId));
        // console.log('changeId----->' + JSON.stringify(changedId));
        // console.log('changedOrder----->' + JSON.stringify(changeOrder));
        const changedFalg = await service.updateUserKpiTwolveById(userId , changedId , changeOrder);
        if (changedFalg != 1) {
            res.end(JSON.stringify(changedFalg));
        }else{
            dataSuccess.data = changedFalg;
            res.end(JSON.stringify(dataSuccess));
        }
    }
    //console.log('changedFalg----->' + changedFalg);
}
exports.updateUserKpiTwolveById = updateUserKpiTwolveById;
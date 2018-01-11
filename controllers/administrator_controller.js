var Administrator = require('../models/administrator'); //引入数据库Message模块
var service = require('../services/administrator_service');
var dataSuccess = {
    status: '0',
    msg: '请求成功',
    data: 'fas'
};

var parameterError = {
    status: '1',
    msg: '参数错误'
};

var loginError = {
    status: '2',
    msg: '用户名或密码验证失败'
};

//查找所有Administrator
exports.selectList = function (req, res, next) {
    if (req == '') {
        res.end(parameterError);
        return;
    }
    service.selectList(req, res, next).then(function (data) {
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

//根据username查找一个Administrator
exports.selectByUserName = function (req, res, next) {
    //如果没有username或者username为空,直接返回
    if (req.body.username == undefined || req.body.username == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    service.selectByUserName(req, res, next).then(function (data) {
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

//添加一个Administrator
exports.addOne = function (req, res, next) {
    //如果没有post数据或者数据为空,直接返回
    if (req.body.username == undefined || req.body.username == '' ||
        req.body.password == undefined || req.body.password == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    //创建一条记录,创建成功后返回json数据
    service.addOne(req, res, next).then(function (data) {
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

//根据username删除Administrator
exports.deleteByUserName = function (req, res, next) {
    //如果没有username字段,返回404
    if (req.query.username == undefined || req.query.username == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    //先查找,再调用删除,最后返回json数据
    service.deleteByUserName(req, res, next).then(function (data) {
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

//根据username跟新Administrator
exports.updateByUserName = function (req, res, next) {
    //如果没有post数据或者数据为空,直接返回
    if (req.body.username == undefined || req.body.username == '' ||
        req.body.password == undefined || req.body.password == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }

    //创建一条记录,创建成功后跳转回首页
    service.updateByUserName(req, res, next).then(function (data) {
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

//管理员登入login接口
exports.adminLogin = function (req, res, next) {
    //console.log('req -> ' + JSON.stringify(req.body));
    //如果没有post数据或者数据为空,直接返回
    const adminPsd = req.body.adminPsd;
    if (req.body.adminName == undefined || req.body.adminName == '' ||
        req.body.adminPsd == undefined || req.body.adminPsd == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }

    service.selectByAdminName(req, res, next).then(function (data) {
        if (data == undefined || data == '') {
            res.end(JSON.stringify(loginError));
            return;
        }
        if (adminPsd == data.adminpsd) {
            let SuccessFalg = {
                status: '0',
                msg: '请求成功',
                data: 'fas',
                flag: '002'
            };
            SuccessFalg.data = data;
            res.end(JSON.stringify(SuccessFalg));
        } else {
            res.end(JSON.stringify(loginError));
        }
    });
}
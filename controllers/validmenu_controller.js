/*
    有效菜单控制处理
    创建人：Three
    时间：2017/10/19
*/

//引入数据库Message模块
var Validmenu = require('../models/validmenu');
var services = require('../services/validmenu_service');
var dataSuccess = {
    status: '0',
    msg: '请求成功',
    data: 'fas'
};

var parameterError = {
    status: '1',
    msg: '参数错误'
};

/*
	查找某个用户所有有效菜单数据，根据id
    用于init显示
*/
exports.selectValmeuById = function (req, res) {
    if (req.body.validMenuId == '' || req.body.validMenuId == undefined) {
        res.end(JSON.stringify(parameterError));
        return;
    }
    services.selectValmeuById(req.body.validMenuId).then(function (data) {
        //console.log(data);
        if (data == '' || data == undefined || data == null) {
            dataSuccess.data = null;
            res.end(JSON.stringify(dataSuccess));
        } else {
            dataSuccess.data = data;
            res.end(JSON.stringify(dataSuccess));
        }
    });
}


/*
	添加一个有效菜单
*/
exports.addValidmenuOne = function (req, res) {
    //如果没有post数据或者数据为空,直接返回
    if (req.body.validmenuName == undefined || req.body.validmenuName == ''
        || req.body.userId == undefined || req.body.userId == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    //创建一条记录,创建成功后返回json数据
    services.addValidmenuOne(req, res).then(function (data) {
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

/*
	根据id删除有效菜单
*/
exports.deleteValidmenuById = function (req, res) {

    if (req.query.validmenuId == undefined || req.query.validmenuId == '') {
        res.end(JSON.stringify(parameterError));
        return;
    }
    //先查找,再调用删除,最后返回json数据
    services.deleteValidmenuById(req, res).then(function (data) {
        //console.log(data);
        dataSuccess.data = data;
        res.end(JSON.stringify(dataSuccess));
    });
}

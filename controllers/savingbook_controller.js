/*
 	auther:Android,
 	NOTE:savingbook表的controller层,
 	time:20171219
 */

var service = require('../services/user_service');
var Lossstatus = require('../models').Lossstatus;//引入数据库Lossstatus模块
var Linebody = require('../models').Linebody;//引入数据库Linebody模块
var errorUtil = require('../utils/errorUtil');

var dataSuccess = {
    status: '0', 
    msg: '请求成功',
    data:'fas'
};

/*
    用户登录接口
    */
async function findAndCount(req , res , next){
    if (req.query.page == undefined ||req.query.page == ''||req.query.page == null) {
        res.end(parameterError);
        return;
    }
}
exports.findAndCount = findAndCount;
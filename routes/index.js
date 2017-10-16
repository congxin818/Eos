var express = require('express');
var router = express.Router();
// 增加url 依赖
var urllib = require('url');
var dd_tongji = require('../controllers/dd_tongji.js'); //引入自定义模块

// 初始数据
var dataSuccess = {
    status: '100', 
    msg: '操作成功',
    data: {
        userId: '123456',
        userName: 'hgdqstudio',
        blog: 'http://hgdqstudio.online'
    }
};

/* GET home page. */
router.get('/', function(req, res, next) {
    var params = urllib.parse(req.url, true);
    var query2 = params.query;
    // 打印get请求中的接口参数
    console.log(query2);
    res.end(JSON.stringify(dataSuccess));
});
router.get('/index', function(req, res, next) {
    var params = urllib.parse(req.url, true);
    var query2 = params.query;
    // 打印get请求中的接口参数
    console.log(query2);
    res.end(JSON.stringify(dataSuccess));
});
module.exports = router;

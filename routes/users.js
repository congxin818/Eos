var express = require('express');
var dd_tongji = require('../controllers/dd_tongji.js'); //引入自定义模块
var router = express.Router();

var dataSuccess = {
    status: '100', 
    msg: '请求成功',
    data: {
        userId: '20170113',
        userName: 'yuzhizhe',
        blog: 'http://hgdqstudio.online'
    }
};

var dataError = {
    status: '99', 
    msg: '用户名或密码错误'
};

// 查询所有的接口，请求方式：get
router.get('/selectList',function (req, res, next) {
	dd_tongji.selectList(req,res);
});

//根据ID查询的接口，请求方式：get
router.get('/selectById' , function(req , res ,next) {
	//console.log(req.body)
	dd_tongji.selectById(req , res);
});

// 登录的接口，请求方式：post
router.post('/userLogin',function (req, res, next) {
    // 打印post请求的数据内容
    console.log(req.body);
    console.log(req.body.username);
    console.log(req.body.password);
    if (req.body.username == "yuzhizhe" && req.body.password == "123456") {
        res.end(JSON.stringify(dataSuccess));
    } else {
        res.end(JSON.stringify(dataError));
    }
});

//添加一天数据的接口，请求方式：post
router.post('/addOne' , function(req , res , next) {
	dd_tongji.addOne(req , res);
});

//根据ID删除的接口，请求方式：post
router.post('/deleteById' , function(req , res , next) {
	dd_tongji.deleteById(req , res);
});

//根据ID修改的接口，请求方式：post
router.post('/updateById' , function(req , res , next) {
	dd_tongji.updateById(req , res);
});

module.exports = router;
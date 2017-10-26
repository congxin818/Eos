var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
// post请求会用到
var bodyParser = require('body-parser');

///=======路由信息 （接口地址）开始 存放在./routes目录下===========//
var index = require('./routes/index');
var users = require('./routes/users');
var message = require('./routes/message_route');
var administrator = require('./routes/administrator_route');
var user = require('./routes/user_route');
var groupSet = require('./routes/group_route'); //集团
var factorySet = require('./routes/factory_route'); //工厂
var workshopSet = require('./routes/workshop_route'); //车间
var linebodySet = require('./routes/linebody_route'); //线体
var areaAllSet = require('./routes/areaall_route'); //区域设置
var validmenuSet = require('./routes/validmenu_route'); //有效菜单
var kpiSet = require('./routes/kpiall_route'); //KPI设置

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 设置请求头
// application/json  接口返回json数据
// charset=utf-8 解决json数据中中文乱码
app.use("*", function(request, response, next) {
    response.writeHead(200, { "Content-Type": "application/json;charset=utf-8", "Access-Control-Allow-Origin": "*"});
    next();
});

// 路由
app.use('/', index);//在app中注册index该接口 
app.use('/users', users);//在app中注册users接口
app.use('/message' , message);
app.use('/admin' , administrator);
app.use('/user' , user);
app.use('/groupSet' , groupSet);//在app中注册集团设置接口
app.use('/factorySet' , factorySet);//在app中注册工厂设置接口
app.use('/workshopSet' , workshopSet);//在app中注册车间设置接口
app.use('/linebodySet' , linebodySet);//在app中注册线体设置接口
app.use('/areaAllSet' , areaAllSet);//在app中注册区域设置接口
app.use('/validmenuSet' , validmenuSet);//在app中注册有效菜单设置接口
app.use('/KPISet' , kpiSet);//在app中注册KPI设置接口

// 404 错误
var errorData_404 = {
    status: '404', 
    msg: 'Not Found!',
};

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.end(JSON.stringify(errorData_404));
});

// 500 
var errorData_500 = {
    status: '500', 
    msg: 'Not Found!',
};

app.use(function(err, req, res, next) {
  errorData_500.msg =  err.message;
  res.end(JSON.stringify(errorData_500));
});

module.exports = app;
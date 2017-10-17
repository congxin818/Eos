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
    response.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
    next();
});

// 路由
app.use('/', index);//在app中注册index该接口 
app.use('/user', users);//在app中注册users接口
app.use('/message' , message);
app.use('/admin' , administrator);

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
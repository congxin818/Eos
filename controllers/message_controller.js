var Message = require('../models/message');//引入数据库Message模块

var dataSuccess = {
    status: '100', 
    msg: '请求成功',
};

var parameterError = {
    status: '99', 
    msg: '参数错误'
};
//查找所有message
exports.selectList = function(req , res) {
	Message.findAll().then(function(msg) {
	var jsonString = {status:1 , data:msg};
	res.end(JSON.stringify(jsonString));
	});
}

//根据ID查找一个message
exports.selectById = function(req , res) {
	//如果没有id或者id为空,直接返回
    if (req.query.id == undefined || req.query.id == '') {
        res.end(JOSN.stringify(parameterError));
        return;
    }
    Message.findOne({
            where:{
                id:req.query.id
            }
    }).then(function(msg){
        var jsonString = {status:1 , data:msg};
		res.end(JSON.stringify(jsonString));
    });
}

//添加一个message
exports.addOne = function(req , res) {
	//如果没有post数据或者数据为空,直接返回
    if (req.body.username == undefined ||req.body.username == ''
        || req.body.content == undefined || req.body.content == '') {
        res.render(parameterError);
        return;
    }
    var message = {
        username: req.body.username,
        content: req.body.content
    };
    //创建一条记录,创建成功后跳转回首页
    Message.create(message).then(function(msg){
        var jsonString = {status:1 , data:msg};
		res.end(JSON.stringify(jsonString));
    });
}

//根据ID删除message
exports.deleteById = function(req , res) {
	//如果没有id字段,返回404
    if (req.query.id == undefined ||req.query.id == '') {
        res.render(parameterError);
        return;
    }
    //先查找,再调用删除,最后返回首页
    Message.findOne({
        where:{
            id:req.query.id
        }
    }).then(function(msg){
        msg.destroy().then(function(){
            var jsonString = {status:1 , data:msg};
			res.end(JSON.stringify(jsonString));
        });
    });
}

//根据ID跟新message
exports.updateById = function(req , res) {
	//如果没有post数据或者数据为空,直接返回
    if (req.body.username == undefined ||req.body.username == ''
        || req.body.content == undefined || req.body.content == ''
        || req.body.id == undefined || req.body.id == '') {
        res.render(parameterError);
        return;
    }
    var message = {
        username: req.body.username,
        content: req.body.content,
    };
    //创建一条记录,创建成功后跳转回首页
    Message.update(message,{
        where:{
            id:req.body.id
        }
    }).then(function(msg){
        var jsonString = {status:1 , data:msg};
		res.end(JSON.stringify(jsonString));
    });
}
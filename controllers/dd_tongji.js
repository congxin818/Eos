var database = require('./database')
var url = require('url');//用于接收get方式的请求中的参数

//查询所有
exports.selectList = function(req, res) {
  // 定义SQL语句
  var sql = "SELECT * FROM websites";

  // 连接数据库
  var connection = database.getConnection();
  connection.query(sql, function(error,results) {
   if (error){
		console.log('[SELECT ERROR] - ' , error.message);
		res.end(JSON.stringify(error.message));
	};
	var jsonString = {status:1 , data:results};
	res.end(JSON.stringify(results));
	});
}

//根据ID查询结果集
exports.selectById = function(req , res , next) {

	var params = url.parse(req.url , true).query;
	var id = params.id;
	//定义SQL语句
	var sql = "SELECT * FROM websites WHERE Id = ?";
	var selectSqlParams = new Array();
	selectSqlParams[0] = id;
	//连接数据库
	var connection = database.getConnection();
	//console.log(params.id);
	connection.query(sql , selectSqlParams , function(error , results) {
		if(error) {
			console.log('[SELECT ERROR] - ' , error.message);
			res.end(JSON.stringify(error.message));
		}
		var jsonString = {status:1 , data:results};
	 	res.end(JSON.stringify(jsonString));
	});
}

//添加一条数据
exports.addOne = function(req , res) {
	
	var id = req.body.id;
	var name = req.body.name;
	var url = req.body.url;
	var alexa = req.body.alexa;
	var country = req.body.country;
	//定义SQL语句
	var sql = "INSERT INTO websites(Id,name,url,alexa,country) VALUES(?,?,?,?,?)";
	var  addSqlParams = new Array();
	addSqlParams[0] = id;
	addSqlParams[1] = name;
	addSqlParams[2] = url;
	addSqlParams[3] = alexa;
	addSqlParams[4] = country;
	//console.log(req.body);
	//连接数据库
	var connection = database.getConnection();
	connection.query(sql , addSqlParams , function(error , results) {
		if(error) {
			console.log('[INSERT ERROR] - ' , error.message);
			res.end(JSON.stringify(error.message));
		}
		
		var jsonString = {status:1 , data:results};
		res.end(JSON.stringify(jsonString));
	});
}

//根据ID删除结果集
exports.deleteById = function(req , res) {
	
	var id = req.body.id;
	//定义SQL语句
	var sql = "DELETE FROM websites WHERE ID = ?";
	var deleteSqlParams = new Array();
	deleteSqlParams[0] = id;
	var connection = database.getConnection();
	connection.query(sql , deleteSqlParams , function(error , results) {
		if(error) {
			console.log('[DELETE ERROR] - ' , error.message);
			res.end(JSON.stringify(error.message));
		}
		
		var jsonString = {status:1 , data:results};
		res.end(JSON.stringify(jsonString));
	});
}

//根据ID修改一条数据
exports.updateById = function(req , res) {
	
	var id = req.body.id;
	var name = req.body.name;
	var url = req.body.url;
	var alexa = req.body.alexa;
	var country = req.body.country;
	//定义SQL语句
	var sql = "update websites SET name = ?,url = ?,alexa = ?,country = ? WHERE Id = ?";
	var  updateSqlParams = new Array();
	updateSqlParams[0] = name;
	updateSqlParams[1] = url;
	updateSqlParams[2] = alexa;
	updateSqlParams[3] = country;
	updateSqlParams[4] = id;
    console.log(req.body);
	//连接数据库
	var connection = database.getConnection();
	connection.query(sql , updateSqlParams , function(error , results) {
		if(error) {
			console.log('[UPDATE ERROR] - ' , error.message);
			res.end(JSON.stringify(error.message));
		}
		
		var jsonString = {status:1 , data:results};
		res.end(JSON.stringify(jsonString));
	});
}




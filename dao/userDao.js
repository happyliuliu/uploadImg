var mysql = require('mysql');
var $conf = require('../config/db');

var pool = mysql.createPool($conf.mysql);

pool.getConnection(function(err, connection) {
  	console.log('connect ok')
});

// 向前台返回JSON数据
var jsonWrite = function(res, ret) {
	if (typeof ret === 'undefined') {
		res.json({
			code: '1',
			message: '操作失失败'
		});
	} else {
		res.json(ret);
	}
};

module.exports = {
	// 添加
	add: function(req, res, next) {
		pool.getConnection(function(err, conncetion) {
			var param = req.query || req.params;
			var sql = 'INSERT INTO info(name, age) values(\"'+encodeURIComponent(param.name)+'\",'+encodeURIComponent(param.age)+');'
			conncetion.query(sql, function(err, result) {
				if(result) {
					result = {
						code: 200,
						msg : '增加成功'
					};
				}
				// 以json格式把操作结果返回前台页面
				jsonWrite(res, result);

				// 释放连接
				conncetion.release();
			});
		});
	},

	//  删除
	delete: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			var id = +req.query.id;   //转整数
			var sql = 'DELETE FROM info WHERE id=' + id;
			connection.query(sql, function(err, result) {
				if(result) {  ///////
					result = {
						code: 200,
						msg: '删除成功'
					};
				} else {
					result = void 0;
				}
				jsonWrite(res, result);
				connection.release();
			});
		});
	},

	// 查询
	queryById : function(req, res, next) {
		var id = +req.query.id;   // 转整数
		pool.getConnection(function(err, conncetion) {
			
			var sql = 'SELECT * FROM info WHERE id=' + id;
			conncetion.query(sql, function(err, result) {
				jsonWrite(res, result);
				conncetion.release();
			});
		});
	},

	// 更新
	// update: function(req, res, next) {
	// 	var param = req.query || req.params;
	// 	if (param.id == null || param.name == null || param.age == null) {
	// 		jsonWrite(res, undefined);
	// 		return;
	// 	}
	// 	pool.getConnection(function(err, connection) {
	// 		var sql = 'UPDATE info SET name=' + param.name + ',age=' + param.age +' WHERE id=' + param.id;
	// 		connection.query(sql, function(err, result) {
	// 			jsonWrite(res, result);
	// 			conncetion.release();
	// 		});
	// 	});
	// }
};







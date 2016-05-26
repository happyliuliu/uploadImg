var express = require('express');
var path = require('path');
var fs = require('fs'); 
var moment =require('moment');

//===========
var mysql = require('mysql');
var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	port: 3306,
	database : 'ImageDataBase'
});

pool.getConnection(function(err, connection) {
  	console.log('connect ok');
});

var jsonWrite = function(res, ret) {
	if (typeof ret === 'undefined') {
		res.json({
			code: '1',
			message: '操作失败'
		});
	} else {
		res.json(ret);
	}
};

//===========


module.exports = {
	upload: function(req, res) {
		var desc = req.body.desc;
		var objFile = req.files.pic;
		if (!objFile.originalFilename) {
			return;
		}
		//get filename
		var filename = objFile.originalFilename || path.basename(objFile.path);
	 	var targetPath = global.rootPath + '/upload/' + filename;
	 	 // console.log(targetPath); 
	 	// 复制文件
	 	fs.createReadStream(objFile.path).pipe(fs.createWriteStream(targetPath));

	 	var url = encodeURIComponent('http://' + req.headers.host + '/img/'+filename);
	 	var desc = encodeURIComponent(desc);
	 	// var postTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	 	var postTime = Date.parse(new Date());
		// res.writeHead(302, {
		//   'Location': '/show?url='+ url + encodeURIComponent(filename) + '&desc=' + encodeURIComponent(desc),
		// });
		// res.end();

		pool.getConnection(function(err, conncetion) {
			var sql = 'INSERT INTO image(url, description, postTime) values(\"'+url+'\", \"'+desc+'\", \"'+postTime+'\")';
			// console.log(sql)
			conncetion.query(sql, function(err, result) {
				if(result) {
					result = {
						code: 200,
						msg : '增加成功'
					};
				}
				// 以json格式把操作结果返回前台页面 
				//jsonWrite(res, result);
				res.writeHead(302, {
				  'Location': '/show',
				});
				res.end()

				// 释放连接
				conncetion.release();
			});
		});
		//======
	},
	show: function(req, res, next){
	 	var query = req.query;

	 	pool.getConnection(function(err, conncetion){
	 		var sql = 'select * from image';
	 		conncetion.query(sql,function(err, result){
	 			var _result = [];
	 			if(result){
	 				_result = result;
	 			}

	 			_result.map(function(item){
	 				if (item) {
	 					item.url = decodeURIComponent(item.url);
	 					item.description = decodeURIComponent(item.description);
	 					item.postTime = moment(item.postTime).format('YYYY-MM-DD HH:mm:ss');
	 					// item.postTime = new Date(item.postTime);
	 				}
	 			});

	 			res.render('show',{
	 				arr: _result,
	 			});
	 			conncetion.release();
	 		})
	 	});
	 },

	 delete: function(req, res, next) {
		pool.getConnection(function(err, connection) {
			var id = req.body.id;
			var sql = 'DELETE FROM image WHERE id=' + id;
			// console.log(sql);
			connection.query(sql, function(err, result) {
				// console.log(result);
				if(result) {
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

	edit: function(req, res, next) {
		var id = req.query.id;
		// console.log(id);  
		
		pool.getConnection(function(err, conncetion){
			var sql = 'select * from image where id=' + id;
			conncetion.query(sql, function(err, result) {
				var _result = [];
	 			if(result){
	 				_result = result;
	 			}

	 			_result.map(function(item){
	 				if (item) {
	 					item.url = decodeURIComponent(item.url);
	 					item.description = decodeURIComponent(item.description);
	 					item.postTime = moment(item.postTime).format('YYYY-MM-DD HH:mm:ss');
	 					// item.postTime = new Date(item.postTime);
	 				}
	 			});
	 			// console.log(_result[0]);
	 			res.render('edit',{
 					arr: _result[0],
 					dataId: id,
 				});
	 			res.end();
	 			conncetion.release();
			});
						
		});

	},

	update: function(req, res, next) {
		var id = req.body.fileId;
		var desc = req.body.newDesc;
		var objFile = req.files.newPic;

		if (!objFile.originalFilename) {
			return;
		}
		
		var filename = objFile.originalFilename || path.basename(objFile.path);

	 	var targetPath = global.rootPath + '/upload/' + filename;

	 	fs.createReadStream(objFile.path).pipe(fs.createWriteStream(targetPath));
	 	// console.log(objFile.path);
	 	// console.log(targetPath);
	 	var url = encodeURIComponent('http://' + req.headers.host + '/img/'+filename);
	 	var desc = encodeURIComponent(desc);
	 	var postTime = Date.parse(new Date());

	 	pool.getConnection(function(err, conncetion) {
			var sql = 'UPDATE image SET url="' + url + '",description="' + desc +'",postTime=' + postTime + ' WHERE id=' + id;
			console.log(sql);
			conncetion.query(sql, function(err, result) {
				if(result) {
					console.log('成功');
				} else {
					console.log('失败');
				}
				// 以json格式把操作结果返回前台页面 				
			
				res.end();
				// 释放连接
				conncetion.release();
			});
		});
	}
};




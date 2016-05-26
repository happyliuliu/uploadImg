var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); 
var multipart = require('connect-multiparty');
var moment =require('moment');

var controllers = require('./server/controller/img-controller');


var app = express();

global.rootPath = path.dirname(__filename);

//view engine setup (express 的参数设置工具)
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');

app.use('/img',express.static(__dirname + '/upload') ) //配置静态文件服务器

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/upload',multipart(), controllers.upload);  // 上传
app.get('/show', controllers.show);   //  展示
app.post('/show', controllers.delete);  // 删除
app.get('/edit', controllers.edit);   // 修改
app.post('/edit', multipart(), controllers.update);

module.exports = app;


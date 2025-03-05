var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // 跨域支持
// var fileUpload = require('express-fileupload'); // 处理文件上传

var multer = require('multer');
var app = express();
var upload = multer({ dest: 'data/' }); // 允许解析 `multipart/form-data`
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var qaRouter = require('./routes/qa'); // 新增 AI 问答路由
var uploadRouter = require('./routes/upload'); // 新增文件上传路由



// 日志记录
app.use(logger('dev'));



// 解析 Cookie
app.use(cookieParser());

// 静态资源目录（如 PDF 文件）
app.use(express.static(path.join(__dirname, 'public')));

// 启用 CORS 允许前端访问后端
app.use(cors());

// 启用文件上传
// app.use(fileUpload());
app.use(upload.any());  // 允许解析文件

// 解析请求体
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/qa', qaRouter); // AI 问答 API
app.use('/api/upload', uploadRouter); // 文件上传 API

// 导出 app 实例
module.exports = app;

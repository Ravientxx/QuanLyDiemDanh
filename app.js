var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors()); //normal CORS

app.use('/api', require('./api/api'));

//Xác định trang "public" cho client
app.use(express.static(path.join(__dirname, 'dist')));

app.use('*', function(req, res, next) {
   res.sendFile(path.join(__dirname,'/dist/index.html'));
});

app.use(express.static(path.join(__dirname, 'swagger-ui')));
module.exports = app;

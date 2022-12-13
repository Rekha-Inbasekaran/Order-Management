var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const db = require('./db_conn')

var indexRouter = require('./routes/index');
var orderRouter = require('./routes/order');

var app = express();

db.connect_db();

app.use(cors({
    origin: '*'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', orderRouter);


module.exports = app;

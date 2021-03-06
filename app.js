var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
var Singleton = require('./accessTokenCache');
var session = require('express-session');
var fs = require('fs');
// var morgan = require('morgan');
var log4js = require("log4js");
log4js.configure({
  "appenders": {
    
        "access": {
    
          "type": "dateFile",
    
          "filename": "log/access.log",
    
          "pattern": "-yyyy-MM-dd"
    
        },
    
        "rule-console": {
    
          "type": "console"
    
        },
    
        "rule-file": {
    
          "type": "dateFile",
    
          "filename": "log/server-",
    
          "encoding": "utf-8",
    
          "maxLogSize": 10000000,
    
          "numBackups": 3,
    
          "pattern": "yyyy-MM-dd.log",
    
          "alwaysIncludePattern": true
    
        },
    
        "rule-error": {
    
          "type": "dateFile",
    
          "filename": "log/error-",
    
          "encoding": "utf-8",
    
          "maxLogSize": 1000000,
    
          "numBackups": 3,
    
          "pattern": "yyyy-MM-dd.log",
    
          "alwaysIncludePattern": true
    
        }
    
      },
    
      "categories": {
    
        "default": {
    
          "appenders": [
    
            "rule-console",
    
            "rule-file",
    
            "rule-error"
    
          ],
    
          "level": "debug"
    
        },
    
        "http": {
    
          "appenders": [
    
            "access"
    
          ],
    
          "level": "info"
    
        }
    
      }
    
    
  
});
var logger = log4js.getLogger('normal');

GlobalCache = (new Singleton()).getInstance();

var routes = require('./routes');

var app = express();
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.xml());
app.use(cookieParser());
app.use(session({
  secret: 'uijnhgywuijnhgywuijnhgywuijnhgywuijnhgywuijnhgywuijnhgywuijnhgywuijnhgywuijnhgywuijnhgywuijnhgywuijnhgywuijnhgywuijnhgywuijnhgyw', // 建议使用 128 个字符的随机字符串
  cookie: { maxAge: 60 * 1000 },
  resave: true,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));
app.use("/",routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

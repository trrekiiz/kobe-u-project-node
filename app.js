var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = 'mongodb://127.0.0.1:27017/angles';
var assert = require('assert');

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var portName = process.argv[2];

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//IoT
var myPort = new SerialPort(portName,{
    baudRate:9600,
    parser:serialport.parsers.readline("\r\n")
})

myPort.on('open',onOpen);
myPort.on('data',onData);

function onOpen(){
    console.log("Open Connection");
}

function onData(data){
    let arrayData = data.replace("\n","").split("\t").map((arg) => {
      return parseFloat(arg)
    })
    console.log(arrayData);
    var bagData = {
      x_angle: arrayData[0],
      y_angle: arrayData[1],
      z_angle: arrayData[2],
      leftWeight: arrayData[3],
      rightWeight: arrayData[4]
    }
    MongoClient.connect(url, function(err,db){
      assert.equal(null,err);
      db.collection('angles').insertOne(bagData, function(err,result){
        assert.equal(null, err);
        console.log('Done');
        db.close();
      });
    });
}

//

module.exports = app;

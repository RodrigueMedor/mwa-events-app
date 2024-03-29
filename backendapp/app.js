//var createError = require('http-errors');
const express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const { jwtVerify } = require('./middleware/check-jwt');
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/eventdb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventsRouter = require('./routes/events');



var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', jwtVerify);
app.use('/events', eventsRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // try {
  //   res.locals.message = err.message;
  //   res.locals.error = req.app.get('env') === 'development' ? err : {};
  // } catch (ex) {
  //   console.log(ex);
  // }
  // console.log(err);
  // render the error page
  res.status(err.status || 500).json(err);
});

//const port = normalizePort(process.env.PORT || '3000');
app.listen(3000, () => { console.log(`Listening on ... 3000`) });

//module.exports = app;

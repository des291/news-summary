const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config()
const schedule = require('node-schedule');
const spawn = require("child_process").spawn;
const helmet = require('helmet');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');

// Schedule scraper.py to run at 06:00 and 17:00
const rule = new schedule.RecurrenceRule();
rule.hour = [6, 17];
rule.minute = 0;
rule.second = 0;
const scraper = schedule.scheduleJob(rule, () => {
  spawn('scraper/venv/bin/python', ['scraper/scraper.py']);
});

const app = express();

mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

// needed to read body of response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// links css/images/javascript
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(helmet());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

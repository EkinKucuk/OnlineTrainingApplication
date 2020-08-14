const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
// const session = require('express-session');
const auth = require('./custom_modules/auth');
const fileUpload = require('express-fileupload');

// var db = require('./custom_modules/db')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const rolesRouter = require('./routes/roles');
const courseRouter = require('./routes/course');
const moduleRouter = require('./routes/modules');
const reviewRouter = require('./routes/course_review');
const authCommonRouter = require('./routes/auth_common');
const examRouter = require('./routes/exam');

const crud = require('./permission_files/crud');
const create_course = require('./permission_files/create_course');
const manage_course = require('./permission_files/manage_course');
const participate_course = require('./permission_files/participate_course');

const app = express();
app.use(cors());
app.use(helmet());
app.use(fileUpload());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/authcommon', auth, authCommonRouter);

app.use('/users', auth, crud, usersRouter);
app.use('/roles', auth,  crud, rolesRouter);
app.use('/course', auth, participate_course, courseRouter);
app.use('/module', auth, manage_course, moduleRouter);
app.use('/review', auth, participate_course, reviewRouter);
app.use('/exam', auth, participate_course, examRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport')
const session = require('express-session')
require('./auth')(passport)

function authenticationMiddleware(req, res, next){
  if (req.isAuthenticated()) return next()
  res.redirect('./login')
}

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const loginRouter = require('./routes/login')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '123', //colocamos aqui fixo pra facilitar, mas o ideal é q ela seja salva em uma variavel de ambiente
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2* 60 * 1000 } //2 minutos transformados em ms
  //store: //se vc quiser que a session seja salva no banco de dados, ai tem q instalar uma extensao connector passport para o seu banco de dados e inicializar ele aqui, do jeito q está pra facilitar a session é salva em memória, o q é o padrão para session de servidor
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/login', loginRouter);
app.use('/users', authenticationMiddleware, usersRouter);
app.use('/', authenticationMiddleware, indexRouter);

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
  res.render('error');
});

module.exports = app;

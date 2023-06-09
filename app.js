var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');


var indexRouter = require('./routes/index');
var clubRouter = require('./routes/yachtclub');

var app = express();

mongoose.set('strictQuery', false);

const mongoDB = process.env.MONGO_KEY;
const clubPassword = process.env.CLUB_PASSWORD;

const main = async() => {
  await mongoose.connect(mongoDB)
}
main().catch((err) => console.log(err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect Username" })
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user)
        } else {
          return done(err, false, { message: "Incorrect Password"})
        }
      })
    } catch (err) {
      return done(err)
    }
  })
)

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user)
  } catch (err) {
    done(err)
  }
})

app.use(session({ secret: 'yacht', resave: false, saveUninitialized: false }))
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

app.use('/', indexRouter);
app.use('/yachtclub', clubRouter);

app.get('/log-out', (req, res, next) => {
  req.logout(function (err) {
      if (err) {
          return next(err)
      }
      res.redirect('/')
  })
});

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

exports.password = clubPassword;
module.exports = app;

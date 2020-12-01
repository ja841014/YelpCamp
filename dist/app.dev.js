"use strict";

var express = require('express');

var path = require('path');

var mongoose = require('mongoose'); // kind of template


var ejsMate = require('ejs-mate');

var session = require('express-session');

var flash = require('connect-flash'); // our own error function


var ExpressError = require('./utils/ExpressError'); // the over-ride method can fake a put method as patch


var methodOverride = require('method-override');

var User = require('./models/user');

var passport = require('passport');

var LocalStrategy = require('passport-local'); // const Campground = require('./models/campground');
// const Review = require('./models/review');
// reconstruct the route


var campgroundRoutes = require('./routes/campgrounds');

var reviewRoutes = require('./routes/reviews');

var userRoutes = require('./routes/users'); // yelp-camp db name


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
var db = mongoose.connection; // connect fail

db.on("error", console.error.bind(console, "connection error")); // connect sucessful

db.once('open', function () {
  return console.log('Connected to MongoDB');
});
var app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // app.use will run on every single request
// encoded url ,so we can parse in into req.body

app.use(express.urlencoded({
  extended: true
}));
app.use(methodOverride('_method'));
app.use(express["static"](path.join(__dirname, 'public')));
var sessionConfig = {
  secret: 'sould be a good secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); // it is apply in every route

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);
app.get('/', function (req, res) {
  res.render('home');
}); // delete
// nothing is match in the above route will go in this route

app.all('*', function (req, res, next) {
  // this next will hit the generic error handler below
  next(new ExpressError('404 Page Not Found', 404));
}); // generic error handler

app.use(function (err, req, res, next) {
  // default statusCode is 500 and default message = "sth wrong"
  var _err$statusCode = err.statusCode,
      statusCode = _err$statusCode === void 0 ? 500 : _err$statusCode;

  if (!err.message) {
    err.message = 'Something went wrong';
  }

  res.status(statusCode).render('error', {
    err: err
  });
});
app.listen(3000, function () {
  console.log("CONNECTED!");
});
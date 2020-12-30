"use strict";

// if we are not in the 'production' node enviornment we have to require 
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
} // mongodb+srv://ja841014:<password>@cluster0.3zcje.mongodb.net/<dbname>?retryWrites=true&w=majority


var express = require('express');

var path = require('path');

var mongoose = require('mongoose'); // kind of template


var ejsMate = require('ejs-mate');

var session = require('express-session');

var flash = require('connect-flash'); // our own error function


var ExpressError = require('./utils/ExpressError'); // the over-ride method can fake a put method as patch


var methodOverride = require('method-override');

var User = require('./models/user'); // prevent client enter some sentitive word such as '$'


var mongoSanitize = require('express-mongo-sanitize');

var helmet = require('helmet'); // https://andyyou.github.io/2017/04/11/express-passport/


var passport = require('passport');

var LocalStrategy = require('passport-local'); // const Campground = require('./models/campground');
// const Review = require('./models/review');
// reconstruct the route


var campgroundRoutes = require('./routes/campgrounds');

var reviewRoutes = require('./routes/reviews');

var userRoutes = require('./routes/users'); // connect to mongo cloud https://www.npmjs.com/package/connect-mongo


var MongoDBStore = require("connect-mongo")(session);

var dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'; // yelp-camp db name
// 'mongodb://localhost:27017/yelp-camp'

mongoose.connect(dbUrl, {
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
app.use(mongoSanitize());
var scriptSrcUrls = ["https://stackpath.bootstrapcdn.com", "https://api.tiles.mapbox.com", "https://api.mapbox.com", "https://kit.fontawesome.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"];
var styleSrcUrls = ["https://kit-free.fontawesome.com", "https://stackpath.bootstrapcdn.com", "https://api.mapbox.com", "https://api.tiles.mapbox.com", "https://fonts.googleapis.com", "https://use.fontawesome.com", "https://cdn.jsdelivr.net"];
var connectSrcUrls = ["https://api.mapbox.com", "https://*.tiles.mapbox.com", "https://events.mapbox.com"];
var fontSrcUrls = [];
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: [],
    connectSrc: ["'self'"].concat(connectSrcUrls),
    scriptSrc: ["'unsafe-inline'", "'self'"].concat(scriptSrcUrls),
    styleSrc: ["'self'", "'unsafe-inline'"].concat(styleSrcUrls),
    workerSrc: ["'self'", "blob:"],
    childSrc: ["blob:"],
    objectSrc: [],
    imgSrc: ["'self'", "blob:", "data:", "https://res.cloudinary.com/ja841014/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
    "https://images.unsplash.com"],
    fontSrc: ["'self'"].concat(fontSrcUrls)
  }
}));
var secret = process.env.SECRET || 'sould be a good secret'; // use mongo to help us store session

var store = new MongoDBStore({
  url: dbUrl,
  secret: secret,
  touchAfter: 24 * 60 * 60
});
store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});
var sessionConfig = {
  store: store,
  name: 'session',
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
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
}); // nothing is match in the above route will go in this route

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
}); // it will set by heroku nomarlly is 80 for heroku

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("CONNECTED! ".concat(port));
});
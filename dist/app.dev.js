"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var path = require('path');

var mongoose = require('mongoose'); // kind of template


var ejsMate = require('ejs-mate'); // our own error function


var catchAsync = require('./utils/catchAsync');

var ExpressError = require('./utils/ExpressError'); // the over-ride method can fake a put method as patch


var methodOverride = require('method-override');

var Campground = require('./models/campground'); // yelp-camp db name


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
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
// encoded url ,s o we can parse in into req.body

app.use(express.urlencoded({
  extended: true
}));
app.use(methodOverride('_method'));
app.get('/', function (req, res) {
  res.render('home');
});
app.get('/campgrounds', catchAsync(function _callee(req, res) {
  var campgrounds;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Campground.find({}));

        case 2:
          campgrounds = _context.sent;
          res.render('campgrounds/index', {
            campgrounds: campgrounds
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
})); // create new Post

app.get('/campgrounds/new', function (req, res) {
  res.render('campgrounds/new');
});
app.post('/campgrounds/', catchAsync(function _callee2(req, res) {
  var campground;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (req.body.campground) {
            _context2.next = 2;
            break;
          }

          throw new ExpressError('Invalid campground Data', 400);

        case 2:
          campground = new Campground(req.body.campground);
          _context2.next = 5;
          return regeneratorRuntime.awrap(campground.save());

        case 5:
          //redirect to /campgrounds/:id this route
          res.redirect("/campgrounds/".concat(campground._id));

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
})); // create new Post
// show specific post

app.get('/campgrounds/:id', catchAsync(function _callee3(req, res) {
  var campground;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Campground.findById(req.params.id));

        case 2:
          campground = _context3.sent;
          res.render('campgrounds/show', {
            campground: campground
          });

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
})); // update post

app.get('/campgrounds/:id/edit', catchAsync(function _callee4(req, res) {
  var campground;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Campground.findById(req.params.id));

        case 2:
          campground = _context4.sent;
          res.render('campgrounds/edit', {
            campground: campground
          });

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
}));
app.put('/campgrounds/:id', catchAsync(function _callee5(req, res) {
  var id, campground;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Campground.findByIdAndUpdate(id, _objectSpread({}, req.body.campground)));

        case 3:
          campground = _context5.sent;
          res.redirect("/campgrounds/".concat(campground._id));

        case 5:
        case "end":
          return _context5.stop();
      }
    }
  });
})); // update post
// delete

app["delete"]('/campgrounds/:id', catchAsync(function _callee6(req, res) {
  var id;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id; // delete in databsse

          _context6.next = 3;
          return regeneratorRuntime.awrap(Campground.findByIdAndDelete(id));

        case 3:
          res.redirect('/campgrounds');

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
})); // delete
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
"use strict";

var _require = require('./schemas.js'),
    campgroundSchema = _require.campgroundSchema,
    reviewSchema = _require.reviewSchema;

var ExpressError = require('./utils/ExpressError');

var Campground = require('./models/campground');

module.exports.isLoggedIn = function (req, res, next) {
  //it is automatically added user field by passport
  console.log("REQ,USER:", req.user); // isAuthenticated is come from passport.js

  if (!req.isAuthenticated()) {
    // we add a returnTo field into session
    // returnTo would be a url we want to redirect user back to
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You have to sign in first');
    return res.redirect('/login');
  }

  next();
}; // make validateCampground as a middleware


module.exports.validateCampground = function (req, res, next) {
  var _campgroundSchema$val = campgroundSchema.validate(req.body),
      error = _campgroundSchema$val.error; // console.log(req);


  if (error) {
    // if there are morn tham one el.message then join with a ','
    var msg = error.details.map(function (el) {
      return el.message;
    }).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = function _callee(req, res, next) {
  var id, campground;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.params.id;
          _context.next = 3;
          return regeneratorRuntime.awrap(Campground.findById(id));

        case 3:
          campground = _context.sent;

          if (campground.author.equals(req.user._id)) {
            _context.next = 7;
            break;
          }

          req.flash('error', 'You do not have permission');
          return _context.abrupt("return", res.redirect("/campgrounds/".concat(id)));

        case 7:
          next();

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.validateReview = function (req, res, next) {
  var _reviewSchema$validat = reviewSchema.validate(req.body),
      error = _reviewSchema$validat.error;

  if (error) {
    // if there are morn tham one el.message then join with a ','
    var msg = error.details.map(function (el) {
      return el.message;
    }).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
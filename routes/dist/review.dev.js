"use strict";

var express = require('express');

var router = express.Router();

var Campground = require('../models/campground');

var Review = require('../models/review');

var _require = require('../schemas.js'),
    reviewSchema = _require.reviewSchema;

var ExpressError = require('../utils/ExpressError');

var catchAsync = require('../utils/catchAsync');

var validateReview = function validateReview(req, res, next) {
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
}; // post a new review


router.post('/', validateReview, catchAsync(function _callee(req, res) {
  var campground, review;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Campground.findById(req.params.id));

        case 2:
          campground = _context.sent;
          // this req.body.review has all the information at specific campground's review which name is in the format review[...]
          review = new Review(req.body.review); // put the new review to the campground model's review field

          campground.reviews.push(review);
          _context.next = 7;
          return regeneratorRuntime.awrap(review.save());

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(campground.save());

        case 9:
          res.redirect("/campgrounds/".concat(campground._id));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
})); // delete a review

router["delete"]('/:reviewID', catchAsync(function _callee2(req, res) {
  var _req$params, id, reviewID;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // this id and reviewID are come from URL
          _req$params = req.params, id = _req$params.id, reviewID = _req$params.reviewID; // remove array from the mongoose => take this reviewID and pull any thing put of the reviews array

          _context2.next = 3;
          return regeneratorRuntime.awrap(Campground.findByIdAndUpdate(id, {
            $pull: {
              reviews: reviewID
            }
          }));

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(Review.findByIdAndDelete(reviewID));

        case 5:
          res.redirect("/campgrounds/".concat(id));

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}));
module.exports = router;
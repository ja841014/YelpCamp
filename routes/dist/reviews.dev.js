"use strict";

var express = require('express');

var router = express.Router({
  mergeParams: true
});

var _require = require('../middleware'),
    validateReview = _require.validateReview,
    isLoggedIn = _require.isLoggedIn,
    isReviewAuthor = _require.isReviewAuthor;

var Campground = require('../models/campground');

var Review = require('../models/review');

var reviews = require('../controllers/reviews');

var _require2 = require('../schemas.js'),
    reviewSchema = _require2.reviewSchema;

var ExpressError = require('../utils/ExpressError');

var catchAsync = require('../utils/catchAsync'); // post a new review


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview)); // delete a review

router["delete"]('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));
module.exports = router;
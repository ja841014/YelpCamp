"use strict";

var mongoose = require('mongoose');

var Scheme = mongoose.Schema;
var reviewdSchema = new Scheme({
  body: String,
  rating: Number
}); // built up model
// collections is Review and db is yelp-camp

module.exports = mongoose.model('Review', reviewdSchema);
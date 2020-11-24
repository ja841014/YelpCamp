"use strict";

var mongoose = require('mongoose');

var Scheme = mongoose.Schema;
var CampgroundSchema = new Scheme({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String
});
module.exports = mongoose.model('Campground', CampgroundSchema);
"use strict";

var mongoose = require('mongoose');

var Review = require('./review');

var Scheme = mongoose.Schema;
var CampgroundSchema = new Scheme({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Scheme.Types.ObjectId,
    ref: 'User'
  },
  reviews: [{
    type: Scheme.Types.ObjectId,
    ref: 'Review'
  }]
});
CampgroundSchema.post('findOneAndDelete', function _callee(doc) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!doc) {
            _context.next = 3;
            break;
          }

          _context.next = 3;
          return regeneratorRuntime.awrap(Review.remove({
            _id: {
              $in: doc.reviews
            }
          }));

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}); // built up model
// collections is Campground and db is yelp-camp

module.exports = mongoose.model('Campground', CampgroundSchema);
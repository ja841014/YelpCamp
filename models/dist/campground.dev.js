"use strict";

var mongoose = require('mongoose');

var Review = require('./review');

var Scheme = mongoose.Schema; // https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_crop,g_face,r_max/w_200/lady.jpg

var ImageSchema = new Scheme({
  url: String,
  filename: String
}); // why we use virtual, because we don't store this in our db or in our model
// because just derive it from the database
// add a new virtual property in this 

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});
var opts = {
  toJSON: {
    virtuals: true
  }
}; // if we do not add "opts", we cannot get virtual property in our object

var CampgroundSchema = new Scheme({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      "enum": ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
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
}, opts);
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return "\n    <strong><a href=\"/campgrounds/".concat(this._id, "\">").concat(this.title, "</a><strong>\n    <p>$").concat(this.price, "/day</p>\n    ");
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
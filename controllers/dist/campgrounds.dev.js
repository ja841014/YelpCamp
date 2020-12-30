"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Campground = require('../models/campground'); // It will accept anything that Google will accept: cities, streets, countries, etc.


var mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

var mapBoxToken = process.env.MAPBOX_TOKEN; // init by pass the token 

var geocoder = mbxGeocoding({
  accessToken: mapBoxToken
});

var _require = require("../cloudinary"),
    cloudinary = _require.cloudinary;

module.exports.index = function _callee(req, res) {
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
};

module.exports.renderNewForm = function (req, res) {
  res.render('campgrounds/new');
};

module.exports.createCampground = function _callee2(req, res) {
  var geoData, campground;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(geocoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
          }).send());

        case 2:
          geoData = _context2.sent;
          // if(!req.body.campground) {
          //     throw new ExpressError('Invalid campground Data', 400);
          // }
          campground = new Campground(req.body.campground);
          campground.geometry = geoData.body.features[0].geometry; // put the url and filename in the campground.images 

          campground.images = req.files.map(function (f) {
            return {
              url: f.path,
              filename: f.filename
            };
          });
          campground.author = req.user._id;
          _context2.next = 9;
          return regeneratorRuntime.awrap(campground.save());

        case 9:
          console.log(campground);
          req.flash('success', 'Succeessfully made a new campground'); //redirect to /campgrounds/:id this route

          res.redirect("/campgrounds/".concat(campground._id));

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.showCampground = function _callee3(req, res) {
  var campground;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Campground.findById(req.params.id).populate({
            path: 'reviews',
            populate: {
              path: 'author'
            }
          }).populate('author'));

        case 2:
          campground = _context3.sent;

          if (campground) {
            _context3.next = 6;
            break;
          }

          req.flash('error', 'Cannot find the campground');
          return _context3.abrupt("return", res.redirect('/campgrounds'));

        case 6:
          res.render('campgrounds/show', {
            campground: campground
          });

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.renderEditForm = function _callee4(req, res) {
  var id, campground;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Campground.findById(id));

        case 3:
          campground = _context4.sent;

          if (campground) {
            _context4.next = 7;
            break;
          }

          req.flash('error', 'Cannot find the campground');
          return _context4.abrupt("return", res.redirect('/campgrounds'));

        case 7:
          res.render('campgrounds/edit', {
            campground: campground
          });

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.updateCampground = function _callee5(req, res) {
  var _campground$images;

  var id, campground, imgs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, filename;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          console.log(req.body);
          _context5.next = 4;
          return regeneratorRuntime.awrap(Campground.findByIdAndUpdate(id, _objectSpread({}, req.body.campground)));

        case 4:
          campground = _context5.sent;
          imgs = req.files.map(function (f) {
            return {
              url: f.path,
              filename: f.filename
            };
          }); // Spread syntax ... push into campground.images seperately

          (_campground$images = campground.images).push.apply(_campground$images, _toConsumableArray(imgs)); // delete image 


          if (!req.body.deleteImages) {
            _context5.next = 37;
            break;
          }

          // delete image from cloudinary
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context5.prev = 11;
          _iterator = req.body.deleteImages[Symbol.iterator]();

        case 13:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context5.next = 20;
            break;
          }

          filename = _step.value;
          _context5.next = 17;
          return regeneratorRuntime.awrap(cloudinary.uploader.destroy(filename));

        case 17:
          _iteratorNormalCompletion = true;
          _context5.next = 13;
          break;

        case 20:
          _context5.next = 26;
          break;

        case 22:
          _context5.prev = 22;
          _context5.t0 = _context5["catch"](11);
          _didIteratorError = true;
          _iteratorError = _context5.t0;

        case 26:
          _context5.prev = 26;
          _context5.prev = 27;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 29:
          _context5.prev = 29;

          if (!_didIteratorError) {
            _context5.next = 32;
            break;
          }

          throw _iteratorError;

        case 32:
          return _context5.finish(29);

        case 33:
          return _context5.finish(26);

        case 34:
          _context5.next = 36;
          return regeneratorRuntime.awrap(campground.updateOne({
            $pull: {
              images: {
                filename: {
                  $in: req.body.deleteImages
                }
              }
            }
          }));

        case 36:
          console.log(campground);

        case 37:
          _context5.next = 39;
          return regeneratorRuntime.awrap(campground.save());

        case 39:
          req.flash('success', 'Successfully update a campground'); // console.log(campground);

          res.redirect("/campgrounds/".concat(campground._id));

        case 41:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[11, 22, 26, 34], [27,, 29, 33]]);
};

module.exports.deleteCampground = function _callee6(req, res) {
  var id;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id; // delete in databsse

          _context6.next = 3;
          return regeneratorRuntime.awrap(Campground.findByIdAndDelete(id));

        case 3:
          req.flash('success', 'Successfully delete a campground');
          res.redirect('/campgrounds');

        case 5:
        case "end":
          return _context6.stop();
      }
    }
  });
};
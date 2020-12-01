"use strict";

var mongoose = require('mongoose');

var cities = require('./cities');

var _require = require('./seedHelpers'),
    places = _require.places,
    descriptors = _require.descriptors;

var Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
}); // sample function which pass an array and will return an random element

var sample = function sample(array) {
  return array[Math.floor(Math.random() * array.length)];
};

var seedDB = function seedDB() {
  var i, random1000, price, camp;
  return regeneratorRuntime.async(function seedDB$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Campground.deleteMany({}));

        case 2:
          i = 0;

        case 3:
          if (!(i < 50)) {
            _context.next = 12;
            break;
          }

          // there is 1000 cities in cities.js
          random1000 = Math.floor(Math.random() * 1000);
          price = Math.floor(Math.random() * 20) + 10;
          camp = new Campground({
            //YOUR USER ID
            author: '5fc5bc04da41405087f54228',
            location: "".concat(cities[random1000].city, ", ").concat(cities[random1000].state),
            title: "".concat(sample(descriptors), " ").concat(sample(places)),
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price: price,
            // geometry: {
            //     type: "Point",
            //     coordinates: [
            //         cities[random1000].longitude,
            //         cities[random1000].latitude,
            //     ]
            // },
            image: 'https://source.unsplash.com/collection/483251' // 'https://source.unsplash.com/collection/483251'
            // images: [
            //     {
            //         url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
            //         filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
            //     },
            //     {
            //         url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
            //         filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
            //     }
            // ]

          });
          _context.next = 9;
          return regeneratorRuntime.awrap(camp.save());

        case 9:
          i++;
          _context.next = 3;
          break;

        case 12:
        case "end":
          return _context.stop();
      }
    }
  });
}; // return a promise


seedDB().then(function () {
  mongoose.connection.close();
});
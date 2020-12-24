const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
// sample function which pass an array and will return an random element
const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        // there is 1000 cities in cities.js
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USER ID
            author: '5fc5bc04da41405087f54228',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/ja841014/image/upload/v1608124550/YelpCamp/osjdhciwmahmtkomidzh.jpg',
                    filename: 'YelpCamp/osjdhciwmahmtkomidzh'
                },
                {
                    url: 'https://res.cloudinary.com/ja841014/image/upload/v1608124551/YelpCamp/wfaepv7j8gyrvfdplmxh.jpg',
                    filename: 'YelpCamp/wfaepv7j8gyrvfdplmxh'
                }
            ]
        })
        await camp.save();
    }
}
// return a promise
seedDB().then(() => {
    mongoose.connection.close();
})
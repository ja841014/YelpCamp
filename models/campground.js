const mongoose = require('mongoose');
const Review = require('./review');

const Scheme = mongoose.Schema;
const CampgroundSchema = new Scheme({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Scheme.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Scheme.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    // if found and delete the campground
    if(doc) {
        // we delete the reviews in this campground
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
}) 

// built up model
// collections is Campground and db is yelp-camp
module.exports = mongoose.model('Campground', CampgroundSchema);
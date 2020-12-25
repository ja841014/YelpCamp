const mongoose = require('mongoose');
const Review = require('./review');
const Scheme = mongoose.Schema;

// https://res.cloudinary.com/demo/image/upload/w_400,h_400,c_crop,g_face,r_max/w_200/lady.jpg

const ImageSchema = new Scheme({
    url: String,
    filename: String
})

// why we use virtual, because we don't store this in our db or in our model
// because just derive it from the database
// add a new virtual property in this 
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = {toJSON : {virtuals: true} };
// if we do not add "opts", we cannot get virtual property in our object
const CampgroundSchema = new Scheme({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
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
    reviews: [
        {
            type: Scheme.Types.ObjectId,
            ref: 'Review'
        }
    ],
    
}, opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>$${this.price}/day</p>
    `;
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
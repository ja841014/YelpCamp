const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const reviewdSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
// built up model
// collections is Review and db is yelp-camp
module.exports = mongoose.model('Review', reviewdSchema);
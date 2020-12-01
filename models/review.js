const mongoose = require('mongoose');

const Scheme = mongoose.Schema;
const reviewdSchema = new Scheme({
    body: String,
    rating: Number
});
// built up model
// collections is Review and db is yelp-camp
module.exports = mongoose.model('Review', reviewdSchema);
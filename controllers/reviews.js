const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.createReview = async(req, res) => {
    // console.log(req.params);
    const campground = await Campground.findById(req.params.id);
                                    // this req.body.review has all the information at specific campground's review which name is in the format review[...]
    const review = new Review(req.body.review);
    review.author = req.user._id;
    // put the new review to the campground model's review field
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully create a new review');
    res.redirect(`/campgrounds/${campground._id}`);
}



module.exports.deleteReview = async(req, res) => {
    // this id and reviewID are come from URL
    const { id, reviewId } = req.params;
    // remove array from the mongoose => take this reviewID and pull any thing put of the reviews array
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    // delete in databsse
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully delete a review');
    res.redirect(`/campgrounds/${id}`);
}



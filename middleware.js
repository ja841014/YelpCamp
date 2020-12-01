const {campgroundSchema, reviewSchema} = require('./schemas.js')
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review')


module.exports.isLoggedIn = (req, res, next) => {
    //it is automatically added user field by passport
    console.log("REQ,USER:", req.user);

    // isAuthenticated is come from passport.js
    if(!req.isAuthenticated()) {
        // we add a returnTo field into session
        // returnTo would be a url we want to redirect user back to
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You have to sign in first');
        return res.redirect('/login');
    }
    next();
}

// make validateCampground as a middleware
module.exports.validateCampground = (req,res, next) => {
    
    const {error} = campgroundSchema.validate(req.body);
    // console.log(req);
    if(error) {
        // if there are morn tham one el.message then join with a ','
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/campgrounds/${id}`);
    }
    
    next();
    
}


module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission');
        return res.redirect(`/campgrounds/${id}`);
    }
    
    next();
    
}

module.exports.validateReview = (req,res, next) => {
    
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        // if there are morn tham one el.message then join with a ','
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}
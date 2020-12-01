const express = require('express');
// we have to merge the parameter, otherwise it cannot get the parameter from different file
const router = express.Router({mergeParams: true});
// our own error function
const catchAsync = require('../utils/catchAsync')
// include campground model
const Campground = require('../models/campground');

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')





router.get('/', catchAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

// create new Pos
router.get('/new', isLoggedIn, (req, res) => {
    
    res.render('campgrounds/new');
})
router.post('/',  isLoggedIn, validateCampground, catchAsync(async(req, res) => {
    
    // if(!req.body.campground) {
    //     throw new ExpressError('Invalid campground Data', 400);
    // }
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Succeessfully made a new campground');
    //redirect to /campgrounds/:id this route
    res.redirect(`/campgrounds/${campground._id}`)
}))
// create new Post

// show specific post and its reviews and rating
router.get('/:id', catchAsync(async(req, res) => {
    // so right now we can get reviews and author from this "campground"
    // populate all the review then populate every review's author
    const campground  = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    // if did not find the campground
    if(!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}));

// this is edit page  update pos !!! I cannot UPDATE!!
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground  = await Campground.findById(id);
    // if did not find the campground
    if(!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async(req, res) => {
    const{ id } = req.params;
    
    const campground =  await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully update a campground');
    // console.log(campground);
    res.redirect(`/campgrounds/${campground._id}`);
}));
// update post

// delet
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    
    // delete in databsse
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete a campground');
    res.redirect('/campgrounds');
}));

module.exports = router;
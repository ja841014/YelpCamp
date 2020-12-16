const Campground = require('../models/campground');

module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req, res) => {
    
    // if(!req.body.campground) {
    //     throw new ExpressError('Invalid campground Data', 400);
    // }
    const campground = new Campground(req.body.campground);
    // put the url and filename in the campground.images 
    campground.images = req.files.map(f =>({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Succeessfully made a new campground');
    //redirect to /campgrounds/:id this route
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async(req, res) => {
    // so right now we can get reviews and author from this "campground"
    // populate all the review then populate every review's author
    const campground  = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(campground);
    // if did not find the campground
    if(!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const campground  = await Campground.findById(id);
    // if did not find the campground
    if(!campground) {
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async(req, res) => {
    const{ id } = req.params;
    
    const campground =  await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully update a campground');
    // console.log(campground);
    res.redirect(`/campgrounds/${campground._id}`);
}



module.exports.deleteCampground = async(req, res) => {
    const { id } = req.params;
    
    // delete in databsse
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete a campground');
    res.redirect('/campgrounds');
}




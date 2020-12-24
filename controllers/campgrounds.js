const Campground = require('../models/campground');

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
// init by pass the token 
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

const {cloudinary} = require("../cloudinary");

module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req, res) => {
    // it will get the possible locations points according the query
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    // if(!req.body.campground) {
    //     throw new ExpressError('Invalid campground Data', 400);
    // }
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
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
    console.log(req.body);
    const campground =  await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f =>({url: f.path, filename: f.filename}));
    // Spread syntax ... push into campground.images seperately
    campground.images.push(...imgs);
    // delete image 
    if(req.body.deleteImages) {
        // delete image from cloudinary
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        // delete image from mongo
        // pull form the images array, all images with filename that in the req.body.deleteImages
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages} } } } );
        console.log(campground);
    }
    

    await campground.save();
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




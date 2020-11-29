const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// joi schema validation, its a validator tool
const Joi = require('joi');
// kind of template
const ejsMate = require('ejs-mate');
// our own error function
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError');
// the over-ride method can fake a put method as patch
const methodOverride = require('method-override');

const Campground = require('./models/campground')

// yelp-camp db name
mongoose.connect('mongodb://localhost:27017/yelp-camp', { 
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true 
});

const db = mongoose.connection;
// connect fail
db.on("error", console.error.bind(console, "connection error"));
// connect sucessful
db.once('open', () => console.log('Connected to MongoDB')); 

const app = express();

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use will run on every single request
// encoded url ,so we can parse in into req.body
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// make validateCampground as a middleware
const validateCampground = (req,res, next) => {
    // this is not mongoose schema
    const campgroundSchema = Joi.object({
            // object is a type
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required(),
            location: Joi.string().required(),
            description: Joi.string().required(),
            }).required()
    })
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        // if there are morn tham one el.message then join with a ','
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', catchAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
}));

// create new Post
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});
app.post('/campgrounds/',  validateCampground, catchAsync(async(req, res) => {
    // if(!req.body.campground) {
    //     throw new ExpressError('Invalid campground Data', 400);
    // }
    const campground = new Campground(req.body.campground);
    await campground.save();
    //redirect to /campgrounds/:id this route
    res.redirect(`/campgrounds/${campground._id}`)
}))
// create new Post

// show specific post
app.get('/campgrounds/:id', catchAsync(async(req, res) => {
    const campground  = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
}));
// update post
app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
    const campground  = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
}));

app.put('/campgrounds/:id', catchAsync(async(req, res) => {
    const{ id } = req.params;
    const campground =  await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}));
// update post

// delete
app.delete('/campgrounds/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    // delete in databsse
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));
// delete
// nothing is match in the above route will go in this route
app.all('*', (req, res, next) => {
    // this next will hit the generic error handler below
    next(new ExpressError('404 Page Not Found', 404));
})

// generic error handler
app.use((err, req, res, next) => {
    // default statusCode is 500 and default message = "sth wrong"
    const {statusCode = 500} = err;
    if(!err.message) {
        err.message = 'Something went wrong'
    }
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log("CONNECTED!");
});
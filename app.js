const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// kind of template
const ejsMate = require('ejs-mate');
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
// encoded url ,s o we can parse in into req.body
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});

// create new Post
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});
app.post('/campgrounds/', async(req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    //redirect to /campgrounds/:id this route
    res.redirect(`/campgrounds/${campground._id}`)
})
// create new Post

// shoe specific post
app.get('/campgrounds/:id', async(req, res) => {
    const campground  = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
});
// update post
app.get('/campgrounds/:id/edit', async(req, res) => {
    const campground  = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
});

app.put('/campgrounds/:id', async(req, res) => {
    const{ id } = req.params;
    const campground =  await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
});
// update post

// delete
app.delete('/campgrounds/:id', async(req, res) => {
    const { id } = req.params;
    // delete in databsse
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})
// delete

app.listen(3000, () => {
    console.log("CONNECTED!");
});
// if we are not in the 'production' node enviornment we have to require 
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// kind of template
const ejsMate = require('ejs-mate');

const session = require('express-session')
const flash = require('connect-flash')
// our own error function
const ExpressError = require('./utils/ExpressError');
// the over-ride method can fake a put method as patch
const methodOverride = require('method-override');
const User =require('./models/user')

// prevent client enter some sentitive word such as '$'
const mongoSanitize = require('express-mongo-sanitize');


const passport = require('passport');
const LocalStrategy = require('passport-local');
// const Campground = require('./models/campground');
// const Review = require('./models/review');
// reconstruct the route
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

// yelp-camp db name
mongoose.connect('mongodb://localhost:27017/yelp-camp', { 
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true,
    useFindAndModify: false 
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());


const sessionConfig = {
    name: 'session',
    secret: 'sould be a good secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// it is apply in every route
app.use((req, res, next) => {

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


   

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

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
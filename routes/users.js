const express = require('express')
const router = express.Router();
const passport =require('passport')
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (req, res)=> {
    res.render('users/register');
})
// submit the register
router.post('/register', catchAsync(async(req, res, next) => {
    try {
        const {email, username, password } = req.body;
        const user = new User({email, username});
        // pass the user object and password in it and save it in db
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if(err) {
                return next(err);
            }
            else {
                req.flash('success', 'Walcome to YelpCamp');
                res.redirect('/campgrounds');
            }
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
    // console.log(registerUser);    
}))

router.get('/login', (req, res)=> {
    res.render('users/login');
})
                            // using the local strategy
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res)=> {
    req.flash('success', 'Walcome Back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);

})

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', "GoodBye");
    res.redirect('/campgrounds')
})

module.exports = router;
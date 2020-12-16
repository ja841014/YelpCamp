const User = require('../models/user');

module.exports.renderRegister = (req, res)=> {
    res.render('users/register');
}

module.exports.register = async(req, res, next) => {
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
}

module.exports.renderLogin = (req, res)=> {
    res.render('users/login');
};


module.exports.login = (req, res)=> {
    req.flash('success', 'Walcome Back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);

}



module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', "GoodBye");
    res.redirect('/campgrounds')
}


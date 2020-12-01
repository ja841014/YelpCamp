"use strict";

var express = require('express');

var router = express.Router();

var passport = require('passport');

var catchAsync = require('../utils/catchAsync');

var User = require('../models/user');

router.get('/register', function (req, res) {
  res.render('users/register');
}); // submit the register

router.post('/register', catchAsync(function _callee(req, res, next) {
  var _req$body, email, username, password, user, registerUser;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, email = _req$body.email, username = _req$body.username, password = _req$body.password;
          user = new User({
            email: email,
            username: username
          }); // pass the user object and password in it and save it in db

          _context.next = 5;
          return regeneratorRuntime.awrap(User.register(user, password));

        case 5:
          registerUser = _context.sent;
          req.login(registerUser, function (err) {
            if (err) {
              return next(err);
            } else {
              req.flash('success', 'Walcome to YelpCamp');
              res.redirect('/campgrounds');
            }
          });
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          req.flash('error', _context.t0.message);
          res.redirect('/register');

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
}));
router.get('/login', function (req, res) {
  res.render('users/login');
}); // using the local strategy

router.post('/login', passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/login'
}), function (req, res) {
  req.flash('success', 'Walcome Back');
  var redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
});
router.get('/logout', function (req, res) {
  req.logOut();
  req.flash('success', "GoodBye");
  res.redirect('/campgrounds');
});
module.exports = router;
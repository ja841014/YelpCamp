"use strict";

var express = require('express'); // we have to merge the parameter, otherwise it cannot get the parameter from different file


var router = express.Router({
  mergeParams: true
}); // our own error function

var catchAsync = require('../utils/catchAsync'); // include campground model


var Campground = require('../models/campground');

var campgrounds = require('../controllers/campgrounds');

var _require = require('../middleware'),
    isLoggedIn = _require.isLoggedIn,
    validateCampground = _require.validateCampground,
    isAuthor = _require.isAuthor; // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. 
// Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.


var multer = require('multer');

var _require2 = require('../cloudinary'),
    storage = _require2.storage;

var upload = multer({
  storage: storage
}); // we can use router.route to chaining all path together

router.route('/').get(catchAsync(campgrounds.index)).post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground)); // create new campground

router.get('/new', isLoggedIn, campgrounds.renderNewForm);
router.route('/:id').get(catchAsync(campgrounds.showCampground)).put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))["delete"](isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); // router.get('/', catchAsync(campgrounds.index));
// router.post('/',  isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
// create new campground
// show specific post and its reviews and rating
// router.get('/:id', catchAsync(campgrounds.showCampground));
// this is show edit page  

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm)); // update post !!! 
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));
// delete
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;
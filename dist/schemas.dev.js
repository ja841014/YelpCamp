"use strict";

// it has lots of validatation in this api
// joi schema validation, its a validator tool
var BaseJoi = require('joi');

var sanitizeHtml = require('sanitize-html'); // extend the Joi


var extension = function extension(joi) {
  return {
    type: 'string',
    base: joi.string(),
    messages: {
      'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
      escapeHTML: {
        validate: function validate(value, helpers) {
          var clean = sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {}
          });
          if (clean !== value) return helpers.error('string.escapeHTML', {
            value: value
          });
          return clean;
        }
      }
    }
  };
};

var Joi = BaseJoi.extend(extension);
module.exports.campgroundSchema = Joi.object({
  // object is a type
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML()
  }).required(),
  deleteImages: Joi.array()
});
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML()
  }).required()
});
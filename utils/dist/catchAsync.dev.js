"use strict";

module.exports = function (func) {
  // func is what we pass in and return a new function that has func executed and then catch any error and pass it to next()
  return function (req, res, next) {
    func(req, res, next)["catch"](next);
  };
};
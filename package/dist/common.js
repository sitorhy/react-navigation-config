"use strict";

exports.__esModule = true;
exports.removeEmpty = removeEmpty;

function removeEmpty(obj, options) {
  if (options === void 0) {
    options = {};
  }

  if (!obj) {
    return obj;
  }

  var omitZero = options.omitZero === true;
  var ignore = options.ignore || [];
  var accepts = {};
  Object.keys(obj).forEach(key => {
    if (ignore.includes(key)) {
      accepts[key] = obj[key];
    } else {
      if (!(obj[key] === null || obj[key] === undefined || obj[key] === 0 && omitZero)) {
        accepts[key] = obj[key];
      }
    }
  });
  return accepts;
}
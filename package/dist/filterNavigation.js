"use strict";

exports.__esModule = true;
exports.default = _default;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _default(routes, allows) {
  if (routes === void 0) {
    routes = [];
  }

  if (allows === void 0) {
    allows = [];
  }

  if (allows === true) {
    return routes;
  }

  function choose(routes, allows, accepts) {
    if (accepts === void 0) {
      accepts = [];
    }

    var _loop = function _loop(i) {
      var {
        name
      } = i;
      var prop = ["children", "all", "oneOf"].find(j => !!i[j]);

      if (prop && Array.isArray(i[prop]) && i[prop].length) {
        var arr = choose(i[prop], allows, []);

        if (arr.length) {
          accepts.push(_extends({}, i, {
            [prop]: arr
          }));
        }
      } else {
        if (name && allows.includes(name)) {
          accepts.push(i);
        }
      }
    };

    for (var i of routes) {
      _loop(i);
    }

    return accepts;
  }

  return choose(routes, allows);
}
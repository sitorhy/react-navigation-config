"use strict";

exports.__esModule = true;
exports.default = _default;
exports.ACTIONS = void 0;

var _redux = require("redux");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ACTIONS = {
  SET_ROUTE_KEY: "SET_ROUTE_KEY",
  SET_ROUTE_NAME: "SET_ROUTE_NAME"
};
exports.ACTIONS = ACTIONS;

function _default() {
  return (0, _redux.createStore)((0, _redux.combineReducers)({
    navigation(state, action) {
      if (state === void 0) {
        state = {};
      }

      switch (action.type) {
        case ACTIONS.SET_ROUTE_KEY:
          {
            return _extends({}, state, {
              key: action.key
            });
          }
          break;

        case ACTIONS.SET_ROUTE_NAME:
          {
            return _extends({}, state, {
              routeName: action.routeName
            });
          }
          break;

        default:
          {
            return state;
          }
      }
    }

  }));
}
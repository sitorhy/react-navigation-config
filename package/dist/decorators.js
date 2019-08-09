"use strict";

exports.__esModule = true;
exports.navigationOptions = navigationOptions;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function navigationOptions(navigationOptions) {
  if (navigationOptions === void 0) {
    navigationOptions = {};
  }

  return Component => {
    var _class, _temp;

    return _temp = _class = class extends Component {}, _defineProperty(_class, "navigationOptions", navigationOptions), _temp;
  };
}
"use strict";

exports.__esModule = true;
exports.default = _default;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Navigator {
  _connect(navigator) {
    this.navigator = navigator;
  }

  switchTab() {}

  reLaunch() {}

  redirectTo() {}

  navigateTo() {}

  navigateBack() {}

}

function _default(AppContainer, acceptNavigator, releaseNavigator) {
  var _temp;

  if (acceptNavigator === void 0) {
    acceptNavigator = () => {};
  }

  if (releaseNavigator === void 0) {
    releaseNavigator = () => {};
  }

  return _temp = class extends _react.default.Component {
    constructor() {
      super(...arguments);

      _defineProperty(this, "onNavigationStateChange", (prevState, newState, action) => {
        var {
          onNavigationStateChange
        } = this.props;
        console.log(prevState);
        console.log(newState);
        console.log(action);
        var {
          type
        } = action;

        switch (type) {
          case "Navigation/NAVIGATE":
            {}
            break;
        }

        if (typeof onNavigationStateChange === "function") {
          onNavigationStateChange(prevState, newState, action);
        }
      });

      this._navigator = new Navigator();

      this._navigator._connect(this);

      acceptNavigator(this._navigator);
    }

    componentWillUnmount() {
      releaseNavigator(this._navigator);

      this._navigator._connect(null);

      this._navigator = null;
    }

    render() {
      var {
        uriPrefix
      } = this.props;
      return _react.default.createElement(AppContainer, {
        uriPrefix: uriPrefix,
        onNavigationStateChange: this.onNavigationStateChange
      });
    }

  }, _temp;
}
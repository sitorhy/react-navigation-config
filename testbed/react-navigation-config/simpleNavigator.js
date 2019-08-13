"use strict";

exports.__esModule = true;
exports.default = _default;

var _react = _interopRequireDefault(require("react"));

var _reactNavigation = require("react-navigation");

var _common = require("./common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Navigator {
  setNavigator(navigator) {
    this.navigator = navigator;
  }

  setContainer(container) {
    this.container = container;
  }

  switchTab() {}

  reLaunch() {}

  redirectTo() {}

  navigateTo(name, params) {
    return new Promise(resolve => {
      var id = (0, _common.uuid)();
      var observer = {
        id,

        callback() {
          resolve();
        }

      };

      this.container._listen(observer);

      if (!this.navigator.dispatch(_reactNavigation.NavigationActions.navigate({
        routeName: name,
        params: params
      }))) {
        this.container._remove(id);
      }
    });
  }

  navigateBack() {}

}

function _default(AppContainer, onNavigatorCreate, onNavigatorDestroy) {
  var _temp;

  if (onNavigatorCreate === void 0) {
    onNavigatorCreate = () => {};
  }

  if (onNavigatorDestroy === void 0) {
    onNavigatorDestroy = () => {};
  }

  var navigator = new Navigator();
  var WrappedAppContainer = class extends AppContainer {
    constructor() {
      super(...arguments);
      onNavigatorCreate(navigator);
      navigator.setNavigator(this);
    }

  };
  return _temp = class extends _react.default.Component {
    constructor() {
      super(...arguments);

      _defineProperty(this, "_observers", []);

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
            {
              this._observers.splice(0, this._observers.length).forEach((_ref) => {
                var {
                  callback
                } = _ref;
                callback();
              });
            }
            break;
        }

        if (typeof onNavigationStateChange === "function") {
          onNavigationStateChange(prevState, newState, action);
        }
      });

      navigator.setContainer(this);
    }

    _listen(observer) {
      this._observers.push(observer);
    }

    _remove(id) {
      var index = this._observers.findIndex(i => i.id === id);

      if (index >= 0) {
        this._observers.splice(index, 1);
      }
    }

    componentWillUnmount() {}

    render() {
      var {
        uriPrefix
      } = this.props;
      return _react.default.createElement(WrappedAppContainer, {
        uriPrefix: uriPrefix,
        onNavigationStateChange: this.onNavigationStateChange
      });
    }

  }, _temp;
}
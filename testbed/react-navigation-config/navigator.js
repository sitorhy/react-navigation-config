"use strict";

exports.__esModule = true;
exports.default = _default;
exports.Navigator = void 0;

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

  reLaunch(name, params) {
    return new Promise((resolve, reject) => {
      var id = (0, _common.uuid)();
      var observer = {
        id,
        callback: () => {
          if (name) {
            this.navigateTo(name, params).then(() => {
              resolve();
            }).catch(() => {
              resolve();
            });
          } else {
            resolve();
          }
        }
      };

      this.container._listen(observer);

      if (!this.navigator.dispatch(_reactNavigation.StackActions.popToTop())) {
        this.container._remove(id);

        reject();
      }
    });
  }

  redirectTo(name, params) {
    return new Promise((resolve, reject) => {
      var id = (0, _common.uuid)();
      var observer = {
        id,

        callback() {
          resolve();
        }

      };

      this.container._listen(observer);

      if (!this.navigator.dispatch(_reactNavigation.StackActions.replace({
        routeName: name,
        params: params
      }))) {
        this.container._remove(id);

        reject();
      }
    });
  }

  navigateTo(name, params) {
    return new Promise((resolve, reject) => {
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

        reject();
      }
    });
  }

  navigateBack() {
    return new Promise((resolve, reject) => {
      var id = (0, _common.uuid)();
      var observer = {
        id,

        callback() {
          resolve();
        }

      };

      this.container._listen(observer);

      if (!this.navigator.dispatch(_reactNavigation.NavigationActions.back({}))) {
        this.container._remove(id);

        reject();
      }
    });
  }

}

exports.Navigator = Navigator;

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

        switch (action.type) {
          default:
            {
              this._observers.splice(0, this._observers.length).forEach((_ref) => {
                var {
                  callback
                } = _ref;
                callback();
              });
            }
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

    componentWillUnmount() {
      onNavigatorDestroy();
      navigator.setContainer(null);
      navigator.setNavigator(null);
    }

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
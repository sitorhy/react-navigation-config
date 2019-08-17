"use strict";

exports.__esModule = true;
exports.getNavState = getNavState;
exports.default = _default;
exports.Navigator = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNavigation = require("react-navigation");

var _common = require("./common");

var _router = _interopRequireDefault(require("./router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function getNavState(nav) {
  function _get(nav, mergeParams, scopeParams) {
    var {
      routes,
      index,
      params
    } = nav;
    var state = null;

    if (routes && routes.length && index !== undefined && index !== null) {
      state = _get(routes[index], mergeParams, scopeParams) || routes[index];

      if (state.params) {
        if (scopeParams[state.routeName]) {
          scopeParams[state.routeName] = _extends({}, scopeParams[state.routeName], {
            [state.key]: state.params
          });
        } else {
          scopeParams[state.routeName] = {
            [state.key]: state.params
          };
        }

        scopeParams[state.routeName].common = _extends({}, scopeParams[state.routeName].common, {}, state.params);
      }
    }

    Object.assign(mergeParams, params);
    return state;
  }

  var params = {};
  var scopeParams = {};

  _get(nav, params, scopeParams);

  return [params, scopeParams];
}

class Navigator {
  _setNavigator(navigator) {
    this.navigator = navigator;
  }

  _setContainer(container) {
    this.container = container;
  }

  _asyncNavigate(doTask) {
    return new Promise((resolve, reject) => {
      var id = (0, _common.uuid)();
      var observer = {
        id,

        callback(obj) {
          resolve(obj);
        }

      };

      this.container._listen(observer);

      if (!doTask()) {
        this.container._remove(id);

        reject();
      }
    });
  }

  getParams() {
    return getNavState(this.navigator.state.nav);
  }

  reLaunch(name, params) {
    return new Promise((resolve, reject) => {
      this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.StackActions.popToTop())).then(obj => {
        if (name) {
          this.redirectTo(name, params).then(obj => {
            resolve(obj);
          }).catch(() => {
            reject();
          });
        } else {
          resolve(obj);
        }
      }).catch(() => {
        reject();
      });
    });
  }

  redirectTo(name, params) {
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.StackActions.replace({
      routeName: name,
      params: params
    })));
  }

  navigateTo(name, params) {
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.NavigationActions.navigate({
      routeName: name,
      params: params
    })));
  }

  navigateBack() {
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.NavigationActions.back({})));
  }

}

exports.Navigator = Navigator;

function _default(AppContainer, navigator) {
  var _temp;

  if (navigator === void 0) {
    navigator = _router.default;
  }

  var WrappedAppContainer = class extends AppContainer {
    constructor() {
      super(...arguments);

      if (navigator) {
        navigator._setNavigator(this);
      }
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
        var {
          params,
          routeName
        } = action;

        switch (action.type) {
          default:
            {
              this._observers.splice(0, this._observers.length).forEach((_ref) => {
                var {
                  callback
                } = _ref;
                callback({
                  params,
                  routeName
                });
              });
            }
        }

        if (typeof onNavigationStateChange === "function") {
          onNavigationStateChange(prevState, newState, action);
        }
      });

      if (navigator) {
        navigator._setContainer(this);
      }
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
      navigator._setContainer(null);

      navigator._setNavigator(null);
    }

    render() {
      var {
        uriPrefix
      } = this.props;
      return _react.default.createElement(_react.Fragment, null, _react.default.createElement(WrappedAppContainer, {
        uriPrefix: uriPrefix,
        onNavigationStateChange: this.onNavigationStateChange
      }));
    }

  }, _temp;
}
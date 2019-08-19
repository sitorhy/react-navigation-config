"use strict";

exports.__esModule = true;
exports.default = exports.Navigator = void 0;

var _common = require("./common");

var _reactNavigation = require("react-navigation");

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

    if (Array.isArray(routes) && routes.length && index !== undefined && index !== null) {
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

function getActiveRoute(nav) {
  var {
    routes,
    index
  } = nav;

  if (index === null || index === undefined) {
    return null;
  }

  if (Array.isArray(routes) && routes.length) {
    var activeRoute = getActiveRoute(routes[index]);

    if (activeRoute === null) {
      return routes[index];
    } else {
      return activeRoute;
    }
  }

  return null;
}

function matchRoute(nav, name) {
  var {
    routes,
    routeName
  } = nav;

  if (routeName === name) {
    return nav;
  }

  if (Array.isArray(routes) && routes.length) {
    for (var i of routes) {
      var j = matchRoute(i, name);

      if (j) {
        return j;
      }
    }
  }

  return null;
}

class Navigator {
  constructor() {
    _defineProperty(this, "_routeName", "");

    _defineProperty(this, "_beforeEachHandler", null);

    _defineProperty(this, "_afterEachHandler", null);

    _defineProperty(this, "_readyHandler", null);

    _defineProperty(this, "_preventDefaultActionFix", true);
  }

  _bindBeforeEach(action, toState, fromState) {
    var fixed = false;
    var nextAction = null;
    var customAction = null;
    var to = getActiveRoute(toState);

    if (this._preventDefaultActionFix !== true) {
      if (to.routeName && to.routeName !== action.routeName) {
        action.routeName = to.routeName;
        fixed = true;
      }
    }

    if (typeof this._beforeEachHandler === "function") {
      var form = getActiveRoute(fromState);
      var handler = this._beforeEachHandler;

      function _rewriteAction(routeName, params) {
        if (params === void 0) {
          params = null;
        }

        if (routeName) {
          customAction = _extends({}, action, {
            routeName
          }, (0, _common.removeEmpty)({
            params
          }));
        }
      }

      nextAction = handler(action, (0, _common.removeEmpty)({
        key: form.key,
        params: form.params,
        routeName: form.routeName
      }), _rewriteAction);
    }

    return nextAction || customAction || fixed && action;
  }

  _bindAfterEach(action, toState, fromState) {
    if (typeof this._afterEachHandler === "function") {
      var from = getActiveRoute(fromState);
      var handler = this._afterEachHandler;
      handler(action, (0, _common.removeEmpty)({
        key: from.key,
        params: from.params,
        routeName: from.routeName
      }));
    }
  }

  _bindReady() {
    if (typeof this._readyHandler === "function") {
      var handler = this._readyHandler;
      handler();
    }
  }

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

  getCurrentParams() {
    var routeName = this._routeName;

    if (routeName) {
      var route = matchRoute(this.navigator.state.nav, routeName);

      if (route) {
        return route.params;
      }
    }

    return null;
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
    var options = (0, _common.removeEmpty)({
      routeName: name,
      params: params
    });
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.NavigationActions.navigate(options)));
  }

  navigateBack() {
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.NavigationActions.back({})));
  }

  preventDefaultActionFix(disabled) {
    if (disabled === void 0) {
      disabled = true;
    }

    this._preventDefaultActionFix = disabled === true;
  }

  beforeEach(callback) {
    if (typeof callback === "function") {
      this._beforeEachHandler = callback;
    }
  }

  afterEach(callback) {
    if (typeof callback === "function") {
      this._afterEachHandler = callback;
    }
  }

  onReady(callback) {
    if (typeof callback === "function") {
      this._readyHandler = callback;
    }
  }

}

exports.Navigator = Navigator;

var _default = new Navigator();

exports.default = _default;
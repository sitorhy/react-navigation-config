"use strict";

exports.__esModule = true;
exports.default = exports.Navigator = void 0;

var _store = _interopRequireWildcard(require("./store"));

var _common = require("./common");

var _reactNavigation = require("react-navigation");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Navigator {
  constructor() {
    _defineProperty(this, "_store", (0, _store.default)());

    _defineProperty(this, "_beforeEachHandler", null);

    _defineProperty(this, "_afterEachHandler", null);

    _defineProperty(this, "_readyHandler", null);

    _defineProperty(this, "_preventDefaultActionFix", true);
  }

  _bindBeforeEach(action, toState, fromState) {
    var fixed = false;
    var nextAction = null;
    var customAction = null;
    var to = (0, _common.getActiveRoute)(toState);

    if (this._preventDefaultActionFix !== true) {
      if (to.routeName && to.routeName !== action.routeName) {
        action.routeName = to.routeName;
        fixed = true;
      }
    }

    if (typeof this._beforeEachHandler === "function") {
      var form = (0, _common.getActiveRoute)(fromState);
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

      nextAction = handler(action, to, (0, _common.removeEmpty)({
        key: form.key,
        params: form.params,
        routeName: form.routeName
      }), _rewriteAction);
    }

    return nextAction || customAction || fixed && action;
  }

  _bindAfterEach(action, toState, fromState) {
    if (typeof this._afterEachHandler === "function") {
      var to = (0, _common.getActiveRoute)(toState);
      var from = (0, _common.getActiveRoute)(fromState);
      var handler = this._afterEachHandler;
      handler(action, to, (0, _common.removeEmpty)({
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

  _asyncNavigate(doTask, screenProps) {
    return new Promise((resolve, reject) => {
      var id = (0, _common.uuid)();
      var observer = {
        id,

        callback(obj) {
          resolve(obj);
        }

      };
      var store = this.getStore();
      store.dispatch({
        type: _store.ACTIONS.PUT_SCREEN_PROPS,
        screenProps
      });

      this.container._listen(observer);

      if (!doTask()) {
        store.dispatch({
          type: _store.ACTIONS.DUMP_SCREEN_PROPS
        });

        this.container._remove(id);

        reject();
      }
    });
  }

  getParams() {
    return (0, _common.getNavState)(this.navigator.state.nav);
  }

  getCurrentParams() {
    var {
      navigation
    } = this.getStore().getState();
    var {
      key
    } = navigation;

    if (key) {
      var route = (0, _common.matchRoute)(this.navigator.state.nav, key);

      if (route) {
        return route.params;
      }
    }

    return null;
  }

  reLaunch(name, params, screenProps) {
    return new Promise((resolve, reject) => {
      this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.StackActions.popToTop()), screenProps).then(obj => {
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

  push(name, params, screenProps) {
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.StackActions.push({
      routeName: name,
      params
    })), screenProps);
  }

  redirectTo(name, params, screenProps) {
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.StackActions.replace({
      routeName: name,
      params: params
    })), screenProps);
  }

  navigateTo(name, params, screenProps) {
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.NavigationActions.navigate({
      routeName: name,
      params: params
    })), screenProps);
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

  getStore() {
    return this._store;
  }

}

exports.Navigator = Navigator;

var _default = new Navigator();

exports.default = _default;
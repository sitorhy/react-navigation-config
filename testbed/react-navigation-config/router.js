"use strict";

exports.__esModule = true;
exports.default = exports.Navigator = void 0;

var _store = _interopRequireWildcard(require("./store"));

var _common = require("./common");

var _reactNavigation = require("react-navigation");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Navigator {
  constructor() {
    _defineProperty(this, "_store", (0, _store.default)());

    _defineProperty(this, "_beforeEachHandler", null);

    _defineProperty(this, "_afterEachHandler", null);

    _defineProperty(this, "_readyHandler", null);

    _defineProperty(this, "_preventDefaultActionFix", true);

    _defineProperty(this, "_ignoreActions", _common.DEFAULT_IGNORE_ACTIONS);
  }

  _bindBeforeEach(action, toState, fromState) {
    var {
      type
    } = action;

    if (this._ignoreActions.includes(type)) {
      return null;
    }

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
        screenProps,

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

  getRouteParams(key) {
    if (key) {
      var route = (0, _common.matchRoute)(this.navigator.state.nav, key);

      if (route) {
        return route.params;
      }
    }

    return null;
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

  getChannel() {
    var {
      navigation,
      screenProps
    } = this.getStore().getState();
    var {
      key
    } = navigation;

    if (key) {
      return screenProps[key];
    }

    return null;
  }

  reLaunch(name, options) {
    if (options === void 0) {
      options = {};
    }

    return new Promise((resolve, reject) => {
      this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.StackActions.popToTop())).then(obj => {
        if (name) {
          this.redirectTo(name, options).then(obj => {
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

  push(name, options) {
    if (options === void 0) {
      options = {};
    }

    var {
      params,
      channel
    } = options;
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.StackActions.push({
      routeName: name,
      params
    })), channel);
  }

  redirectTo(name, options) {
    if (options === void 0) {
      options = {};
    }

    var {
      params,
      channel
    } = options;
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.StackActions.replace({
      routeName: name,
      params: params
    })), channel);
  }

  navigateTo(name, options) {
    if (options === void 0) {
      options = {};
    }

    var {
      params,
      channel
    } = options;
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.NavigationActions.navigate({
      routeName: name,
      params: params
    })), channel);
  }

  navigateBack() {
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.NavigationActions.back({})));
  }

  dispatchAction(action, options) {
    if (options === void 0) {
      options = {};
    }

    if (action) {
      var {
        channel
      } = options,
          actionProps = _objectWithoutPropertiesLoose(options, ["channel"]);

      return this._asyncNavigate(() => this.navigator.dispatch(_extends({}, action, {}, actionProps), channel));
    }
  }

  toggleDrawer() {
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.DrawerActions.toggleDrawer()));
  }

  openDrawer() {
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.DrawerActions.openDrawer()));
  }

  closeDrawer() {
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.DrawerActions.closeDrawer()));
  }

  preventDefaultActionFix(disabled) {
    if (disabled === void 0) {
      disabled = true;
    }

    this._preventDefaultActionFix = disabled === true;
  }

  beforeEach(callback, options) {
    if (options === void 0) {
      options = {};
    }

    if (options) {
      var {
        ignoreActions
      } = options;

      if (Array.isArray(ignoreActions)) {
        this._ignoreActions = ignoreActions;
      }
    }

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
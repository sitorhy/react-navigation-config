"use strict";

exports.__esModule = true;
exports.default = exports.Navigator = void 0;

var _store = _interopRequireDefault(require("./store"));

var _common = require("./common");

var _reactNavigation = require("react-navigation");

var _actions = require("./actions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  _asyncNavigate(doTask, channel) {
    return new Promise((resolve, reject) => {
      var id = (0, _common.uuid)();
      var observer = {
        id,

        callback(obj) {
          resolve(obj);
        }

      };
      var store = this.getStore();
      store.dispatch((0, _actions.depositChannel)(channel));

      this.container._listen(observer);

      if (!doTask()) {
        store.dispatch((0, _actions.dumpChannel)());

        this.container._remove(id);

        reject();
      }
    });
  }

  mergeParams() {
    return (0, _common.getNavState)(this.navigator.state.nav);
  }

  getParams(routeKey) {
    var key = routeKey || this.getActiveKey();

    if (key) {
      var route = (0, _common.matchRoute)(this.navigator.state.nav, key);

      if (route) {
        return route.params;
      }
    }

    return null;
  }

  updateChannel(routeKey, channel) {
    var key = routeKey || this.getActiveKey();

    if (key) {
      this.getStore().dispatch((0, _actions.installChannel)(key, channel));
      return true;
    }

    return false;
  }

  getChannel(routeKey) {
    var state = this.getStore().getState();
    var key = routeKey || this.getActiveKey();

    if (key) {
      return (0, _common.getScreenPropsFromChannelModule)(key, (0, _common.getChannelModule)(state));
    }

    return null;
  }

  mergeChannels() {
    var state = this.getStore().getState();
    return (0, _common.mergeChannel)((0, _common.getChannelModule)(state));
  }

  removeChannel(routeKey) {
    var key = routeKey || this.getActiveKey();
    this.getStore().dispatch((0, _actions.uninstallChannel)(key));
  }

  getActiveKey() {
    var navigation = (0, _common.getNavigationModule)(this.getStore().getState());
    return (0, _common.getKeyFromNavigationModule)(navigation);
  }

  setParams(routeKey, params) {
    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.NavigationActions.setParams({
      params: params,
      key: routeKey
    })));
  }

  reLaunch(name, options) {
    if (options === void 0) {
      options = {};
    }

    var params = null,
        channel = null;

    if (options) {
      params = options.params;
      channel = options.channel;
    }

    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.StackActions.reset({
      index: 0,
      actions: [_reactNavigation.NavigationActions.navigate(_extends({
        routeName: name
      }, (0, _common.removeEmpty)({
        params
      })))]
    })), channel);
  }

  push(name, options) {
    if (options === void 0) {
      options = {};
    }

    var params = null,
        channel = null;

    if (options) {
      params = options.params;
      channel = options.channel;
    }

    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.StackActions.push(_extends({
      routeName: name
    }, (0, _common.removeEmpty)({
      params
    })))), channel);
  }

  redirectTo(name, options) {
    if (options === void 0) {
      options = {};
    }

    var params = null,
        channel = null;

    if (options) {
      params = options.params;
      channel = options.channel;
    }

    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.StackActions.replace(_extends({
      routeName: name
    }, (0, _common.removeEmpty)({
      params
    })))), channel);
  }

  navigateTo(name, options) {
    if (options === void 0) {
      options = {};
    }

    var params = null,
        channel = null,
        routeKey = null;

    if (options) {
      params = options.params;
      channel = options.channel;
      routeKey = options.routeKey;
    }

    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.NavigationActions.navigate(_extends({
      routeName: name
    }, (0, _common.removeEmpty)({
      params,
      key: routeKey
    })))), channel);
  }

  navigateBack(options) {
    var channel = null,
        routeKey = null;

    if (options) {
      channel = options.channel;
      routeKey = options.routeKey;
    }

    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.NavigationActions.back((0, _common.removeEmpty)({
      key: routeKey
    }))), channel);
  }

  dispatchAction(action, options) {
    if (action) {
      var channel = null;

      if (options) {
        channel = options.channel;
      }

      return this._asyncNavigate(() => this.navigator.dispatch(action), channel);
    }
  }

  popToTop(options) {
    if (options === void 0) {
      options = null;
    }

    return this.dispatchAction(_reactNavigation.StackActions.popToTop(), options);
  }

  pop(n, options) {
    if (n === void 0) {
      n = 1;
    }

    if (options === void 0) {
      options = null;
    }

    return this.dispatchAction(_reactNavigation.StackActions.pop({
      n
    }), options);
  }

  toggleDrawer(options) {
    var channel = null;

    if (options) {
      channel = options.channel;
    }

    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.DrawerActions.toggleDrawer()), channel);
  }

  openDrawer(options) {
    var channel = null;

    if (options) {
      channel = options.channel;
    }

    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.DrawerActions.openDrawer()), channel);
  }

  closeDrawer(options) {
    var channel = null;

    if (options) {
      channel = options.channel;
    }

    return this._asyncNavigate(() => this.navigator.dispatch(_reactNavigation.DrawerActions.closeDrawer()), channel);
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
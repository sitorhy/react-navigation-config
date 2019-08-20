"use strict";

exports.__esModule = true;
exports.default = _default;

var _react = _interopRequireDefault(require("react"));

var _reactNavigation = require("react-navigation");

var _router = _interopRequireDefault(require("./router"));

var decorators = _interopRequireWildcard(require("./decorators"));

var _common = require("./common");

var _store = require("./store");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function inject(injectNavigationOptions, navigationOptions, component) {
  if (injectNavigationOptions) {
    if (injectNavigationOptions === "extend") {
      return decorators.navigationOptions(navigationOptions)(component);
    } else {
      if (injectNavigationOptions === true) {
        component.navigationOptions = navigationOptions;
      }
    }
  }

  return component;
}

function through(store, screenProps, ScreenComponent) {
  var _temp;

  var ThroughComponent = (_temp = class ThroughComponent extends _react.default.Component {
    constructor() {
      super(...arguments);

      _defineProperty(this, "observer", null);

      if (store) {
        this.observer = new _common.ObserveStore(store, (state, call) => {
          var {
            navigation
          } = this.props;
          var {
            key
          } = navigation.state;
          var {
            screenProps
          } = state;

          if (Object.hasOwnProperty.call(screenProps, key)) {
            if (typeof call === "function") {
              call(screenProps[key]);
            }
          }
        }, screenProps => {
          this.state = _extends({}, this.state, {
            screenProps
          });
        });
      }
    }

    componentDidMount() {
      if (this.observer) {
        this.observer.start(screenProps => {
          this.setState({
            screenProps
          });
        });
      }
    }

    componentWillUnmount() {
      if (this.observer) {
        var {
          navigation
        } = this.props;
        var {
          key
        } = navigation.state;
        this.observer.dispose();
        store.dispatch({
          type: _store.ACTIONS.UNINSTALL_SCREEN_PROPS,
          key
        });
        this.observer = null;
      }
    }

    render() {
      var {
        screenProps: installScreenProps
      } = this.state;

      var _this$props = this.props,
          {
        screenProps: dynamicScreenProps
      } = _this$props,
          others = _objectWithoutPropertiesLoose(_this$props, ["screenProps"]);

      return _react.default.createElement(ScreenComponent, _extends({}, others, {
        screenProps: _extends({}, dynamicScreenProps, {}, installScreenProps)
      }));
    }

  }, _temp);

  if (ScreenComponent.router) {
    ThroughComponent.router = ScreenComponent.router;
  }

  return ThroughComponent;
}

function _default(config, navigator) {
  if (navigator === void 0) {
    navigator = _router.default;
  }

  var creator = {
    children: _reactNavigation.createStackNavigator,
    all: _reactNavigation.createBottomTabNavigator,
    oneOf: _reactNavigation.createSwitchNavigator,
    app: _reactNavigation.createAppContainer
  };

  var map = function map(route) {
    var {
      name,
      component,
      app,
      injectNavigationOptions = false,
      navigationOptions,
      routerConfig,
      screenProps
    } = route;
    var prop = ["children", "all", "oneOf", "app"].find(j => !!route[j]);

    if (!name && app !== true) {
      throw new Error("navigation config missing name.");
    }

    if (prop && Array.isArray(route[prop]) && route[prop].length) {
      var routeConfigs = {};

      for (var i of route[prop]) {
        Object.assign(routeConfigs, map(i, creator[prop]));
      }

      var navigation = creator[prop](routeConfigs, routerConfig);
      var ScreenComponent = navigation;
      var screen = through(navigator ? navigator.getStore() : null, screenProps, ScreenComponent);

      if (app === true) {
        return creator["app"](inject(injectNavigationOptions, navigationOptions, screen));
      } else {
        return {
          [name]: (0, _common.removeEmpty)({
            screen: inject(injectNavigationOptions, navigationOptions, screen),
            navigationOptions: injectNavigationOptions ? null : navigationOptions
          })
        };
      }
    } else {
      if (!component) {
        throw new Error("navigation config missing component.");
      }

      var _ScreenComponent = component;

      var _screen = through(navigator ? navigator.getStore() : null, screenProps, _ScreenComponent);

      return {
        [name]: (0, _common.removeEmpty)({
          screen: inject(injectNavigationOptions, navigationOptions, _screen),
          navigationOptions: injectNavigationOptions ? {
            header: null
          } : navigationOptions
        })
      };
    }
  };

  return map(config);
}
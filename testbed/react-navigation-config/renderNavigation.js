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

var creator = {
  children: _reactNavigation.createStackNavigator,
  all: _reactNavigation.createBottomTabNavigator,
  oneOf: _reactNavigation.createSwitchNavigator,
  drawer: _reactNavigation.createDrawerNavigator,
  app: _reactNavigation.createAppContainer
};

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
  var ThroughComponent = class extends _react.default.Component {
    constructor() {
      super(...arguments);

      if (store) {
        this.observer = new _common.ObserveStore(store, (state, call) => {
          var {
            navigation
          } = this.props;
          var {
            key
          } = navigation.state;
          var {
            screenProps: collection
          } = state;

          if (Object.hasOwnProperty.call(collection, key)) {
            if (typeof call === "function") {
              call((0, _common.getScreenPropsFormCollection)(key, collection));
            }
          }
        }, channel => {
          this.state = _extends({}, this.state, {
            channel
          });
        });
      }
    }

    componentDidMount() {
      if (this.observer) {
        this.observer.start(channel => {
          this.setState({
            channel
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
        channel
      } = this.state;

      var _this$props = this.props,
          {
        screenProps: dynamicScreenProps
      } = _this$props,
          others = _objectWithoutPropertiesLoose(_this$props, ["screenProps"]);

      return _react.default.createElement(ScreenComponent, _extends({}, others, {
        screenProps: _extends({}, screenProps, {}, dynamicScreenProps, {}, channel)
      }));
    }

  };

  if (ScreenComponent.router) {
    ThroughComponent.router = ScreenComponent.router;
  }

  return ThroughComponent;
}

var map = function map(route, navigator) {
  var {
    component,
    app,
    injectNavigationOptions = false,
    navigationOptions,
    routerConfig,
    screenProps,
    path,
    creator: customCreator = null
  } = route;
  var {
    name
  } = route;
  var prop = ["children", "all", "oneOf", "drawer", "app"].find(j => !!route[j]);

  if (app !== true && !name) {
    name = "anonymous-" + (0, _common.randomString)(8) + "-" + Date.now();
  }

  if (!name && app !== true) {
    throw new Error("navigation config missing name.");
  }

  if (prop && Array.isArray(route[prop]) && route[prop].length) {
    var routeConfigs = {};

    for (var i of route[prop]) {
      Object.assign(routeConfigs, map(i, navigator));
    }

    var containerCreator;

    if (typeof customCreator === "function") {
      containerCreator = customCreator;
    } else {
      containerCreator = creator[prop];
    }

    var navigation = containerCreator(routeConfigs, routerConfig);
    var ScreenComponent = navigation;
    var screen = through(navigator ? navigator.getStore() : null, screenProps, ScreenComponent);

    if (app === true) {
      return creator["app"](inject(injectNavigationOptions, navigationOptions, screen));
    } else {
      return {
        [name]: (0, _common.removeEmpty)({
          screen: inject(injectNavigationOptions, navigationOptions, screen),
          path,
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
        path,
        navigationOptions: injectNavigationOptions ? {
          header: null
        } : navigationOptions
      })
    };
  }
};

function _default(config, navigator) {
  if (navigator === void 0) {
    navigator = _router.default;
  }

  return map(config, navigator);
}
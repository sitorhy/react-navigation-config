"use strict";

exports.__esModule = true;
exports.linkNavigatorProvider = linkNavigatorProvider;
exports.default = _default;

var _react = _interopRequireWildcard(require("react"));

var _reactNavigation = require("react-navigation");

var _router = _interopRequireDefault(require("./router"));

var decorators = _interopRequireWildcard(require("./decorators"));

var _common = require("./common");

var _actions = require("./actions");

var _reactNavigationStack = require("react-navigation-stack");

var _reactNavigationDrawer = require("react-navigation-drawer");

var _reactNavigationTabs = require("react-navigation-tabs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var creator = {
  children: _reactNavigationStack.createStackNavigator,
  all: _reactNavigationTabs.createBottomTabNavigator,
  oneOf: _reactNavigation.createSwitchNavigator,
  drawer: _reactNavigationDrawer.createDrawerNavigator,
  app: _reactNavigation.createAppContainer
};

function linkNavigatorProvider(type, provider) {
  creator[type] = provider;
}

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
  var ThroughComponent = class extends _react.Component {
    constructor(props) {
      super(props);
      var key = props.navigation.state.key;

      if (store) {
        this.observer = new _common.ObserveStore(store, state => {
          var channelModule = (0, _common.getChannelModule)(state);
          var channel = (0, _common.getScreenPropsFromChannelModule)(key, channelModule);
          this.state = _extends({}, this.state, {
            channel
          });
          return channel;
        });
      }
    }

    componentDidMount() {
      if (this.observer) {
        this.observer.start((state, call) => {
          var {
            navigation
          } = this.props;
          var {
            key
          } = navigation.state;
          var channelModule = (0, _common.getChannelModule)(state);

          if (!(!Object.hasOwnProperty.call(channelModule, key) && this.state.channel === undefined) && typeof call === "function") {
            call((0, _common.getScreenPropsFromChannelModule)(key, channelModule));
          }
        }, channel => {
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
        store.dispatch((0, _actions.uninstallChannel)(key));
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

      return /*#__PURE__*/_react.default.createElement(ScreenComponent, _extends({}, others, {
        screenProps: _extends({}, screenProps, dynamicScreenProps, channel)
      }));
    }

  };

  if (ScreenComponent.router) {
    ThroughComponent.router = ScreenComponent.router;
  }

  if (ScreenComponent.navigationOptions) {
    ThroughComponent.navigationOptions = ScreenComponent.navigationOptions;
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
    use
  } = route;
  var {
    name
  } = route;
  var prop = ["children", "all", "oneOf", "drawer"].find(j => !!route[j]);

  if (app !== true && !name) {
    name = "anonymous-" + (0, _common.randomString)(8) + "-" + Date.now();
    route.name = name;
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

    if (typeof use === "function") {
      containerCreator = use;
    } else {
      containerCreator = creator[prop];
    }

    if (!containerCreator) {
      throw new Error("unidentified navigator provider");
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
        }, {
          omitEmptyString: true
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
      }, {
        omitEmptyString: true
      })
    };
  }
};

function _default(config, navigator) {
  if (navigator === void 0) {
    navigator = _router.default;
  }

  if (navigator) {
    navigator._setRoutes(config);
  }

  return map(config, navigator);
}
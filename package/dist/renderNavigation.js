"use strict";

exports.__esModule = true;
exports.default = _default;

var _reactNavigation = require("react-navigation");

var decorators = _interopRequireWildcard(require("./decorators"));

var _common = require("./common");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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

function _default(config) {
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
      routerConfig
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
      return app === true ? creator["app"](inject(injectNavigationOptions, navigationOptions, navigation)) : {
        [name]: (0, _common.removeEmpty)({
          screen: inject(injectNavigationOptions, navigationOptions, navigation),
          navigationOptions: injectNavigationOptions ? null : navigationOptions
        })
      };
    } else {
      if (!component) {
        throw new Error("navigation config missing component.");
      }

      return {
        [name]: (0, _common.removeEmpty)({
          screen: inject(injectNavigationOptions, navigationOptions, component),
          navigationOptions: injectNavigationOptions ? {
            header: null
          } : navigationOptions
        })
      };
    }
  };

  return map(config);
}
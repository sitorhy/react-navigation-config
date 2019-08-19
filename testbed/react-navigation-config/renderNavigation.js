"use strict";

exports.__esModule = true;
exports.default = _default;

var _react = _interopRequireDefault(require("react"));

var _reactNavigation = require("react-navigation");

var decorators = _interopRequireWildcard(require("./decorators"));

var _common = require("./common");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

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

      if (app === true) {
        return creator["app"](inject(injectNavigationOptions, navigationOptions, navigation));
      } else {
        var Screen = inject(injectNavigationOptions, navigationOptions, navigation);
        return {
          [name]: (0, _common.removeEmpty)({
            screen: screenProps ? props => {
              var {
                screenProps: dynamicScreenProps
              } = props,
                  others = _objectWithoutPropertiesLoose(props, ["screenProps"]);

              return _react.default.createElement(Screen, _extends({}, others, {
                screenProps: _extends({}, screenProps, {}, dynamicScreenProps)
              }));
            } : Screen,
            navigationOptions: injectNavigationOptions ? null : navigationOptions
          })
        };
      }
    } else {
      if (!component) {
        throw new Error("navigation config missing component.");
      }

      var _Screen = inject(injectNavigationOptions, navigationOptions, component);

      return {
        [name]: (0, _common.removeEmpty)({
          screen: screenProps ? props => {
            var {
              screenProps: dynamicScreenProps
            } = props,
                others = _objectWithoutPropertiesLoose(props, ["screenProps"]);

            return _react.default.createElement(_Screen, _extends({}, others, {
              screenProps: _extends({}, screenProps, {}, dynamicScreenProps)
            }));
          } : _Screen,
          navigationOptions: injectNavigationOptions ? {
            header: null
          } : navigationOptions
        })
      };
    }
  };

  return map(config);
}
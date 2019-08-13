"use strict";

exports.__esModule = true;
exports.default = _default;
exports.SimpleNavigation = void 0;

var _reactNavigation = require("react-navigation");

var _common = require("./common");

class SimpleNavigation {
  static wrappedNavigationRef(AppContainerClass, ref) {
    if (ref === void 0) {
      ref = () => {};
    }

    return class extends AppContainerClass {
      constructor() {
        super(...arguments);
        ref(new SimpleNavigation(this));
      }

    };
  }

  constructor(navigator) {
    this.setNavigator(navigator);
  }

  setNavigator(navigator) {
    this.navigator = navigator;
  }

  getParams() {
    var {
      state: {
        params
      }
    } = this.navigator;
    console.log(this.navigator);
    return params;
  }

  reLaunch() {}

  redirectTo() {}

  navigateTo(routeName, params, action) {
    if (action === void 0) {
      action = null;
    }

    this.navigator.dispatch(_reactNavigation.NavigationActions.navigate((0, _common.removeEmpty)({
      routeName,
      params,
      action
    })));
  }

  navigateBack() {}

}

exports.SimpleNavigation = SimpleNavigation;

function _default() {
  return SimpleNavigation.wrappedNavigationRef(...arguments);
}
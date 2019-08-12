"use strict";

exports.__esModule = true;
exports.default = _default;

class Navigator {
  _connect(navigator) {
    this.navigator = navigator;
  }

  switchTab() {}

  reLaunch() {}

  redirectTo() {}

  navigateTo() {}

  navigateBack() {}

}

function _default(AppContainer, acceptNavigator) {
  var navigator = new Navigator();
  var wrappedAppContainer = class extends AppContainer {
    constructor() {
      navigator._connect(this);
    }

  };
}
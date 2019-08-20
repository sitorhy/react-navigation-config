"use strict";

exports.__esModule = true;
exports.default = _default;

var _react = _interopRequireWildcard(require("react"));

var _router = _interopRequireDefault(require("./router"));

var _common = require("./common");

var _store = require("./store");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _default(AppContainer, navigator) {
  var _temp;

  if (navigator === void 0) {
    navigator = _router.default;
  }

  var WrappedAppContainer = class extends AppContainer {
    constructor() {
      super(...arguments);

      if (navigator) {
        navigator._setNavigator(this);
      }
    }

  };

  if (navigator) {
    WrappedAppContainer.router = {
      getActionCreators: AppContainer.router.getActionCreators,
      getActionForPathAndParams: AppContainer.router.getActionForPathAndParams,
      getComponentForRouteName: AppContainer.router.getComponentForRouteName,
      getComponentForState: AppContainer.router.getComponentForState,
      getPathAndParamsForState: AppContainer.router.getPathAndParamsForState,
      getScreenOptions: AppContainer.router.getScreenOptions,
      getStateForAction: AppContainer.router.getStateForAction
    };

    AppContainer.router.getActionCreators = function (route, stateKey) {
      return WrappedAppContainer.router.getActionCreators(route, stateKey);
    };

    AppContainer.router.getActionForPathAndParams = function (path, params) {
      return WrappedAppContainer.router.getActionForPathAndParams(path, params);
    };

    AppContainer.router.getComponentForRouteName = function (routeName) {
      return WrappedAppContainer.router.getComponentForRouteName(routeName);
    };

    AppContainer.router.getComponentForState = function (state) {
      return WrappedAppContainer.router.getComponentForState(state);
    };

    AppContainer.router.getPathAndParamsForState = function (state) {
      return WrappedAppContainer.router.getPathAndParamsForState(state);
    };

    AppContainer.router.getScreenOptions = function (navigation, screenProps) {
      return WrappedAppContainer.router.getScreenOptions(navigation, screenProps);
    };

    AppContainer.router.getStateForAction = function (action, inputState) {
      var {
        type
      } = action;

      switch (type) {
        case "Navigation/INIT":
          {
            navigator._bindReady();
          }
      }

      var state = WrappedAppContainer.router.getStateForAction(action, inputState);

      if (inputState) {
        var nextAction = navigator._bindBeforeEach(action, state, inputState);

        if (nextAction) {
          state = WrappedAppContainer.router.getStateForAction(nextAction, inputState);
        }
      }

      var activeRoute = (0, _common.getActiveRoute)(state);
      var {
        key,
        routeName
      } = activeRoute;
      var store = navigator.getStore();
      store.dispatch({
        type: _store.ACTIONS.SET_ROUTE_KEY,
        key
      });
      store.dispatch({
        type: _store.ACTIONS.SET_ROUTE_NAME,
        routeName
      });

      switch (type) {
        case "Navigation/REPLACE":
        case "Navigation/PUSH":
        case "Navigation/NAVIGATE":
          {
            var {
              stage
            } = store.getState();
            var {
              screenProps
            } = stage;
          }
      }

      return state;
    };
  }

  return _temp = class extends _react.default.Component {
    constructor() {
      super(...arguments);

      _defineProperty(this, "_observers", []);

      _defineProperty(this, "onNavigationStateChange", (prevState, newState, action) => {
        var {
          onNavigationStateChange
        } = this.props;
        var {
          params,
          routeName
        } = action;

        switch (action.type) {
          case "Navigation/NAVIGATE":
            {
              navigator._bindAfterEach(action, prevState, newState);
            }

          default:
            {
              this._observers.splice(0, this._observers.length).forEach((_ref) => {
                var {
                  callback
                } = _ref;
                callback({
                  params,
                  routeName
                });
              });
            }
        }

        if (typeof onNavigationStateChange === "function") {
          onNavigationStateChange(prevState, newState, action);
        }
      });

      if (navigator) {
        navigator._setContainer(this);
      }
    }

    _listen(observer) {
      this._observers.push(observer);
    }

    _remove(id) {
      var index = this._observers.findIndex(i => i.id === id);

      if (index >= 0) {
        this._observers.splice(index, 1);
      }
    }

    componentWillUnmount() {
      if (navigator) {
        navigator._setContainer(null);

        navigator._setNavigator(null);

        navigator.onReady(null);
        navigator.beforeEach(null);
        navigator.afterEach(null);
      }
    }

    render() {
      var {
        uriPrefix
      } = this.props;
      return _react.default.createElement(_react.Fragment, null, _react.default.createElement(WrappedAppContainer, {
        uriPrefix: uriPrefix,
        onNavigationStateChange: this.onNavigationStateChange
      }));
    }

  }, _temp;
}
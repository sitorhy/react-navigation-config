"use strict";

exports.__esModule = true;
exports.default = _default;

var _react = _interopRequireDefault(require("react"));

var _router = _interopRequireDefault(require("./router"));

var _common = require("./common");

var _actions = require("./actions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _default(AppContainer, navigator, options) {
  var _temp;

  if (navigator === void 0) {
    navigator = _router.default;
  }

  if (options === void 0) {
    options = {};
  }

  var {
    channelActions
  } = options || {};
  var WrappedAppContainer = class extends AppContainer {
    constructor(props) {
      super(props);

      this._bindNavigator();
    }

    _bindNavigator() {
      if (navigator) {
        navigator._setNavigator(this);
      }
    }

    _unbindNavigator() {
      if (navigator) {
        navigator._setNavigator(null);
      }
    }

    componentDidMount() {
      this._bindNavigator();

      super.componentDidMount();
    }

    componentWillUnmount() {
      this._unbindNavigator();

      super.componentWillUnmount();
    }

  };
  AppContainer.CHANNEL_ACTIONS = channelActions || _common.DEFAULT_CHANNEL_ACTIONS;

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

    AppContainer.router.getPathAndParamsForState = function (state) {
      return WrappedAppContainer.router.getPathAndParamsForState(state);
    };

    AppContainer.router.getActionForPathAndParams = function (path, params) {
      var action = WrappedAppContainer.router.getActionForPathAndParams(path, params);

      if (action) {
        var nextAction = navigator._bindBeforeResolve(action, path, params);

        if (nextAction !== null && nextAction !== undefined) {
          if (nextAction === false) {
            return null;
          }

          return nextAction;
        }
      }

      return action;
    };

    AppContainer.router.getComponentForRouteName = function (routeName) {
      return WrappedAppContainer.router.getComponentForRouteName(routeName);
    };

    AppContainer.router.getComponentForState = function (state) {
      return WrappedAppContainer.router.getComponentForState(state);
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
          break;
      }

      var state = WrappedAppContainer.router.getStateForAction(action, inputState);

      if (inputState && state) {
        var nextAction = navigator._bindBeforeEach(action, state, inputState);

        if (nextAction !== null && nextAction !== undefined) {
          if (nextAction === false) {
            return null;
          }

          state = WrappedAppContainer.router.getStateForAction(nextAction, inputState);
        }
      }

      if (state) {
        var activeRoute = (0, _common.getActiveRoute)(state);
        var {
          key,
          routeName
        } = activeRoute;
        var store = navigator.getStore();
        store.dispatch((0, _actions.setNavigationRouteKey)(key));
        store.dispatch((0, _actions.setNavigationRouteName)(routeName));

        if (AppContainer.CHANNEL_ACTIONS.includes(type)) {
          var _state = store.getState();

          var channel = (0, _common.getChannelFromStageModule)((0, _common.getStageModule)(_state));

          if (channel) {
            store.dispatch((0, _actions.installChannel)(key, channel));
          }
        }

        store.dispatch((0, _actions.dumpChannel)());
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

      this._bindContainer();
    }

    _bindContainer() {
      if (navigator) {
        navigator._setContainer(this);
      }
    }

    _unbindContainer() {
      if (navigator) {
        navigator._setContainer(null);
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

    componentDidMount() {
      this._bindContainer();
    }

    componentWillUnmount() {
      if (navigator) {
        navigator.onReady(null);
        navigator.beforeEach(null, null);
        navigator.afterEach(null);

        navigator._setRoutes([]);
      }

      this._unbindContainer();
    }

    render() {
      var {
        uriPrefix,
        enableURLHandling = true
      } = this.props;
      return _react.default.createElement(WrappedAppContainer, {
        enableURLHandling: enableURLHandling,
        uriPrefix: uriPrefix,
        onNavigationStateChange: this.onNavigationStateChange
      });
    }

  }, _temp;
}
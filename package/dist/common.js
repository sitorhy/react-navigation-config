"use strict";

exports.__esModule = true;
exports.pathToRegex = pathToRegex;
exports.addContainerEventListener = addContainerEventListener;
exports.removeContainerEventListener = removeContainerEventListener;
exports.rewriteAction = rewriteAction;
exports.getDeepestActionState = getDeepestActionState;
exports.mergeActionParams = mergeActionParams;
exports.removeEmpty = removeEmpty;
exports.routeFind = routeFind;
exports.randomString = randomString;
exports.uuid = uuid;
exports.getNavState = getNavState;
exports.mergeChannel = mergeChannel;
exports.getActiveRoute = getActiveRoute;
exports.matchRoute = matchRoute;
exports.matchRouteParent = matchRouteParent;
exports.getScreenPropsFromChannelModule = getScreenPropsFromChannelModule;
exports.getChannelModule = getChannelModule;
exports.getKeyFromNavigationModule = getKeyFromNavigationModule;
exports.getNameFromNavigationModule = getNameFromNavigationModule;
exports.getNavigationModule = getNavigationModule;
exports.getStageModule = getStageModule;
exports.getChannelFromStageModule = getChannelFromStageModule;
exports.ObserveStore = exports.CONTAINER_EVENT = exports.DEFAULT_CHANNEL_ACTIONS = exports.BACKWARD_ACTIONS = exports.DEFAULT_IGNORE_ACTIONS = void 0;

var _reactNavigation = require("react-navigation");

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DEFAULT_IGNORE_ACTIONS = ["Navigation/COMPLETE_TRANSITION", "Navigation/BACK", "Navigation/OPEN_DRAWER", "Navigation/MARK_DRAWER_SETTLING", "Navigation/MARK_DRAWER_IDLE", "Navigation/DRAWER_OPENED", "Navigation/CLOSE_DRAWER", "Navigation/DRAWER_CLOSED", "Navigation/TOGGLE_DRAWER", "Navigation/SET_PARAMS", "Navigation/RESET", "Navigation/POP", "Navigation/POP_TO_TOP"];
exports.DEFAULT_IGNORE_ACTIONS = DEFAULT_IGNORE_ACTIONS;
var BACKWARD_ACTIONS = ["Navigation/BACK", "Navigation/POP", "Navigation/POP_TO_TOP"];
exports.BACKWARD_ACTIONS = BACKWARD_ACTIONS;
var DEFAULT_CHANNEL_ACTIONS = ["Navigation/REPLACE", "Navigation/PUSH", "Navigation/NAVIGATE", "Navigation/POP", "Navigation/POP_TO_TOP", "Navigation/BACK", "Navigation/OPEN_DRAWER", "Navigation/CLOSE_DRAWER", "Navigation/TOGGLE_DRAWER", "Navigation/RESET"];
exports.DEFAULT_CHANNEL_ACTIONS = DEFAULT_CHANNEL_ACTIONS;
var CONTAINER_EVENT = {
  STATE_CHANGE: "STATE_CHANGE"
};
exports.CONTAINER_EVENT = CONTAINER_EVENT;

function pathToRegex(path) {
  if (path === void 0) {
    path = "";
  }

  var str = path.replace(/:[^/:]+/g, "(.+)");
  return new RegExp(str);
}

function addContainerEventListener(container, options) {
  if (options === void 0) {
    options = {};
  }

  container._listen({
    type: options.type || CONTAINER_EVENT.STATE_CHANGE,
    id: options.id || uuid(),
    callback: options.callback
  });
}

function removeContainerEventListener(container, _ref) {
  var {
    id
  } = _ref;

  container._remove(id);
}

function _overrideRewriteAction(options) {
  if (options === void 0) {
    options = {};
  }

  var {
    action,
    routeName,
    params,
    routeKey
  } = options;

  var basicAction = _reactNavigation.NavigationActions.navigate(_extends({
    routeName
  }, params === undefined ? {} : {
    params
  }, removeEmpty({
    key: routeKey
  })));

  return _extends({}, basicAction, action);
}

function rewriteAction(routeNameOrOptions, options) {
  if (arguments.length > 1) {
    return _overrideRewriteAction(_extends({
      routeName: routeNameOrOptions
    }, options));
  } else {
    return _overrideRewriteAction(routeNameOrOptions);
  }
}

function getDeepestActionState(resolveAction) {
  if (resolveAction.action) {
    var next = getDeepestActionState(resolveAction.action);

    if (next) {
      return next;
    }
  }

  return resolveAction;
}

function _mergeActionParams(action, result) {
  if (action) {
    var {
      params,
      action: nextAction
    } = action;

    if (params) {
      Object.assign(result, params);
    }

    if (nextAction) {
      _mergeActionParams(nextAction, result);
    }
  }
}

function mergeActionParams(action) {
  var result = {};

  _mergeActionParams(action, result);

  return result;
}

function removeEmpty(obj, options) {
  if (options === void 0) {
    options = {};
  }

  if (!obj) {
    return obj;
  }

  var omitZero = true;
  var omitEmptyString = false;

  if (options && typeof options.omitZero === "boolean") {
    omitZero = options.omitZero;
  }

  if (options && typeof options.omitEmptyString === "boolean") {
    omitEmptyString = options.omitEmptyString;
  }

  var ignore = options.ignore || [];
  var accepts = {};
  Object.keys(obj).forEach(key => {
    if (ignore.includes(key)) {
      accepts[key] = obj[key];
    } else {
      if (!(obj[key] === null || obj[key] === undefined || obj[key] === "" && !omitEmptyString || obj[key] === 0 && !omitZero)) {
        accepts[key] = obj[key];
      }
    }
  });
  return accepts;
}

function _findRoute(route, config) {
  var {
    forKey,
    value,
    match,
    getResult
  } = config;
  var prop = ["children", "all", "oneOf", "drawer"].find(j => !!route[j]);

  if (Array.isArray(route[prop])) {
    for (var i of route[prop]) {
      var j = _findRoute(i, config);

      if (j) {
        return j;
      }
    }
  }

  if (route.hasOwnProperty(forKey)) {
    if (typeof match === "function") {
      if (match(route, forKey, route[forKey])) {
        return getResult(route);
      }
    } else {
      if (route[forKey] === value) {
        return getResult(route);
      }
    }
  }

  return undefined;
}

function routeFind(route, config) {
  if (route === void 0) {
    route = {};
  }

  if (config === void 0) {
    config = {};
  }

  var _cfg = _extends({
    forKey: "name",
    value: undefined,
    match: null,
    getResult: r => r
  }, config);

  return _findRoute(route, _cfg);
}

var uuid_chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
var random_chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";

function randomString(len) {
  len = len || 32;
  var maxPos = random_chars.length;
  var pwd = "";

  for (var i = 0; i < len; i++) {
    pwd += random_chars.charAt(Math.floor(Math.random() * maxPos));
  }

  return pwd;
}

function uuid(len, radix) {
  var uuid = [];
  var i;
  radix = radix || uuid_chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) {
      uuid[i] = uuid_chars[0 | Math.random() * radix];
    }
  } else {
    // rfc4122, version 4 form
    var r; // rfc4122 requires these characters

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4"; // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = uuid_chars[i == 19 ? r & 0x3 | 0x8 : r];
      }
    }
  }

  return uuid.join("");
}

function _getState(nav, mergeParams, scopeParams) {
  var {
    routes,
    index,
    params
  } = nav;
  var state = null;

  if (Array.isArray(routes) && routes.length && index !== undefined && index !== null) {
    state = _getState(routes[index], mergeParams, scopeParams) || routes[index];

    if (state.params) {
      if (scopeParams[state.routeName]) {
        scopeParams[state.routeName] = _extends({}, scopeParams[state.routeName], {
          [state.key]: state.params
        });
      } else {
        scopeParams[state.routeName] = {
          [state.key]: state.params
        };
      }

      scopeParams[state.routeName].common = _extends({}, scopeParams[state.routeName].common, state.params);
    }
  }

  Object.assign(mergeParams, params);
  return state;
}

function getNavState(nav) {
  var params = {};
  var scopeParams = {};

  _getState(nav, params, scopeParams);

  return [params, scopeParams];
}

function mergeChannel(channelModule) {
  var channels = {};
  var scopeChannels = {};
  Object.keys(channelModule).map(key => {
    var module = channelModule[key];
    Object.assign(scopeChannels, {
      [key]: module.channel
    });
    return module;
  }).sort((i, j) => {
    return i.timestamp - j.timestamp;
  }).forEach(module => {
    var {
      channel
    } = module;
    Object.assign(channels, channel);
  });
  return [channels, scopeChannels];
}

function getActiveRoute(nav) {
  var {
    routes,
    index
  } = nav;

  if (index === null || index === undefined) {
    return null;
  }

  if (Array.isArray(routes) && routes.length) {
    var activeRoute = getActiveRoute(routes[index]);

    if (activeRoute === null) {
      return routes[index];
    } else {
      return activeRoute;
    }
  }

  return null;
}

function matchRoute(nav, key) {
  var {
    routes,
    key: routeKey
  } = nav;

  if (routeKey === key) {
    return nav;
  }

  if (Array.isArray(routes) && routes.length) {
    for (var i of routes) {
      var j = matchRoute(i, key);

      if (j) {
        return j;
      }
    }
  }

  return null;
}

function _matchRouteParent(key, nav, parent) {
  var {
    routes,
    key: routeKey
  } = nav;

  if (routeKey === key) {
    return {
      current: nav,
      parent
    };
  }

  if (Array.isArray(routes) && routes.length) {
    for (var i of routes) {
      var j = _matchRouteParent(key, i, nav);

      if (j) {
        return j;
      }
    }
  }

  return null;
}

function matchRouteParent(nav, key) {
  return _matchRouteParent(key, nav, null);
}

class ObserveStore {
  constructor(store, onCreate) {
    this.store = store;

    if (typeof onCreate === "function") {
      this.currentState = onCreate(store.getState());
    }
  }

  start(select, onChange) {
    this.unsubscribe = this.store.subscribe(() => {
      if (this.unsubscribe) {
        select(this.store.getState(), nextState => {
          if (nextState !== this.currentState) {
            this.currentState = nextState;
            onChange(this.currentState);
          }
        });
      }
    });
  }

  dispose() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    this.store = null;
    this.unsubscribe = null;
    this.currentState = null;
  }

}

exports.ObserveStore = ObserveStore;

function getScreenPropsFromChannelModule(key, state) {
  if (!state) {
    return null;
  }

  var module = state[key];
  if (!module) return undefined;

  var _module$channel = module.channel,
      channel = _objectWithoutPropertiesLoose(_module$channel, ["timestamp"]);

  return channel;
}

function getChannelModule(state) {
  return state.channels;
}

function getKeyFromNavigationModule(state) {
  if (!state) {
    return null;
  }

  return state.key;
}

function getNameFromNavigationModule(state) {
  if (!state) {
    return null;
  }

  return state.routeName;
}

function getNavigationModule(state) {
  return state.navigation;
}

function getStageModule(state) {
  return state.stage;
}

function getChannelFromStageModule(state) {
  if (!state) {
    return null;
  }

  return state.channel;
}
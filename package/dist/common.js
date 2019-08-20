"use strict";

exports.__esModule = true;
exports.removeEmpty = removeEmpty;
exports.uuid = uuid;
exports.getNavState = getNavState;
exports.getActiveRoute = getActiveRoute;
exports.matchRoute = matchRoute;
exports.ObserveStore = void 0;

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function removeEmpty(obj, options) {
  if (options === void 0) {
    options = {};
  }

  if (!obj) {
    return obj;
  }

  var omitZero = options.omitZero === true;
  var ignore = options.ignore || [];
  var accepts = {};
  Object.keys(obj).forEach(key => {
    if (ignore.includes(key)) {
      accepts[key] = obj[key];
    } else {
      if (!(obj[key] === null || obj[key] === undefined || obj[key] === 0 && omitZero)) {
        accepts[key] = obj[key];
      }
    }
  });
  return accepts;
}

function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [],
      i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | Math.random() * radix];
    }
  } else {
    // rfc4122, version 4 form
    var r; // rfc4122 requires these characters

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4'; // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

function _get(nav, mergeParams, scopeParams) {
  var {
    routes,
    index,
    params
  } = nav;
  var state = null;

  if (Array.isArray(routes) && routes.length && index !== undefined && index !== null) {
    state = _get(routes[index], mergeParams, scopeParams) || routes[index];

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

      scopeParams[state.routeName].common = _extends({}, scopeParams[state.routeName].common, {}, state.params);
    }
  }

  Object.assign(mergeParams, params);
  return state;
}

function getNavState(nav) {
  var params = {};
  var scopeParams = {};

  _get(nav, params, scopeParams);

  return [params, scopeParams];
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

class ObserveStore {
  constructor(store, select, onCreate) {
    this.select = select;
    this.store = store;
    this.currentState = select(store.getState());

    if (typeof onCreate === "function") {
      onCreate(this.currentState);
    }
  }

  start(onChange) {
    this.dispose = this.store.subscribe(() => {
      if (this.store) {
        var nextState = this.select(this.store.getState());

        if (nextState !== this.currentState) {
          this.currentState = nextState;
          onChange(this.currentState);
        }
      }
    });
  }

  unsubscribe() {
    if (this.dispose) {
      this.dispose();
    }

    this.store = null;
    this.dispose = null;
    this.select = null;
    this.currentState = null;
  }

}

exports.ObserveStore = ObserveStore;
"use strict";

exports.__esModule = true;
exports.setNavigationRouteKey = setNavigationRouteKey;
exports.setNavigationRouteName = setNavigationRouteName;
exports.depositChannel = depositChannel;
exports.dumpChannel = dumpChannel;
exports.installChannel = installChannel;
exports.uninstallChannel = uninstallChannel;

var _store = require("./store");

function setNavigationRouteKey(key) {
  return {
    type: _store.ACTIONS.SET_ROUTE_KEY,
    key
  };
}

function setNavigationRouteName(routeName) {
  return {
    type: _store.ACTIONS.SET_ROUTE_NAME,
    routeName
  };
}

function depositChannel(channel) {
  return {
    type: _store.ACTIONS.DEPOSIT_CHANNEL,
    channel
  };
}

function dumpChannel() {
  return {
    type: _store.ACTIONS.DUMP_CHANNEL
  };
}

function installChannel(key, channel) {
  return {
    type: _store.ACTIONS.INSTALL_CHANNEL,
    key,
    channel
  };
}

function uninstallChannel(key) {
  return {
    type: _store.ACTIONS.UNINSTALL_CHANNEL,
    key
  };
}
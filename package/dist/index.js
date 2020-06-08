"use strict";

exports.__esModule = true;
exports.linkNavigatorProvider = exports.Navigator = exports.wrappedNavigatorRef = exports.renderNavigation = exports.filterNavigation = void 0;

var _filterNavigation2 = _interopRequireDefault(require("./filterNavigation"));

var _renderNavigation2 = _interopRequireWildcard(require("./renderNavigation"));

var _navigator = _interopRequireDefault(require("./navigator"));

var _router = require("./router");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var filterNavigation = _filterNavigation2.default;
exports.filterNavigation = filterNavigation;
var renderNavigation = _renderNavigation2.default;
exports.renderNavigation = renderNavigation;
var wrappedNavigatorRef = _navigator.default;
exports.wrappedNavigatorRef = wrappedNavigatorRef;
var Navigator = _router.Navigator;
exports.Navigator = Navigator;
var linkNavigatorProvider = _renderNavigation2.linkNavigatorProvider;
exports.linkNavigatorProvider = linkNavigatorProvider;
"use strict";

exports.__esModule = true;
exports.linkNavigatorProvider = exports.Navigator = exports.wrappedNavigatorRef = exports.renderNavigation = exports.filterNavigation = void 0;

var _filterNavigation2 = _interopRequireDefault(require("./filterNavigation"));

var _renderNavigation2 = _interopRequireWildcard(require("./renderNavigation"));

var _navigator = _interopRequireDefault(require("./navigator"));

var _router = require("./router");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

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
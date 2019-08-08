var _interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard");var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:true});exports.default=_default;var _extends2=_interopRequireDefault(require("@babel/runtime/helpers/extends"));var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));var _reactNavigation=require("react-navigation");var decorators=_interopRequireWildcard(require("./decorators"));var _common=require("./common");function _default(config){var creator={children:_reactNavigation.createStackNavigator,all:_reactNavigation.createBottomTabNavigator,oneOf:_reactNavigation.createSwitchNavigator,app:_reactNavigation.createAppContainer};var map=function map(route){var name=route.name,component=route.component,app=route.app,injectNavigationOptions=route.injectNavigationOptions,navigationOptions=route.navigationOptions,routerConfig=route.routerConfig;var prop=["children","all","oneOf","app"].find(function(j){return!!route[j];});if(!name&&app!==true){throw new Error("navigation config missing name.");}if(prop&&Array.isArray(route[prop])&&route[prop].length){var routeConfigs={};for(var _iterator=route[prop],_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[typeof Symbol==="function"?Symbol.iterator:"@@iterator"]();;){var _ref;if(_isArray){if(_i>=_iterator.length)break;_ref=_iterator[_i++];}else{_i=_iterator.next();if(_i.done)break;_ref=_i.value;}var _i2=_ref;(0,_extends2.default)(routeConfigs,map(_i2,creator[prop]));}return app===true?creator["app"](creator[prop](routeConfigs,routerConfig)):(0,_defineProperty2.default)({},name,{screen:creator[prop](routeConfigs,routerConfig)});}else{if(!component){throw new Error("navigation config missing component.");}var screen=component;if(injectNavigationOptions===true){screen.navigationOptions=navigationOptions;}else{if(injectNavigationOptions==="extend"){screen=decorators.navigationOptions(navigationOptions)(component);}}return(0,_defineProperty2.default)({},name,(0,_common.removeEmpty)({screen:screen,navigationOptions:injectNavigationOptions===true?null:navigationOptions}));}};return map(config);}
//# sourceMappingURL=renderNavigation.js.map
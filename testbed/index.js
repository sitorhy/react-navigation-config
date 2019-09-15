/**
 * @format
 */

import React from "react";
import { AppRegistry, View, Text } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

import { createAppContainer, createSwitchNavigator } from "react-navigation";

import { createBottomTabNavigator } from "react-navigation-tabs";

import { renderNavigation } from "./react-navigation-config";

import { Tab1, Tab3, Tab2, Login } from "./testComponents";
// import { TestRouter } from "./router";

const Home = createBottomTabNavigator({
  tab1: {
    screen: Tab1,
    path: "home"
  },
  tab2: {
    screen: Tab2,
    path: "mine/:user"
  },
  tab3: {
    screen: Tab3,
    path: "setting"
  }
});

const Main = createSwitchNavigator({
  main: {
    screen: Home,
    path: "main"
  },
  login: {
    screen: Login,
    path: "login"
  }
});

const AppContainer = createAppContainer(Main);

class NativeApp extends React.Component {
  render() {
    return <AppContainer />;
  }
}

/////////////////////////

// const routes = {
//   app: true,
//   oneOf: [
//     {
//       name: "main",
//       path: "main",
//       all: [
//         {
//           name: "tab1",
//           component: Tab1,
//           path: "home"
//         },
//         {
//           name: "tab2",
//           component: Tab2,
//           path: "mine/:user"
//         },
//         {
//           name: "tab3",
//           component: Tab3,
//           path: "setting"
//         }
//       ]
//     },
//     {
//       name: "login",
//       component: Login
//     }
//   ]
// };

// const TestApp = renderNavigation(routes);

// const RouterApp = () => {
//   return <TestRouter uriPrefix="mychat://" />;
// };

if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    error: () => {}
  };
}

AppRegistry.registerComponent(appName, () => App);

// AppRegistry.registerComponent(appName, () => RouterApp);

// AppRegistry.registerComponent(appName, () => NativeApp);

// AppRegistry.registerComponent(appName, () => TestApp);

# React Navigation Config
Static route configuration helpers for React Navigation 3.x.

# Basic Usage
navigation example, project created by `react-native-cli`.
+ App.js
```
import React from "react";
import { View, Text } from "react-native";
import { renderNavigation } from "react-navigation-config";

const baseRoutes = {
  app: true,
  children: [
    {
      name: "Home",
      component: () => (
        <View>
          <Text>Hello</Text>
        </View>
      )
    }
  ]
};

export default renderNavigation(baseRoutes);
```
+ index.js
```
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
```
# Configuration
**Route** objects with the properties.

+ `Boolean` app - will call function **createAppContainer** last, return a **AppContainer** wrapper.

under props can only choose one of them:
+ `Array<Route>` children - create as **StackNavigator**
+ `Array<Route>` all - create **BottomTabNavigator** default
+ `Array<Route>` oneOf - create as **SwitchNavigator**

# API
### **filterNavigation(routes, allows)**
remove route config where allows array not include.
##### Parameters
+ `Array<Route>` routes - the route configuration
+ `Array<String>` allows - route names that will be retain

### **renderNavigation(routes)**
create navigation components with config.
##### Parameters
+ `Array<Route>` routes - the route configuration

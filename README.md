# React Navigation Config
configuration helpers for react-navigation 3.x.

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

+ `<Boolean>` `app` - will call function **createAppContainer** last, return a **AppContainer** wrapper.

+ `<String>` `name` - route name, required, for use **navigation.navigate(routeName)**, is not necessary when **app** is `true`
+ `<Object>` `routerConfig` - same as **StackNavigatorConfig**,**SwitchNavigatorConfig** and so on
+ `<Object>` `navigationOptions` - set **navigationOptions** in **RouteConfigs** when injectNavigationOptions not specified
+ `<Boolean | String>` `injectNavigationOptions` - not necessary, inject static **navigationOptions** in component class,available when one of following values:
    - `true`: **Component.navigationOptions = navigationOptions;**
    - `"extend"`: extend class **Component**, and set static **navigationOptions**, same as:
```
import {navigationOptions} from "react-navigation-config/decorators";

@navigationOptions({
   title: "Home"
})
class Component extend React.Component{

}
```

under props can only choose one of them:
+ `Array<Route>` `children` - create as **StackNavigator**
+ `Array<Route>` `all` - create **BottomTabNavigator** default
+ `Array<Route>` `oneOf` - create as **SwitchNavigator**

# API
### **filterNavigation(routes, allows)**
remove route config where allows array not include.
##### Parameters
+ `Array<Route>` routes - the route configuration
+ `Array<String>` allows - route names that will be retain

```
filterNavigation(
    [{"children":[{"name":"A","children":[{"name":"C"}]},{"name":"B"},{"name":"D","children":[{"name":"E"}]}]}],
    ["C", "B"]
  )
```
output:
```
[{"children":[{"name":"A","children":[{"name":"C"}]},{"name":"B"}]}]
```

### **renderNavigation(routes)**
create navigation components with config.
##### Parameters
+ `Array<Route>` routes - the route configuration

# Decorator
### **navigationOptions(options)**
set static navigationOptions variable in subclass.
##### Parameters
+ `Object` options - see **createStackNavigator** or others


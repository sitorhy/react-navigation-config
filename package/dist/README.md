# React Navigation Config
configuration helpers for react-navigation 3.x.

# Usage
navigation example, project created by `react-native-cli`.

##### Basic Example
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
##### TabLayout Example
+ index.js
```
import React from "react";
import { AppRegistry, View, Text } from "react-native";
import { renderNavigation } from "react-navigation-config";
import { name } from "./app";

class Tab1 extends React.Component {
  render() {
    return (
      <View>
        <Text>Tab1</Text>
      </View>
    );
  }
}

class Tab2 extends React.Component {
  render() {
    return (
      <View>
        <Text>Tab2</Text>
      </View>
    );
  }
}

const App = renderNavigation({
  app: true,
  all: [
    {
      name: "tab2",
      component: Tab2
    },
    {
      name: "tab1",
      component: Tab1
    }
  ],
  routerConfig: {
    initialRouteName: "tab1"
  }
});

AppRegistry.registerComponent(name, () => App);

```



# Configuration
**Route** object with the properties.

+ `<Boolean>` `app` - will call function **createAppContainer** last, return a **AppContainer** wrapper.

+ `<String>` `name` - route name, required, for use **navigation.navigate(routeName)**, is not necessary when **app** is `true`

+ `<Object>` `routerConfig` - same as **StackNavigatorConfig**,**SwitchNavigatorConfig** ,**StackNavigatorConfig** and so on

+ `<Object>` `navigationOptions` - set **navigationOptions** in **RouteConfigs** when injectNavigationOptions not specified

+ `<Boolean | String>` `injectNavigationOptions` - not necessary, inject static variable **navigationOptions** in component class,available when one of following values:
    - `true`: static **<ComponentClass>.navigationOptions = navigationOptions;**
    - `"extend"`: extend class **Component**, and set static variable **navigationOptions**, same as:
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

### **wrappedNavigatorRef**
receive a navigator that can navigate to specified route anywhere.
##### Parameters
+ `Array<Route>` AppContainer, from call **renderNavigation**
+ `<Navigator> navigator` the navigator that will be initialized

# Navigator
send some frequent action to router use the method provided in this object.

### Usage
+ create and export a navigator object
```
// navigator.js
import { Navigator } from "../react-navigation-config";

export default new Navigator();
```
+ init with **wrappedNavigatorRef**
```
import navigator from "./navigator"; // navigator.js

// ....config

export default wrappedNavigatorRef(renderNavigation(routes), navigator);
```
+ import anywhere
```
import React from "react";
import { Button, View } from "react-native";
import navigator from "./navigator"; // navigator.js

export default class extends React.Component {
  navigateTest= () => {
    navigator.navigateTo("home").then(() => {
      // navigation state changed
    });
  };

  render() {
    return (
      <View>
          <Button
            title="Navigate Test"
            onPress={this.navigateTest}
          />
      </View>
    );
  }
}

```
### API
### **reLaunch**
take back to the first screen in the stack.
##### Parameters
+ `<String> name` optional, the next navigation route name that will replace first screen.
+ `<Object> params` optional,route params
##### Return Value
+ `<Promise>`

### **redirectTo**
replace the route at the given name with another.
##### Parameters
+ `<String> name` required
+ `<Object> params` optional
##### Return Value
+ `<Promise>`

### **navigateTo**
update the current state with the given name and params.
##### Parameters
+ `<String> name` required
+ `<Object> params` optional
##### Return Value
+ `<Promise>` resolve when success for action
```
import { NavigationActions } from 'react-navigation';

this.props.navigation.dispatch(NavigationActions.navigate({
  routeName: 'Profile',
  params: {},
  action: NavigationActions.navigate({ routeName: 'SubProfileRoute' }),
}));
```
is similar with
```
navigator.navigateTo("Profile",{}).then(()=>{
    navigator.navigateTo("SubProfileRoute");
});
```

### **navigateBack**
Go back to previous screen and close current screen.
##### Parameters
+ `void`
##### Return Value
+ `<Promise>`

# Decorator
### **navigationOptions(options)**
set static navigationOptions variable in subclass.
##### Parameters
+ `Object` options - see **createStackNavigator** or others




# React Navigation Config
configuration helpers for react-navigation 3.x.

<br>

# Dependent
+ react
+ redux
+ react-navigation

<br>

# Usage
navigation instance, project created by `react-native-cli`.

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

<br>

# Configuration
**Route** object with the properties.

+ `<Boolean>` `app` - call function **createAppContainer** at last, return a **AppContainer** wrapper.

+ `<String>` `name` - route name, required, for use **this.props.navigation.navigate(routeName)**, is not necessary when **app** is `"true"`

+ `<Object>` `routerConfig` - read document releated **StackNavigatorConfig**,**SwitchNavigatorConfig** ,**StackNavigatorConfig** ...

+ `<Object>` `navigationOptions` - set parameter **navigationOptions** in **RouteConfigs** when injectNavigationOptions not specified

+ `<Object>` `screenProps` - route meta fields,will be integrated into **screenProps**

+ `<Function>` `creator` - other container creator,use default setting if null
```
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

// config

{
          name: "tab",
          material: false,
          creator: createMaterialBottomTabNavigator,
          navigationOptions: {
            header: null
          },
          all: [  ... ]
}
```

+ `<Boolean | String>` `injectNavigationOptions` - this option is not necessary, inject static variable **navigationOptions** into the component's class, it is available when one of following values:
    - `true`: direct injection
    - `"extend"`: inherit first then inject

only one of following options can be choose:
+ `Array<Route>` `children` - create as **StackNavigator**
+ `Array<Route>` `all` - create **BottomTabNavigator** default
+ `Array<Route>` `oneOf` - create as **SwitchNavigator**

<br>

# API
### **filterNavigation(routes, allows)**
remove route config by name where the array allows not contain.
##### Parameters
+ `Array<Route>` routes - the route configuration
+ `Array<String>` allows - route names that will be reserved

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

<br>


### **renderNavigation(routes,navigator)**
create navigation components with config.
##### Parameters
+ `Array<Route>` routes - the route configuration
+ `<Navigator> navigator` - the navigator that will be initialized

<br>

### **wrappedNavigatorRef**
receive a navigator that can navigate to specified route anywhere.
##### Parameters
+ `Array<Route>` AppContainer - from call **renderNavigation**
+ `<Navigator> navigator` - the navigator that will be initialized

<br>

# Navigator
send some frequent actions to router use the method provided by the navigator.
### **Custom Navigator**
-----------------------------
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

export default wrappedNavigatorRef(renderNavigation(routes,navigator), navigator);
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
### **Default Navigator**
-----------------------------
```
import router from "react-navigation-config/router"
```
```
export default wrappedNavigatorRef(renderNavigation(routes));
```

### **Navigator API**
--------------------------------------
### **navigateTo**
update the navigation state with the given name and options.
##### Parameters
+ `<String> name` - required
+ `<Object> options` - optional
##### **options**
> - `<Object> params` - optional, the params field of navigation prop state  
>
> - `<Object> channel` - optional, part of screenProps,can pass any objects, recommend functions for ineraction in navigation stack
  
##### Return Value
+ `<Promise>` - resolve when successful for action
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

<br>

### **reLaunch**
take back to the first screen in the stack.
##### Parameters
+ `<String> name` - optional, the next navigation route name that will replace first screen.
+ `<Object> options` - optional
##### Return Value
+ `<Promise>`

<br>

### **redirectTo**
replace the route at the given name with another.
##### Parameters
+ `<String> name` - required
+ `<Object> options` - optional
##### Return Value
+ `<Promise>`

<br>

### **navigateBack**
go back to previous screen and close current screen.
##### Parameters
+ `void`
##### Return Value
+ `<Promise>`

<br>

### **beforeEach**
register interceptor before state change.
##### Parameters
+ `<Function>` - callback
```
router.beforeEach((to, from, next) => {
  if(from.routeName==="main")
  {
    next("home",{});
  }
});
```
##### **callback**
> + action - navigation action
> + to - route state
> + from - current route state
> + next(routeName,params) - may change target route, if parameter `params` is null or empty,it will be ignored and unchanged.

<br>

### **onReady**
navigation initialized.
##### Parameters
+ `<Function ((void)=>void)>` - callback
##### Return Value
+ `void`

<br>

### **afterEach**
register a listener after state change.
##### Parameters
+ `<Function (action,to,form)=>void>` - callback
##### Return Value
+ `void`

<br>

### **preventDefaultActionFix**
 it is not work default.

##### Parameters
+ `<Boolean>` `disabled`

try call `preventDefaultActionFix(false)` to enable it.

#### Problem
```
const A = createStackNavigator({ B:... })
const C = createSwitchNavigator({C:A});
...
this.props.navigation.disptach(
  NavigationActions.navigate({ routeName: 'A',params:{xyz:100} })
);
```
navigate to route `A` ,actually redirect to `B` ,but params `xyz` passed to route `A`.
get params from `this.props.navigation.state` is always `undefinded` in component `B`.
#### Fixed
redirect to child route when `action.routeName` not equal to the state resolved.

<br>

### **push**
##### Parameters
+ `<String> name` - required
+ `<Object> options` - optional
##### Return Value
+ `<Promise>`

<br>

### **dispatchAction**
update navigation current state with the given action.
##### Parameters
+ `<Object> action` - navigation action
+ `<Object> options` - optional
##### Return Value
+ `<Promise>`

<br>

### **getCurrentParams**
get params of current navigation state.
##### Parameters
+ `void`
##### Return Value
+ `<Object | null>`

<br>

### **getParams**
get all params from the stack.
##### Parameters
+ `void`
##### Return Value
+ `<Object | null>`

<br>

### **getRouteParams**
get params by route key.
##### Parameters
+ `<String> key` - required
##### Return Value
+ `<Object | null>`

<br>

### **openDrawer**
##### Parameters
+ `void`
##### Return Value
+ `void`

<br>

### **closeDrawer**
##### Parameters
+ `void`
##### Return Value
+ `void`

<br>

### **toggleDrawer**
##### Parameters
+ `void`
##### Return Value
+ `void`

<br>
  
### **getChannel**
##### Parameters
+  `void`
```
class ScreenA extends React.Component
{
    state={n:0};
    add=()=>{ this.setState({n:this.state.n+1}) };

    onBtnNavigateClick=()=>{
          navigator.navigateTo("B",{ channel:{ add:this.add } })
    }
    ...
}

// ScreenB

class ScreenB extend React.Component
{
    onTest=()=>{
        const {add} = navigator.getChannel();
        add(); // update ScreenA state
    }    

    render()
    {
        return <Button title="test" onPress={this.onTest} />
    }
}

```
##### Return Value
+ `<Object | null>`

<br>

# Decorator
### **navigationOptions(options)**
set static navigationOptions variable in subclass.
##### Parameters
+ `Object` options - see **createStackNavigator** or others

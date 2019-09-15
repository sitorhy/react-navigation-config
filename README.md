# React Navigation Config
configuration helpers for [react-navigation 4.x](https://reactnavigation.org/).

<br>

# Dependent
+ react
+ redux
+ react-navigation
+ react-navigation-drawer
+ react-navigation-stack
+ react-navigation-tabs

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

+ `<String>` `name` - route name, optional, use random name if not specified, for use **this.props.navigation.navigate(routeName)**, is not necessary when **app** is `"true"`

+ `<String>` `path` - optional, deep linking

+ `<Object>` `routerConfig` - read document related to **StackNavigatorConfig**,**SwitchNavigatorConfig**...

+ `<Object>` `navigationOptions` - set parameter **navigationOptions** in **RouteConfigs** when injectNavigationOptions not specified

+ `<Object>` `screenProps` - route meta fields,will be integrated into **screenProps**

+ `<Function>` `use` - other navigation container creator, use default setting if null.
```
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

// config

{
          name: "tab",
          use: createMaterialBottomTabNavigator,
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
+ `Array<Route>` `all` - create **BottomTabNavigator**
+ `Array<Route>` `oneOf` - create as **SwitchNavigator**
+ `Array<Route>` `drawer` - create as **DrawerNavigator**

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
+ `<Navigator> navigator` - optional, the navigator that will be initialized, use default navigator if not specify

<br>

### **linkNavigatorProvider**
4.x preview, define navigation container constructor.
##### Parameters
+ `<String>` type - config field name of navigator constructor
+ `<Navigator> navigator` - constructor

```
import { createStackNavigator } from 'react-navigation-stack';

linkNavigatorProvider("all", createStackNavigator);
```

<br>

# Navigator
send some frequent actions to router use the method provided by the navigator.
### **Custom Navigator**
-----------------------------
+ create and export a navigator object
```
// navigator.js
import { Navigator } from "react-navigation-config";

export default new Navigator();
```
+ init with **wrappedNavigatorRef**
```
import navigator from "./navigator"; // navigator.js

// ....config

const routes = { ... };

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
export default wrappedNavigatorRef(renderNavigation(routes));
```
```
import router from "react-navigation-config/router"

export default class extend React.Component
{
    handleEvent()
    {
          router.navigateTo(.....);
    }
    ...
}
```

### **Navigator API**
--------------------------------------
### **navigateTo**
update the navigation state with the given name and options.
##### Parameters
+ `<String> name` - required
+ `<Object> options` - optional
##### **options** - following navigator methods are the same
> - `<Object> params` - optional, the params field of navigation prop state  
>
> - `<Object> channel` - optional, will be integrated to `screenProps`, can pass any objects, including functions that interact between screens, but use for pop action may be very dangerous.
>
> - `<String>` `routeKey` - optional
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
wipes the whole navigation state.
##### Parameters
+ `<String> name` - required, route name that will replace first screen.
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

### **beforeEach**
register interceptor before state change.
##### Parameters
+ `<Function>` - callback
```
router.beforeEach((action, to, from, next) => {
  if(from.routeName==="main")
  {
    next("home",{});
  }
});
```
##### **callback**
> + `<Object>` `action` - navigation action
> + `<Object>` `to` - route state
> + `<Object>` `from` - current route state
> + `<Function>` `next(routeName,options)` - action create helper, if field `params` of parameter options is `undefined`,it will be ignored and unchanged.
>      - `options.routeName` - optional
>      - `options.action` - optional, NavigationActions.navigate(...)
>      - `options.params` - optional
>      - `options.channel` - optional, not recommended here

##### **<Function> next** - action create helper
> - `next()` - nothing happen
> - `next(false)` - abort current navigation
> - `next(routeName:String,options:Object)` - navigate to new one
> - `next(options:Object)` - navigate to new one, omit the parameter routeName, but need to specific action or routeName in parameter `options`


<br>

### **beforeResolve**
handle URIs event.
##### Parameters
+ `<Function>` - callback
##### **callback**
> + `<Object>` `state`
> + `<Object>` `to`
> + `<String>` `path` - deep link path
> + `<String>` `params` - query param and path param
> + `<Object>` `next(routeName,params)` - action rewrite helper

```
router.beforeResolve((state, to, path, params, next) => {
  // authorization code here ....
  
  next(action.routeName, {
    params: {
      ...params
    }
  });
});
```

##### **<Function> next** - action rewrite helper
> - `next()` - nothing happen
> - `next(false)` - stay at the screen specified by the router entrance
> - `next(routeName:String,options:Object)`
> - `next(options:Object)`

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
navigate to route `A`, actually redirect to `B` ,but params `"xyz"` passed to route `A`.
get params from `props.navigation.state` is always `undefinded` in component `B`.
#### Fixed
redirect to child route when `action.routeName` not equal to the state resolved.


<br>

### **preventDefaultURIResolveFix**
##### Parameters
+ `<Boolean>` `disabled`

try call `preventDefaultURIResolveFix(false)` to enable it.

#### Problem
path params will not merge to route params.
```
// browser
<a href="mychat://main/tab/mine/tom?country=China">Mine</a>

// app route config
createStackNavigator({
  mine: {
      path: 'mine/:user',
    })
  },

  ...MyOtherRoutes,
});
```
path paramter `"tom"` will not appear in `route.params` of navigation prop.

#### Fixed
force merge path params to `route.params`.

<br>

### **push**
##### Parameters
+ `<String> name` - required
+ `<Object> options` - optional
##### Return Value
+ `<Promise>`

<br>

### **dispatchAction**
low-level method, update navigation current state with the given action.
##### Parameters
+ `<Object> action` - navigation action
+ `<Object> options` - optional, not sure all fields effective.
##### Return Value
+ `<Promise>`

<br>

### **getActiveKey**
get current route key.
##### Parameters
+ `void`
##### Return Value
+ `<String| null>`

<br>

### **getActiveName**
get current route name.
##### Parameters
+ `void`
##### Return Value
+ `<String| null>`

<br>

### **getParams**
get route params by key.
##### Parameters
+ `<String> key` - optional, return current route params if not specified
##### Return Value
+ `<Object | null>`

<br>

### **mergeParams**
get all params of the stack.
##### Parameters
+ `<void> key`
##### Return Value
+ `<Object | null>`

<br>

### **setParams**
set route params by key.
##### Parameters
+ `<String> key` - required
+ `<String> params` - required
##### Return Value
+ `<Promise>`

<br>

### **openDrawer**
##### Parameters
+ `<Object>` `options` - optional
##### Return Value
+ `<Promise>`

<br>

### **closeDrawer**
##### Parameters
+ `<Object>` `options` - optional
##### Return Value
+ `<Promise>`

<br>

### **toggleDrawer**
##### Parameters
+ `<Object>` `options` - optional
##### Return Value
+ `<Promise>`

<br>

### **pop**
takes you back to a previous screen in the stack.
`options.params` is not supported in any go back action.
##### Parameters
+ `<Object> n` - the number of screens
+ `<Object | null> options` - optional
##### Return Value
+ `<Promise>`

<br>

### **popToTop**
takes you back to the first screen in the stack.
##### Parameters
+ `<Object | null> options` - optional
##### Return Value
+ `<Promise>`

<br>

### **navigateBack**
go back to previous screen and close current screen.
##### Parameters
+ `<Object>` `options` - optional
##### Return Value
+ `<Promise>`

<br>
  
### **getChannel**
##### Parameters
+  `<String> key` - optional
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

### **updateChannel**
##### Parameters
+ `<String | null > key` - required
+ `<Object> channel`  - required
##### Return Value
+ `<Boolean>`

<br>

### **removeChannel**
##### Parameters
+ `<String | null > key` - required
##### Return Value
+ `<void>`

<br>

### **mergeChannels**
merge channels of state, fields of channels with the same name will be overridden.
##### Parameters
+ `<void>`
##### Return Value
+ `<Array<object>>`
```
const [stackChannels] = navigator.mergeChannels();
const { ... } = stackChannels;
```

<br>

# Decorator
### **navigationOptions(options)**
set static navigationOptions variable in subclass.
##### Parameters
+ `Object` options - see **createStackNavigator** or others

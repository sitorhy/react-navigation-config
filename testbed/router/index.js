import React from "react";

import HomeScreen from "../components/HomeScreen";
import MineScreen from "../components/MineScreen";
import LoginScreen from "../components/LoginScreen";
import RegisterScreen from "../components/RegisterScreen";
import SettingScreen from "../components/SettingScreen";
import CountScreen from "../components/CountScreen";
import CountControlScreen from "../components/CountControlScreen";
import NativeTestScreen from "../components/NativeTestScreen";
import DrawerScreen from "../components/DrawerScreen";
import DrawerContentScreen from "../components/DrawerContentScreen";

import router from "../react-navigation-config/router";

import { createMaterialTopTabNavigator } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

router.preventDefaultActionFix(false);
/*
router.onReady(() => {
  console.log("初始化完毕");
});

router.beforeEach((action, to, from, next) => {
  console.log("--- before start ---");
  console.log(to);
  console.log(from);
  console.log("--- before end ---");
});

router.afterEach((action, to, from) => {
  console.log("--- after start ---");
  console.log(to);
  console.log(from);
  console.log("--- after end ---");
});
*/

import { Image } from "react-native";
import {
  renderNavigation,
  wrappedNavigatorRef
} from "../react-navigation-config";

import iconTodo from "../images/todo.png";
import iconMine from "../images/mine.png";

const routes = {
  app: true,
  screenProps: {
    description: "test data",
    permissions: ["SUPER_USER"]
  },
  routerConfig: {
    initialRouteName: "start"
  },
  oneOf: [
    {
      name: "main",
      screenProps: {
        stackCommonProps: {
          username: "anonymous"
        }
      },
      children: [
        {
          name: "tab",
          material: false,
          creator: createMaterialBottomTabNavigator,
          navigationOptions: {
            header: null
          },
          all: [
            {
              name: "home",
              component: HomeScreen,
              injectNavigationOptions: true,
              screenProps: {
                meta: {
                  xyz: 999
                }
              },
              navigationOptions: {
                title: "Home",
                tabBarLabel: "Home",
                header: null,
                tabBarIcon: ({ focused, tintColor }) => (
                  <Image
                    style={[
                      { width: 24, height: 24 },
                      { tintColor: focused ? tintColor : "gray" }
                    ]}
                    source={iconTodo}
                  />
                )
              }
            },
            {
              name: "mine",
              component: MineScreen,
              navigationOptions: {
                title: "Mine",
                tabBarLabel: "Mine",
                header: null,
                tabBarIcon: ({ focused, tintColor }) => (
                  <Image
                    style={[
                      { width: 24, height: 24 },
                      { tintColor: focused ? tintColor : "gray" }
                    ]}
                    source={iconMine}
                  />
                )
              }
            }
          ]
        },
        {
          name: "setting",
          component: SettingScreen,
          navigationOptions: ({ navigation }) => {
            return {
              headerTitle: navigation.getParam("headerTitle", "Setting")
            };
          },
          screenProps: {
            meta: {
              a: 100,
              b: 200
            }
          }
        },
        {
          name: "count",
          component: CountScreen,
          navigationOptions: {
            headerTitle: "Count"
          }
        },
        {
          name: "count-control",
          component: CountControlScreen,
          navigationOptions: {
            headerTitle: "Count-Control"
          }
        },
        {
          name: "native",
          component: NativeTestScreen,
          navigationOptions: {
            headerTitle: "Native-Test"
          }
        },
        {
          name: "drawerTest",
          drawer: [
            {
              name: "drawer",
              component: DrawerScreen
            }
          ],
          routerConfig: {
            contentComponent: DrawerContentScreen
          },
          navigationOptions: {
            headerTitle: "DrawerLayout"
          }
        }
      ]
    },
    {
      name: "start",
      routerConfig: {
        defaultNavigationOptions: {
          headerStyle: {
            backgroundColor: "#f4511e"
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold"
          }
        }
      },
      children: [
        {
          name: "login",
          component: LoginScreen,
          navigationOptions: {
            headerTitle: "Login"
          }
        },
        {
          name: "register",
          component: RegisterScreen,
          navigationOptions: {
            headerTitle: "Register"
          }
        }
      ]
    }
  ]
};

export default wrappedNavigatorRef(renderNavigation(routes));

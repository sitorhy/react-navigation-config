import React from "react";

import HomeScreen from "../components/HomeScreen";
import MineScreen from "../components/MineScreen";
import LoginScreen from "../components/LoginScreen";
import RegisterScreen from "../components/RegisterScreen";
import SettingScreen from "../components/SettingScreen";

import { Image } from "react-native";
import { renderNavigation } from "../react-navigation-config";

import iconTodo from "../images/todo.png";
import iconMine from "../images/mine.png";

const routes = {
  app: true,
  routerConfig: {
    initialRouteName: "start"
  },
  oneOf: [
    {
      name: "main",
      children: [
        {
          name: "tab",
          navigationOptions: {
            header: null
          },
          all: [
            {
              name: "home",
              component: HomeScreen,
              injectNavigationOptions: true,
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
          navigationOptions: {
            headerTitle: "设置"
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
            headerTitle: "登录"
          }
        },
        {
          name: "register",
          component: RegisterScreen,
          navigationOptions: {
            headerTitle: "注册"
          }
        }
      ]
    }
  ]
};

export default renderNavigation(routes);

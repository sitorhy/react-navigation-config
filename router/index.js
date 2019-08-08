import React from "react";

import HomeScreen from "../components/HomeScreen";
import MineScreen from "../components/MineScreen";
import LoginScreen from "../components/LoginScreen";
import RegisterScreen from "../components/RegisterScreen";

import { Image } from "react-native";
import { renderNavigation } from "../react-navigation-config";

import iconTodo from "../images/todo.png";
import iconMine from "../images/mine.png";
import filterNavigation from "../react-navigation-config/filterNavigation";

const routes = {
  app: true,
  routerConfig: {
    initialRouteName: "start"
  },
  oneOf: [
    {
      name: "main",
      all: [
        {
          name: "home",
          component: HomeScreen,
          injectNavigationOptions: true,
          navigationOptions: {
            title: "Home",
            tabBarLabel: "Home",
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
            title: "登录"
          }
        },
        {
          name: "register",
          component: RegisterScreen,
          navigationOptions: {
            title: "注册"
          }
        }
      ]
    }
  ]
};

export default renderNavigation(routes);

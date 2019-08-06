import React from "react";
import { View, Text, Button } from "react-native";
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
  createBottomTabNavigator
} from "react-navigation";

import HomeScreen from "./components/HomeScreen";
import MineScreen from "./components/MineScreen";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";

import "./router";

const MainNavigator = createBottomTabNavigator({
  Home: {
    screen: HomeScreen
  },
  Mine: {
    screen: MineScreen
  }
});

const AuthNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen
  },
  Register: {
    screen: RegisterScreen
  }
});

const AppNavigator = createSwitchNavigator(
  {
    Auth: {
      screen: AuthNavigator
    },
    App: {
      screen: MainNavigator
    }
  },
  { initialRouteName: "Auth" }
);
const routes = {
  oneOf: [
    {
      name: "App",
      all: [
        {
          name: "Home",
          component: HomeScreen
        },
        {
          name: "Mine",
          component: MineScreen
        }
      ]
    },
    {
      name: "Auth",
      children: [
        {
          name: "Login",
          component: LoginScreen
        },
        {
          name: "Register",
          component: RegisterScreen
        }
      ]
    }
  ]
};
export default createAppContainer(AppNavigator);

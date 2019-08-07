import HomeScreen from "../components/HomeScreen";
import MineScreen from "../components/MineScreen";
import LoginScreen from "../components/LoginScreen";
import RegisterScreen from "../components/RegisterScreen";

import { renderNavigation } from "../react-navigation-config";

const routes = {
  app: true,
  oneOf: [
    {
      name: "start",
      children: [
        {
          name: "login",
          component: LoginScreen
        },
        {
          name: "register",
          component: RegisterScreen
        }
      ]
    },
    {
      name: "main",
      all: [
        {
          name: "home",
          component: HomeScreen
        },
        {
          name: "mine",
          component: MineScreen
        }
      ]
    }
  ]
};

export default renderNavigation(routes);

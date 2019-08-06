import HomeScreen from "../components/HomeScreen";
import MineScreen from "../components/MineScreen";
import LoginScreen from "../components/LoginScreen";
import RegisterScreen from "../components/RegisterScreen";
import { filterRoutes } from "../react-navigation-config";

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

console.log(filterRoutes(routes.oneOf, ["Mine", "Register"]));

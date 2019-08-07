import HomeScreen from "../components/HomeScreen";
import MineScreen from "../components/MineScreen";

import { renderNavigation } from "../react-navigation-config";

const routes = {
  app: true,
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
};

export default renderNavigation(routes);

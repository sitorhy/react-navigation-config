/* eslint-disable*/

import {
    createAppContainer,
    createStackNavigator,
    createSwitchNavigator,
    createBottomTabNavigator,
} from "react-navigation";

import * as decorators from "./decorators";
import {removeEmpty} from "./common";

export default function (config)
{
    const creator = {
        children: createStackNavigator,
        all: createBottomTabNavigator,
        oneOf: createSwitchNavigator,
        app: createAppContainer,
    };

    const map = function (route)
    {
        const {
            name,
            component,
            app,
            injectNavigationOptions,
            navigationOptions,
            routerConfig
        } = route;

        const prop = ["children", "all", "oneOf", "app"].find(j => !!route[j]);

        if (!name && app !== true)
        {
            throw new Error("navigation config missing name.");
        }

        if (prop && Array.isArray(route[prop]) && route[prop].length)
        {
            const routeConfigs = {};
            for (const i of route[prop])
            {
                Object.assign(routeConfigs, map(i, creator[prop]));
            }
            return app === true ? creator["app"]((creator[prop])(routeConfigs, routerConfig)) : {
                [name]: {
                    screen: (creator[prop])(routeConfigs, routerConfig),
                },
            };
        }
        else
        {

            if (!component)
            {
                throw new Error("navigation config missing component.");
            }

            let screen = component;

            if (injectNavigationOptions === true)
            {
                screen.navigationOptions = navigationOptions;
            }
            else
            {
                if (injectNavigationOptions === "extend")
                {
                    screen = decorators.navigationOptions(navigationOptions)(component);
                }
            }

            return {
                [name]: removeEmpty({
                    screen,
                    navigationOptions: injectNavigationOptions === true ? null : navigationOptions
                })
            };
        }
    };

    return map(config);
}

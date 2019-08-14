import {
    createAppContainer,
    createStackNavigator,
    createSwitchNavigator,
    createBottomTabNavigator
} from "react-navigation";

import * as decorators from "./decorators";
import {removeEmpty} from "./common";

function inject(injectNavigationOptions, navigationOptions, component)
{
    if (injectNavigationOptions)
    {
        if (injectNavigationOptions === "extend")
        {
            return decorators.navigationOptions(navigationOptions)(component);
        }
        else
        {
            if (injectNavigationOptions === true)
            {
                component.navigationOptions = navigationOptions;
            }
        }
    }

    return component;
}

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
            injectNavigationOptions = false,
            navigationOptions,
            routerConfig,
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

            let navigation = (creator[prop])(routeConfigs, routerConfig);

            return app === true ? creator["app"](inject(injectNavigationOptions, navigationOptions, navigation)) : {
                [name]: removeEmpty({
                    screen: inject(injectNavigationOptions, navigationOptions, navigation),
                    navigationOptions: injectNavigationOptions ? null : navigationOptions
                })
            };
        }
        else
        {

            if (!component)
            {
                throw new Error("navigation config missing component.");
            }

            return {
                [name]: removeEmpty({
                    screen: inject(injectNavigationOptions, navigationOptions, component),
                    navigationOptions: injectNavigationOptions ? {header: null} : navigationOptions
                })
            };
        }
    };

    return map(config);
}

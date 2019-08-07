/* eslint-disable*/

import {
    createAppContainer,
    createStackNavigator,
    createSwitchNavigator,
    createBottomTabNavigator,
} from "react-navigation";

export default function (config)
{
    const creator = {
        children: createStackNavigator,
        all: createBottomTabNavigator,
        oneOf: createSwitchNavigator,
        app: createAppContainer
    };

    const map = function (route)
    {
        const {name, children, all, oneOf, component, app, ...others} = route;
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
            Object.assign(routeConfigs, others);
            return app === true ? creator["app"]((creator[prop])(routeConfigs)) : {
                [name]: {
                    screen: (creator[prop])(routeConfigs)
                }
            };
        }
        else
        {
            if (!component)
            {
                throw new Error("navigation config missing component.");
            }
            return {
                [name]: {
                    screen: component,
                    ...others
                }
            }
        }
    }

    return map(config);
}

/* eslint-disable*/

import {
    createAppContainer,
    createStackNavigator,
    createSwitchNavigator,
    createBottomTabNavigator,
} from 'react-navigation';

import {navigationOptions as injectNavigationOptions} from './decorators';

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
            config = {},
        } = route;
        const {navigationOptions} = config;
        const prop = ['children', 'all', 'oneOf', 'app'].find(j => !!route[j]);

        if (!name && app !== true)
        {
            throw new Error('navigation config missing name.');
        }

        if (prop && Array.isArray(route[prop]) && route[prop].length)
        {
            const routeConfigs = {};
            for (const i of route[prop])
            {
                Object.assign(routeConfigs, map(i, creator[prop]));
            }
            return app === true ? creator['app']((creator[prop])(routeConfigs, config)) : {
                [name]: {
                    screen: (creator[prop])(routeConfigs, config),
                },
            };
        }
        else
        {
            if (!component)
            {
                throw new Error('navigation config missing component.');
            }

            let screen = component;

            if (navigationOptions)
            {
                screen = injectNavigationOptions(navigationOptions)(component);
            }
            return {
                [name]: {
                    screen
                },
            };
        }
    };

    return map(config);
}

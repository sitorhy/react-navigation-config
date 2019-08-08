/* eslint-disable*/

import {
    createAppContainer,
    createStackNavigator,
    createSwitchNavigator,
    createBottomTabNavigator,
} from 'react-navigation';

import * as decorators from './decorators';
import {removeEmpty} from './common';

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

            let navigation = (creator[prop])(routeConfigs, routerConfig);

            if (injectNavigationOptions)
            {
                if (injectNavigationOptions === 'extend')
                {
                    navigation = decorators.navigationOptions(navigationOptions)(navigation);
                }
                else
                {
                    if (injectNavigationOptions === true)
                    {
                        navigation.navigationOptions = navigationOptions;
                    }
                }
            }

            return app === true ? creator['app'](navigation) : {
                [name]: removeEmpty({
                    screen: navigation,
                    navigationOptions: injectNavigationOptions ? null : navigationOptions,
                })
            };
        }
        else
        {

            if (!component)
            {
                throw new Error('navigation config missing component.');
            }

            let screen = component;

            if (injectNavigationOptions)
            {
                if (injectNavigationOptions === 'extend')
                {
                    screen = decorators.navigationOptions(navigationOptions)(component);
                }
                else
                {
                    if (injectNavigationOptions === true)
                    {
                        screen.navigationOptions = navigationOptions;
                    }
                }
            }

            return {
                [name]: removeEmpty({
                    screen,
                    navigationOptions: injectNavigationOptions ? {header: null} : navigationOptions,
                })
            };
        }
    };

    return map(config);
}

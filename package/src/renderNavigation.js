import React from "react";
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
        app: createAppContainer
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
            screenProps
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

            const ScreenComponent = navigation;
            const screen = screenProps ? class extends React.Component
            {
                static router = ScreenComponent.router;

                render()
                {
                    const {screenProps: dynamicScreenProps, ...others} = this.props;
                    return <ScreenComponent {...others} screenProps={{...screenProps, ...dynamicScreenProps}}/>
                }
            } : ScreenComponent

            if (app === true)
            {
                return creator["app"](inject(injectNavigationOptions, navigationOptions, screen));
            }
            else
            {
                return {
                    [name]: removeEmpty({
                        screen: inject(injectNavigationOptions, navigationOptions, screen),
                        navigationOptions: injectNavigationOptions ? null : navigationOptions
                    })
                };
            }
        }
        else
        {
            if (!component)
            {
                throw new Error("navigation config missing component.");
            }

            const ScreenComponent = component;
            const screen = screenProps ? (props) =>
            {
                const {screenProps: dynamicScreenProps, ...others} = props;
                return <ScreenComponent {...others} screenProps={{...screenProps, ...dynamicScreenProps}}/>
            } : ScreenComponent

            return {
                [name]: removeEmpty({
                    screen: inject(injectNavigationOptions, navigationOptions, screen),
                    navigationOptions: injectNavigationOptions ? {header: null} : navigationOptions
                })
            };
        }
    };

    return map(config);
}

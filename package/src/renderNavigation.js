import React from "react";
import {
    createAppContainer,
    createStackNavigator,
    createSwitchNavigator,
    createBottomTabNavigator,
    createDrawerNavigator,
    createMaterialTopTabNavigator
} from "react-navigation";

import defaultNavigator from "./router";
import * as decorators from "./decorators";
import {ObserveStore, removeEmpty} from "./common";
import {ACTIONS} from "./store";

const creator = {
    children: createStackNavigator,
    all: createBottomTabNavigator,
    oneOf: createSwitchNavigator,
    drawer: createDrawerNavigator,
    app: createAppContainer
};

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

function through(store, screenProps, ScreenComponent)
{
    const ThroughComponent = class extends React.Component
    {
        constructor(...args)
        {
            super(...args);
            if (store)
            {
                this.observer = new ObserveStore(store, (state, call) =>
                {
                    const {navigation} = this.props;
                    const {key} = navigation.state;
                    const {screenProps} = state;
                    if (Object.hasOwnProperty.call(screenProps, key))
                    {
                        if (typeof call === "function")
                        {
                            call(screenProps[key]);
                        }
                    }
                }, (screenProps) =>
                {
                    this.state = {
                        ...this.state,
                        screenProps
                    };
                });
            }
        }

        componentDidMount()
        {
            if (this.observer)
            {
                this.observer.start((screenProps) =>
                {
                    this.setState({
                        screenProps
                    });
                });
            }
        }

        componentWillUnmount()
        {
            if (this.observer)
            {
                const {navigation} = this.props;
                const {key} = navigation.state;
                this.observer.dispose();
                store.dispatch({
                    type: ACTIONS.UNINSTALL_SCREEN_PROPS,
                    key
                });
                this.observer = null;
            }
        }

        render()
        {
            const {screenProps: installScreenProps} = this.state;
            const {screenProps: dynamicScreenProps, ...others} = this.props;
            return <ScreenComponent
                {...others}
                screenProps={{...dynamicScreenProps, ...installScreenProps}}
            />
        }
    }

    if (ScreenComponent.router)
    {
        ThroughComponent.router = ScreenComponent.router;
    }

    return ThroughComponent;
}

const map = function (route, navigator)
{
    const {
        name,
        component,
        app,
        injectNavigationOptions = false,
        navigationOptions,
        routerConfig,
        screenProps,
        creator: customCreator = null
    } = route;

    const prop = ["children", "all", "oneOf", "drawer", "app"].find(j => !!route[j]);

    if (!name && app !== true)
    {
        throw new Error("navigation config missing name.");
    }

    if (prop && Array.isArray(route[prop]) && route[prop].length)
    {
        const routeConfigs = {};
        for (const i of route[prop])
        {
            Object.assign(routeConfigs, map(i, navigator));
        }

        let containerCreator;

        if (typeof customCreator === "function")
        {
            containerCreator = customCreator;
        }
        else
        {
            containerCreator = creator[prop];
        }

        let navigation = containerCreator(routeConfigs, routerConfig);

        const ScreenComponent = navigation;
        const screen = through(navigator ? navigator.getStore() : null, screenProps, ScreenComponent);

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
        const screen = through(navigator ? navigator.getStore() : null, screenProps, ScreenComponent);
        return {
            [name]: removeEmpty({
                screen: inject(injectNavigationOptions, navigationOptions, screen),
                navigationOptions: injectNavigationOptions ? {header: null} : navigationOptions
            })
        };
    }
};

export default function (config, navigator = defaultNavigator)
{
    return map(config, navigator);
}

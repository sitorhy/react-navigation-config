import React from "react";
import {
    createAppContainer,
    createStackNavigator,
    createSwitchNavigator,
    createBottomTabNavigator
} from "react-navigation";

import defaultNavigator from "./router";
import * as decorators from "./decorators";
import {ObserveStore, observeStore, removeEmpty} from "./common";

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

export default function (config, navigator = defaultNavigator)
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
            const screen = screenProps ? function ()
            {
                const store = navigator ? navigator.getStore() : null;
                return (
                    class extends React.Component
                    {
                        observer = null;

                        constructor(...args)
                        {
                            super(...args);
                            if (store)
                            {
                                this.observer = new ObserveStore(store, (state) =>
                                {
                                    const {navigation} = this.props;
                                    const {key} = navigation.state;
                                    const {screenProps} = state;
                                    return screenProps[key];
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
                                this.observer.unsubscribe();
                            }
                        }

                        render()
                        {
                            const {screenProps: installScreenProps} = this.state;
                            const {screenProps: dynamicScreenProps, ...others} = this.props;
                            return <ScreenComponent
                                {...others}
                                screenProps={{...screenProps, ...dynamicScreenProps, ...installScreenProps}}
                            />
                        }
                    }
                );
            }() : ScreenComponent

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

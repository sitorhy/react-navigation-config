import React, {Component} from "react";
import {
    createAppContainer,
    createSwitchNavigator
} from "react-navigation";

import defaultNavigator from "./router";
import * as decorators from "./decorators";
import {getChannelModule, getScreenPropsFromChannelModule, ObserveStore, randomString, removeEmpty} from "./common";
import {uninstallChannel} from "./actions";

import {createStackNavigator} from "react-navigation-stack";
import {createDrawerNavigator} from "react-navigation-drawer";
import {createBottomTabNavigator} from "react-navigation-tabs";

const creator = {
    children: createStackNavigator,
    all: createBottomTabNavigator,
    oneOf: createSwitchNavigator,
    drawer: createDrawerNavigator,
    app: createAppContainer
};


export function linkNavigatorProvider(type, provider) {
    creator[type] = provider;
}

function inject(injectNavigationOptions, navigationOptions, component) {
    if (injectNavigationOptions) {
        if (injectNavigationOptions === "extend") {
            return decorators.navigationOptions(navigationOptions)(component);
        } else {
            if (injectNavigationOptions === true) {
                component.navigationOptions = navigationOptions;
            }
        }
    }

    return component;
}

function through(store, screenProps, ScreenComponent) {
    const ThroughComponent = class extends Component {
        constructor(props) {
            super(props);
            const key = props.navigation.state.key;
            if (store) {
                this.observer = new ObserveStore(store, (state) => {
                    const channelModule = getChannelModule(state);
                    const channel = getScreenPropsFromChannelModule(key, channelModule);
                    this.state = {
                        ...this.state,
                        channel
                    };
                    return channel;
                });
            }
        }

        componentDidMount() {
            if (this.observer) {
                this.observer.start((state, call) => {
                    const {navigation} = this.props;
                    const {key} = navigation.state;
                    const channelModule = getChannelModule(state);
                    if (!(!Object.hasOwnProperty.call(channelModule, key) && this.state.channel === undefined) && typeof call === "function") {
                        call(getScreenPropsFromChannelModule(key, channelModule));
                    }
                }, (channel) => {
                    this.setState({
                        channel
                    });
                });
            }
        }

        componentWillUnmount() {
            if (this.observer) {
                const {navigation} = this.props;
                const {key} = navigation.state;
                this.observer.dispose();
                store.dispatch(uninstallChannel(key));
                this.observer = null;
            }
        }

        render() {
            const {channel} = this.state;
            const {screenProps: dynamicScreenProps, ...others} = this.props;
            return <ScreenComponent
                {...others}
                screenProps={{...screenProps, ...dynamicScreenProps, ...channel}}
            />
        }
    }

    if (ScreenComponent.router) {
        ThroughComponent.router = ScreenComponent.router;
    }

    if (ScreenComponent.navigationOptions) {
        ThroughComponent.navigationOptions = ScreenComponent.navigationOptions;
    }

    return ThroughComponent;
}

const map = function (route, navigator) {
    const {
        component,
        app,
        injectNavigationOptions = false,
        navigationOptions,
        routerConfig,
        screenProps,
        path,
        use
    } = route;

    let {name} = route;

    const prop = ["children", "all", "oneOf", "drawer"].find(j => !!route[j]);

    if (app !== true && !name) {
        name = `anonymous-${randomString(8)}-${Date.now()}`;
        route.name = name;
    }

    if (!name && app !== true) {
        throw new Error("navigation config missing name.");
    }

    if (prop && Array.isArray(route[prop]) && route[prop].length) {
        const routeConfigs = {};
        for (const i of route[prop]) {
            Object.assign(routeConfigs, map(i, navigator));
        }

        let containerCreator;

        if (typeof use === "function") {
            containerCreator = use;
        } else {
            containerCreator = creator[prop];
        }

        if (!containerCreator) {
            throw new Error("unidentified navigator provider");
        }

        let navigation = containerCreator(routeConfigs, routerConfig);

        const ScreenComponent = navigation;
        const screen = through(navigator ? navigator.getStore() : null, screenProps, ScreenComponent);

        if (app === true) {
            return creator["app"](inject(injectNavigationOptions, navigationOptions, screen));
        } else {
            return {
                [name]: removeEmpty({
                    screen: inject(injectNavigationOptions, navigationOptions, screen),
                    path,
                    navigationOptions: injectNavigationOptions ? null : navigationOptions,
                }, {
                    omitEmptyString: true
                })
            };
        }
    } else {
        if (!component) {
            throw new Error("navigation config missing component.");
        }

        const ScreenComponent = component;
        const screen = through(navigator ? navigator.getStore() : null, screenProps, ScreenComponent);
        return {
            [name]: removeEmpty({
                screen: inject(injectNavigationOptions, navigationOptions, screen),
                path,
                navigationOptions: injectNavigationOptions ? {header: null} : navigationOptions
            }, {
                omitEmptyString: true
            })
        };
    }
};

export default function (config, navigator = defaultNavigator) {
    if (navigator) {
        navigator._setRoutes(config);
    }
    return map(config, navigator);
}

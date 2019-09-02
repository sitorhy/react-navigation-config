import React from "react";
import {NavigationContainer} from "react-navigation";

export interface Route {
    component: React.Component;
    injectNavigationOptions?: boolean;
    navigationOptions?: object;
    routerConfig?: object;
    screenProps?: object;
    path?: string;
    name?: string;
    use?: () => NavigationContainer;
    children?: Array<Route>;
    drawer?: Array<Route>;
    oneOf?: Array<Route>;
    all?: Array<Route>;
}

export interface Config extends Route {
    app?: boolean;
}

export function renderNavigation(config: Config, navigator?: object): React.Component;

export function wrappedNavigatorRef(AppContainer: React.Component, navigator?: object, options?: object): React.Component;
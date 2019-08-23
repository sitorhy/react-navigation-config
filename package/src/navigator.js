import React from "react";
import defaultNavigator from "./router";
import {DEFAULT_CHANNEL_ACTIONS, getActiveRoute, getChannelFromStageModule, getStageModule} from "./common";
import {dumpChannel, installChannel, setNavigationRouteKey, setNavigationRouteName} from "./actions";

export default function (AppContainer, navigator = defaultNavigator, options = {})
{
    const {channelActions} = options || {};

    const WrappedAppContainer = (
        class extends AppContainer
        {
            constructor(...args)
            {
                super(...args);
                if (navigator)
                {
                    navigator._setNavigator(this);
                }
            }
        }
    );

    AppContainer.CHANNEL_ACTIONS = channelActions || DEFAULT_CHANNEL_ACTIONS;

    if (navigator)
    {
        WrappedAppContainer.router = {
            getActionCreators: AppContainer.router.getActionCreators,
            getActionForPathAndParams: AppContainer.router.getActionForPathAndParams,
            getComponentForRouteName: AppContainer.router.getComponentForRouteName,
            getComponentForState: AppContainer.router.getComponentForState,
            getPathAndParamsForState: AppContainer.router.getPathAndParamsForState,
            getScreenOptions: AppContainer.router.getScreenOptions,
            getStateForAction: AppContainer.router.getStateForAction
        };

        AppContainer.router.getActionCreators = function (route, stateKey)
        {
            return WrappedAppContainer.router.getActionCreators(route, stateKey);
        };

        AppContainer.router.getActionForPathAndParams = function (path, params)
        {
            return WrappedAppContainer.router.getActionForPathAndParams(path, params);
        };

        AppContainer.router.getComponentForRouteName = function (routeName)
        {
            return WrappedAppContainer.router.getComponentForRouteName(routeName);
        };

        AppContainer.router.getComponentForState = function (state)
        {
            return WrappedAppContainer.router.getComponentForState(state);
        };

        AppContainer.router.getPathAndParamsForState = function (state)
        {
            return WrappedAppContainer.router.getPathAndParamsForState(state);
        };

        AppContainer.router.getScreenOptions = function (navigation, screenProps)
        {
            return WrappedAppContainer.router.getScreenOptions(navigation, screenProps);
        };

        AppContainer.router.getStateForAction = function (action, inputState)
        {
            const {type} = action;

            switch (type)
            {
                case "Navigation/INIT":
                {
                    navigator._bindReady();
                }
                    break;
            }
            let state = WrappedAppContainer.router.getStateForAction(action, inputState);

            if (inputState)
            {
                const nextAction = navigator._bindBeforeEach(action, state, inputState);
                if (nextAction)
                {
                    state = WrappedAppContainer.router.getStateForAction(nextAction, inputState);
                }
            }

            const activeRoute = getActiveRoute(state);
            const {key, routeName} = activeRoute;

            const store = navigator.getStore();

            store.dispatch(setNavigationRouteKey(key));

            store.dispatch(setNavigationRouteName(routeName));

            if (AppContainer.CHANNEL_ACTIONS.includes(type))
            {
                const state = store.getState();
                const channel = getChannelFromStageModule(getStageModule(state));
                if (channel)
                {
                    store.dispatch(installChannel(key, channel));
                }
            }

            store.dispatch(dumpChannel());

            return state;
        };
    }

    return class extends React.Component
    {
        _observers = [];

        constructor(...args)
        {
            super(...args);
            if (navigator)
            {
                navigator._setContainer(this);
            }
        }

        _listen(observer)
        {
            this._observers.push(observer);
        }

        _remove(id)
        {
            const index = this._observers.findIndex(i => i.id === id);
            if (index >= 0)
            {
                this._observers.splice(index, 1);
            }
        }

        onNavigationStateChange = (prevState, newState, action) =>
        {
            const {onNavigationStateChange} = this.props;
            const {params, routeName} = action;

            switch (action.type)
            {
                case "Navigation/NAVIGATE":
                {
                    navigator._bindAfterEach(action, prevState, newState);
                }
                default:
                {
                    this._observers.splice(0, this._observers.length).forEach(({callback}) =>
                    {
                        callback({params, routeName});
                    });
                }
            }

            if (typeof onNavigationStateChange === "function")
            {
                onNavigationStateChange(prevState, newState, action);
            }
        };

        componentWillUnmount()
        {
            if (navigator)
            {
                navigator._setContainer(null);
                navigator._setNavigator(null);
                navigator.onReady(null);
                navigator.beforeEach(null);
                navigator.afterEach(null);
            }
        }

        render()
        {
            const {uriPrefix} = this.props;
            return (
                <WrappedAppContainer uriPrefix={uriPrefix} onNavigationStateChange={this.onNavigationStateChange}/>
            );
        }
    }
}

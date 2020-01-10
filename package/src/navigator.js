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
            constructor(props)
            {
                super(props);
                this._bindNavigator();
            }

            _bindNavigator()
            {
                if (navigator)
                {
                    navigator._setNavigator(this);
                }
            }

            _unbindNavigator()
            {
                if (navigator)
                {
                    navigator._setNavigator(null);
                }
            }

            componentDidMount()
            {
                this._bindNavigator();
                super.componentDidMount();
            }

            componentWillUnmount()
            {
                this._unbindNavigator();
                super.componentWillUnmount();
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

        AppContainer.router.getPathAndParamsForState = function (state)
        {
            return WrappedAppContainer.router.getPathAndParamsForState(state);
        };

        AppContainer.router.getActionForPathAndParams = function (path, params)
        {
            const action = WrappedAppContainer.router.getActionForPathAndParams(path, params);
            if (action)
            {
                const nextAction = navigator._bindBeforeResolve(action, path, params);

                if (nextAction !== null && nextAction !== undefined)
                {
                    if (nextAction === false)
                    {
                        return null;
                    }

                    return nextAction;
                }
            }
            return action;
        };

        AppContainer.router.getComponentForRouteName = function (routeName)
        {
            return WrappedAppContainer.router.getComponentForRouteName(routeName);
        };

        AppContainer.router.getComponentForState = function (state)
        {
            return WrappedAppContainer.router.getComponentForState(state);
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

            if (inputState && state)
            {
                const nextAction = navigator._bindBeforeEach(action, state, inputState);
                if (nextAction !== null && nextAction !== undefined)
                {
                    if (nextAction === false)
                    {
                        return null;
                    }
                    state = WrappedAppContainer.router.getStateForAction(nextAction, inputState);
                }
            }

            if(state)
            {
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
            }

            return state;
        };
    }

    return class extends React.Component
    {
        _observers = [];

        constructor(...args)
        {
            super(...args);
            this._bindContainer();
        }

        _bindContainer()
        {
            if (navigator)
            {
                navigator._setContainer(this);
            }
        }

        _unbindContainer()
        {
            if (navigator)
            {
                navigator._setContainer(null);
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

        componentDidMount()
        {
            this._bindContainer();
        }

        componentWillUnmount()
        {
            if (navigator)
            {
                navigator.onReady(null);
                navigator.beforeEach(null, null);
                navigator.afterEach(null);
                navigator._setRoutes([]);
            }

            this._unbindContainer();
        }

        render()
        {
            const {uriPrefix, enableURLHandling = true} = this.props;
            return (
                <WrappedAppContainer enableURLHandling={enableURLHandling}
                                     uriPrefix={uriPrefix}
                                     onNavigationStateChange={this.onNavigationStateChange}/>
            );
        }
    }
}

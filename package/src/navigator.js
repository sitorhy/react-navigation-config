import React, {Fragment} from "react";
import defaultNavigator from "./router";

export default function (AppContainer, navigator = defaultNavigator)
{
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
            const {type, routeName} = action;

            switch (type)
            {
                case "Navigation/INIT":
                {
                    navigator._bindReady();
                }
            }
            let state = WrappedAppContainer.router.getStateForAction(action, inputState);

            navigator._routeName = routeName;

            if (inputState)
            {
                const nextAction = navigator._bindBeforeEach(action, state, inputState);
                if (nextAction)
                {
                    state = WrappedAppContainer.router.getStateForAction(nextAction, inputState);
                    navigator._routeName = nextAction.routeName;
                }
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
                <Fragment>
                    <WrappedAppContainer uriPrefix={uriPrefix} onNavigationStateChange={this.onNavigationStateChange}/>
                </Fragment>
            );
        }
    }
}

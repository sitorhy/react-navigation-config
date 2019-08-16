import React, {Fragment} from "react";
import {NavigationActions, StackActions} from "react-navigation";
import {uuid} from "./common";

export function getNavState(nav)
{
    function _get(nav, mergeParams, scopeParams)
    {
        const {routes, index, params} = nav;
        let state = null;
        if (routes && routes.length && index !== undefined && index !== null)
        {
            state = _get(routes[index], mergeParams, scopeParams) || routes[index];
            if (state.params)
            {
                if (scopeParams[state.routeName])
                {
                    scopeParams[state.routeName] = {
                        ...scopeParams[state.routeName],
                        [state.key]: state.params
                    };
                }
                else
                {
                    scopeParams[state.routeName] = {[state.key]: state.params};
                }
                scopeParams[state.routeName].common = {
                    ...scopeParams[state.routeName].common,
                    ...state.params
                };
            }
        }
        Object.assign(mergeParams, params);
        return state;
    }

    const params = {};
    const scopeParams = {};
    _get(nav, params, scopeParams);
    return [params, scopeParams];
}

export class Navigator
{
    _setNavigator(navigator)
    {
        this.navigator = navigator;
    }

    _setContainer(container)
    {
        this.container = container;
    }

    _asyncNavigate(doTask)
    {
        return new Promise((resolve, reject) =>
        {
            const id = uuid();
            const observer = {
                id,
                callback(obj)
                {
                    resolve(obj);
                }
            };
            this.container._listen(observer);
            if (!doTask())
            {
                this.container._remove(id);
                reject();
            }
        });
    }

    getParams()
    {
        return getNavState(this.navigator.state.nav);
    }

    reLaunch(name, params)
    {
        return new Promise((resolve, reject) =>
        {
            this._asyncNavigate(
                () => this.navigator.dispatch(StackActions.popToTop())
            ).then((obj) =>
            {
                if (name)
                {
                    this.redirectTo(name, params).then((obj) =>
                    {
                        resolve(obj);
                    }).catch(() =>
                    {
                        reject();
                    });
                }
                else
                {
                    resolve(obj);
                }
            }).catch(() =>
            {
                reject();
            });
        });
    }

    redirectTo(name, params)
    {
        return this._asyncNavigate(() => this.navigator.dispatch(StackActions.replace({
                routeName: name,
                params: params
            }))
        );
    }

    navigateTo(name, params)
    {
        return this._asyncNavigate(() => this.navigator.dispatch(NavigationActions.navigate({
                routeName: name,
                params: params
            }))
        );
    }

    navigateBack()
    {
        return this._asyncNavigate(
            () => this.navigator.dispatch(NavigationActions.back({}))
        );
    }
}

export default function (AppContainer, navigator)
{
    const WrappedAppContainer = class extends AppContainer
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
            navigator._setContainer(null);
            navigator._setNavigator(null);
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

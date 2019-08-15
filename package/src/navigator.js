import React,{Fragment} from "react";
import {NavigationActions, StackActions, NavigationEvents} from "react-navigation";
import {uuid} from "./common";

function getNavState(nav)
{
    const {routes, index} = nav;
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
        console.log(this.navigator)
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
                    this.navigateTo(name, params).then((obj) =>
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

export default function (AppContainer, onNavigatorCreate = () =>
{
}, onNavigatorDestroy = () =>
{
})
{
    const navigator = new Navigator();

    const WrappedAppContainer = class extends AppContainer
    {
        constructor(...args)
        {
            super(...args);
            onNavigatorCreate(navigator);
            navigator._setNavigator(this);
        }
    }

    return class extends React.Component
    {
        _observers = [];

        constructor(...args)
        {
            super(...args);
            navigator._setContainer(this);
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

            console.log(prevState);
            console.log(newState);
            console.log(action);
            console.log(this);

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
            onNavigatorDestroy();
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

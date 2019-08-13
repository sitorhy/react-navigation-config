import React from "react";
import {NavigationActions, StackActions,SwitchActions } from "react-navigation";
import {uuid} from "./common";

export class Navigator
{
    setNavigator(navigator)
    {
        this.navigator = navigator;
    }

    setContainer(container)
    {
        this.container = container;
    }

    switchTab()
    {

    }

    reLaunch(name,params)
    {
        return new Promise((resolve, reject)=>{
            const id = uuid();
            const observer = {
                id,
                callback:()=>
                {
                    if(name)
                    {
                        this.navigateTo(name,params).then(()=>{
                            resolve();
                        }).catch(()=>{
                            resolve();
                        });
                    }
                    else
                    {
                        resolve();
                    }
                }
            };
            this.container._listen(observer);
            if (!this.navigator.dispatch(StackActions.popToTop()))
            {
                this.container._remove(id);
                reject();
            }
        });
    }

    redirectTo(name, params)
    {
        return new Promise((resolve, reject) =>
        {
            const id = uuid();
            const observer = {
                id,
                callback()
                {
                    resolve();
                }
            };
            this.container._listen(observer);
            if (!this.navigator.dispatch(StackActions.replace({
                routeName: name,
                params: params
            })))
            {
                this.container._remove(id);
                reject();
            }
        });
    }

    navigateTo(name, params)
    {
        return new Promise((resolve, reject) =>
        {
            const id = uuid();
            const observer = {
                id,
                callback()
                {
                    resolve();
                }
            };
            this.container._listen(observer);
            if (!this.navigator.dispatch(NavigationActions.navigate({
                routeName: name,
                params: params
            })))
            {
                this.container._remove(id);
                reject();
            }
        });
    }

    navigateBack()
    {
        return new Promise((resolve, reject) =>
        {
            const id = uuid();
            const observer = {
                id,
                callback()
                {
                    resolve();
                }
            };
            this.container._listen(observer);
            if (!this.navigator.dispatch(NavigationActions.back({})))
            {
                this.container._remove(id);
                reject();
            }
        });
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
            navigator.setNavigator(this);
        }
    }

    return class extends React.Component
    {
        _observers = [];

        constructor(...args)
        {
            super(...args);
            navigator.setContainer(this);
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

            switch (action.type)
            {
                default:
                {
                    this._observers.splice(0, this._observers.length).forEach(({callback}) =>
                    {
                        callback();
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
            navigator.setContainer(null);
            navigator.setNavigator(null);
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

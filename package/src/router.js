import createStore from "./store";
import {removeEmpty, uuid, getActiveRoute, matchRoute, getNavState} from "./common";
import {NavigationActions, StackActions} from "react-navigation";

export class Navigator
{
    _store = createStore();

    _beforeEachHandler = null;

    _afterEachHandler = null;

    _readyHandler = null;

    _preventDefaultActionFix = true;

    _bindBeforeEach(action, toState, fromState)
    {
        let fixed = false;
        let nextAction = null;
        let customAction = null;

        const to = getActiveRoute(toState);

        if (this._preventDefaultActionFix !== true)
        {
            if (to.routeName && to.routeName !== action.routeName)
            {
                action.routeName = to.routeName;
                fixed = true;
            }
        }

        if (typeof this._beforeEachHandler === "function")
        {
            const form = getActiveRoute(fromState);

            const handler = this._beforeEachHandler;

            function _rewriteAction(routeName, params = null)
            {
                if (routeName)
                {
                    customAction = {
                        ...action,
                        routeName,
                        ...removeEmpty({
                            params
                        })
                    };
                }
            }

            nextAction = handler(action, to, removeEmpty({
                key: form.key,
                params: form.params,
                routeName: form.routeName
            }), _rewriteAction);
        }

        return nextAction || customAction || (fixed && action);
    }

    _bindAfterEach(action, toState, fromState)
    {
        if (typeof this._afterEachHandler === "function")
        {
            const to = getActiveRoute(toState);
            const from = getActiveRoute(fromState);

            const handler = this._afterEachHandler;
            handler(action, to, removeEmpty({
                key: from.key,
                params: from.params,
                routeName: from.routeName
            }));
        }
    }

    _bindReady()
    {
        if (typeof this._readyHandler === "function")
        {
            const handler = this._readyHandler;
            handler();
        }
    }

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

    getCurrentParams()
    {
        const {navigation} = this._store.getState();
        const {key} = navigation;
        if (key)
        {
            const route = matchRoute(this.navigator.state.nav, key);
            if (route)
            {
                return route.params;
            }
        }
        return null;
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
        const options = removeEmpty({
            routeName: name,
            params: params
        });
        return this._asyncNavigate(() => this.navigator.dispatch(NavigationActions.navigate(options)));
    }

    navigateBack()
    {
        return this._asyncNavigate(
            () => this.navigator.dispatch(NavigationActions.back({}))
        );
    }

    preventDefaultActionFix(disabled = true)
    {
        this._preventDefaultActionFix = disabled === true;
    }

    beforeEach(callback)
    {
        if (typeof callback === "function")
        {
            this._beforeEachHandler = callback;
        }
    }

    afterEach(callback)
    {
        if (typeof callback === "function")
        {
            this._afterEachHandler = callback;
        }
    }

    onReady(callback)
    {
        if (typeof callback === "function")
        {
            this._readyHandler = callback;
        }
    }

    getStore()
    {
        return this._store;
    }
}

export default new Navigator();

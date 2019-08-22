import createStore, {ACTIONS} from "./store";
import {removeEmpty, uuid, getActiveRoute, matchRoute, getNavState, DEFAULT_IGNORE_ACTIONS} from "./common";
import {NavigationActions, StackActions, DrawerActions} from "react-navigation";

export class Navigator
{
    _store = createStore();

    _beforeEachHandler = null;

    _afterEachHandler = null;

    _readyHandler = null;

    _preventDefaultActionFix = true;

    _ignoreActions = DEFAULT_IGNORE_ACTIONS;

    _bindBeforeEach(action, toState, fromState)
    {
        const {type} = action;

        if (this._ignoreActions.includes(type))
        {
            return null;
        }
        
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

    _asyncNavigate(doTask, screenProps)
    {
        return new Promise((resolve, reject) =>
        {
            const id = uuid();
            const observer = {
                id,
                screenProps,
                callback(obj)
                {
                    resolve(obj);
                }
            };
            const store = this.getStore();
            store.dispatch({
                type: ACTIONS.PUT_SCREEN_PROPS,
                screenProps
            });
            this.container._listen(observer);
            if (!doTask())
            {
                store.dispatch({
                    type: ACTIONS.DUMP_SCREEN_PROPS
                });
                this.container._remove(id);
                reject();
            }
        });
    }

    getParams()
    {
        return getNavState(this.navigator.state.nav);
    }

    getRouteParams(key)
    {
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

    getCurrentParams()
    {
        const {navigation} = this.getStore().getState();
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

    getChannel()
    {
        const {navigation, screenProps} = this.getStore().getState();
        const {key} = navigation;
        if (key)
        {
            return screenProps[key];
        }
        return null;
    }

    reLaunch(name, options = {})
    {
        return new Promise((resolve, reject) =>
        {
            this._asyncNavigate(
                () => this.navigator.dispatch(StackActions.popToTop())
            ).then((obj) =>
            {
                if (name)
                {
                    this.redirectTo(name, options).then((obj) =>
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

    push(name, options = {})
    {
        const {params, channel} = options;
        return this._asyncNavigate(() => this.navigator.dispatch(
            StackActions.push({
                routeName: name,
                params
            })
        ), channel);
    }

    redirectTo(name, options = {})
    {
        const {params, channel} = options;
        return this._asyncNavigate(() => this.navigator.dispatch(StackActions.replace({
            routeName: name,
            params: params
        })), channel);
    }

    navigateTo(name, options = {})
    {
        const {params, channel} = options;
        return this._asyncNavigate(() => this.navigator.dispatch(NavigationActions.navigate({
            routeName: name,
            params: params
        })), channel);
    }

    navigateBack()
    {
        return this._asyncNavigate(
            () => this.navigator.dispatch(NavigationActions.back({}))
        );
    }

    dispatchAction(action, options = {})
    {
        if (action)
        {
            const {channel, ...actionProps} = options;
            return this._asyncNavigate(
                () => this.navigator.dispatch({
                    ...action,
                    ...actionProps
                }, channel)
            );
        }
    }

    toggleDrawer()
    {
        return this._asyncNavigate(
            () => this.navigator.dispatch(DrawerActions.toggleDrawer())
        );
    }

    openDrawer()
    {
        return this._asyncNavigate(
            () => this.navigator.dispatch(DrawerActions.openDrawer())
        );
    }

    closeDrawer()
    {
        return this._asyncNavigate(
            () => this.navigator.dispatch(DrawerActions.closeDrawer())
        );
    }

    preventDefaultActionFix(disabled = true)
    {
        this._preventDefaultActionFix = disabled === true;
    }

    beforeEach(callback, options = {})
    {
        if (options)
        {
            const {ignoreActions} = options;
            if (Array.isArray(ignoreActions))
            {
                this._ignoreActions = ignoreActions;
            }
        }
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

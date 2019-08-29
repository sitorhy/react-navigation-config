import createStore from "./store";
import {
    removeEmpty,
    uuid,
    getActiveRoute,
    matchRoute,
    getNavState,
    DEFAULT_IGNORE_ACTIONS,
    getScreenPropsFromChannelModule,
    getNavigationModule,
    getKeyFromNavigationModule,
    getChannelModule,
    mergeChannel,
    getDeepestActionState,
    rewriteAction,
    addContainerEventListener,
    removeContainerEventListener
} from "./common";
import {NavigationActions, StackActions, DrawerActions} from "react-navigation";
import {depositChannel, dumpChannel, installChannel, uninstallChannel} from "./actions";

function effectOfActionCreate(effect = () =>
{
}, ...args)
{
    const action = rewriteAction(...args);
    const {routeName} = action;
    if (routeName)
    {
        effect(action, args.length === 1 ? (args[0] || {}).channel : (args[1] || {}).channel);
    }
}

export class Navigator
{
    _routes = [];

    _store = createStore();

    _beforeResolveHandler = null;

    _beforeEachHandler = null;

    _afterEachHandler = null;

    _readyHandler = null;

    _preventDefaultActionFix = true;

    _preventDefaultURIResolveFix = true;

    _ignoreRouteActions = [...DEFAULT_IGNORE_ACTIONS];

    _ignoreURIActions = [...DEFAULT_IGNORE_ACTIONS];

    _setRoutes(routes = [])
    {
        this._routes = routes;
    }

    _bindBeforeResolve(action, path, params)
    {
        const actionTo = getDeepestActionState(action);

        if (this._preventDefaultURIResolveFix !== true)
        {
            action.params = {
                ...action.params,
                ...actionTo.params
            };
        }

        let nextAction = null;

        if (typeof this._beforeResolveHandler === "function")
        {
            const {type} = actionTo;

            if (this._ignoreURIActions.includes(type))
            {
                return null;
            }

            const actionParams = actionTo.params;

            const _createAction = (...args) =>
            {
                if (args.length)
                {
                    if (args.length && args[0] === false)
                    {
                        nextAction = false;
                    }
                    else
                    {
                        effectOfActionCreate((actionRewrite, channel) =>
                        {
                            nextAction = actionRewrite;
                            this.getStore().dispatch(depositChannel(channel));
                        }, ...args);
                    }
                }
            };

            const handler = this._beforeResolveHandler;
            handler(action, actionTo, path, actionParams, _createAction);
        }

        if (nextAction !== null && nextAction !== undefined)
        {
            if ((nextAction && nextAction !== true) || nextAction === false)
            {
                return nextAction;
            }
        }

        return null;
    }

    _bindBeforeEach(action, toState, fromState)
    {
        const {type} = action;

        if (this._ignoreRouteActions.includes(type))
        {
            return null;
        }

        let fixed = false;
        let nextAction = null;

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
            const from = getActiveRoute(fromState);

            const handler = this._beforeEachHandler;

            const _rewriteAction = (...args) =>
            {
                if (!args.length)
                {
                    return;
                }
                if (args.length && args[0] === false)
                {
                    nextAction = false;
                }
                else
                {
                    effectOfActionCreate((actionRewrite, channel) =>
                    {
                        nextAction = actionRewrite;
                        this.getStore().dispatch(depositChannel(channel));
                    }, ...args);
                }
            };

            handler(action, to, removeEmpty({
                key: from.key,
                params: from.params,
                routeName: from.routeName
            }), _rewriteAction);
        }

        if (nextAction !== null && nextAction !== undefined)
        {
            if ((nextAction && nextAction !== true) || nextAction === false)
            {
                return nextAction;
            }
        }

        return fixed ? action : null;
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

    _asyncNavigate(doTask, channel)
    {
        return new Promise((resolve, reject) =>
        {
            const id = uuid();
            const store = this.getStore();
            this.getStore().dispatch(depositChannel(channel));
            addContainerEventListener(this.container, {
                id,
                callback(obj)
                {
                    resolve(obj);
                }
            });
            if (!doTask())
            {
                store.dispatch(dumpChannel());
                removeContainerEventListener(this.container, {id});
                reject();
            }
        });
    }

    mergeParams()
    {
        return getNavState(this.navigator.state.nav);
    }

    getParams(routeKey)
    {
        const key = routeKey || this.getActiveKey();
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

    updateChannel(routeKey, channel)
    {
        let key = routeKey || this.getActiveKey();
        if (key)
        {
            this.getStore().dispatch(installChannel(key, channel));
            return true;
        }
        return false;
    }

    getChannel(routeKey)
    {
        const state = this.getStore().getState();
        const key = routeKey || this.getActiveKey();
        if (key)
        {
            return getScreenPropsFromChannelModule(key, getChannelModule(state));
        }
        return null;
    }

    mergeChannels()
    {
        const state = this.getStore().getState();
        return mergeChannel(getChannelModule(state));
    }

    removeChannel(routeKey)
    {
        const key = routeKey || this.getActiveKey();
        this.getStore().dispatch(uninstallChannel(key));
    }

    getActiveKey()
    {
        const navigation = getNavigationModule(this.getStore().getState());
        return getKeyFromNavigationModule(navigation);
    }

    setParams(routeKey, params)
    {
        return this._asyncNavigate(() => this.navigator.dispatch(
            NavigationActions.setParams({
                params: params,
                key: routeKey
            })
        ))
    }

    reLaunch(name, options = {})
    {
        let params = null, channel = null;
        if (options)
        {
            params = options.params;
            channel = options.channel;
        }
        return this._asyncNavigate(() => this.navigator.dispatch(
            StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({
                    routeName: name,
                    ...removeEmpty({params})
                })],
            })
        ), channel);
    }

    push(name, options = {})
    {
        let params = null, channel = null;
        if (options)
        {
            params = options.params;
            channel = options.channel;
        }
        return this._asyncNavigate(() => this.navigator.dispatch(
            StackActions.push({
                routeName: name,
                ...removeEmpty({
                    params
                })
            })
        ), channel);
    }

    redirectTo(name, options = {})
    {
        let params = null, channel = null;
        if (options)
        {
            params = options.params;
            channel = options.channel;
        }
        return this._asyncNavigate(() => this.navigator.dispatch(StackActions.replace({
            routeName: name,
            ...removeEmpty({
                params
            })
        })), channel);
    }

    navigateTo(name, options = {})
    {
        let params = null, channel = null, routeKey = null;
        if (options)
        {
            params = options.params;
            channel = options.channel;
            routeKey = options.routeKey;
        }
        return this._asyncNavigate(() => this.navigator.dispatch(NavigationActions.navigate({
            routeName: name,
            ...removeEmpty({
                params,
                key: routeKey
            })
        })), channel);
    }

    navigateBack(options)
    {
        let channel = null, routeKey = null;
        if (options)
        {
            channel = options.channel;
            routeKey = options.routeKey;
        }
        return this._asyncNavigate(
            () => this.navigator.dispatch(NavigationActions.back(
                removeEmpty({key: routeKey})
            )),
            channel
        );
    }

    dispatchAction(action, options)
    {
        if (action)
        {
            let channel = null;
            if (options)
            {
                channel = options.channel;
            }
            return this._asyncNavigate(
                () => this.navigator.dispatch(action), channel
            );
        }
    }

    popToTop(options = null)
    {
        return this.dispatchAction(StackActions.popToTop(), options);
    }

    pop(n = 1, options = null)
    {
        return this.dispatchAction(StackActions.pop({
            n,
        }), options);
    }

    toggleDrawer(options)
    {
        let channel = null;
        if (options)
        {
            channel = options.channel;
        }
        return this._asyncNavigate(
            () => this.navigator.dispatch(DrawerActions.toggleDrawer()), channel
        );
    }

    openDrawer(options)
    {
        let channel = null;
        if (options)
        {
            channel = options.channel;
        }
        return this._asyncNavigate(
            () => this.navigator.dispatch(DrawerActions.openDrawer()), channel
        );
    }

    closeDrawer(options)
    {
        let channel = null;
        if (options)
        {
            channel = options.channel;
        }
        return this._asyncNavigate(
            () => this.navigator.dispatch(DrawerActions.closeDrawer()), channel
        );
    }

    preventDefaultActionFix(disabled = true)
    {
        this._preventDefaultActionFix = disabled === true;
    }

    preventDefaultURIResolveFix(disabled = true)
    {
        this._preventDefaultURIResolveFix = disabled === true;
    }

    beforeResolve(callback, options = {})
    {
        if (options)
        {
            const {ignoreActions} = options;
            if (Array.isArray(ignoreActions))
            {
                this.setIgnoreURIActions(ignoreActions);
            }
        }
        if (typeof callback === "function")
        {
            this._beforeResolveHandler = callback;
        }
    }

    beforeEach(callback, options = {})
    {
        if (options)
        {
            const {ignoreActions} = options;
            if (Array.isArray(ignoreActions))
            {
                this.setIgnoreRouteActions(ignoreActions);
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

    getIgnoreRouteActions()
    {
        return this._ignoreRouteActions;
    }

    getIgnoreURIActions()
    {
        return this._ignoreURIActions;
    }

    setIgnoreRouteActions(actions = [])
    {
        this._ignoreRouteActions = actions;
    }

    setIgnoreURIActions(actions = [])
    {
        this._ignoreURIActions = actions;
    }
}

export default new Navigator();

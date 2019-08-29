import {NavigationActions} from "react-navigation";

export const DEFAULT_IGNORE_ACTIONS = [
    "Navigation/COMPLETE_TRANSITION",
    "Navigation/BACK",
    "Navigation/OPEN_DRAWER",
    "Navigation/MARK_DRAWER_SETTLING",
    "Navigation/MARK_DRAWER_IDLE",
    "Navigation/DRAWER_OPENED",
    "Navigation/CLOSE_DRAWER",
    "Navigation/DRAWER_CLOSED",
    "Navigation/TOGGLE_DRAWER",
    "Navigation/SET_PARAMS",
    "Navigation/RESET",
    "Navigation/POP",
    "Navigation/POP_TO_TOP"
];

export const DEFAULT_CHANNEL_ACTIONS = [
    "Navigation/REPLACE",
    "Navigation/PUSH",
    "Navigation/NAVIGATE",
    "Navigation/POP",
    "Navigation/POP_TO_TOP",
    "Navigation/BACK",
    "Navigation/OPEN_DRAWER",
    "Navigation/CLOSE_DRAWER",
    "Navigation/TOGGLE_DRAWER",
    "Navigation/RESET"
];

export const CONTAINER_EVENT = {
    STATE_CHANGE: "STATE_CHANGE"
};

export function pathToRegex(path = "")
{
    const str = path.replace(/:[^/:]+/g, "(.+)");
    return new RegExp(str);
}

export function addContainerEventListener(container, options = {})
{
    container._listen(
        {
            type: options.type || CONTAINER_EVENT.STATE_CHANGE,
            id: options.id || uuid(),
            callback: options.callback
        }
    );
}

export function removeContainerEventListener(container, {id})
{
    container._remove(id);
}

function _overrideRewriteAction(options = {})
{
    const {action, routeName, params, routeKey} = options;
    const basicAction = NavigationActions.navigate(
        {
            routeName,
            ...params === undefined ? {} : {params},
            ...removeEmpty({
                key: routeKey
            })
        }
    );

    return {
        ...basicAction,
        ...action
    };
}

export function rewriteAction(routeNameOrOptions, options)
{
    if (arguments.length > 1)
    {
        return _overrideRewriteAction(
            {
                routeName: routeNameOrOptions,
                ...options
            }
        );
    }
    else
    {
        return _overrideRewriteAction(routeNameOrOptions);
    }
}

export function getDeepestActionState(resolveAction)
{
    if (resolveAction.action)
    {
        const next = getDeepestActionState(resolveAction.action);
        if (next)
        {
            return next;
        }
    }
    return resolveAction;
}

function _mergeActionParams(action, result)
{
    if (action)
    {
        const {params, action: nextAction} = action;
        if (params)
        {
            Object.assign(result, params);
        }
        if (nextAction)
        {
            _mergeActionParams(nextAction, result);
        }
    }
}

export function mergeActionParams(action)
{
    const result = {};
    _mergeActionParams(action, result);
    return result;
}

export function removeEmpty(obj, options = {})
{
    if (!obj)
    {
        return obj;
    }
    const omitZero = options.omitZero === true;
    const omitEmptyString = options.omitEmptyString === true;
    const ignore = options.ignore || [];
    const accepts = {};
    Object.keys(obj).forEach((key) =>
    {
        if (ignore.includes(key))
        {
            accepts[key] = obj[key];
        }
        else
        {
            if (!(obj[key] === null || obj[key] === undefined || (obj[key] === 0 && omitZero) || (obj[key] === "" && omitEmptyString)))
            {
                accepts[key] = obj[key];
            }
        }
    });
    return accepts;
}

function _findRoute(route, config)
{
    const {forKey, value, match, getResult} = config;

    const prop = ["children", "all", "oneOf", "drawer"].find(j => !!route[j]);

    if (Array.isArray(route[prop]))
    {
        for (const i of route[prop])
        {
            const j = _findRoute(i, config);
            if (j)
            {
                return j;
            }
        }
    }

    if (route.hasOwnProperty(forKey))
    {
        if (typeof match === "function")
        {
            if (match(route, forKey, route[forKey]))
            {
                return getResult(route);
            }
        }
        else
        {
            if (route[forKey] === value)
            {
                return getResult(route);
            }
        }
    }

    return undefined;
}

export function routeFind(
    route = {},
    config = {}
)
{
    const _cfg = {
        forKey: "name",
        value: undefined,
        match: null,
        getResult: r => r,
        ...config
    };

    return _findRoute(route, _cfg);
}

const uuid_chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

const random_chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";

export function randomString(len)
{
    len = len || 32;
    let maxPos = random_chars.length;
    let pwd = "";
    for (let i = 0; i < len; i++)
    {
        pwd += random_chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

export function uuid(len, radix)
{
    const uuid = [];
    let i;
    radix = radix || uuid_chars.length;

    if (len)
    {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = uuid_chars[0 | Math.random() * radix];
    }
    else
    {
        // rfc4122, version 4 form
        let r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
        uuid[14] = "4";

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++)
        {
            if (!uuid[i])
            {
                r = 0 | Math.random() * 16;
                uuid[i] = uuid_chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join("");
}

function _getState(nav, mergeParams, scopeParams)
{
    const {routes, index, params} = nav;
    let state = null;
    if (Array.isArray(routes) && routes.length && index !== undefined && index !== null)
    {
        state = _getState(routes[index], mergeParams, scopeParams) || routes[index];
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

export function getNavState(nav)
{
    const params = {};
    const scopeParams = {};
    _getState(nav, params, scopeParams);
    return [params, scopeParams];
}

export function mergeChannel(channelModule)
{
    const channels = {};
    const scopeChannels = {};
    Object.keys(channelModule).map(key =>
    {
        const module = channelModule[key];
        Object.assign(scopeChannels, {
            [key]: module.channel
        });
        return module;
    }).sort((i, j) =>
    {
        return i.timestamp - j.timestamp;
    }).forEach((module) =>
    {
        const {channel} = module;
        Object.assign(channels, channel);
    });
    return [channels, scopeChannels];
}

export function getActiveRoute(nav)
{
    const {routes, index} = nav;
    if (index === null || index === undefined)
    {
        return null;
    }
    if (Array.isArray(routes) && routes.length)
    {
        const activeRoute = getActiveRoute(routes[index]);
        if (activeRoute === null)
        {
            return routes[index];
        }
        else
        {
            return activeRoute;
        }
    }
    return null;
}

export function matchRoute(nav, key)
{
    const {routes, key: routeKey} = nav;
    if (routeKey === key)
    {
        return nav;
    }
    if (Array.isArray(routes) && routes.length)
    {
        for (const i of routes)
        {
            const j = matchRoute(i, key);
            if (j)
            {
                return j;
            }
        }
    }
    return null;
}

export class ObserveStore
{
    constructor(store, onCreate)
    {
        this.store = store;
        if (typeof onCreate === "function")
        {
            this.currentState = onCreate(store.getState());
        }
    }

    start(select, onChange)
    {
        this.unsubscribe = this.store.subscribe(() =>
        {
            if (this.unsubscribe)
            {
                select(this.store.getState(), (nextState) =>
                {
                    if (nextState !== this.currentState)
                    {
                        this.currentState = nextState;
                        onChange(this.currentState);
                    }
                });
            }
        });
    }

    dispose()
    {
        if (this.unsubscribe)
        {
            this.unsubscribe();
        }
        this.store = null;
        this.unsubscribe = null;
        this.currentState = null;
    }
}

export function getScreenPropsFromChannelModule(key, state)
{
    if (!state)
    {
        return null;
    }
    const module = state[key];
    return module ? module.channel : undefined;
}

export function getChannelModule(state)
{
    return state.channels;
}

export function getKeyFromNavigationModule(state)
{
    if (!state)
    {
        return null;
    }
    return state.key;
}

export function getNavigationModule(state)
{
    return state.navigation;
}


export function getStageModule(state)
{
    return state.stage;
}

export function getChannelFromStageModule(state)
{
    if (!state)
    {
        return null;
    }
    return state.channel;
}

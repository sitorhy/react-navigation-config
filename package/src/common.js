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
];

export function removeEmpty(obj, options = {})
{
    if (!obj)
    {
        return obj;
    }
    const omitZero = options.omitZero === true;
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
            if (!(obj[key] === null || obj[key] === undefined || (obj[key] === 0 && omitZero)))
            {
                accepts[key] = obj[key];
            }
        }
    });
    return accepts;
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

function _get(nav, mergeParams, scopeParams)
{
    const {routes, index, params} = nav;
    let state = null;
    if (Array.isArray(routes) && routes.length && index !== undefined && index !== null)
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

export function getNavState(nav)
{
    const params = {};
    const scopeParams = {};
    _get(nav, params, scopeParams);
    return [params, scopeParams];
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
    constructor(store, select, onCreate)
    {
        this.select = select;
        this.store = store;
        this.currentState = select(store.getState());
        if (typeof onCreate === "function")
        {
            onCreate(this.currentState);
        }
    }

    start(onChange)
    {
        this.unsubscribe = this.store.subscribe(() =>
        {
            if (this.unsubscribe)
            {
                this.select(this.store.getState(), (nextState) =>
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
        this.select = null;
        this.currentState = null;
    }
}

export function getScreenPropsFromChannelModule(key, state)
{
    if (!state)
    {
        return null;
    }
    return state[key];
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

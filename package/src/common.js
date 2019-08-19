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

export function uuid(len, radix) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    let uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        // rfc4122, version 4 form
        let r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

export function getNavState(nav)
{
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
    const {routes, key:routeKey} = nav;
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


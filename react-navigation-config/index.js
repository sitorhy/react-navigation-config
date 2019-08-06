/* eslint-disable*/

import {
    createAppContainer,
    createStackNavigator,
    createSwitchNavigator,
    createBottomTabNavigator,
} from "react-navigation";

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

export function filterRoutes(routes = [], allows = [])
{
    if (allows === true)
    {
        return routes;
    }

    function choose(routes, allows, accepts = [])
    {
        for (const i of routes)
        {
            const {name} = i;
            const prop = ["children", "all", "oneOf"].find(j => !!i[j]);
            if (prop && Array.isArray(i[prop]) && i[prop].length)
            {
                const arr = choose(i[prop], allows, []);
                if (arr.length)
                {
                    accepts.push(
                        removeEmpty({
                            ...i,
                            [prop]: arr,
                        }),
                    );
                }
            }
            else
            {
                if (name && allows.includes(name))
                {
                    accepts.push(i);
                }
            }
        }
        return accepts;
    }

    return choose(routes, allows);
}

export function renderNavigation()
{
    return [];
}

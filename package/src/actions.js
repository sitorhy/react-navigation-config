import {ACTIONS} from "./store";

export function setNavigationRouteKey(key)
{
    return {
        type: ACTIONS.SET_ROUTE_KEY,
        key
    }
}

export function setNavigationRouteName(routeName)
{
    return {
        type: ACTIONS.SET_ROUTE_NAME,
        routeName
    }
}

export function depositChannel(channel)
{
    return {
        type: ACTIONS.DEPOSIT_CHANNEL,
        channel
    }
}

export function dumpChannel()
{
    return {
        type: ACTIONS.DUMP_CHANNEL
    }
}

export function installChannel(key, channel)
{
    return {
        type: ACTIONS.INSTALL_CHANNEL,
        key,
        channel
    }
}

export function uninstallChannel(key)
{
    return {
        type: ACTIONS.UNINSTALL_CHANNEL,
        key
    }
}


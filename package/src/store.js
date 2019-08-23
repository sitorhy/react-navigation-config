import {createStore, combineReducers} from "redux";

export const ACTIONS = {
    SET_ROUTE_KEY: "SET_ROUTE_KEY",
    SET_ROUTE_NAME: "SET_ROUTE_NAME",
    DEPOSIT_CHANNEL: "DEPOSIT_CHANNEL",
    DUMP_CHANNEL: "DUMP_CHANNEL",
    INSTALL_CHANNEL: "INSTALL_CHANNEL",
    UNINSTALL_CHANNEL: "UNINSTALL_CHANNEL"
};

function channels(state = {}, action)
{
    switch (action.type)
    {
        case ACTIONS.INSTALL_CHANNEL:
        {
            if (!action.key)
            {
                throw new Error("missing route key of channel install action.");
                return state;
            }
            return {
                ...state,
                [action.key]: {
                    timestamp: Date.now(),
                    channel: action.channel
                }
            };
        }
            break;
        case ACTIONS.UNINSTALL_CHANNEL:
        {
            if (!state.hasOwnProperty(action.key))
            {
                return state;
            }
            if (action.key)
            {
                delete state[action.key];
                return {
                    ...state
                };
            }
            return state;
        }
            break;
        default:
        {
            return state;
        }
    }
}

function stage(state = {}, action)
{
    switch (action.type)
    {
        case ACTIONS.DEPOSIT_CHANNEL:
        {
            return {
                ...state,
                channel: action.channel
            };
        }
            break;
        case ACTIONS.DUMP_CHANNEL:
        {
            if (state.channel === undefined)
            {
                return state;
            }
            return {
                ...state,
                channel: undefined
            };
        }
            break;
        default:
        {
            return state;
        }
    }
}

function navigation(state = {}, action)
{
    switch (action.type)
    {
        case ACTIONS.SET_ROUTE_KEY:
        {
            return {
                ...state,
                key: action.key
            };
        }
            break;
        case ACTIONS.SET_ROUTE_NAME:
        {
            return {
                ...state,
                routeName: action.routeName
            };
        }
            break;
        default:
        {
            return state;
        }
    }
}

export default function ()
{
    return createStore
    (
        combineReducers(
            {
                channels,
                stage,
                navigation
            }
        )
    );
}

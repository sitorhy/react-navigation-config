import {createStore, combineReducers} from "redux";

export const ACTIONS = {
    SET_ROUTE_KEY: "SET_ROUTE_KEY",
    SET_ROUTE_NAME: "SET_ROUTE_NAME",
    PUT_SCREEN_PROPS: "PUT_SCREEN_PROPS",
    DUMP_SCREEN_PROPS: "DUMP_SCREEN_PROPS",
    INSTALL_SCREEN_PROPS: "INSTALL_SCREEN_PROPS",
    UNINSTALL_SCREEN_PROPS: "UNINSTALL_SCREEN_PROPS"
};

export default function ()
{
    return createStore(combineReducers(
        {
            screenProps(state = {}, action)
            {
                switch (action.type)
                {
                    case ACTIONS.INSTALL_SCREEN_PROPS:
                    {
                        return {
                            ...state,
                            [action.key]: action.screenProps
                        };
                    }
                        break;
                    case ACTIONS.UNINSTALL_SCREEN_PROPS:
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
            },
            stage(state = {}, action)
            {
                switch (action.type)
                {
                    case ACTIONS.PUT_SCREEN_PROPS:
                    {
                        return {
                            ...state,
                            screenProps: action.screenProps
                        };
                    }
                        break;
                    case ACTIONS.DUMP_SCREEN_PROPS:
                    {
                        if (state.screenProps === undefined)
                        {
                            return state;
                        }
                        return {
                            ...state,
                            screenProps: undefined
                        };
                    }
                        break;
                    default:
                    {
                        return state;
                    }
                }
            },
            navigation(state = {}, action)
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
        })
    );
}

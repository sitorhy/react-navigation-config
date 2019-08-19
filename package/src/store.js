import {createStore, combineReducers} from "redux";

export const ACTIONS = {
    SET_ROUTE_KEY: "SET_ROUTE_KEY",
    SET_ROUTE_NAME: "SET_ROUTE_NAME"
};

export default function ()
{
    return createStore(combineReducers(
        {
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

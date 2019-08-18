import {uuid} from "./common";
import {NavigationActions, StackActions} from "react-navigation";

function getNavState(nav)
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

function matchRoute(nav, name)
{
    const {routes, routeName} = nav;
    if (routeName === name)
    {
        return nav;
    }
    if (Array.isArray(routes) && routes.length)
    {
        for (const i of routes)
        {
            const j = matchRoute(i, name);
            if (j)
            {
                return j;
            }
        }
    }
    return null;
}

export class Navigator
{
    _routeName = "";

    _setNavigator(navigator)
    {
        this.navigator = navigator;
    }

    _setContainer(container)
    {
        this.container = container;
    }

    _asyncNavigate(doTask)
    {
        return new Promise((resolve, reject) =>
        {
            const id = uuid();
            const observer = {
                id,
                callback(obj)
                {
                    resolve(obj);
                }
            };
            this.container._listen(observer);
            if (!doTask())
            {
                this.container._remove(id);
                reject();
            }
        });
    }

    getParams()
    {
        return getNavState(this.navigator.state.nav);
    }

    getCurrentParams()
    {
        const routeName = this._routeName;
        if (routeName)
        {
            const route = matchRoute(this.navigator.state.nav, routeName);
            if (route)
            {
                return route.params;
            }
        }
        return null;
    }

    reLaunch(name, params)
    {
        return new Promise((resolve, reject) =>
        {
            this._asyncNavigate(
                () => this.navigator.dispatch(StackActions.popToTop())
            ).then((obj) =>
            {
                if (name)
                {
                    this.redirectTo(name, params).then((obj) =>
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

    redirectTo(name, params)
    {
        return this._asyncNavigate(() => this.navigator.dispatch(StackActions.replace({
                routeName: name,
                params: params
            }))
        );
    }

    navigateTo(name, params)
    {
        return this._asyncNavigate(() => this.navigator.dispatch(NavigationActions.navigate({
                routeName: name,
                params: params
            }))
        );
    }

    navigateBack()
    {
        return this._asyncNavigate(
            () => this.navigator.dispatch(NavigationActions.back({}))
        );
    }
}

export default new Navigator();

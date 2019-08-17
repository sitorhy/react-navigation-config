declare namespace router
{
    function navigateTo(name:string,params:object):Promise<object>;

    function reLaunch(name:string,params:object):Promise<object>;

    function redirectTo(name:string,params:object):Promise<object>;

    function navigateBack():Promise<object>;

    function getParams():Array<object>;
}

export default router;

declare namespace router {
    function getParams(): object | null;

    function getCurrentParams(): object | null;

    function getRouteParams(key: string): object | null;

    function getChannel(): object | null;

    function navigateTo(name: string, options: object): Promise<object>;

    function push(name: string, options: object): Promise<object>;

    function reLaunch(name: string, options: object): Promise<object>;

    function redirectTo(name: string, options: object): Promise<object>;

    function navigateBack(): Promise<object>;

    function toggleDrawer(): Promise<object>;

    function openDrawer(): Promise<object>;

    function closeDrawer(): Promise<object>;

    function getParams(): Array<object>;

    function dispatchAction(action: object, options: object);

    function beforeEach(callback: (action: object, to: object, from: object, next: (routeName: string) => object | null) => void);

    function afterEach(callback: (action: object, to: object, from: object) => void);

    function onReady(callback: () => void);

    function preventDefaultActionFix(disabled: boolean);
}

export default router;

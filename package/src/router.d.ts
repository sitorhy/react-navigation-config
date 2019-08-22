declare namespace router {
    function getParams(): object | null;

    function getActiveKey(): string | null;

    function getCurrentParams(): object | null;

    function getRouteParams(key: string): object | null;

    function getChannel(): object | null;

    function navigateTo(name: string, options: object): Promise<object>;

    function push(name: string, options: object): Promise<object>;

    function reLaunch(name: string, options: object): Promise<object>;

    function redirectTo(name: string, options: object): Promise<object>;

    function navigateBack(options: object): Promise<object>;

    function popToTop(options: object | null);

    function pop(n: number, options: object | null);

    function toggleDrawer(options: object | null): Promise<object>;

    function openDrawer(options: object | null): Promise<object>;

    function closeDrawer(options: object | null): Promise<object>;

    function getParams(): Array<object>;

    function dispatchAction(action: object, options: object);

    function beforeEach(callback: (action: object, to: object, from: object, next: (routeName: string) => object | null) => void, options: object | null | undefined);

    function afterEach(callback: (action: object, to: object, from: object) => void);

    function onReady(callback: () => void);

    function preventDefaultActionFix(disabled: boolean);
}

export default router;

declare namespace router {
    function getParams(): object | null;

    function getActiveKey(): string | null;

    function getActiveName(): string | null;

    function mergeParams(): object | null;

    function getParams(key: string | null | undefined): object | null;

    function getChannel(): object | null;

    function updateChannel(key: string, channel: object): boolean;

    function mergeChannels(): Array<object>;

    function removeChannel(key: string): void;

    function navigateTo(name: string, options?: object): Promise<object>;

    function push(name: string, options?: object): Promise<object>;

    function reLaunch(name: string, options?: object): Promise<object>;

    function redirectTo(name: string, options?: object): Promise<object>;

    function navigateBack(options?: object): Promise<object>;

    function popToTop(options?: object | null);

    function pop(n?: number, options?: object | null);

    function toggleDrawer(options?: object | null): Promise<object>;

    function openDrawer(options?: object | null): Promise<object>;

    function closeDrawer(options?: object | null): Promise<object>;

    function setParams(key: string, params: object): Promise<object>;

    function getParams(): Array<object>;

    function dispatchAction(action: object, options: object): Promise<object>;

    function beforeResolve(callback: (nextState: object, toAction: object, path: string, params: object, next: (routeName: string) => object | null) => object, options: object | null | undefined): void;

    function beforeEach(callback: (action: object, to: object, from: object, next: (routeName: string) => object | null) => void, options: object | null | undefined): void;

    function afterEach(callback: (action: object, to: object, from: object) => void): void;

    function onReady(callback: () => void): void;

    function preventDefaultActionFix(disabled: boolean): void;

    function preventDefaultURIResolveFix(disabled: boolean): void;

    function getIgnoreRouteActions(): void;

    function getIgnoreURIActions(): void;

    function setIgnoreRouteActions(actions: Array<string>): void;

    function setIgnoreURIActions(actions: Array<string>): void;

    function channelProvider(navigation): Object;

    function hasPreviousNavigation(routeKey: String | null, depth: Number): Boolean;
}

export default router;

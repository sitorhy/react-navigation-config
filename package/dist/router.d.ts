declare namespace router {
    function getParams(): object | null;

    function getCurrentParams(): object | null;

    function navigateTo(name: string, params: object): Promise<object>;

    function reLaunch(name: string, params: object): Promise<object>;

    function redirectTo(name: string, params: object): Promise<object>;

    function navigateBack(): Promise<object>;

    function getParams(): Array<object>;

    function beforeEach(callback: (to: object, from: object, next: (routeName: string) => object | null) => void);

    function afterEach(callback: (to: object, from: object) => void);
}

export default router;

import {
    applyUrlDefaults,
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\ProductionPortalWebController::login
 * @see app/Http/Controllers/ProductionPortalWebController.php:24
 * @route '/production-portal/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
});

login.definition = {
    methods: ['get', 'head'],
    url: '/production-portal/login',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::login
 * @see app/Http/Controllers/ProductionPortalWebController.php:24
 * @route '/production-portal/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::login
 * @see app/Http/Controllers/ProductionPortalWebController.php:24
 * @route '/production-portal/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::login
 * @see app/Http/Controllers/ProductionPortalWebController.php:24
 * @route '/production-portal/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::login
 * @see app/Http/Controllers/ProductionPortalWebController.php:24
 * @route '/production-portal/login'
 */
const loginForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::login
 * @see app/Http/Controllers/ProductionPortalWebController.php:24
 * @route '/production-portal/login'
 */
loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::login
 * @see app/Http/Controllers/ProductionPortalWebController.php:24
 * @route '/production-portal/login'
 */
loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

login.form = loginForm;

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::authenticate
 * @see app/Http/Controllers/ProductionPortalWebController.php:32
 * @route '/production-portal/authenticate'
 */
export const authenticate = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: authenticate.url(options),
    method: 'post',
});

authenticate.definition = {
    methods: ['post'],
    url: '/production-portal/authenticate',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::authenticate
 * @see app/Http/Controllers/ProductionPortalWebController.php:32
 * @route '/production-portal/authenticate'
 */
authenticate.url = (options?: RouteQueryOptions) => {
    return authenticate.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::authenticate
 * @see app/Http/Controllers/ProductionPortalWebController.php:32
 * @route '/production-portal/authenticate'
 */
authenticate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: authenticate.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::authenticate
 * @see app/Http/Controllers/ProductionPortalWebController.php:32
 * @route '/production-portal/authenticate'
 */
const authenticateForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: authenticate.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::authenticate
 * @see app/Http/Controllers/ProductionPortalWebController.php:32
 * @route '/production-portal/authenticate'
 */
authenticateForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: authenticate.url(options),
    method: 'post',
});

authenticate.form = authenticateForm;

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::logout
 * @see app/Http/Controllers/ProductionPortalWebController.php:159
 * @route '/production-portal/logout'
 */
export const logout = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
});

logout.definition = {
    methods: ['post'],
    url: '/production-portal/logout',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::logout
 * @see app/Http/Controllers/ProductionPortalWebController.php:159
 * @route '/production-portal/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::logout
 * @see app/Http/Controllers/ProductionPortalWebController.php:159
 * @route '/production-portal/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::logout
 * @see app/Http/Controllers/ProductionPortalWebController.php:159
 * @route '/production-portal/logout'
 */
const logoutForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::logout
 * @see app/Http/Controllers/ProductionPortalWebController.php:159
 * @route '/production-portal/logout'
 */
logoutForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
});

logout.form = logoutForm;

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::dashboard
 * @see app/Http/Controllers/ProductionPortalWebController.php:95
 * @route '/production-portal/dashboard'
 */
export const dashboard = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
});

dashboard.definition = {
    methods: ['get', 'head'],
    url: '/production-portal/dashboard',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::dashboard
 * @see app/Http/Controllers/ProductionPortalWebController.php:95
 * @route '/production-portal/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::dashboard
 * @see app/Http/Controllers/ProductionPortalWebController.php:95
 * @route '/production-portal/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::dashboard
 * @see app/Http/Controllers/ProductionPortalWebController.php:95
 * @route '/production-portal/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::dashboard
 * @see app/Http/Controllers/ProductionPortalWebController.php:95
 * @route '/production-portal/dashboard'
 */
const dashboardForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::dashboard
 * @see app/Http/Controllers/ProductionPortalWebController.php:95
 * @route '/production-portal/dashboard'
 */
dashboardForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::dashboard
 * @see app/Http/Controllers/ProductionPortalWebController.php:95
 * @route '/production-portal/dashboard'
 */
dashboardForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: dashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

dashboard.form = dashboardForm;

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::order
 * @see app/Http/Controllers/ProductionPortalWebController.php:125
 * @route '/production-portal/order/{order}'
 */
export const order = (
    args:
        | { order: string | number }
        | [order: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: order.url(args, options),
    method: 'get',
});

order.definition = {
    methods: ['get', 'head'],
    url: '/production-portal/order/{order}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::order
 * @see app/Http/Controllers/ProductionPortalWebController.php:125
 * @route '/production-portal/order/{order}'
 */
order.url = (
    args:
        | { order: string | number }
        | [order: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args };
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        order: args.order,
    };

    return (
        order.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::order
 * @see app/Http/Controllers/ProductionPortalWebController.php:125
 * @route '/production-portal/order/{order}'
 */
order.get = (
    args:
        | { order: string | number }
        | [order: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: order.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::order
 * @see app/Http/Controllers/ProductionPortalWebController.php:125
 * @route '/production-portal/order/{order}'
 */
order.head = (
    args:
        | { order: string | number }
        | [order: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: order.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::order
 * @see app/Http/Controllers/ProductionPortalWebController.php:125
 * @route '/production-portal/order/{order}'
 */
const orderForm = (
    args:
        | { order: string | number }
        | [order: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: order.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::order
 * @see app/Http/Controllers/ProductionPortalWebController.php:125
 * @route '/production-portal/order/{order}'
 */
orderForm.get = (
    args:
        | { order: string | number }
        | [order: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: order.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ProductionPortalWebController::order
 * @see app/Http/Controllers/ProductionPortalWebController.php:125
 * @route '/production-portal/order/{order}'
 */
orderForm.head = (
    args:
        | { order: string | number }
        | [order: string | number]
        | string
        | number,
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: order.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

order.form = orderForm;

const productionPortal = {
    login: Object.assign(login, login),
    authenticate: Object.assign(authenticate, authenticate),
    logout: Object.assign(logout, logout),
    dashboard: Object.assign(dashboard, dashboard),
    order: Object.assign(order, order),
};

export default productionPortal;

import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductionPortalWebController::login
* @see app/Http/Controllers/ProductionPortalWebController.php:25
* @route '/production-portal/login'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/production-portal/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductionPortalWebController::login
* @see app/Http/Controllers/ProductionPortalWebController.php:25
* @route '/production-portal/login'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductionPortalWebController::login
* @see app/Http/Controllers/ProductionPortalWebController.php:25
* @route '/production-portal/login'
*/
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionPortalWebController::login
* @see app/Http/Controllers/ProductionPortalWebController.php:25
* @route '/production-portal/login'
*/
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductionPortalWebController::authenticate
* @see app/Http/Controllers/ProductionPortalWebController.php:33
* @route '/production-portal/authenticate'
*/
export const authenticate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: authenticate.url(options),
    method: 'post',
})

authenticate.definition = {
    methods: ["post"],
    url: '/production-portal/authenticate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductionPortalWebController::authenticate
* @see app/Http/Controllers/ProductionPortalWebController.php:33
* @route '/production-portal/authenticate'
*/
authenticate.url = (options?: RouteQueryOptions) => {
    return authenticate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductionPortalWebController::authenticate
* @see app/Http/Controllers/ProductionPortalWebController.php:33
* @route '/production-portal/authenticate'
*/
authenticate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: authenticate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProductionPortalWebController::logout
* @see app/Http/Controllers/ProductionPortalWebController.php:160
* @route '/production-portal/logout'
*/
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/production-portal/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductionPortalWebController::logout
* @see app/Http/Controllers/ProductionPortalWebController.php:160
* @route '/production-portal/logout'
*/
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductionPortalWebController::logout
* @see app/Http/Controllers/ProductionPortalWebController.php:160
* @route '/production-portal/logout'
*/
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProductionPortalWebController::dashboard
* @see app/Http/Controllers/ProductionPortalWebController.php:96
* @route '/production-portal/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/production-portal/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductionPortalWebController::dashboard
* @see app/Http/Controllers/ProductionPortalWebController.php:96
* @route '/production-portal/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductionPortalWebController::dashboard
* @see app/Http/Controllers/ProductionPortalWebController.php:96
* @route '/production-portal/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionPortalWebController::dashboard
* @see app/Http/Controllers/ProductionPortalWebController.php:96
* @route '/production-portal/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductionPortalWebController::showOrder
* @see app/Http/Controllers/ProductionPortalWebController.php:126
* @route '/production-portal/order/{order}'
*/
export const showOrder = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showOrder.url(args, options),
    method: 'get',
})

showOrder.definition = {
    methods: ["get","head"],
    url: '/production-portal/order/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductionPortalWebController::showOrder
* @see app/Http/Controllers/ProductionPortalWebController.php:126
* @route '/production-portal/order/{order}'
*/
showOrder.url = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: args.order,
    }

    return showOrder.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductionPortalWebController::showOrder
* @see app/Http/Controllers/ProductionPortalWebController.php:126
* @route '/production-portal/order/{order}'
*/
showOrder.get = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showOrder.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionPortalWebController::showOrder
* @see app/Http/Controllers/ProductionPortalWebController.php:126
* @route '/production-portal/order/{order}'
*/
showOrder.head = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showOrder.url(args, options),
    method: 'head',
})

const ProductionPortalWebController = { login, authenticate, logout, dashboard, showOrder }

export default ProductionPortalWebController
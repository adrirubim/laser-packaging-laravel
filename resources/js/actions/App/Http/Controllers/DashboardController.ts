import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::index
* @see app/Http/Controllers/DashboardController.php:21
* @route '/dashboard'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::index
* @see app/Http/Controllers/DashboardController.php:21
* @route '/dashboard'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::index
* @see app/Http/Controllers/DashboardController.php:21
* @route '/dashboard'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::index
* @see app/Http/Controllers/DashboardController.php:21
* @route '/dashboard'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::stats
* @see app/Http/Controllers/DashboardController.php:42
* @route '/dashboard/stats'
*/
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/dashboard/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::stats
* @see app/Http/Controllers/DashboardController.php:42
* @route '/dashboard/stats'
*/
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::stats
* @see app/Http/Controllers/DashboardController.php:42
* @route '/dashboard/stats'
*/
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::stats
* @see app/Http/Controllers/DashboardController.php:42
* @route '/dashboard/stats'
*/
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::acknowledgeAlert
* @see app/Http/Controllers/DashboardController.php:64
* @route '/dashboard/alerts/acknowledge'
*/
export const acknowledgeAlert = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acknowledgeAlert.url(options),
    method: 'post',
})

acknowledgeAlert.definition = {
    methods: ["post"],
    url: '/dashboard/alerts/acknowledge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::acknowledgeAlert
* @see app/Http/Controllers/DashboardController.php:64
* @route '/dashboard/alerts/acknowledge'
*/
acknowledgeAlert.url = (options?: RouteQueryOptions) => {
    return acknowledgeAlert.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::acknowledgeAlert
* @see app/Http/Controllers/DashboardController.php:64
* @route '/dashboard/alerts/acknowledge'
*/
acknowledgeAlert.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acknowledgeAlert.url(options),
    method: 'post',
})

const DashboardController = { index, stats, acknowledgeAlert }

export default DashboardController
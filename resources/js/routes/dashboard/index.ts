import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import alerts from './alerts'
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

const dashboard = {
    stats: Object.assign(stats, stats),
    alerts: Object.assign(alerts, alerts),
}

export default dashboard
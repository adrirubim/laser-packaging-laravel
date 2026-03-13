import {
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../wayfinder';
import alerts from './alerts';
/**
 * @see \App\Http\Controllers\DashboardController::stats
 * @see app/Http/Controllers/DashboardController.php:42
 * @route '/dashboard/stats'
 */
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
});

stats.definition = {
    methods: ['get', 'head'],
    url: '/dashboard/stats',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\DashboardController::stats
 * @see app/Http/Controllers/DashboardController.php:42
 * @route '/dashboard/stats'
 */
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\DashboardController::stats
 * @see app/Http/Controllers/DashboardController.php:42
 * @route '/dashboard/stats'
 */
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\DashboardController::stats
 * @see app/Http/Controllers/DashboardController.php:42
 * @route '/dashboard/stats'
 */
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\DashboardController::stats
 * @see app/Http/Controllers/DashboardController.php:42
 * @route '/dashboard/stats'
 */
const statsForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\DashboardController::stats
 * @see app/Http/Controllers/DashboardController.php:42
 * @route '/dashboard/stats'
 */
statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\DashboardController::stats
 * @see app/Http/Controllers/DashboardController.php:42
 * @route '/dashboard/stats'
 */
statsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: stats.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

stats.form = statsForm;

const dashboard = {
    stats: Object.assign(stats, stats),
    alerts: Object.assign(alerts, alerts),
};

export default dashboard;

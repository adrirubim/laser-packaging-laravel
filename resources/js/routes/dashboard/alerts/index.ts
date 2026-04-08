import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::acknowledge
* @see app/Http/Controllers/DashboardController.php:64
* @route '/dashboard/alerts/acknowledge'
*/
export const acknowledge = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acknowledge.url(options),
    method: 'post',
})

acknowledge.definition = {
    methods: ["post"],
    url: '/dashboard/alerts/acknowledge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DashboardController::acknowledge
* @see app/Http/Controllers/DashboardController.php:64
* @route '/dashboard/alerts/acknowledge'
*/
acknowledge.url = (options?: RouteQueryOptions) => {
    return acknowledge.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::acknowledge
* @see app/Http/Controllers/DashboardController.php:64
* @route '/dashboard/alerts/acknowledge'
*/
acknowledge.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acknowledge.url(options),
    method: 'post',
})

const alerts = {
    acknowledge: Object.assign(acknowledge, acknowledge),
}

export default alerts
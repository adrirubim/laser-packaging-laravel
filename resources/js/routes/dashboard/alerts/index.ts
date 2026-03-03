import {
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../../wayfinder';
/**
 * @see \App\Http\Controllers\DashboardController::acknowledge
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/dashboard/alerts/acknowledge'
 */
export const acknowledge = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: acknowledge.url(options),
    method: 'post',
});

acknowledge.definition = {
    methods: ['post'],
    url: '/dashboard/alerts/acknowledge',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\DashboardController::acknowledge
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/dashboard/alerts/acknowledge'
 */
acknowledge.url = (options?: RouteQueryOptions) => {
    return acknowledge.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\DashboardController::acknowledge
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/dashboard/alerts/acknowledge'
 */
acknowledge.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acknowledge.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\DashboardController::acknowledge
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/dashboard/alerts/acknowledge'
 */
const acknowledgeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: acknowledge.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\DashboardController::acknowledge
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/dashboard/alerts/acknowledge'
 */
acknowledgeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: acknowledge.url(options),
    method: 'post',
});

acknowledge.form = acknowledgeForm;

const alerts = {
    acknowledge: Object.assign(acknowledge, acknowledge),
};

export default alerts;

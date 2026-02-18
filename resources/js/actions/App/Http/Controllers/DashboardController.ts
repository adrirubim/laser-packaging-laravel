import {
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:23
 * @route '/dashboard'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/dashboard',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:23
 * @route '/dashboard'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:23
 * @route '/dashboard'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:23
 * @route '/dashboard'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:23
 * @route '/dashboard'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:23
 * @route '/dashboard'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\DashboardController::index
 * @see app/Http/Controllers/DashboardController.php:23
 * @route '/dashboard'
 */
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

index.form = indexForm;

/**
 * @see \App\Http\Controllers\DashboardController::acknowledgeAlert
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/dashboard/alerts/acknowledge'
 */
export const acknowledgeAlert = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: acknowledgeAlert.url(options),
    method: 'post',
});

acknowledgeAlert.definition = {
    methods: ['post'],
    url: '/dashboard/alerts/acknowledge',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\DashboardController::acknowledgeAlert
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/dashboard/alerts/acknowledge'
 */
acknowledgeAlert.url = (options?: RouteQueryOptions) => {
    return acknowledgeAlert.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\DashboardController::acknowledgeAlert
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/dashboard/alerts/acknowledge'
 */
acknowledgeAlert.post = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: acknowledgeAlert.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\DashboardController::acknowledgeAlert
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/dashboard/alerts/acknowledge'
 */
const acknowledgeAlertForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: acknowledgeAlert.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\DashboardController::acknowledgeAlert
 * @see app/Http/Controllers/DashboardController.php:132
 * @route '/dashboard/alerts/acknowledge'
 */
acknowledgeAlertForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: acknowledgeAlert.url(options),
    method: 'post',
});

acknowledgeAlert.form = acknowledgeAlertForm;

const DashboardController = { index, acknowledgeAlert };

export default DashboardController;

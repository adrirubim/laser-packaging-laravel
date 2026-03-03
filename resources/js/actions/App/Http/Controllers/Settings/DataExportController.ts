import {
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Settings\DataExportController::__invoke
 * @see app/Http/Controllers/Settings/DataExportController.php:11
 * @route '/settings/data-export'
 */
const DataExportController = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: DataExportController.url(options),
    method: 'get',
});

DataExportController.definition = {
    methods: ['get', 'head'],
    url: '/settings/data-export',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Settings\DataExportController::__invoke
 * @see app/Http/Controllers/Settings/DataExportController.php:11
 * @route '/settings/data-export'
 */
DataExportController.url = (options?: RouteQueryOptions) => {
    return DataExportController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Settings\DataExportController::__invoke
 * @see app/Http/Controllers/Settings/DataExportController.php:11
 * @route '/settings/data-export'
 */
DataExportController.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: DataExportController.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Settings\DataExportController::__invoke
 * @see app/Http/Controllers/Settings/DataExportController.php:11
 * @route '/settings/data-export'
 */
DataExportController.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: DataExportController.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Settings\DataExportController::__invoke
 * @see app/Http/Controllers/Settings/DataExportController.php:11
 * @route '/settings/data-export'
 */
const DataExportControllerForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: DataExportController.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Settings\DataExportController::__invoke
 * @see app/Http/Controllers/Settings/DataExportController.php:11
 * @route '/settings/data-export'
 */
DataExportControllerForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: DataExportController.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Settings\DataExportController::__invoke
 * @see app/Http/Controllers/Settings/DataExportController.php:11
 * @route '/settings/data-export'
 */
DataExportControllerForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: DataExportController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

DataExportController.form = DataExportControllerForm;

export default DataExportController;

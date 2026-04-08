import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\DataExportController::__invoke
* @see app/Http/Controllers/Settings/DataExportController.php:11
* @route '/settings/data-export'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/data-export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\DataExportController::__invoke
* @see app/Http/Controllers/Settings/DataExportController.php:11
* @route '/settings/data-export'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\DataExportController::__invoke
* @see app/Http/Controllers/Settings/DataExportController.php:11
* @route '/settings/data-export'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\DataExportController::__invoke
* @see app/Http/Controllers/Settings/DataExportController.php:11
* @route '/settings/data-export'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const dataExport = {
    index: Object.assign(index, index),
}

export default dataExport
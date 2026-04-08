import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\AppearanceController::edit
* @see app/Http/Controllers/Settings/AppearanceController.php:15
* @route '/settings/appearance'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/appearance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\AppearanceController::edit
* @see app/Http/Controllers/Settings/AppearanceController.php:15
* @route '/settings/appearance'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AppearanceController::edit
* @see app/Http/Controllers/Settings/AppearanceController.php:15
* @route '/settings/appearance'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\AppearanceController::edit
* @see app/Http/Controllers/Settings/AppearanceController.php:15
* @route '/settings/appearance'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\AppearanceController::update
* @see app/Http/Controllers/Settings/AppearanceController.php:30
* @route '/settings/appearance'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/appearance',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\AppearanceController::update
* @see app/Http/Controllers/Settings/AppearanceController.php:30
* @route '/settings/appearance'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\AppearanceController::update
* @see app/Http/Controllers/Settings/AppearanceController.php:30
* @route '/settings/appearance'
*/
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

const AppearanceController = { edit, update }

export default AppearanceController
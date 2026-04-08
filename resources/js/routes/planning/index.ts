import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Planning\PlanningController::index
* @see app/Http/Controllers/Planning/PlanningController.php:45
* @route '/planning'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/planning',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Planning\PlanningController::index
* @see app/Http/Controllers/Planning/PlanningController.php:45
* @route '/planning'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Planning\PlanningController::index
* @see app/Http/Controllers/Planning/PlanningController.php:45
* @route '/planning'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Planning\PlanningController::index
* @see app/Http/Controllers/Planning/PlanningController.php:45
* @route '/planning'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const planning = {
    index: Object.assign(index, index),
}

export default planning
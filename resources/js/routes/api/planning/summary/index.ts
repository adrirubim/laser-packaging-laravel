import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Planning\PlanningController::save
* @see app/Http/Controllers/Planning/PlanningController.php:136
* @route '/api/planning/summary/save'
*/
export const save = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(options),
    method: 'post',
})

save.definition = {
    methods: ["post"],
    url: '/api/planning/summary/save',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Planning\PlanningController::save
* @see app/Http/Controllers/Planning/PlanningController.php:136
* @route '/api/planning/summary/save'
*/
save.url = (options?: RouteQueryOptions) => {
    return save.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Planning\PlanningController::save
* @see app/Http/Controllers/Planning/PlanningController.php:136
* @route '/api/planning/summary/save'
*/
save.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(options),
    method: 'post',
})

const summary = {
    save: Object.assign(save, save),
}

export default summary
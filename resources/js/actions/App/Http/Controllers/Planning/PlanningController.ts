import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Planning\PlanningController::data
* @see app/Http/Controllers/Planning/PlanningController.php:57
* @route '/api/planning/data'
*/
export const data = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: data.url(options),
    method: 'post',
})

data.definition = {
    methods: ["post"],
    url: '/api/planning/data',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Planning\PlanningController::data
* @see app/Http/Controllers/Planning/PlanningController.php:57
* @route '/api/planning/data'
*/
data.url = (options?: RouteQueryOptions) => {
    return data.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Planning\PlanningController::data
* @see app/Http/Controllers/Planning/PlanningController.php:57
* @route '/api/planning/data'
*/
data.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: data.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Planning\PlanningController::save
* @see app/Http/Controllers/Planning/PlanningController.php:90
* @route '/api/planning/save'
*/
export const save = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(options),
    method: 'post',
})

save.definition = {
    methods: ["post"],
    url: '/api/planning/save',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Planning\PlanningController::save
* @see app/Http/Controllers/Planning/PlanningController.php:90
* @route '/api/planning/save'
*/
save.url = (options?: RouteQueryOptions) => {
    return save.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Planning\PlanningController::save
* @see app/Http/Controllers/Planning/PlanningController.php:90
* @route '/api/planning/save'
*/
save.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Planning\PlanningController::saveSummary
* @see app/Http/Controllers/Planning/PlanningController.php:136
* @route '/api/planning/summary/save'
*/
export const saveSummary = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveSummary.url(options),
    method: 'post',
})

saveSummary.definition = {
    methods: ["post"],
    url: '/api/planning/summary/save',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Planning\PlanningController::saveSummary
* @see app/Http/Controllers/Planning/PlanningController.php:136
* @route '/api/planning/summary/save'
*/
saveSummary.url = (options?: RouteQueryOptions) => {
    return saveSummary.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Planning\PlanningController::saveSummary
* @see app/Http/Controllers/Planning/PlanningController.php:136
* @route '/api/planning/summary/save'
*/
saveSummary.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveSummary.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Planning\PlanningController::calculateHours
* @see app/Http/Controllers/Planning/PlanningController.php:182
* @route '/api/planning/calculate-hours'
*/
export const calculateHours = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calculateHours.url(options),
    method: 'post',
})

calculateHours.definition = {
    methods: ["post"],
    url: '/api/planning/calculate-hours',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Planning\PlanningController::calculateHours
* @see app/Http/Controllers/Planning/PlanningController.php:182
* @route '/api/planning/calculate-hours'
*/
calculateHours.url = (options?: RouteQueryOptions) => {
    return calculateHours.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Planning\PlanningController::calculateHours
* @see app/Http/Controllers/Planning/PlanningController.php:182
* @route '/api/planning/calculate-hours'
*/
calculateHours.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: calculateHours.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Planning\PlanningController::checkToday
* @see app/Http/Controllers/Planning/PlanningController.php:214
* @route '/api/planning/check-today'
*/
export const checkToday = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkToday.url(options),
    method: 'post',
})

checkToday.definition = {
    methods: ["post"],
    url: '/api/planning/check-today',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Planning\PlanningController::checkToday
* @see app/Http/Controllers/Planning/PlanningController.php:214
* @route '/api/planning/check-today'
*/
checkToday.url = (options?: RouteQueryOptions) => {
    return checkToday.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Planning\PlanningController::checkToday
* @see app/Http/Controllers/Planning/PlanningController.php:214
* @route '/api/planning/check-today'
*/
checkToday.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkToday.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Planning\PlanningController::forceReschedule
* @see app/Http/Controllers/Planning/PlanningController.php:228
* @route '/api/planning/force-reschedule'
*/
export const forceReschedule = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forceReschedule.url(options),
    method: 'post',
})

forceReschedule.definition = {
    methods: ["post"],
    url: '/api/planning/force-reschedule',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Planning\PlanningController::forceReschedule
* @see app/Http/Controllers/Planning/PlanningController.php:228
* @route '/api/planning/force-reschedule'
*/
forceReschedule.url = (options?: RouteQueryOptions) => {
    return forceReschedule.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Planning\PlanningController::forceReschedule
* @see app/Http/Controllers/Planning/PlanningController.php:228
* @route '/api/planning/force-reschedule'
*/
forceReschedule.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forceReschedule.url(options),
    method: 'post',
})

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

const PlanningController = { data, save, saveSummary, calculateHours, checkToday, forceReschedule, index }

export default PlanningController
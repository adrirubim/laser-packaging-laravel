import {
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Planning\PlanningController::data
 * @see app/Http/Controllers/Planning/PlanningController.php:50
 * @route '/api/planning/data'
 */
export const data = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: data.url(options),
    method: 'post',
});

data.definition = {
    methods: ['post'],
    url: '/api/planning/data',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Planning\PlanningController::data
 * @see app/Http/Controllers/Planning/PlanningController.php:50
 * @route '/api/planning/data'
 */
data.url = (options?: RouteQueryOptions) => {
    return data.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Planning\PlanningController::data
 * @see app/Http/Controllers/Planning/PlanningController.php:50
 * @route '/api/planning/data'
 */
data.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: data.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::data
 * @see app/Http/Controllers/Planning/PlanningController.php:50
 * @route '/api/planning/data'
 */
const dataForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: data.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::data
 * @see app/Http/Controllers/Planning/PlanningController.php:50
 * @route '/api/planning/data'
 */
dataForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: data.url(options),
    method: 'post',
});

data.form = dataForm;

/**
 * @see \App\Http\Controllers\Planning\PlanningController::save
 * @see app/Http/Controllers/Planning/PlanningController.php:87
 * @route '/api/planning/save'
 */
export const save = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(options),
    method: 'post',
});

save.definition = {
    methods: ['post'],
    url: '/api/planning/save',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Planning\PlanningController::save
 * @see app/Http/Controllers/Planning/PlanningController.php:87
 * @route '/api/planning/save'
 */
save.url = (options?: RouteQueryOptions) => {
    return save.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Planning\PlanningController::save
 * @see app/Http/Controllers/Planning/PlanningController.php:87
 * @route '/api/planning/save'
 */
save.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::save
 * @see app/Http/Controllers/Planning/PlanningController.php:87
 * @route '/api/planning/save'
 */
const saveForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: save.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::save
 * @see app/Http/Controllers/Planning/PlanningController.php:87
 * @route '/api/planning/save'
 */
saveForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: save.url(options),
    method: 'post',
});

save.form = saveForm;

/**
 * @see \App\Http\Controllers\Planning\PlanningController::saveSummary
 * @see app/Http/Controllers/Planning/PlanningController.php:158
 * @route '/api/planning/summary/save'
 */
export const saveSummary = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: saveSummary.url(options),
    method: 'post',
});

saveSummary.definition = {
    methods: ['post'],
    url: '/api/planning/summary/save',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Planning\PlanningController::saveSummary
 * @see app/Http/Controllers/Planning/PlanningController.php:158
 * @route '/api/planning/summary/save'
 */
saveSummary.url = (options?: RouteQueryOptions) => {
    return saveSummary.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Planning\PlanningController::saveSummary
 * @see app/Http/Controllers/Planning/PlanningController.php:158
 * @route '/api/planning/summary/save'
 */
saveSummary.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveSummary.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::saveSummary
 * @see app/Http/Controllers/Planning/PlanningController.php:158
 * @route '/api/planning/summary/save'
 */
const saveSummaryForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: saveSummary.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::saveSummary
 * @see app/Http/Controllers/Planning/PlanningController.php:158
 * @route '/api/planning/summary/save'
 */
saveSummaryForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: saveSummary.url(options),
    method: 'post',
});

saveSummary.form = saveSummaryForm;

/**
 * @see \App\Http\Controllers\Planning\PlanningController::calculateHours
 * @see app/Http/Controllers/Planning/PlanningController.php:202
 * @route '/api/planning/calculate-hours'
 */
export const calculateHours = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: calculateHours.url(options),
    method: 'post',
});

calculateHours.definition = {
    methods: ['post'],
    url: '/api/planning/calculate-hours',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Planning\PlanningController::calculateHours
 * @see app/Http/Controllers/Planning/PlanningController.php:202
 * @route '/api/planning/calculate-hours'
 */
calculateHours.url = (options?: RouteQueryOptions) => {
    return calculateHours.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Planning\PlanningController::calculateHours
 * @see app/Http/Controllers/Planning/PlanningController.php:202
 * @route '/api/planning/calculate-hours'
 */
calculateHours.post = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: calculateHours.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::calculateHours
 * @see app/Http/Controllers/Planning/PlanningController.php:202
 * @route '/api/planning/calculate-hours'
 */
const calculateHoursForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: calculateHours.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::calculateHours
 * @see app/Http/Controllers/Planning/PlanningController.php:202
 * @route '/api/planning/calculate-hours'
 */
calculateHoursForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: calculateHours.url(options),
    method: 'post',
});

calculateHours.form = calculateHoursForm;

/**
 * @see \App\Http\Controllers\Planning\PlanningController::checkToday
 * @see app/Http/Controllers/Planning/PlanningController.php:238
 * @route '/api/planning/check-today'
 */
export const checkToday = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: checkToday.url(options),
    method: 'post',
});

checkToday.definition = {
    methods: ['post'],
    url: '/api/planning/check-today',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Planning\PlanningController::checkToday
 * @see app/Http/Controllers/Planning/PlanningController.php:238
 * @route '/api/planning/check-today'
 */
checkToday.url = (options?: RouteQueryOptions) => {
    return checkToday.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Planning\PlanningController::checkToday
 * @see app/Http/Controllers/Planning/PlanningController.php:238
 * @route '/api/planning/check-today'
 */
checkToday.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkToday.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::checkToday
 * @see app/Http/Controllers/Planning/PlanningController.php:238
 * @route '/api/planning/check-today'
 */
const checkTodayForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: checkToday.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::checkToday
 * @see app/Http/Controllers/Planning/PlanningController.php:238
 * @route '/api/planning/check-today'
 */
checkTodayForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: checkToday.url(options),
    method: 'post',
});

checkToday.form = checkTodayForm;

/**
 * @see \App\Http\Controllers\Planning\PlanningController::forceReschedule
 * @see app/Http/Controllers/Planning/PlanningController.php:284
 * @route '/api/planning/force-reschedule'
 */
export const forceReschedule = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: forceReschedule.url(options),
    method: 'post',
});

forceReschedule.definition = {
    methods: ['post'],
    url: '/api/planning/force-reschedule',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Planning\PlanningController::forceReschedule
 * @see app/Http/Controllers/Planning/PlanningController.php:284
 * @route '/api/planning/force-reschedule'
 */
forceReschedule.url = (options?: RouteQueryOptions) => {
    return forceReschedule.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Planning\PlanningController::forceReschedule
 * @see app/Http/Controllers/Planning/PlanningController.php:284
 * @route '/api/planning/force-reschedule'
 */
forceReschedule.post = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: forceReschedule.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::forceReschedule
 * @see app/Http/Controllers/Planning/PlanningController.php:284
 * @route '/api/planning/force-reschedule'
 */
const forceRescheduleForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: forceReschedule.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::forceReschedule
 * @see app/Http/Controllers/Planning/PlanningController.php:284
 * @route '/api/planning/force-reschedule'
 */
forceRescheduleForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: forceReschedule.url(options),
    method: 'post',
});

forceReschedule.form = forceRescheduleForm;

/**
 * @see \App\Http\Controllers\Planning\PlanningController::index
 * @see app/Http/Controllers/Planning/PlanningController.php:38
 * @route '/planning'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/planning',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Planning\PlanningController::index
 * @see app/Http/Controllers/Planning/PlanningController.php:38
 * @route '/planning'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Planning\PlanningController::index
 * @see app/Http/Controllers/Planning/PlanningController.php:38
 * @route '/planning'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::index
 * @see app/Http/Controllers/Planning/PlanningController.php:38
 * @route '/planning'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::index
 * @see app/Http/Controllers/Planning/PlanningController.php:38
 * @route '/planning'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::index
 * @see app/Http/Controllers/Planning/PlanningController.php:38
 * @route '/planning'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::index
 * @see app/Http/Controllers/Planning/PlanningController.php:38
 * @route '/planning'
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

const PlanningController = {
    data,
    save,
    saveSummary,
    calculateHours,
    checkToday,
    forceReschedule,
    index,
};

export default PlanningController;

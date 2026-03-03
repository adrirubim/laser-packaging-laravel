import {
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Planning\PlanningController::save
 * @see app/Http/Controllers/Planning/PlanningController.php:157
 * @route '/api/planning/summary/save'
 */
export const save = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(options),
    method: 'post',
});

save.definition = {
    methods: ['post'],
    url: '/api/planning/summary/save',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Planning\PlanningController::save
 * @see app/Http/Controllers/Planning/PlanningController.php:157
 * @route '/api/planning/summary/save'
 */
save.url = (options?: RouteQueryOptions) => {
    return save.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Planning\PlanningController::save
 * @see app/Http/Controllers/Planning/PlanningController.php:157
 * @route '/api/planning/summary/save'
 */
save.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: save.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::save
 * @see app/Http/Controllers/Planning/PlanningController.php:157
 * @route '/api/planning/summary/save'
 */
const saveForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: save.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Planning\PlanningController::save
 * @see app/Http/Controllers/Planning/PlanningController.php:157
 * @route '/api/planning/summary/save'
 */
saveForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: save.url(options),
    method: 'post',
});

save.form = saveForm;

const summary = {
    save: Object.assign(save, save),
};

export default summary;

import {
    applyUrlDefaults,
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\LasWorkLineController::index
 * @see app/Http/Controllers/LasWorkLineController.php:20
 * @route '/offers/las-work-lines'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/offers/las-work-lines',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\LasWorkLineController::index
 * @see app/Http/Controllers/LasWorkLineController.php:20
 * @route '/offers/las-work-lines'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\LasWorkLineController::index
 * @see app/Http/Controllers/LasWorkLineController.php:20
 * @route '/offers/las-work-lines'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::index
 * @see app/Http/Controllers/LasWorkLineController.php:20
 * @route '/offers/las-work-lines'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::index
 * @see app/Http/Controllers/LasWorkLineController.php:20
 * @route '/offers/las-work-lines'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::index
 * @see app/Http/Controllers/LasWorkLineController.php:20
 * @route '/offers/las-work-lines'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::index
 * @see app/Http/Controllers/LasWorkLineController.php:20
 * @route '/offers/las-work-lines'
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
 * @see \App\Http\Controllers\LasWorkLineController::create
 * @see app/Http/Controllers/LasWorkLineController.php:41
 * @route '/offers/las-work-lines/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/offers/las-work-lines/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\LasWorkLineController::create
 * @see app/Http/Controllers/LasWorkLineController.php:41
 * @route '/offers/las-work-lines/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\LasWorkLineController::create
 * @see app/Http/Controllers/LasWorkLineController.php:41
 * @route '/offers/las-work-lines/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::create
 * @see app/Http/Controllers/LasWorkLineController.php:41
 * @route '/offers/las-work-lines/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::create
 * @see app/Http/Controllers/LasWorkLineController.php:41
 * @route '/offers/las-work-lines/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::create
 * @see app/Http/Controllers/LasWorkLineController.php:41
 * @route '/offers/las-work-lines/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::create
 * @see app/Http/Controllers/LasWorkLineController.php:41
 * @route '/offers/las-work-lines/create'
 */
createForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

create.form = createForm;

/**
 * @see \App\Http\Controllers\LasWorkLineController::store
 * @see app/Http/Controllers/LasWorkLineController.php:46
 * @route '/offers/las-work-lines'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/offers/las-work-lines',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\LasWorkLineController::store
 * @see app/Http/Controllers/LasWorkLineController.php:46
 * @route '/offers/las-work-lines'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\LasWorkLineController::store
 * @see app/Http/Controllers/LasWorkLineController.php:46
 * @route '/offers/las-work-lines'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::store
 * @see app/Http/Controllers/LasWorkLineController.php:46
 * @route '/offers/las-work-lines'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::store
 * @see app/Http/Controllers/LasWorkLineController.php:46
 * @route '/offers/las-work-lines'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\LasWorkLineController::show
 * @see app/Http/Controllers/LasWorkLineController.php:70
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
export const show = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/offers/las-work-lines/{lasWorkLine}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\LasWorkLineController::show
 * @see app/Http/Controllers/LasWorkLineController.php:70
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
show.url = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lasWorkLine: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { lasWorkLine: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            lasWorkLine: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        lasWorkLine:
            typeof args.lasWorkLine === 'object'
                ? args.lasWorkLine.uuid
                : args.lasWorkLine,
    };

    return (
        show.definition.url
            .replace('{lasWorkLine}', parsedArgs.lasWorkLine.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\LasWorkLineController::show
 * @see app/Http/Controllers/LasWorkLineController.php:70
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
show.get = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::show
 * @see app/Http/Controllers/LasWorkLineController.php:70
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
show.head = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::show
 * @see app/Http/Controllers/LasWorkLineController.php:70
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
const showForm = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::show
 * @see app/Http/Controllers/LasWorkLineController.php:70
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
showForm.get = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::show
 * @see app/Http/Controllers/LasWorkLineController.php:70
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
showForm.head = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

show.form = showForm;

/**
 * @see \App\Http\Controllers\LasWorkLineController::edit
 * @see app/Http/Controllers/LasWorkLineController.php:77
 * @route '/offers/las-work-lines/{lasWorkLine}/edit'
 */
export const edit = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/offers/las-work-lines/{lasWorkLine}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\LasWorkLineController::edit
 * @see app/Http/Controllers/LasWorkLineController.php:77
 * @route '/offers/las-work-lines/{lasWorkLine}/edit'
 */
edit.url = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lasWorkLine: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { lasWorkLine: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            lasWorkLine: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        lasWorkLine:
            typeof args.lasWorkLine === 'object'
                ? args.lasWorkLine.uuid
                : args.lasWorkLine,
    };

    return (
        edit.definition.url
            .replace('{lasWorkLine}', parsedArgs.lasWorkLine.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\LasWorkLineController::edit
 * @see app/Http/Controllers/LasWorkLineController.php:77
 * @route '/offers/las-work-lines/{lasWorkLine}/edit'
 */
edit.get = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::edit
 * @see app/Http/Controllers/LasWorkLineController.php:77
 * @route '/offers/las-work-lines/{lasWorkLine}/edit'
 */
edit.head = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::edit
 * @see app/Http/Controllers/LasWorkLineController.php:77
 * @route '/offers/las-work-lines/{lasWorkLine}/edit'
 */
const editForm = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::edit
 * @see app/Http/Controllers/LasWorkLineController.php:77
 * @route '/offers/las-work-lines/{lasWorkLine}/edit'
 */
editForm.get = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::edit
 * @see app/Http/Controllers/LasWorkLineController.php:77
 * @route '/offers/las-work-lines/{lasWorkLine}/edit'
 */
editForm.head = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

edit.form = editForm;

/**
 * @see \App\Http\Controllers\LasWorkLineController::update
 * @see app/Http/Controllers/LasWorkLineController.php:84
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
export const update = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put', 'patch'],
    url: '/offers/las-work-lines/{lasWorkLine}',
} satisfies RouteDefinition<['put', 'patch']>;

/**
 * @see \App\Http\Controllers\LasWorkLineController::update
 * @see app/Http/Controllers/LasWorkLineController.php:84
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
update.url = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lasWorkLine: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { lasWorkLine: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            lasWorkLine: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        lasWorkLine:
            typeof args.lasWorkLine === 'object'
                ? args.lasWorkLine.uuid
                : args.lasWorkLine,
    };

    return (
        update.definition.url
            .replace('{lasWorkLine}', parsedArgs.lasWorkLine.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\LasWorkLineController::update
 * @see app/Http/Controllers/LasWorkLineController.php:84
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
update.put = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::update
 * @see app/Http/Controllers/LasWorkLineController.php:84
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
update.patch = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::update
 * @see app/Http/Controllers/LasWorkLineController.php:84
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
const updateForm = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::update
 * @see app/Http/Controllers/LasWorkLineController.php:84
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
updateForm.put = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::update
 * @see app/Http/Controllers/LasWorkLineController.php:84
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
updateForm.patch = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

update.form = updateForm;

/**
 * @see \App\Http\Controllers\LasWorkLineController::destroy
 * @see app/Http/Controllers/LasWorkLineController.php:104
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
export const destroy = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/offers/las-work-lines/{lasWorkLine}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\LasWorkLineController::destroy
 * @see app/Http/Controllers/LasWorkLineController.php:104
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
destroy.url = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lasWorkLine: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { lasWorkLine: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            lasWorkLine: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        lasWorkLine:
            typeof args.lasWorkLine === 'object'
                ? args.lasWorkLine.uuid
                : args.lasWorkLine,
    };

    return (
        destroy.definition.url
            .replace('{lasWorkLine}', parsedArgs.lasWorkLine.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\LasWorkLineController::destroy
 * @see app/Http/Controllers/LasWorkLineController.php:104
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
destroy.delete = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::destroy
 * @see app/Http/Controllers/LasWorkLineController.php:104
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
const destroyForm = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\LasWorkLineController::destroy
 * @see app/Http/Controllers/LasWorkLineController.php:104
 * @route '/offers/las-work-lines/{lasWorkLine}'
 */
destroyForm.delete = (
    args:
        | { lasWorkLine: string | { uuid: string } }
        | [lasWorkLine: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

destroy.form = destroyForm;

const LasWorkLineController = {
    index,
    create,
    store,
    show,
    edit,
    update,
    destroy,
};

export default LasWorkLineController;

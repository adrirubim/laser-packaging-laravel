import {
    applyUrlDefaults,
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\CriticalIssueController::index
 * @see app/Http/Controllers/CriticalIssueController.php:23
 * @route '/critical-issues'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/critical-issues',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\CriticalIssueController::index
 * @see app/Http/Controllers/CriticalIssueController.php:23
 * @route '/critical-issues'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\CriticalIssueController::index
 * @see app/Http/Controllers/CriticalIssueController.php:23
 * @route '/critical-issues'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::index
 * @see app/Http/Controllers/CriticalIssueController.php:23
 * @route '/critical-issues'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::index
 * @see app/Http/Controllers/CriticalIssueController.php:23
 * @route '/critical-issues'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::index
 * @see app/Http/Controllers/CriticalIssueController.php:23
 * @route '/critical-issues'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::index
 * @see app/Http/Controllers/CriticalIssueController.php:23
 * @route '/critical-issues'
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
 * @see \App\Http\Controllers\CriticalIssueController::create
 * @see app/Http/Controllers/CriticalIssueController.php:47
 * @route '/critical-issues/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/critical-issues/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\CriticalIssueController::create
 * @see app/Http/Controllers/CriticalIssueController.php:47
 * @route '/critical-issues/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\CriticalIssueController::create
 * @see app/Http/Controllers/CriticalIssueController.php:47
 * @route '/critical-issues/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::create
 * @see app/Http/Controllers/CriticalIssueController.php:47
 * @route '/critical-issues/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::create
 * @see app/Http/Controllers/CriticalIssueController.php:47
 * @route '/critical-issues/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::create
 * @see app/Http/Controllers/CriticalIssueController.php:47
 * @route '/critical-issues/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::create
 * @see app/Http/Controllers/CriticalIssueController.php:47
 * @route '/critical-issues/create'
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
 * @see \App\Http\Controllers\CriticalIssueController::store
 * @see app/Http/Controllers/CriticalIssueController.php:55
 * @route '/critical-issues'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/critical-issues',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\CriticalIssueController::store
 * @see app/Http/Controllers/CriticalIssueController.php:55
 * @route '/critical-issues'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\CriticalIssueController::store
 * @see app/Http/Controllers/CriticalIssueController.php:55
 * @route '/critical-issues'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::store
 * @see app/Http/Controllers/CriticalIssueController.php:55
 * @route '/critical-issues'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::store
 * @see app/Http/Controllers/CriticalIssueController.php:55
 * @route '/critical-issues'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\CriticalIssueController::show
 * @see app/Http/Controllers/CriticalIssueController.php:73
 * @route '/critical-issues/{criticalIssue}'
 */
export const show = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/critical-issues/{criticalIssue}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\CriticalIssueController::show
 * @see app/Http/Controllers/CriticalIssueController.php:73
 * @route '/critical-issues/{criticalIssue}'
 */
show.url = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { criticalIssue: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { criticalIssue: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            criticalIssue: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        criticalIssue:
            typeof args.criticalIssue === 'object'
                ? args.criticalIssue.uuid
                : args.criticalIssue,
    };

    return (
        show.definition.url
            .replace('{criticalIssue}', parsedArgs.criticalIssue.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\CriticalIssueController::show
 * @see app/Http/Controllers/CriticalIssueController.php:73
 * @route '/critical-issues/{criticalIssue}'
 */
show.get = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::show
 * @see app/Http/Controllers/CriticalIssueController.php:73
 * @route '/critical-issues/{criticalIssue}'
 */
show.head = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::show
 * @see app/Http/Controllers/CriticalIssueController.php:73
 * @route '/critical-issues/{criticalIssue}'
 */
const showForm = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::show
 * @see app/Http/Controllers/CriticalIssueController.php:73
 * @route '/critical-issues/{criticalIssue}'
 */
showForm.get = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::show
 * @see app/Http/Controllers/CriticalIssueController.php:73
 * @route '/critical-issues/{criticalIssue}'
 */
showForm.head = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
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
 * @see \App\Http\Controllers\CriticalIssueController::edit
 * @see app/Http/Controllers/CriticalIssueController.php:85
 * @route '/critical-issues/{criticalIssue}/edit'
 */
export const edit = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/critical-issues/{criticalIssue}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\CriticalIssueController::edit
 * @see app/Http/Controllers/CriticalIssueController.php:85
 * @route '/critical-issues/{criticalIssue}/edit'
 */
edit.url = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { criticalIssue: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { criticalIssue: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            criticalIssue: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        criticalIssue:
            typeof args.criticalIssue === 'object'
                ? args.criticalIssue.uuid
                : args.criticalIssue,
    };

    return (
        edit.definition.url
            .replace('{criticalIssue}', parsedArgs.criticalIssue.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\CriticalIssueController::edit
 * @see app/Http/Controllers/CriticalIssueController.php:85
 * @route '/critical-issues/{criticalIssue}/edit'
 */
edit.get = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::edit
 * @see app/Http/Controllers/CriticalIssueController.php:85
 * @route '/critical-issues/{criticalIssue}/edit'
 */
edit.head = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::edit
 * @see app/Http/Controllers/CriticalIssueController.php:85
 * @route '/critical-issues/{criticalIssue}/edit'
 */
const editForm = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::edit
 * @see app/Http/Controllers/CriticalIssueController.php:85
 * @route '/critical-issues/{criticalIssue}/edit'
 */
editForm.get = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::edit
 * @see app/Http/Controllers/CriticalIssueController.php:85
 * @route '/critical-issues/{criticalIssue}/edit'
 */
editForm.head = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
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
 * @see \App\Http\Controllers\CriticalIssueController::update
 * @see app/Http/Controllers/CriticalIssueController.php:95
 * @route '/critical-issues/{criticalIssue}'
 */
export const update = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put', 'patch'],
    url: '/critical-issues/{criticalIssue}',
} satisfies RouteDefinition<['put', 'patch']>;

/**
 * @see \App\Http\Controllers\CriticalIssueController::update
 * @see app/Http/Controllers/CriticalIssueController.php:95
 * @route '/critical-issues/{criticalIssue}'
 */
update.url = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { criticalIssue: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { criticalIssue: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            criticalIssue: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        criticalIssue:
            typeof args.criticalIssue === 'object'
                ? args.criticalIssue.uuid
                : args.criticalIssue,
    };

    return (
        update.definition.url
            .replace('{criticalIssue}', parsedArgs.criticalIssue.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\CriticalIssueController::update
 * @see app/Http/Controllers/CriticalIssueController.php:95
 * @route '/critical-issues/{criticalIssue}'
 */
update.put = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::update
 * @see app/Http/Controllers/CriticalIssueController.php:95
 * @route '/critical-issues/{criticalIssue}'
 */
update.patch = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::update
 * @see app/Http/Controllers/CriticalIssueController.php:95
 * @route '/critical-issues/{criticalIssue}'
 */
const updateForm = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
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
 * @see \App\Http\Controllers\CriticalIssueController::update
 * @see app/Http/Controllers/CriticalIssueController.php:95
 * @route '/critical-issues/{criticalIssue}'
 */
updateForm.put = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
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
 * @see \App\Http\Controllers\CriticalIssueController::update
 * @see app/Http/Controllers/CriticalIssueController.php:95
 * @route '/critical-issues/{criticalIssue}'
 */
updateForm.patch = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
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
 * @see \App\Http\Controllers\CriticalIssueController::destroy
 * @see app/Http/Controllers/CriticalIssueController.php:110
 * @route '/critical-issues/{criticalIssue}'
 */
export const destroy = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/critical-issues/{criticalIssue}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\CriticalIssueController::destroy
 * @see app/Http/Controllers/CriticalIssueController.php:110
 * @route '/critical-issues/{criticalIssue}'
 */
destroy.url = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { criticalIssue: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { criticalIssue: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            criticalIssue: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        criticalIssue:
            typeof args.criticalIssue === 'object'
                ? args.criticalIssue.uuid
                : args.criticalIssue,
    };

    return (
        destroy.definition.url
            .replace('{criticalIssue}', parsedArgs.criticalIssue.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\CriticalIssueController::destroy
 * @see app/Http/Controllers/CriticalIssueController.php:110
 * @route '/critical-issues/{criticalIssue}'
 */
destroy.delete = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\CriticalIssueController::destroy
 * @see app/Http/Controllers/CriticalIssueController.php:110
 * @route '/critical-issues/{criticalIssue}'
 */
const destroyForm = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
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
 * @see \App\Http\Controllers\CriticalIssueController::destroy
 * @see app/Http/Controllers/CriticalIssueController.php:110
 * @route '/critical-issues/{criticalIssue}'
 */
destroyForm.delete = (
    args:
        | { criticalIssue: string | { uuid: string } }
        | [criticalIssue: string | { uuid: string }]
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

const CriticalIssueController = {
    index,
    create,
    store,
    show,
    edit,
    update,
    destroy,
};

export default CriticalIssueController;

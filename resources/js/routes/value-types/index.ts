import {
    applyUrlDefaults,
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\ValueTypesController::index
 * @see app/Http/Controllers/ValueTypesController.php:12
 * @route '/value-types'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/value-types',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ValueTypesController::index
 * @see app/Http/Controllers/ValueTypesController.php:12
 * @route '/value-types'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ValueTypesController::index
 * @see app/Http/Controllers/ValueTypesController.php:12
 * @route '/value-types'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::index
 * @see app/Http/Controllers/ValueTypesController.php:12
 * @route '/value-types'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::index
 * @see app/Http/Controllers/ValueTypesController.php:12
 * @route '/value-types'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::index
 * @see app/Http/Controllers/ValueTypesController.php:12
 * @route '/value-types'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::index
 * @see app/Http/Controllers/ValueTypesController.php:12
 * @route '/value-types'
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
 * @see \App\Http\Controllers\ValueTypesController::create
 * @see app/Http/Controllers/ValueTypesController.php:30
 * @route '/value-types/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/value-types/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ValueTypesController::create
 * @see app/Http/Controllers/ValueTypesController.php:30
 * @route '/value-types/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ValueTypesController::create
 * @see app/Http/Controllers/ValueTypesController.php:30
 * @route '/value-types/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::create
 * @see app/Http/Controllers/ValueTypesController.php:30
 * @route '/value-types/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::create
 * @see app/Http/Controllers/ValueTypesController.php:30
 * @route '/value-types/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::create
 * @see app/Http/Controllers/ValueTypesController.php:30
 * @route '/value-types/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::create
 * @see app/Http/Controllers/ValueTypesController.php:30
 * @route '/value-types/create'
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
 * @see \App\Http\Controllers\ValueTypesController::store
 * @see app/Http/Controllers/ValueTypesController.php:35
 * @route '/value-types'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/value-types',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ValueTypesController::store
 * @see app/Http/Controllers/ValueTypesController.php:35
 * @route '/value-types'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ValueTypesController::store
 * @see app/Http/Controllers/ValueTypesController.php:35
 * @route '/value-types'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::store
 * @see app/Http/Controllers/ValueTypesController.php:35
 * @route '/value-types'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::store
 * @see app/Http/Controllers/ValueTypesController.php:35
 * @route '/value-types'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\ValueTypesController::show
 * @see app/Http/Controllers/ValueTypesController.php:56
 * @route '/value-types/{valueType}'
 */
export const show = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/value-types/{valueType}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ValueTypesController::show
 * @see app/Http/Controllers/ValueTypesController.php:56
 * @route '/value-types/{valueType}'
 */
show.url = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { valueType: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { valueType: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            valueType: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        valueType:
            typeof args.valueType === 'object'
                ? args.valueType.uuid
                : args.valueType,
    };

    return (
        show.definition.url
            .replace('{valueType}', parsedArgs.valueType.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ValueTypesController::show
 * @see app/Http/Controllers/ValueTypesController.php:56
 * @route '/value-types/{valueType}'
 */
show.get = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::show
 * @see app/Http/Controllers/ValueTypesController.php:56
 * @route '/value-types/{valueType}'
 */
show.head = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::show
 * @see app/Http/Controllers/ValueTypesController.php:56
 * @route '/value-types/{valueType}'
 */
const showForm = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::show
 * @see app/Http/Controllers/ValueTypesController.php:56
 * @route '/value-types/{valueType}'
 */
showForm.get = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::show
 * @see app/Http/Controllers/ValueTypesController.php:56
 * @route '/value-types/{valueType}'
 */
showForm.head = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ValueTypesController::edit
 * @see app/Http/Controllers/ValueTypesController.php:63
 * @route '/value-types/{valueType}/edit'
 */
export const edit = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/value-types/{valueType}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ValueTypesController::edit
 * @see app/Http/Controllers/ValueTypesController.php:63
 * @route '/value-types/{valueType}/edit'
 */
edit.url = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { valueType: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { valueType: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            valueType: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        valueType:
            typeof args.valueType === 'object'
                ? args.valueType.uuid
                : args.valueType,
    };

    return (
        edit.definition.url
            .replace('{valueType}', parsedArgs.valueType.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ValueTypesController::edit
 * @see app/Http/Controllers/ValueTypesController.php:63
 * @route '/value-types/{valueType}/edit'
 */
edit.get = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::edit
 * @see app/Http/Controllers/ValueTypesController.php:63
 * @route '/value-types/{valueType}/edit'
 */
edit.head = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::edit
 * @see app/Http/Controllers/ValueTypesController.php:63
 * @route '/value-types/{valueType}/edit'
 */
const editForm = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::edit
 * @see app/Http/Controllers/ValueTypesController.php:63
 * @route '/value-types/{valueType}/edit'
 */
editForm.get = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::edit
 * @see app/Http/Controllers/ValueTypesController.php:63
 * @route '/value-types/{valueType}/edit'
 */
editForm.head = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ValueTypesController::update
 * @see app/Http/Controllers/ValueTypesController.php:70
 * @route '/value-types/{valueType}'
 */
export const update = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put', 'patch'],
    url: '/value-types/{valueType}',
} satisfies RouteDefinition<['put', 'patch']>;

/**
 * @see \App\Http\Controllers\ValueTypesController::update
 * @see app/Http/Controllers/ValueTypesController.php:70
 * @route '/value-types/{valueType}'
 */
update.url = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { valueType: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { valueType: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            valueType: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        valueType:
            typeof args.valueType === 'object'
                ? args.valueType.uuid
                : args.valueType,
    };

    return (
        update.definition.url
            .replace('{valueType}', parsedArgs.valueType.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ValueTypesController::update
 * @see app/Http/Controllers/ValueTypesController.php:70
 * @route '/value-types/{valueType}'
 */
update.put = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::update
 * @see app/Http/Controllers/ValueTypesController.php:70
 * @route '/value-types/{valueType}'
 */
update.patch = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::update
 * @see app/Http/Controllers/ValueTypesController.php:70
 * @route '/value-types/{valueType}'
 */
const updateForm = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ValueTypesController::update
 * @see app/Http/Controllers/ValueTypesController.php:70
 * @route '/value-types/{valueType}'
 */
updateForm.put = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ValueTypesController::update
 * @see app/Http/Controllers/ValueTypesController.php:70
 * @route '/value-types/{valueType}'
 */
updateForm.patch = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ValueTypesController::destroy
 * @see app/Http/Controllers/ValueTypesController.php:85
 * @route '/value-types/{valueType}'
 */
export const destroy = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/value-types/{valueType}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\ValueTypesController::destroy
 * @see app/Http/Controllers/ValueTypesController.php:85
 * @route '/value-types/{valueType}'
 */
destroy.url = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { valueType: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { valueType: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            valueType: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        valueType:
            typeof args.valueType === 'object'
                ? args.valueType.uuid
                : args.valueType,
    };

    return (
        destroy.definition.url
            .replace('{valueType}', parsedArgs.valueType.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ValueTypesController::destroy
 * @see app/Http/Controllers/ValueTypesController.php:85
 * @route '/value-types/{valueType}'
 */
destroy.delete = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\ValueTypesController::destroy
 * @see app/Http/Controllers/ValueTypesController.php:85
 * @route '/value-types/{valueType}'
 */
const destroyForm = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ValueTypesController::destroy
 * @see app/Http/Controllers/ValueTypesController.php:85
 * @route '/value-types/{valueType}'
 */
destroyForm.delete = (
    args:
        | { valueType: string | { uuid: string } }
        | [valueType: string | { uuid: string }]
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

const valueTypes = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
};

export default valueTypes;

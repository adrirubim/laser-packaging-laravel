import {
    applyUrlDefaults,
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\PalletTypeController::index
 * @see app/Http/Controllers/PalletTypeController.php:24
 * @route '/pallet-types'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/pallet-types',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\PalletTypeController::index
 * @see app/Http/Controllers/PalletTypeController.php:24
 * @route '/pallet-types'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\PalletTypeController::index
 * @see app/Http/Controllers/PalletTypeController.php:24
 * @route '/pallet-types'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::index
 * @see app/Http/Controllers/PalletTypeController.php:24
 * @route '/pallet-types'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::index
 * @see app/Http/Controllers/PalletTypeController.php:24
 * @route '/pallet-types'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::index
 * @see app/Http/Controllers/PalletTypeController.php:24
 * @route '/pallet-types'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::index
 * @see app/Http/Controllers/PalletTypeController.php:24
 * @route '/pallet-types'
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
 * @see \App\Http\Controllers\PalletTypeController::create
 * @see app/Http/Controllers/PalletTypeController.php:49
 * @route '/pallet-types/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/pallet-types/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\PalletTypeController::create
 * @see app/Http/Controllers/PalletTypeController.php:49
 * @route '/pallet-types/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\PalletTypeController::create
 * @see app/Http/Controllers/PalletTypeController.php:49
 * @route '/pallet-types/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::create
 * @see app/Http/Controllers/PalletTypeController.php:49
 * @route '/pallet-types/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::create
 * @see app/Http/Controllers/PalletTypeController.php:49
 * @route '/pallet-types/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::create
 * @see app/Http/Controllers/PalletTypeController.php:49
 * @route '/pallet-types/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::create
 * @see app/Http/Controllers/PalletTypeController.php:49
 * @route '/pallet-types/create'
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
 * @see \App\Http\Controllers\PalletTypeController::store
 * @see app/Http/Controllers/PalletTypeController.php:57
 * @route '/pallet-types'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/pallet-types',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\PalletTypeController::store
 * @see app/Http/Controllers/PalletTypeController.php:57
 * @route '/pallet-types'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\PalletTypeController::store
 * @see app/Http/Controllers/PalletTypeController.php:57
 * @route '/pallet-types'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::store
 * @see app/Http/Controllers/PalletTypeController.php:57
 * @route '/pallet-types'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::store
 * @see app/Http/Controllers/PalletTypeController.php:57
 * @route '/pallet-types'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\PalletTypeController::show
 * @see app/Http/Controllers/PalletTypeController.php:76
 * @route '/pallet-types/{palletType}'
 */
export const show = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/pallet-types/{palletType}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\PalletTypeController::show
 * @see app/Http/Controllers/PalletTypeController.php:76
 * @route '/pallet-types/{palletType}'
 */
show.url = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { palletType: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { palletType: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            palletType: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        palletType:
            typeof args.palletType === 'object'
                ? args.palletType.uuid
                : args.palletType,
    };

    return (
        show.definition.url
            .replace('{palletType}', parsedArgs.palletType.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\PalletTypeController::show
 * @see app/Http/Controllers/PalletTypeController.php:76
 * @route '/pallet-types/{palletType}'
 */
show.get = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::show
 * @see app/Http/Controllers/PalletTypeController.php:76
 * @route '/pallet-types/{palletType}'
 */
show.head = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::show
 * @see app/Http/Controllers/PalletTypeController.php:76
 * @route '/pallet-types/{palletType}'
 */
const showForm = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::show
 * @see app/Http/Controllers/PalletTypeController.php:76
 * @route '/pallet-types/{palletType}'
 */
showForm.get = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::show
 * @see app/Http/Controllers/PalletTypeController.php:76
 * @route '/pallet-types/{palletType}'
 */
showForm.head = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
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
 * @see \App\Http\Controllers\PalletTypeController::edit
 * @see app/Http/Controllers/PalletTypeController.php:88
 * @route '/pallet-types/{palletType}/edit'
 */
export const edit = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/pallet-types/{palletType}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\PalletTypeController::edit
 * @see app/Http/Controllers/PalletTypeController.php:88
 * @route '/pallet-types/{palletType}/edit'
 */
edit.url = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { palletType: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { palletType: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            palletType: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        palletType:
            typeof args.palletType === 'object'
                ? args.palletType.uuid
                : args.palletType,
    };

    return (
        edit.definition.url
            .replace('{palletType}', parsedArgs.palletType.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\PalletTypeController::edit
 * @see app/Http/Controllers/PalletTypeController.php:88
 * @route '/pallet-types/{palletType}/edit'
 */
edit.get = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::edit
 * @see app/Http/Controllers/PalletTypeController.php:88
 * @route '/pallet-types/{palletType}/edit'
 */
edit.head = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::edit
 * @see app/Http/Controllers/PalletTypeController.php:88
 * @route '/pallet-types/{palletType}/edit'
 */
const editForm = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::edit
 * @see app/Http/Controllers/PalletTypeController.php:88
 * @route '/pallet-types/{palletType}/edit'
 */
editForm.get = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::edit
 * @see app/Http/Controllers/PalletTypeController.php:88
 * @route '/pallet-types/{palletType}/edit'
 */
editForm.head = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
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
 * @see \App\Http\Controllers\PalletTypeController::update
 * @see app/Http/Controllers/PalletTypeController.php:98
 * @route '/pallet-types/{palletType}'
 */
export const update = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put', 'patch'],
    url: '/pallet-types/{palletType}',
} satisfies RouteDefinition<['put', 'patch']>;

/**
 * @see \App\Http\Controllers\PalletTypeController::update
 * @see app/Http/Controllers/PalletTypeController.php:98
 * @route '/pallet-types/{palletType}'
 */
update.url = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { palletType: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { palletType: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            palletType: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        palletType:
            typeof args.palletType === 'object'
                ? args.palletType.uuid
                : args.palletType,
    };

    return (
        update.definition.url
            .replace('{palletType}', parsedArgs.palletType.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\PalletTypeController::update
 * @see app/Http/Controllers/PalletTypeController.php:98
 * @route '/pallet-types/{palletType}'
 */
update.put = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::update
 * @see app/Http/Controllers/PalletTypeController.php:98
 * @route '/pallet-types/{palletType}'
 */
update.patch = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::update
 * @see app/Http/Controllers/PalletTypeController.php:98
 * @route '/pallet-types/{palletType}'
 */
const updateForm = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
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
 * @see \App\Http\Controllers\PalletTypeController::update
 * @see app/Http/Controllers/PalletTypeController.php:98
 * @route '/pallet-types/{palletType}'
 */
updateForm.put = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
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
 * @see \App\Http\Controllers\PalletTypeController::update
 * @see app/Http/Controllers/PalletTypeController.php:98
 * @route '/pallet-types/{palletType}'
 */
updateForm.patch = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
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
 * @see \App\Http\Controllers\PalletTypeController::destroy
 * @see app/Http/Controllers/PalletTypeController.php:112
 * @route '/pallet-types/{palletType}'
 */
export const destroy = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/pallet-types/{palletType}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\PalletTypeController::destroy
 * @see app/Http/Controllers/PalletTypeController.php:112
 * @route '/pallet-types/{palletType}'
 */
destroy.url = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { palletType: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { palletType: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            palletType: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        palletType:
            typeof args.palletType === 'object'
                ? args.palletType.uuid
                : args.palletType,
    };

    return (
        destroy.definition.url
            .replace('{palletType}', parsedArgs.palletType.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\PalletTypeController::destroy
 * @see app/Http/Controllers/PalletTypeController.php:112
 * @route '/pallet-types/{palletType}'
 */
destroy.delete = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\PalletTypeController::destroy
 * @see app/Http/Controllers/PalletTypeController.php:112
 * @route '/pallet-types/{palletType}'
 */
const destroyForm = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
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
 * @see \App\Http\Controllers\PalletTypeController::destroy
 * @see app/Http/Controllers/PalletTypeController.php:112
 * @route '/pallet-types/{palletType}'
 */
destroyForm.delete = (
    args:
        | { palletType: string | { uuid: string } }
        | [palletType: string | { uuid: string }]
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

const PalletTypeController = {
    index,
    create,
    store,
    show,
    edit,
    update,
    destroy,
};

export default PalletTypeController;

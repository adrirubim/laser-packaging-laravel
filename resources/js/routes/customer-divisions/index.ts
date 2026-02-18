import {
    applyUrlDefaults,
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\CustomerDivisionController::index
 * @see app/Http/Controllers/CustomerDivisionController.php:32
 * @route '/customer-divisions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/customer-divisions',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\CustomerDivisionController::index
 * @see app/Http/Controllers/CustomerDivisionController.php:32
 * @route '/customer-divisions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\CustomerDivisionController::index
 * @see app/Http/Controllers/CustomerDivisionController.php:32
 * @route '/customer-divisions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::index
 * @see app/Http/Controllers/CustomerDivisionController.php:32
 * @route '/customer-divisions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::index
 * @see app/Http/Controllers/CustomerDivisionController.php:32
 * @route '/customer-divisions'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::index
 * @see app/Http/Controllers/CustomerDivisionController.php:32
 * @route '/customer-divisions'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::index
 * @see app/Http/Controllers/CustomerDivisionController.php:32
 * @route '/customer-divisions'
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
 * @see \App\Http\Controllers\CustomerDivisionController::create
 * @see app/Http/Controllers/CustomerDivisionController.php:47
 * @route '/customer-divisions/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/customer-divisions/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\CustomerDivisionController::create
 * @see app/Http/Controllers/CustomerDivisionController.php:47
 * @route '/customer-divisions/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\CustomerDivisionController::create
 * @see app/Http/Controllers/CustomerDivisionController.php:47
 * @route '/customer-divisions/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::create
 * @see app/Http/Controllers/CustomerDivisionController.php:47
 * @route '/customer-divisions/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::create
 * @see app/Http/Controllers/CustomerDivisionController.php:47
 * @route '/customer-divisions/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::create
 * @see app/Http/Controllers/CustomerDivisionController.php:47
 * @route '/customer-divisions/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::create
 * @see app/Http/Controllers/CustomerDivisionController.php:47
 * @route '/customer-divisions/create'
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
 * @see \App\Http\Controllers\CustomerDivisionController::store
 * @see app/Http/Controllers/CustomerDivisionController.php:60
 * @route '/customer-divisions'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/customer-divisions',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\CustomerDivisionController::store
 * @see app/Http/Controllers/CustomerDivisionController.php:60
 * @route '/customer-divisions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\CustomerDivisionController::store
 * @see app/Http/Controllers/CustomerDivisionController.php:60
 * @route '/customer-divisions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::store
 * @see app/Http/Controllers/CustomerDivisionController.php:60
 * @route '/customer-divisions'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::store
 * @see app/Http/Controllers/CustomerDivisionController.php:60
 * @route '/customer-divisions'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\CustomerDivisionController::show
 * @see app/Http/Controllers/CustomerDivisionController.php:74
 * @route '/customer-divisions/{customerDivision}'
 */
export const show = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/customer-divisions/{customerDivision}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\CustomerDivisionController::show
 * @see app/Http/Controllers/CustomerDivisionController.php:74
 * @route '/customer-divisions/{customerDivision}'
 */
show.url = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customerDivision: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { customerDivision: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            customerDivision: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        customerDivision:
            typeof args.customerDivision === 'object'
                ? args.customerDivision.uuid
                : args.customerDivision,
    };

    return (
        show.definition.url
            .replace(
                '{customerDivision}',
                parsedArgs.customerDivision.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\CustomerDivisionController::show
 * @see app/Http/Controllers/CustomerDivisionController.php:74
 * @route '/customer-divisions/{customerDivision}'
 */
show.get = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::show
 * @see app/Http/Controllers/CustomerDivisionController.php:74
 * @route '/customer-divisions/{customerDivision}'
 */
show.head = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::show
 * @see app/Http/Controllers/CustomerDivisionController.php:74
 * @route '/customer-divisions/{customerDivision}'
 */
const showForm = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::show
 * @see app/Http/Controllers/CustomerDivisionController.php:74
 * @route '/customer-divisions/{customerDivision}'
 */
showForm.get = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::show
 * @see app/Http/Controllers/CustomerDivisionController.php:74
 * @route '/customer-divisions/{customerDivision}'
 */
showForm.head = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
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
 * @see \App\Http\Controllers\CustomerDivisionController::edit
 * @see app/Http/Controllers/CustomerDivisionController.php:88
 * @route '/customer-divisions/{customerDivision}/edit'
 */
export const edit = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/customer-divisions/{customerDivision}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\CustomerDivisionController::edit
 * @see app/Http/Controllers/CustomerDivisionController.php:88
 * @route '/customer-divisions/{customerDivision}/edit'
 */
edit.url = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customerDivision: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { customerDivision: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            customerDivision: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        customerDivision:
            typeof args.customerDivision === 'object'
                ? args.customerDivision.uuid
                : args.customerDivision,
    };

    return (
        edit.definition.url
            .replace(
                '{customerDivision}',
                parsedArgs.customerDivision.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\CustomerDivisionController::edit
 * @see app/Http/Controllers/CustomerDivisionController.php:88
 * @route '/customer-divisions/{customerDivision}/edit'
 */
edit.get = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::edit
 * @see app/Http/Controllers/CustomerDivisionController.php:88
 * @route '/customer-divisions/{customerDivision}/edit'
 */
edit.head = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::edit
 * @see app/Http/Controllers/CustomerDivisionController.php:88
 * @route '/customer-divisions/{customerDivision}/edit'
 */
const editForm = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::edit
 * @see app/Http/Controllers/CustomerDivisionController.php:88
 * @route '/customer-divisions/{customerDivision}/edit'
 */
editForm.get = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::edit
 * @see app/Http/Controllers/CustomerDivisionController.php:88
 * @route '/customer-divisions/{customerDivision}/edit'
 */
editForm.head = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
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
 * @see \App\Http\Controllers\CustomerDivisionController::update
 * @see app/Http/Controllers/CustomerDivisionController.php:101
 * @route '/customer-divisions/{customerDivision}'
 */
export const update = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put', 'patch'],
    url: '/customer-divisions/{customerDivision}',
} satisfies RouteDefinition<['put', 'patch']>;

/**
 * @see \App\Http\Controllers\CustomerDivisionController::update
 * @see app/Http/Controllers/CustomerDivisionController.php:101
 * @route '/customer-divisions/{customerDivision}'
 */
update.url = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customerDivision: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { customerDivision: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            customerDivision: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        customerDivision:
            typeof args.customerDivision === 'object'
                ? args.customerDivision.uuid
                : args.customerDivision,
    };

    return (
        update.definition.url
            .replace(
                '{customerDivision}',
                parsedArgs.customerDivision.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\CustomerDivisionController::update
 * @see app/Http/Controllers/CustomerDivisionController.php:101
 * @route '/customer-divisions/{customerDivision}'
 */
update.put = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::update
 * @see app/Http/Controllers/CustomerDivisionController.php:101
 * @route '/customer-divisions/{customerDivision}'
 */
update.patch = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::update
 * @see app/Http/Controllers/CustomerDivisionController.php:101
 * @route '/customer-divisions/{customerDivision}'
 */
const updateForm = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
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
 * @see \App\Http\Controllers\CustomerDivisionController::update
 * @see app/Http/Controllers/CustomerDivisionController.php:101
 * @route '/customer-divisions/{customerDivision}'
 */
updateForm.put = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
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
 * @see \App\Http\Controllers\CustomerDivisionController::update
 * @see app/Http/Controllers/CustomerDivisionController.php:101
 * @route '/customer-divisions/{customerDivision}'
 */
updateForm.patch = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
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
 * @see \App\Http\Controllers\CustomerDivisionController::destroy
 * @see app/Http/Controllers/CustomerDivisionController.php:119
 * @route '/customer-divisions/{customerDivision}'
 */
export const destroy = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/customer-divisions/{customerDivision}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\CustomerDivisionController::destroy
 * @see app/Http/Controllers/CustomerDivisionController.php:119
 * @route '/customer-divisions/{customerDivision}'
 */
destroy.url = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customerDivision: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { customerDivision: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            customerDivision: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        customerDivision:
            typeof args.customerDivision === 'object'
                ? args.customerDivision.uuid
                : args.customerDivision,
    };

    return (
        destroy.definition.url
            .replace(
                '{customerDivision}',
                parsedArgs.customerDivision.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\CustomerDivisionController::destroy
 * @see app/Http/Controllers/CustomerDivisionController.php:119
 * @route '/customer-divisions/{customerDivision}'
 */
destroy.delete = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\CustomerDivisionController::destroy
 * @see app/Http/Controllers/CustomerDivisionController.php:119
 * @route '/customer-divisions/{customerDivision}'
 */
const destroyForm = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
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
 * @see \App\Http\Controllers\CustomerDivisionController::destroy
 * @see app/Http/Controllers/CustomerDivisionController.php:119
 * @route '/customer-divisions/{customerDivision}'
 */
destroyForm.delete = (
    args:
        | { customerDivision: string | { uuid: string } }
        | [customerDivision: string | { uuid: string }]
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

const customerDivisions = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
};

export default customerDivisions;

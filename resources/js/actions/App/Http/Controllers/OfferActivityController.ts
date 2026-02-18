import {
    applyUrlDefaults,
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\OfferActivityController::index
 * @see app/Http/Controllers/OfferActivityController.php:22
 * @route '/offers/activities'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/offers/activities',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferActivityController::index
 * @see app/Http/Controllers/OfferActivityController.php:22
 * @route '/offers/activities'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferActivityController::index
 * @see app/Http/Controllers/OfferActivityController.php:22
 * @route '/offers/activities'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::index
 * @see app/Http/Controllers/OfferActivityController.php:22
 * @route '/offers/activities'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::index
 * @see app/Http/Controllers/OfferActivityController.php:22
 * @route '/offers/activities'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::index
 * @see app/Http/Controllers/OfferActivityController.php:22
 * @route '/offers/activities'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::index
 * @see app/Http/Controllers/OfferActivityController.php:22
 * @route '/offers/activities'
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
 * @see \App\Http\Controllers\OfferActivityController::create
 * @see app/Http/Controllers/OfferActivityController.php:50
 * @route '/offers/activities/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/offers/activities/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferActivityController::create
 * @see app/Http/Controllers/OfferActivityController.php:50
 * @route '/offers/activities/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferActivityController::create
 * @see app/Http/Controllers/OfferActivityController.php:50
 * @route '/offers/activities/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::create
 * @see app/Http/Controllers/OfferActivityController.php:50
 * @route '/offers/activities/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::create
 * @see app/Http/Controllers/OfferActivityController.php:50
 * @route '/offers/activities/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::create
 * @see app/Http/Controllers/OfferActivityController.php:50
 * @route '/offers/activities/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::create
 * @see app/Http/Controllers/OfferActivityController.php:50
 * @route '/offers/activities/create'
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
 * @see \App\Http\Controllers\OfferActivityController::store
 * @see app/Http/Controllers/OfferActivityController.php:55
 * @route '/offers/activities'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/offers/activities',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\OfferActivityController::store
 * @see app/Http/Controllers/OfferActivityController.php:55
 * @route '/offers/activities'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferActivityController::store
 * @see app/Http/Controllers/OfferActivityController.php:55
 * @route '/offers/activities'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::store
 * @see app/Http/Controllers/OfferActivityController.php:55
 * @route '/offers/activities'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::store
 * @see app/Http/Controllers/OfferActivityController.php:55
 * @route '/offers/activities'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\OfferActivityController::show
 * @see app/Http/Controllers/OfferActivityController.php:66
 * @route '/offers/activities/{offerActivity}'
 */
export const show = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/offers/activities/{offerActivity}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferActivityController::show
 * @see app/Http/Controllers/OfferActivityController.php:66
 * @route '/offers/activities/{offerActivity}'
 */
show.url = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerActivity: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerActivity: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerActivity: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerActivity:
            typeof args.offerActivity === 'object'
                ? args.offerActivity.uuid
                : args.offerActivity,
    };

    return (
        show.definition.url
            .replace('{offerActivity}', parsedArgs.offerActivity.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferActivityController::show
 * @see app/Http/Controllers/OfferActivityController.php:66
 * @route '/offers/activities/{offerActivity}'
 */
show.get = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::show
 * @see app/Http/Controllers/OfferActivityController.php:66
 * @route '/offers/activities/{offerActivity}'
 */
show.head = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::show
 * @see app/Http/Controllers/OfferActivityController.php:66
 * @route '/offers/activities/{offerActivity}'
 */
const showForm = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::show
 * @see app/Http/Controllers/OfferActivityController.php:66
 * @route '/offers/activities/{offerActivity}'
 */
showForm.get = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::show
 * @see app/Http/Controllers/OfferActivityController.php:66
 * @route '/offers/activities/{offerActivity}'
 */
showForm.head = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferActivityController::edit
 * @see app/Http/Controllers/OfferActivityController.php:73
 * @route '/offers/activities/{offerActivity}/edit'
 */
export const edit = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/offers/activities/{offerActivity}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferActivityController::edit
 * @see app/Http/Controllers/OfferActivityController.php:73
 * @route '/offers/activities/{offerActivity}/edit'
 */
edit.url = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerActivity: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerActivity: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerActivity: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerActivity:
            typeof args.offerActivity === 'object'
                ? args.offerActivity.uuid
                : args.offerActivity,
    };

    return (
        edit.definition.url
            .replace('{offerActivity}', parsedArgs.offerActivity.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferActivityController::edit
 * @see app/Http/Controllers/OfferActivityController.php:73
 * @route '/offers/activities/{offerActivity}/edit'
 */
edit.get = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::edit
 * @see app/Http/Controllers/OfferActivityController.php:73
 * @route '/offers/activities/{offerActivity}/edit'
 */
edit.head = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::edit
 * @see app/Http/Controllers/OfferActivityController.php:73
 * @route '/offers/activities/{offerActivity}/edit'
 */
const editForm = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::edit
 * @see app/Http/Controllers/OfferActivityController.php:73
 * @route '/offers/activities/{offerActivity}/edit'
 */
editForm.get = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::edit
 * @see app/Http/Controllers/OfferActivityController.php:73
 * @route '/offers/activities/{offerActivity}/edit'
 */
editForm.head = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferActivityController::update
 * @see app/Http/Controllers/OfferActivityController.php:80
 * @route '/offers/activities/{offerActivity}'
 */
export const update = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put', 'patch'],
    url: '/offers/activities/{offerActivity}',
} satisfies RouteDefinition<['put', 'patch']>;

/**
 * @see \App\Http\Controllers\OfferActivityController::update
 * @see app/Http/Controllers/OfferActivityController.php:80
 * @route '/offers/activities/{offerActivity}'
 */
update.url = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerActivity: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerActivity: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerActivity: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerActivity:
            typeof args.offerActivity === 'object'
                ? args.offerActivity.uuid
                : args.offerActivity,
    };

    return (
        update.definition.url
            .replace('{offerActivity}', parsedArgs.offerActivity.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferActivityController::update
 * @see app/Http/Controllers/OfferActivityController.php:80
 * @route '/offers/activities/{offerActivity}'
 */
update.put = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::update
 * @see app/Http/Controllers/OfferActivityController.php:80
 * @route '/offers/activities/{offerActivity}'
 */
update.patch = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::update
 * @see app/Http/Controllers/OfferActivityController.php:80
 * @route '/offers/activities/{offerActivity}'
 */
const updateForm = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferActivityController::update
 * @see app/Http/Controllers/OfferActivityController.php:80
 * @route '/offers/activities/{offerActivity}'
 */
updateForm.put = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferActivityController::update
 * @see app/Http/Controllers/OfferActivityController.php:80
 * @route '/offers/activities/{offerActivity}'
 */
updateForm.patch = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferActivityController::destroy
 * @see app/Http/Controllers/OfferActivityController.php:88
 * @route '/offers/activities/{offerActivity}'
 */
export const destroy = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/offers/activities/{offerActivity}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\OfferActivityController::destroy
 * @see app/Http/Controllers/OfferActivityController.php:88
 * @route '/offers/activities/{offerActivity}'
 */
destroy.url = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerActivity: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerActivity: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerActivity: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerActivity:
            typeof args.offerActivity === 'object'
                ? args.offerActivity.uuid
                : args.offerActivity,
    };

    return (
        destroy.definition.url
            .replace('{offerActivity}', parsedArgs.offerActivity.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferActivityController::destroy
 * @see app/Http/Controllers/OfferActivityController.php:88
 * @route '/offers/activities/{offerActivity}'
 */
destroy.delete = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\OfferActivityController::destroy
 * @see app/Http/Controllers/OfferActivityController.php:88
 * @route '/offers/activities/{offerActivity}'
 */
const destroyForm = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferActivityController::destroy
 * @see app/Http/Controllers/OfferActivityController.php:88
 * @route '/offers/activities/{offerActivity}'
 */
destroyForm.delete = (
    args:
        | { offerActivity: string | { uuid: string } }
        | [offerActivity: string | { uuid: string }]
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

const OfferActivityController = {
    index,
    create,
    store,
    show,
    edit,
    update,
    destroy,
};

export default OfferActivityController;

import {
    applyUrlDefaults,
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\OfferSeasonalityController::index
 * @see app/Http/Controllers/OfferSeasonalityController.php:22
 * @route '/offers/seasonality'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/offers/seasonality',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::index
 * @see app/Http/Controllers/OfferSeasonalityController.php:22
 * @route '/offers/seasonality'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::index
 * @see app/Http/Controllers/OfferSeasonalityController.php:22
 * @route '/offers/seasonality'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::index
 * @see app/Http/Controllers/OfferSeasonalityController.php:22
 * @route '/offers/seasonality'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::index
 * @see app/Http/Controllers/OfferSeasonalityController.php:22
 * @route '/offers/seasonality'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::index
 * @see app/Http/Controllers/OfferSeasonalityController.php:22
 * @route '/offers/seasonality'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::index
 * @see app/Http/Controllers/OfferSeasonalityController.php:22
 * @route '/offers/seasonality'
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
 * @see \App\Http\Controllers\OfferSeasonalityController::create
 * @see app/Http/Controllers/OfferSeasonalityController.php:50
 * @route '/offers/seasonality/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/offers/seasonality/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::create
 * @see app/Http/Controllers/OfferSeasonalityController.php:50
 * @route '/offers/seasonality/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::create
 * @see app/Http/Controllers/OfferSeasonalityController.php:50
 * @route '/offers/seasonality/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::create
 * @see app/Http/Controllers/OfferSeasonalityController.php:50
 * @route '/offers/seasonality/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::create
 * @see app/Http/Controllers/OfferSeasonalityController.php:50
 * @route '/offers/seasonality/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::create
 * @see app/Http/Controllers/OfferSeasonalityController.php:50
 * @route '/offers/seasonality/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::create
 * @see app/Http/Controllers/OfferSeasonalityController.php:50
 * @route '/offers/seasonality/create'
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
 * @see \App\Http\Controllers\OfferSeasonalityController::store
 * @see app/Http/Controllers/OfferSeasonalityController.php:55
 * @route '/offers/seasonality'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/offers/seasonality',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::store
 * @see app/Http/Controllers/OfferSeasonalityController.php:55
 * @route '/offers/seasonality'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::store
 * @see app/Http/Controllers/OfferSeasonalityController.php:55
 * @route '/offers/seasonality'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::store
 * @see app/Http/Controllers/OfferSeasonalityController.php:55
 * @route '/offers/seasonality'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::store
 * @see app/Http/Controllers/OfferSeasonalityController.php:55
 * @route '/offers/seasonality'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::show
 * @see app/Http/Controllers/OfferSeasonalityController.php:66
 * @route '/offers/seasonality/{offerSeasonality}'
 */
export const show = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/offers/seasonality/{offerSeasonality}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::show
 * @see app/Http/Controllers/OfferSeasonalityController.php:66
 * @route '/offers/seasonality/{offerSeasonality}'
 */
show.url = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerSeasonality: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerSeasonality: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerSeasonality: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerSeasonality:
            typeof args.offerSeasonality === 'object'
                ? args.offerSeasonality.uuid
                : args.offerSeasonality,
    };

    return (
        show.definition.url
            .replace(
                '{offerSeasonality}',
                parsedArgs.offerSeasonality.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::show
 * @see app/Http/Controllers/OfferSeasonalityController.php:66
 * @route '/offers/seasonality/{offerSeasonality}'
 */
show.get = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::show
 * @see app/Http/Controllers/OfferSeasonalityController.php:66
 * @route '/offers/seasonality/{offerSeasonality}'
 */
show.head = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::show
 * @see app/Http/Controllers/OfferSeasonalityController.php:66
 * @route '/offers/seasonality/{offerSeasonality}'
 */
const showForm = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::show
 * @see app/Http/Controllers/OfferSeasonalityController.php:66
 * @route '/offers/seasonality/{offerSeasonality}'
 */
showForm.get = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::show
 * @see app/Http/Controllers/OfferSeasonalityController.php:66
 * @route '/offers/seasonality/{offerSeasonality}'
 */
showForm.head = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferSeasonalityController::edit
 * @see app/Http/Controllers/OfferSeasonalityController.php:73
 * @route '/offers/seasonality/{offerSeasonality}/edit'
 */
export const edit = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/offers/seasonality/{offerSeasonality}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::edit
 * @see app/Http/Controllers/OfferSeasonalityController.php:73
 * @route '/offers/seasonality/{offerSeasonality}/edit'
 */
edit.url = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerSeasonality: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerSeasonality: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerSeasonality: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerSeasonality:
            typeof args.offerSeasonality === 'object'
                ? args.offerSeasonality.uuid
                : args.offerSeasonality,
    };

    return (
        edit.definition.url
            .replace(
                '{offerSeasonality}',
                parsedArgs.offerSeasonality.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::edit
 * @see app/Http/Controllers/OfferSeasonalityController.php:73
 * @route '/offers/seasonality/{offerSeasonality}/edit'
 */
edit.get = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::edit
 * @see app/Http/Controllers/OfferSeasonalityController.php:73
 * @route '/offers/seasonality/{offerSeasonality}/edit'
 */
edit.head = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::edit
 * @see app/Http/Controllers/OfferSeasonalityController.php:73
 * @route '/offers/seasonality/{offerSeasonality}/edit'
 */
const editForm = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::edit
 * @see app/Http/Controllers/OfferSeasonalityController.php:73
 * @route '/offers/seasonality/{offerSeasonality}/edit'
 */
editForm.get = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::edit
 * @see app/Http/Controllers/OfferSeasonalityController.php:73
 * @route '/offers/seasonality/{offerSeasonality}/edit'
 */
editForm.head = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferSeasonalityController::update
 * @see app/Http/Controllers/OfferSeasonalityController.php:80
 * @route '/offers/seasonality/{offerSeasonality}'
 */
export const update = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put', 'patch'],
    url: '/offers/seasonality/{offerSeasonality}',
} satisfies RouteDefinition<['put', 'patch']>;

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::update
 * @see app/Http/Controllers/OfferSeasonalityController.php:80
 * @route '/offers/seasonality/{offerSeasonality}'
 */
update.url = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerSeasonality: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerSeasonality: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerSeasonality: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerSeasonality:
            typeof args.offerSeasonality === 'object'
                ? args.offerSeasonality.uuid
                : args.offerSeasonality,
    };

    return (
        update.definition.url
            .replace(
                '{offerSeasonality}',
                parsedArgs.offerSeasonality.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::update
 * @see app/Http/Controllers/OfferSeasonalityController.php:80
 * @route '/offers/seasonality/{offerSeasonality}'
 */
update.put = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::update
 * @see app/Http/Controllers/OfferSeasonalityController.php:80
 * @route '/offers/seasonality/{offerSeasonality}'
 */
update.patch = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::update
 * @see app/Http/Controllers/OfferSeasonalityController.php:80
 * @route '/offers/seasonality/{offerSeasonality}'
 */
const updateForm = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferSeasonalityController::update
 * @see app/Http/Controllers/OfferSeasonalityController.php:80
 * @route '/offers/seasonality/{offerSeasonality}'
 */
updateForm.put = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferSeasonalityController::update
 * @see app/Http/Controllers/OfferSeasonalityController.php:80
 * @route '/offers/seasonality/{offerSeasonality}'
 */
updateForm.patch = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferSeasonalityController::destroy
 * @see app/Http/Controllers/OfferSeasonalityController.php:88
 * @route '/offers/seasonality/{offerSeasonality}'
 */
export const destroy = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/offers/seasonality/{offerSeasonality}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::destroy
 * @see app/Http/Controllers/OfferSeasonalityController.php:88
 * @route '/offers/seasonality/{offerSeasonality}'
 */
destroy.url = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerSeasonality: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerSeasonality: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerSeasonality: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerSeasonality:
            typeof args.offerSeasonality === 'object'
                ? args.offerSeasonality.uuid
                : args.offerSeasonality,
    };

    return (
        destroy.definition.url
            .replace(
                '{offerSeasonality}',
                parsedArgs.offerSeasonality.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::destroy
 * @see app/Http/Controllers/OfferSeasonalityController.php:88
 * @route '/offers/seasonality/{offerSeasonality}'
 */
destroy.delete = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\OfferSeasonalityController::destroy
 * @see app/Http/Controllers/OfferSeasonalityController.php:88
 * @route '/offers/seasonality/{offerSeasonality}'
 */
const destroyForm = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferSeasonalityController::destroy
 * @see app/Http/Controllers/OfferSeasonalityController.php:88
 * @route '/offers/seasonality/{offerSeasonality}'
 */
destroyForm.delete = (
    args:
        | { offerSeasonality: string | { uuid: string } }
        | [offerSeasonality: string | { uuid: string }]
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

const OfferSeasonalityController = {
    index,
    create,
    store,
    show,
    edit,
    update,
    destroy,
};

export default OfferSeasonalityController;

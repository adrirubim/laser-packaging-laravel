import {
    applyUrlDefaults,
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::loadCategories
 * @see app/Http/Controllers/OfferOperationCategoryController.php:124
 * @route '/offers/operation-categories/load-categories'
 */
export const loadCategories = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: loadCategories.url(options),
    method: 'get',
});

loadCategories.definition = {
    methods: ['get', 'head'],
    url: '/offers/operation-categories/load-categories',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::loadCategories
 * @see app/Http/Controllers/OfferOperationCategoryController.php:124
 * @route '/offers/operation-categories/load-categories'
 */
loadCategories.url = (options?: RouteQueryOptions) => {
    return loadCategories.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::loadCategories
 * @see app/Http/Controllers/OfferOperationCategoryController.php:124
 * @route '/offers/operation-categories/load-categories'
 */
loadCategories.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: loadCategories.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::loadCategories
 * @see app/Http/Controllers/OfferOperationCategoryController.php:124
 * @route '/offers/operation-categories/load-categories'
 */
loadCategories.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: loadCategories.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::loadCategories
 * @see app/Http/Controllers/OfferOperationCategoryController.php:124
 * @route '/offers/operation-categories/load-categories'
 */
const loadCategoriesForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: loadCategories.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::loadCategories
 * @see app/Http/Controllers/OfferOperationCategoryController.php:124
 * @route '/offers/operation-categories/load-categories'
 */
loadCategoriesForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: loadCategories.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::loadCategories
 * @see app/Http/Controllers/OfferOperationCategoryController.php:124
 * @route '/offers/operation-categories/load-categories'
 */
loadCategoriesForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: loadCategories.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

loadCategories.form = loadCategoriesForm;

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::index
 * @see app/Http/Controllers/OfferOperationCategoryController.php:20
 * @route '/offers/operation-categories'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/offers/operation-categories',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::index
 * @see app/Http/Controllers/OfferOperationCategoryController.php:20
 * @route '/offers/operation-categories'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::index
 * @see app/Http/Controllers/OfferOperationCategoryController.php:20
 * @route '/offers/operation-categories'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::index
 * @see app/Http/Controllers/OfferOperationCategoryController.php:20
 * @route '/offers/operation-categories'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::index
 * @see app/Http/Controllers/OfferOperationCategoryController.php:20
 * @route '/offers/operation-categories'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::index
 * @see app/Http/Controllers/OfferOperationCategoryController.php:20
 * @route '/offers/operation-categories'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::index
 * @see app/Http/Controllers/OfferOperationCategoryController.php:20
 * @route '/offers/operation-categories'
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
 * @see \App\Http\Controllers\OfferOperationCategoryController::create
 * @see app/Http/Controllers/OfferOperationCategoryController.php:41
 * @route '/offers/operation-categories/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/offers/operation-categories/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::create
 * @see app/Http/Controllers/OfferOperationCategoryController.php:41
 * @route '/offers/operation-categories/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::create
 * @see app/Http/Controllers/OfferOperationCategoryController.php:41
 * @route '/offers/operation-categories/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::create
 * @see app/Http/Controllers/OfferOperationCategoryController.php:41
 * @route '/offers/operation-categories/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::create
 * @see app/Http/Controllers/OfferOperationCategoryController.php:41
 * @route '/offers/operation-categories/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::create
 * @see app/Http/Controllers/OfferOperationCategoryController.php:41
 * @route '/offers/operation-categories/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::create
 * @see app/Http/Controllers/OfferOperationCategoryController.php:41
 * @route '/offers/operation-categories/create'
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
 * @see \App\Http\Controllers\OfferOperationCategoryController::store
 * @see app/Http/Controllers/OfferOperationCategoryController.php:46
 * @route '/offers/operation-categories'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/offers/operation-categories',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::store
 * @see app/Http/Controllers/OfferOperationCategoryController.php:46
 * @route '/offers/operation-categories'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::store
 * @see app/Http/Controllers/OfferOperationCategoryController.php:46
 * @route '/offers/operation-categories'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::store
 * @see app/Http/Controllers/OfferOperationCategoryController.php:46
 * @route '/offers/operation-categories'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::store
 * @see app/Http/Controllers/OfferOperationCategoryController.php:46
 * @route '/offers/operation-categories'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::show
 * @see app/Http/Controllers/OfferOperationCategoryController.php:70
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
export const show = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/offers/operation-categories/{offerOperationCategory}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::show
 * @see app/Http/Controllers/OfferOperationCategoryController.php:70
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
show.url = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOperationCategory: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOperationCategory: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerOperationCategory: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerOperationCategory:
            typeof args.offerOperationCategory === 'object'
                ? args.offerOperationCategory.uuid
                : args.offerOperationCategory,
    };

    return (
        show.definition.url
            .replace(
                '{offerOperationCategory}',
                parsedArgs.offerOperationCategory.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::show
 * @see app/Http/Controllers/OfferOperationCategoryController.php:70
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
show.get = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::show
 * @see app/Http/Controllers/OfferOperationCategoryController.php:70
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
show.head = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::show
 * @see app/Http/Controllers/OfferOperationCategoryController.php:70
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
const showForm = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::show
 * @see app/Http/Controllers/OfferOperationCategoryController.php:70
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
showForm.get = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::show
 * @see app/Http/Controllers/OfferOperationCategoryController.php:70
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
showForm.head = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferOperationCategoryController::edit
 * @see app/Http/Controllers/OfferOperationCategoryController.php:79
 * @route '/offers/operation-categories/{offerOperationCategory}/edit'
 */
export const edit = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/offers/operation-categories/{offerOperationCategory}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::edit
 * @see app/Http/Controllers/OfferOperationCategoryController.php:79
 * @route '/offers/operation-categories/{offerOperationCategory}/edit'
 */
edit.url = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOperationCategory: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOperationCategory: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerOperationCategory: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerOperationCategory:
            typeof args.offerOperationCategory === 'object'
                ? args.offerOperationCategory.uuid
                : args.offerOperationCategory,
    };

    return (
        edit.definition.url
            .replace(
                '{offerOperationCategory}',
                parsedArgs.offerOperationCategory.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::edit
 * @see app/Http/Controllers/OfferOperationCategoryController.php:79
 * @route '/offers/operation-categories/{offerOperationCategory}/edit'
 */
edit.get = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::edit
 * @see app/Http/Controllers/OfferOperationCategoryController.php:79
 * @route '/offers/operation-categories/{offerOperationCategory}/edit'
 */
edit.head = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::edit
 * @see app/Http/Controllers/OfferOperationCategoryController.php:79
 * @route '/offers/operation-categories/{offerOperationCategory}/edit'
 */
const editForm = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::edit
 * @see app/Http/Controllers/OfferOperationCategoryController.php:79
 * @route '/offers/operation-categories/{offerOperationCategory}/edit'
 */
editForm.get = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::edit
 * @see app/Http/Controllers/OfferOperationCategoryController.php:79
 * @route '/offers/operation-categories/{offerOperationCategory}/edit'
 */
editForm.head = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferOperationCategoryController::update
 * @see app/Http/Controllers/OfferOperationCategoryController.php:86
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
export const update = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put', 'patch'],
    url: '/offers/operation-categories/{offerOperationCategory}',
} satisfies RouteDefinition<['put', 'patch']>;

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::update
 * @see app/Http/Controllers/OfferOperationCategoryController.php:86
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
update.url = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOperationCategory: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOperationCategory: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerOperationCategory: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerOperationCategory:
            typeof args.offerOperationCategory === 'object'
                ? args.offerOperationCategory.uuid
                : args.offerOperationCategory,
    };

    return (
        update.definition.url
            .replace(
                '{offerOperationCategory}',
                parsedArgs.offerOperationCategory.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::update
 * @see app/Http/Controllers/OfferOperationCategoryController.php:86
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
update.put = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::update
 * @see app/Http/Controllers/OfferOperationCategoryController.php:86
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
update.patch = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::update
 * @see app/Http/Controllers/OfferOperationCategoryController.php:86
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
const updateForm = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferOperationCategoryController::update
 * @see app/Http/Controllers/OfferOperationCategoryController.php:86
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
updateForm.put = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferOperationCategoryController::update
 * @see app/Http/Controllers/OfferOperationCategoryController.php:86
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
updateForm.patch = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferOperationCategoryController::destroy
 * @see app/Http/Controllers/OfferOperationCategoryController.php:109
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
export const destroy = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/offers/operation-categories/{offerOperationCategory}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::destroy
 * @see app/Http/Controllers/OfferOperationCategoryController.php:109
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
destroy.url = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOperationCategory: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOperationCategory: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerOperationCategory: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerOperationCategory:
            typeof args.offerOperationCategory === 'object'
                ? args.offerOperationCategory.uuid
                : args.offerOperationCategory,
    };

    return (
        destroy.definition.url
            .replace(
                '{offerOperationCategory}',
                parsedArgs.offerOperationCategory.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::destroy
 * @see app/Http/Controllers/OfferOperationCategoryController.php:109
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
destroy.delete = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\OfferOperationCategoryController::destroy
 * @see app/Http/Controllers/OfferOperationCategoryController.php:109
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
const destroyForm = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferOperationCategoryController::destroy
 * @see app/Http/Controllers/OfferOperationCategoryController.php:109
 * @route '/offers/operation-categories/{offerOperationCategory}'
 */
destroyForm.delete = (
    args:
        | { offerOperationCategory: string | { uuid: string } }
        | [offerOperationCategory: string | { uuid: string }]
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

const OfferOperationCategoryController = {
    loadCategories,
    index,
    create,
    store,
    show,
    edit,
    update,
    destroy,
};

export default OfferOperationCategoryController;

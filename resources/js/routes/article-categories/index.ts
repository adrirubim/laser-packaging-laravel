import {
    applyUrlDefaults,
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\ArticleCategoryController::index
 * @see app/Http/Controllers/ArticleCategoryController.php:23
 * @route '/article-categories'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/article-categories',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleCategoryController::index
 * @see app/Http/Controllers/ArticleCategoryController.php:23
 * @route '/article-categories'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ArticleCategoryController::index
 * @see app/Http/Controllers/ArticleCategoryController.php:23
 * @route '/article-categories'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::index
 * @see app/Http/Controllers/ArticleCategoryController.php:23
 * @route '/article-categories'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::index
 * @see app/Http/Controllers/ArticleCategoryController.php:23
 * @route '/article-categories'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::index
 * @see app/Http/Controllers/ArticleCategoryController.php:23
 * @route '/article-categories'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::index
 * @see app/Http/Controllers/ArticleCategoryController.php:23
 * @route '/article-categories'
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
 * @see \App\Http\Controllers\ArticleCategoryController::create
 * @see app/Http/Controllers/ArticleCategoryController.php:57
 * @route '/article-categories/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/article-categories/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleCategoryController::create
 * @see app/Http/Controllers/ArticleCategoryController.php:57
 * @route '/article-categories/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ArticleCategoryController::create
 * @see app/Http/Controllers/ArticleCategoryController.php:57
 * @route '/article-categories/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::create
 * @see app/Http/Controllers/ArticleCategoryController.php:57
 * @route '/article-categories/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::create
 * @see app/Http/Controllers/ArticleCategoryController.php:57
 * @route '/article-categories/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::create
 * @see app/Http/Controllers/ArticleCategoryController.php:57
 * @route '/article-categories/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::create
 * @see app/Http/Controllers/ArticleCategoryController.php:57
 * @route '/article-categories/create'
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
 * @see \App\Http\Controllers\ArticleCategoryController::store
 * @see app/Http/Controllers/ArticleCategoryController.php:65
 * @route '/article-categories'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/article-categories',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ArticleCategoryController::store
 * @see app/Http/Controllers/ArticleCategoryController.php:65
 * @route '/article-categories'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ArticleCategoryController::store
 * @see app/Http/Controllers/ArticleCategoryController.php:65
 * @route '/article-categories'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::store
 * @see app/Http/Controllers/ArticleCategoryController.php:65
 * @route '/article-categories'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::store
 * @see app/Http/Controllers/ArticleCategoryController.php:65
 * @route '/article-categories'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\ArticleCategoryController::show
 * @see app/Http/Controllers/ArticleCategoryController.php:83
 * @route '/article-categories/{articleCategory}'
 */
export const show = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/article-categories/{articleCategory}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleCategoryController::show
 * @see app/Http/Controllers/ArticleCategoryController.php:83
 * @route '/article-categories/{articleCategory}'
 */
show.url = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { articleCategory: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { articleCategory: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            articleCategory: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        articleCategory:
            typeof args.articleCategory === 'object'
                ? args.articleCategory.uuid
                : args.articleCategory,
    };

    return (
        show.definition.url
            .replace('{articleCategory}', parsedArgs.articleCategory.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ArticleCategoryController::show
 * @see app/Http/Controllers/ArticleCategoryController.php:83
 * @route '/article-categories/{articleCategory}'
 */
show.get = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::show
 * @see app/Http/Controllers/ArticleCategoryController.php:83
 * @route '/article-categories/{articleCategory}'
 */
show.head = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::show
 * @see app/Http/Controllers/ArticleCategoryController.php:83
 * @route '/article-categories/{articleCategory}'
 */
const showForm = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::show
 * @see app/Http/Controllers/ArticleCategoryController.php:83
 * @route '/article-categories/{articleCategory}'
 */
showForm.get = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::show
 * @see app/Http/Controllers/ArticleCategoryController.php:83
 * @route '/article-categories/{articleCategory}'
 */
showForm.head = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleCategoryController::edit
 * @see app/Http/Controllers/ArticleCategoryController.php:95
 * @route '/article-categories/{articleCategory}/edit'
 */
export const edit = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/article-categories/{articleCategory}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleCategoryController::edit
 * @see app/Http/Controllers/ArticleCategoryController.php:95
 * @route '/article-categories/{articleCategory}/edit'
 */
edit.url = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { articleCategory: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { articleCategory: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            articleCategory: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        articleCategory:
            typeof args.articleCategory === 'object'
                ? args.articleCategory.uuid
                : args.articleCategory,
    };

    return (
        edit.definition.url
            .replace('{articleCategory}', parsedArgs.articleCategory.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ArticleCategoryController::edit
 * @see app/Http/Controllers/ArticleCategoryController.php:95
 * @route '/article-categories/{articleCategory}/edit'
 */
edit.get = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::edit
 * @see app/Http/Controllers/ArticleCategoryController.php:95
 * @route '/article-categories/{articleCategory}/edit'
 */
edit.head = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::edit
 * @see app/Http/Controllers/ArticleCategoryController.php:95
 * @route '/article-categories/{articleCategory}/edit'
 */
const editForm = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::edit
 * @see app/Http/Controllers/ArticleCategoryController.php:95
 * @route '/article-categories/{articleCategory}/edit'
 */
editForm.get = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::edit
 * @see app/Http/Controllers/ArticleCategoryController.php:95
 * @route '/article-categories/{articleCategory}/edit'
 */
editForm.head = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleCategoryController::update
 * @see app/Http/Controllers/ArticleCategoryController.php:105
 * @route '/article-categories/{articleCategory}'
 */
export const update = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put', 'patch'],
    url: '/article-categories/{articleCategory}',
} satisfies RouteDefinition<['put', 'patch']>;

/**
 * @see \App\Http\Controllers\ArticleCategoryController::update
 * @see app/Http/Controllers/ArticleCategoryController.php:105
 * @route '/article-categories/{articleCategory}'
 */
update.url = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { articleCategory: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { articleCategory: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            articleCategory: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        articleCategory:
            typeof args.articleCategory === 'object'
                ? args.articleCategory.uuid
                : args.articleCategory,
    };

    return (
        update.definition.url
            .replace('{articleCategory}', parsedArgs.articleCategory.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ArticleCategoryController::update
 * @see app/Http/Controllers/ArticleCategoryController.php:105
 * @route '/article-categories/{articleCategory}'
 */
update.put = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::update
 * @see app/Http/Controllers/ArticleCategoryController.php:105
 * @route '/article-categories/{articleCategory}'
 */
update.patch = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::update
 * @see app/Http/Controllers/ArticleCategoryController.php:105
 * @route '/article-categories/{articleCategory}'
 */
const updateForm = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleCategoryController::update
 * @see app/Http/Controllers/ArticleCategoryController.php:105
 * @route '/article-categories/{articleCategory}'
 */
updateForm.put = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleCategoryController::update
 * @see app/Http/Controllers/ArticleCategoryController.php:105
 * @route '/article-categories/{articleCategory}'
 */
updateForm.patch = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleCategoryController::destroy
 * @see app/Http/Controllers/ArticleCategoryController.php:123
 * @route '/article-categories/{articleCategory}'
 */
export const destroy = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/article-categories/{articleCategory}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\ArticleCategoryController::destroy
 * @see app/Http/Controllers/ArticleCategoryController.php:123
 * @route '/article-categories/{articleCategory}'
 */
destroy.url = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { articleCategory: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { articleCategory: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            articleCategory: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        articleCategory:
            typeof args.articleCategory === 'object'
                ? args.articleCategory.uuid
                : args.articleCategory,
    };

    return (
        destroy.definition.url
            .replace('{articleCategory}', parsedArgs.articleCategory.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ArticleCategoryController::destroy
 * @see app/Http/Controllers/ArticleCategoryController.php:123
 * @route '/article-categories/{articleCategory}'
 */
destroy.delete = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\ArticleCategoryController::destroy
 * @see app/Http/Controllers/ArticleCategoryController.php:123
 * @route '/article-categories/{articleCategory}'
 */
const destroyForm = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleCategoryController::destroy
 * @see app/Http/Controllers/ArticleCategoryController.php:123
 * @route '/article-categories/{articleCategory}'
 */
destroyForm.delete = (
    args:
        | { articleCategory: string | { uuid: string } }
        | [articleCategory: string | { uuid: string }]
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

const articleCategories = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
};

export default articleCategories;

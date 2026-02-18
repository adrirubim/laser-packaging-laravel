import {
    applyUrlDefaults,
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../wayfinder';
import cqModels from './cq-models';
import operationalInstructions from './operational-instructions';
import packagingInstructions from './packaging-instructions';
import palletSheets from './pallet-sheets';
import palletizationInstructions from './palletization-instructions';
/**
 * @see \App\Http\Controllers\ArticleController::getLasCode
 * @see app/Http/Controllers/ArticleController.php:546
 * @route '/articles/get-las-code'
 */
export const getLasCode = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: getLasCode.url(options),
    method: 'get',
});

getLasCode.definition = {
    methods: ['get', 'head'],
    url: '/articles/get-las-code',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleController::getLasCode
 * @see app/Http/Controllers/ArticleController.php:546
 * @route '/articles/get-las-code'
 */
getLasCode.url = (options?: RouteQueryOptions) => {
    return getLasCode.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ArticleController::getLasCode
 * @see app/Http/Controllers/ArticleController.php:546
 * @route '/articles/get-las-code'
 */
getLasCode.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getLasCode.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::getLasCode
 * @see app/Http/Controllers/ArticleController.php:546
 * @route '/articles/get-las-code'
 */
getLasCode.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getLasCode.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleController::getLasCode
 * @see app/Http/Controllers/ArticleController.php:546
 * @route '/articles/get-las-code'
 */
const getLasCodeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: getLasCode.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::getLasCode
 * @see app/Http/Controllers/ArticleController.php:546
 * @route '/articles/get-las-code'
 */
getLasCodeForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: getLasCode.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::getLasCode
 * @see app/Http/Controllers/ArticleController.php:546
 * @route '/articles/get-las-code'
 */
getLasCodeForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: getLasCode.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

getLasCode.form = getLasCodeForm;

/**
 * @see \App\Http\Controllers\ArticleController::downloadLineLayout
 * @see app/Http/Controllers/ArticleController.php:600
 * @route '/articles/{article}/download-line-layout'
 */
export const downloadLineLayout = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadLineLayout.url(args, options),
    method: 'get',
});

downloadLineLayout.definition = {
    methods: ['get', 'head'],
    url: '/articles/{article}/download-line-layout',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleController::downloadLineLayout
 * @see app/Http/Controllers/ArticleController.php:600
 * @route '/articles/{article}/download-line-layout'
 */
downloadLineLayout.url = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { article: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { article: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            article: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        article:
            typeof args.article === 'object' ? args.article.uuid : args.article,
    };

    return (
        downloadLineLayout.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ArticleController::downloadLineLayout
 * @see app/Http/Controllers/ArticleController.php:600
 * @route '/articles/{article}/download-line-layout'
 */
downloadLineLayout.get = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadLineLayout.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::downloadLineLayout
 * @see app/Http/Controllers/ArticleController.php:600
 * @route '/articles/{article}/download-line-layout'
 */
downloadLineLayout.head = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: downloadLineLayout.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleController::downloadLineLayout
 * @see app/Http/Controllers/ArticleController.php:600
 * @route '/articles/{article}/download-line-layout'
 */
const downloadLineLayoutForm = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadLineLayout.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::downloadLineLayout
 * @see app/Http/Controllers/ArticleController.php:600
 * @route '/articles/{article}/download-line-layout'
 */
downloadLineLayoutForm.get = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadLineLayout.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::downloadLineLayout
 * @see app/Http/Controllers/ArticleController.php:600
 * @route '/articles/{article}/download-line-layout'
 */
downloadLineLayoutForm.head = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadLineLayout.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

downloadLineLayout.form = downloadLineLayoutForm;

/**
 * @see \App\Http\Controllers\ArticleController::index
 * @see app/Http/Controllers/ArticleController.php:51
 * @route '/articles'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/articles',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleController::index
 * @see app/Http/Controllers/ArticleController.php:51
 * @route '/articles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ArticleController::index
 * @see app/Http/Controllers/ArticleController.php:51
 * @route '/articles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::index
 * @see app/Http/Controllers/ArticleController.php:51
 * @route '/articles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleController::index
 * @see app/Http/Controllers/ArticleController.php:51
 * @route '/articles'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::index
 * @see app/Http/Controllers/ArticleController.php:51
 * @route '/articles'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::index
 * @see app/Http/Controllers/ArticleController.php:51
 * @route '/articles'
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
 * @see \App\Http\Controllers\ArticleController::create
 * @see app/Http/Controllers/ArticleController.php:103
 * @route '/articles/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/articles/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleController::create
 * @see app/Http/Controllers/ArticleController.php:103
 * @route '/articles/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ArticleController::create
 * @see app/Http/Controllers/ArticleController.php:103
 * @route '/articles/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::create
 * @see app/Http/Controllers/ArticleController.php:103
 * @route '/articles/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleController::create
 * @see app/Http/Controllers/ArticleController.php:103
 * @route '/articles/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::create
 * @see app/Http/Controllers/ArticleController.php:103
 * @route '/articles/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::create
 * @see app/Http/Controllers/ArticleController.php:103
 * @route '/articles/create'
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
 * @see \App\Http\Controllers\ArticleController::store
 * @see app/Http/Controllers/ArticleController.php:192
 * @route '/articles'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/articles',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ArticleController::store
 * @see app/Http/Controllers/ArticleController.php:192
 * @route '/articles'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ArticleController::store
 * @see app/Http/Controllers/ArticleController.php:192
 * @route '/articles'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ArticleController::store
 * @see app/Http/Controllers/ArticleController.php:192
 * @route '/articles'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ArticleController::store
 * @see app/Http/Controllers/ArticleController.php:192
 * @route '/articles'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\ArticleController::show
 * @see app/Http/Controllers/ArticleController.php:311
 * @route '/articles/{article}'
 */
export const show = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/articles/{article}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleController::show
 * @see app/Http/Controllers/ArticleController.php:311
 * @route '/articles/{article}'
 */
show.url = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { article: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { article: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            article: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        article:
            typeof args.article === 'object' ? args.article.uuid : args.article,
    };

    return (
        show.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ArticleController::show
 * @see app/Http/Controllers/ArticleController.php:311
 * @route '/articles/{article}'
 */
show.get = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::show
 * @see app/Http/Controllers/ArticleController.php:311
 * @route '/articles/{article}'
 */
show.head = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleController::show
 * @see app/Http/Controllers/ArticleController.php:311
 * @route '/articles/{article}'
 */
const showForm = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::show
 * @see app/Http/Controllers/ArticleController.php:311
 * @route '/articles/{article}'
 */
showForm.get = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::show
 * @see app/Http/Controllers/ArticleController.php:311
 * @route '/articles/{article}'
 */
showForm.head = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleController::edit
 * @see app/Http/Controllers/ArticleController.php:337
 * @route '/articles/{article}/edit'
 */
export const edit = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/articles/{article}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleController::edit
 * @see app/Http/Controllers/ArticleController.php:337
 * @route '/articles/{article}/edit'
 */
edit.url = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { article: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { article: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            article: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        article:
            typeof args.article === 'object' ? args.article.uuid : args.article,
    };

    return (
        edit.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ArticleController::edit
 * @see app/Http/Controllers/ArticleController.php:337
 * @route '/articles/{article}/edit'
 */
edit.get = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::edit
 * @see app/Http/Controllers/ArticleController.php:337
 * @route '/articles/{article}/edit'
 */
edit.head = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleController::edit
 * @see app/Http/Controllers/ArticleController.php:337
 * @route '/articles/{article}/edit'
 */
const editForm = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::edit
 * @see app/Http/Controllers/ArticleController.php:337
 * @route '/articles/{article}/edit'
 */
editForm.get = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleController::edit
 * @see app/Http/Controllers/ArticleController.php:337
 * @route '/articles/{article}/edit'
 */
editForm.head = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleController::update
 * @see app/Http/Controllers/ArticleController.php:391
 * @route '/articles/{article}'
 */
export const update = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put', 'patch'],
    url: '/articles/{article}',
} satisfies RouteDefinition<['put', 'patch']>;

/**
 * @see \App\Http\Controllers\ArticleController::update
 * @see app/Http/Controllers/ArticleController.php:391
 * @route '/articles/{article}'
 */
update.url = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { article: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { article: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            article: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        article:
            typeof args.article === 'object' ? args.article.uuid : args.article,
    };

    return (
        update.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ArticleController::update
 * @see app/Http/Controllers/ArticleController.php:391
 * @route '/articles/{article}'
 */
update.put = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\ArticleController::update
 * @see app/Http/Controllers/ArticleController.php:391
 * @route '/articles/{article}'
 */
update.patch = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\ArticleController::update
 * @see app/Http/Controllers/ArticleController.php:391
 * @route '/articles/{article}'
 */
const updateForm = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleController::update
 * @see app/Http/Controllers/ArticleController.php:391
 * @route '/articles/{article}'
 */
updateForm.put = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleController::update
 * @see app/Http/Controllers/ArticleController.php:391
 * @route '/articles/{article}'
 */
updateForm.patch = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleController::destroy
 * @see app/Http/Controllers/ArticleController.php:521
 * @route '/articles/{article}'
 */
export const destroy = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/articles/{article}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\ArticleController::destroy
 * @see app/Http/Controllers/ArticleController.php:521
 * @route '/articles/{article}'
 */
destroy.url = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { article: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { article: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            article: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        article:
            typeof args.article === 'object' ? args.article.uuid : args.article,
    };

    return (
        destroy.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ArticleController::destroy
 * @see app/Http/Controllers/ArticleController.php:521
 * @route '/articles/{article}'
 */
destroy.delete = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\ArticleController::destroy
 * @see app/Http/Controllers/ArticleController.php:521
 * @route '/articles/{article}'
 */
const destroyForm = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleController::destroy
 * @see app/Http/Controllers/ArticleController.php:521
 * @route '/articles/{article}'
 */
destroyForm.delete = (
    args:
        | { article: string | { uuid: string } }
        | [article: string | { uuid: string }]
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

const articles = {
    packagingInstructions: Object.assign(
        packagingInstructions,
        packagingInstructions,
    ),
    palletizationInstructions: Object.assign(
        palletizationInstructions,
        palletizationInstructions,
    ),
    operationalInstructions: Object.assign(
        operationalInstructions,
        operationalInstructions,
    ),
    cqModels: Object.assign(cqModels, cqModels),
    palletSheets: Object.assign(palletSheets, palletSheets),
    getLasCode: Object.assign(getLasCode, getLasCode),
    downloadLineLayout: Object.assign(downloadLineLayout, downloadLineLayout),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
};

export default articles;

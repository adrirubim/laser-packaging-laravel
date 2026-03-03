import {
    applyUrlDefaults,
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\ArticleICController::generateICNumber
 * @see app/Http/Controllers/ArticleICController.php:216
 * @route '/articles/packaging-instructions/generate-ic-number'
 */
export const generateICNumber = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: generateICNumber.url(options),
    method: 'get',
});

generateICNumber.definition = {
    methods: ['get', 'head'],
    url: '/articles/packaging-instructions/generate-ic-number',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleICController::generateICNumber
 * @see app/Http/Controllers/ArticleICController.php:216
 * @route '/articles/packaging-instructions/generate-ic-number'
 */
generateICNumber.url = (options?: RouteQueryOptions) => {
    return generateICNumber.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ArticleICController::generateICNumber
 * @see app/Http/Controllers/ArticleICController.php:216
 * @route '/articles/packaging-instructions/generate-ic-number'
 */
generateICNumber.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: generateICNumber.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::generateICNumber
 * @see app/Http/Controllers/ArticleICController.php:216
 * @route '/articles/packaging-instructions/generate-ic-number'
 */
generateICNumber.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: generateICNumber.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleICController::generateICNumber
 * @see app/Http/Controllers/ArticleICController.php:216
 * @route '/articles/packaging-instructions/generate-ic-number'
 */
const generateICNumberForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: generateICNumber.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::generateICNumber
 * @see app/Http/Controllers/ArticleICController.php:216
 * @route '/articles/packaging-instructions/generate-ic-number'
 */
generateICNumberForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: generateICNumber.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::generateICNumber
 * @see app/Http/Controllers/ArticleICController.php:216
 * @route '/articles/packaging-instructions/generate-ic-number'
 */
generateICNumberForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: generateICNumber.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

generateICNumber.form = generateICNumberForm;

/**
 * @see \App\Http\Controllers\ArticleICController::download
 * @see app/Http/Controllers/ArticleICController.php:197
 * @route '/articles/packaging-instructions/{packagingInstruction}/download'
 */
export const download = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
});

download.definition = {
    methods: ['get', 'head'],
    url: '/articles/packaging-instructions/{packagingInstruction}/download',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleICController::download
 * @see app/Http/Controllers/ArticleICController.php:197
 * @route '/articles/packaging-instructions/{packagingInstruction}/download'
 */
download.url = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { packagingInstruction: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { packagingInstruction: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            packagingInstruction: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        packagingInstruction:
            typeof args.packagingInstruction === 'object'
                ? args.packagingInstruction.uuid
                : args.packagingInstruction,
    };

    return (
        download.definition.url
            .replace(
                '{packagingInstruction}',
                parsedArgs.packagingInstruction.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ArticleICController::download
 * @see app/Http/Controllers/ArticleICController.php:197
 * @route '/articles/packaging-instructions/{packagingInstruction}/download'
 */
download.get = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::download
 * @see app/Http/Controllers/ArticleICController.php:197
 * @route '/articles/packaging-instructions/{packagingInstruction}/download'
 */
download.head = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleICController::download
 * @see app/Http/Controllers/ArticleICController.php:197
 * @route '/articles/packaging-instructions/{packagingInstruction}/download'
 */
const downloadForm = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::download
 * @see app/Http/Controllers/ArticleICController.php:197
 * @route '/articles/packaging-instructions/{packagingInstruction}/download'
 */
downloadForm.get = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::download
 * @see app/Http/Controllers/ArticleICController.php:197
 * @route '/articles/packaging-instructions/{packagingInstruction}/download'
 */
downloadForm.head = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

download.form = downloadForm;

/**
 * @see \App\Http\Controllers\ArticleICController::index
 * @see app/Http/Controllers/ArticleICController.php:23
 * @route '/articles/packaging-instructions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/articles/packaging-instructions',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleICController::index
 * @see app/Http/Controllers/ArticleICController.php:23
 * @route '/articles/packaging-instructions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ArticleICController::index
 * @see app/Http/Controllers/ArticleICController.php:23
 * @route '/articles/packaging-instructions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::index
 * @see app/Http/Controllers/ArticleICController.php:23
 * @route '/articles/packaging-instructions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleICController::index
 * @see app/Http/Controllers/ArticleICController.php:23
 * @route '/articles/packaging-instructions'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::index
 * @see app/Http/Controllers/ArticleICController.php:23
 * @route '/articles/packaging-instructions'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::index
 * @see app/Http/Controllers/ArticleICController.php:23
 * @route '/articles/packaging-instructions'
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
 * @see \App\Http\Controllers\ArticleICController::create
 * @see app/Http/Controllers/ArticleICController.php:59
 * @route '/articles/packaging-instructions/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/articles/packaging-instructions/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleICController::create
 * @see app/Http/Controllers/ArticleICController.php:59
 * @route '/articles/packaging-instructions/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ArticleICController::create
 * @see app/Http/Controllers/ArticleICController.php:59
 * @route '/articles/packaging-instructions/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::create
 * @see app/Http/Controllers/ArticleICController.php:59
 * @route '/articles/packaging-instructions/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleICController::create
 * @see app/Http/Controllers/ArticleICController.php:59
 * @route '/articles/packaging-instructions/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::create
 * @see app/Http/Controllers/ArticleICController.php:59
 * @route '/articles/packaging-instructions/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::create
 * @see app/Http/Controllers/ArticleICController.php:59
 * @route '/articles/packaging-instructions/create'
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
 * @see \App\Http\Controllers\ArticleICController::store
 * @see app/Http/Controllers/ArticleICController.php:67
 * @route '/articles/packaging-instructions'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/articles/packaging-instructions',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ArticleICController::store
 * @see app/Http/Controllers/ArticleICController.php:67
 * @route '/articles/packaging-instructions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ArticleICController::store
 * @see app/Http/Controllers/ArticleICController.php:67
 * @route '/articles/packaging-instructions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ArticleICController::store
 * @see app/Http/Controllers/ArticleICController.php:67
 * @route '/articles/packaging-instructions'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ArticleICController::store
 * @see app/Http/Controllers/ArticleICController.php:67
 * @route '/articles/packaging-instructions'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\ArticleICController::show
 * @see app/Http/Controllers/ArticleICController.php:104
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
export const show = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/articles/packaging-instructions/{packagingInstruction}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleICController::show
 * @see app/Http/Controllers/ArticleICController.php:104
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
show.url = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { packagingInstruction: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { packagingInstruction: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            packagingInstruction: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        packagingInstruction:
            typeof args.packagingInstruction === 'object'
                ? args.packagingInstruction.uuid
                : args.packagingInstruction,
    };

    return (
        show.definition.url
            .replace(
                '{packagingInstruction}',
                parsedArgs.packagingInstruction.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ArticleICController::show
 * @see app/Http/Controllers/ArticleICController.php:104
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
show.get = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::show
 * @see app/Http/Controllers/ArticleICController.php:104
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
show.head = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleICController::show
 * @see app/Http/Controllers/ArticleICController.php:104
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
const showForm = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::show
 * @see app/Http/Controllers/ArticleICController.php:104
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
showForm.get = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::show
 * @see app/Http/Controllers/ArticleICController.php:104
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
showForm.head = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleICController::edit
 * @see app/Http/Controllers/ArticleICController.php:116
 * @route '/articles/packaging-instructions/{packagingInstruction}/edit'
 */
export const edit = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/articles/packaging-instructions/{packagingInstruction}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ArticleICController::edit
 * @see app/Http/Controllers/ArticleICController.php:116
 * @route '/articles/packaging-instructions/{packagingInstruction}/edit'
 */
edit.url = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { packagingInstruction: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { packagingInstruction: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            packagingInstruction: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        packagingInstruction:
            typeof args.packagingInstruction === 'object'
                ? args.packagingInstruction.uuid
                : args.packagingInstruction,
    };

    return (
        edit.definition.url
            .replace(
                '{packagingInstruction}',
                parsedArgs.packagingInstruction.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ArticleICController::edit
 * @see app/Http/Controllers/ArticleICController.php:116
 * @route '/articles/packaging-instructions/{packagingInstruction}/edit'
 */
edit.get = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::edit
 * @see app/Http/Controllers/ArticleICController.php:116
 * @route '/articles/packaging-instructions/{packagingInstruction}/edit'
 */
edit.head = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ArticleICController::edit
 * @see app/Http/Controllers/ArticleICController.php:116
 * @route '/articles/packaging-instructions/{packagingInstruction}/edit'
 */
const editForm = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::edit
 * @see app/Http/Controllers/ArticleICController.php:116
 * @route '/articles/packaging-instructions/{packagingInstruction}/edit'
 */
editForm.get = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ArticleICController::edit
 * @see app/Http/Controllers/ArticleICController.php:116
 * @route '/articles/packaging-instructions/{packagingInstruction}/edit'
 */
editForm.head = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleICController::update
 * @see app/Http/Controllers/ArticleICController.php:126
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
export const update = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put', 'patch'],
    url: '/articles/packaging-instructions/{packagingInstruction}',
} satisfies RouteDefinition<['put', 'patch']>;

/**
 * @see \App\Http\Controllers\ArticleICController::update
 * @see app/Http/Controllers/ArticleICController.php:126
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
update.url = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { packagingInstruction: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { packagingInstruction: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            packagingInstruction: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        packagingInstruction:
            typeof args.packagingInstruction === 'object'
                ? args.packagingInstruction.uuid
                : args.packagingInstruction,
    };

    return (
        update.definition.url
            .replace(
                '{packagingInstruction}',
                parsedArgs.packagingInstruction.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ArticleICController::update
 * @see app/Http/Controllers/ArticleICController.php:126
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
update.put = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\ArticleICController::update
 * @see app/Http/Controllers/ArticleICController.php:126
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
update.patch = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\ArticleICController::update
 * @see app/Http/Controllers/ArticleICController.php:126
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
const updateForm = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleICController::update
 * @see app/Http/Controllers/ArticleICController.php:126
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
updateForm.put = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleICController::update
 * @see app/Http/Controllers/ArticleICController.php:126
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
updateForm.patch = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleICController::destroy
 * @see app/Http/Controllers/ArticleICController.php:183
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
export const destroy = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/articles/packaging-instructions/{packagingInstruction}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\ArticleICController::destroy
 * @see app/Http/Controllers/ArticleICController.php:183
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
destroy.url = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { packagingInstruction: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { packagingInstruction: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            packagingInstruction: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        packagingInstruction:
            typeof args.packagingInstruction === 'object'
                ? args.packagingInstruction.uuid
                : args.packagingInstruction,
    };

    return (
        destroy.definition.url
            .replace(
                '{packagingInstruction}',
                parsedArgs.packagingInstruction.toString(),
            )
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ArticleICController::destroy
 * @see app/Http/Controllers/ArticleICController.php:183
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
destroy.delete = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\ArticleICController::destroy
 * @see app/Http/Controllers/ArticleICController.php:183
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
const destroyForm = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ArticleICController::destroy
 * @see app/Http/Controllers/ArticleICController.php:183
 * @route '/articles/packaging-instructions/{packagingInstruction}'
 */
destroyForm.delete = (
    args:
        | { packagingInstruction: string | { uuid: string } }
        | [packagingInstruction: string | { uuid: string }]
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

const ArticleICController = {
    generateICNumber,
    download,
    index,
    create,
    store,
    show,
    edit,
    update,
    destroy,
};

export default ArticleICController;

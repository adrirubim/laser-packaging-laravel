import {
    applyUrlDefaults,
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\OfferOperationController::loadCategoryOperations
 * @see app/Http/Controllers/OfferOperationController.php:201
 * @route '/offers/operations/load-category-operations'
 */
export const loadCategoryOperations = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: loadCategoryOperations.url(options),
    method: 'get',
});

loadCategoryOperations.definition = {
    methods: ['get', 'head'],
    url: '/offers/operations/load-category-operations',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferOperationController::loadCategoryOperations
 * @see app/Http/Controllers/OfferOperationController.php:201
 * @route '/offers/operations/load-category-operations'
 */
loadCategoryOperations.url = (options?: RouteQueryOptions) => {
    return loadCategoryOperations.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferOperationController::loadCategoryOperations
 * @see app/Http/Controllers/OfferOperationController.php:201
 * @route '/offers/operations/load-category-operations'
 */
loadCategoryOperations.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: loadCategoryOperations.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::loadCategoryOperations
 * @see app/Http/Controllers/OfferOperationController.php:201
 * @route '/offers/operations/load-category-operations'
 */
loadCategoryOperations.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: loadCategoryOperations.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::loadCategoryOperations
 * @see app/Http/Controllers/OfferOperationController.php:201
 * @route '/offers/operations/load-category-operations'
 */
const loadCategoryOperationsForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: loadCategoryOperations.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::loadCategoryOperations
 * @see app/Http/Controllers/OfferOperationController.php:201
 * @route '/offers/operations/load-category-operations'
 */
loadCategoryOperationsForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: loadCategoryOperations.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::loadCategoryOperations
 * @see app/Http/Controllers/OfferOperationController.php:201
 * @route '/offers/operations/load-category-operations'
 */
loadCategoryOperationsForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: loadCategoryOperations.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

loadCategoryOperations.form = loadCategoryOperationsForm;

/**
 * @see \App\Http\Controllers\OfferOperationController::downloadFile
 * @see app/Http/Controllers/OfferOperationController.php:182
 * @route '/offers/operations/{offerOperation}/download-file'
 */
export const downloadFile = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadFile.url(args, options),
    method: 'get',
});

downloadFile.definition = {
    methods: ['get', 'head'],
    url: '/offers/operations/{offerOperation}/download-file',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferOperationController::downloadFile
 * @see app/Http/Controllers/OfferOperationController.php:182
 * @route '/offers/operations/{offerOperation}/download-file'
 */
downloadFile.url = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOperation: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOperation: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerOperation: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerOperation:
            typeof args.offerOperation === 'object'
                ? args.offerOperation.uuid
                : args.offerOperation,
    };

    return (
        downloadFile.definition.url
            .replace('{offerOperation}', parsedArgs.offerOperation.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferOperationController::downloadFile
 * @see app/Http/Controllers/OfferOperationController.php:182
 * @route '/offers/operations/{offerOperation}/download-file'
 */
downloadFile.get = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadFile.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::downloadFile
 * @see app/Http/Controllers/OfferOperationController.php:182
 * @route '/offers/operations/{offerOperation}/download-file'
 */
downloadFile.head = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: downloadFile.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::downloadFile
 * @see app/Http/Controllers/OfferOperationController.php:182
 * @route '/offers/operations/{offerOperation}/download-file'
 */
const downloadFileForm = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadFile.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::downloadFile
 * @see app/Http/Controllers/OfferOperationController.php:182
 * @route '/offers/operations/{offerOperation}/download-file'
 */
downloadFileForm.get = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadFile.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::downloadFile
 * @see app/Http/Controllers/OfferOperationController.php:182
 * @route '/offers/operations/{offerOperation}/download-file'
 */
downloadFileForm.head = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadFile.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

downloadFile.form = downloadFileForm;

/**
 * @see \App\Http\Controllers\OfferOperationController::index
 * @see app/Http/Controllers/OfferOperationController.php:14
 * @route '/offers/operations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/offers/operations',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferOperationController::index
 * @see app/Http/Controllers/OfferOperationController.php:14
 * @route '/offers/operations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferOperationController::index
 * @see app/Http/Controllers/OfferOperationController.php:14
 * @route '/offers/operations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::index
 * @see app/Http/Controllers/OfferOperationController.php:14
 * @route '/offers/operations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::index
 * @see app/Http/Controllers/OfferOperationController.php:14
 * @route '/offers/operations'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::index
 * @see app/Http/Controllers/OfferOperationController.php:14
 * @route '/offers/operations'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::index
 * @see app/Http/Controllers/OfferOperationController.php:14
 * @route '/offers/operations'
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
 * @see \App\Http\Controllers\OfferOperationController::create
 * @see app/Http/Controllers/OfferOperationController.php:43
 * @route '/offers/operations/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/offers/operations/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferOperationController::create
 * @see app/Http/Controllers/OfferOperationController.php:43
 * @route '/offers/operations/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferOperationController::create
 * @see app/Http/Controllers/OfferOperationController.php:43
 * @route '/offers/operations/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::create
 * @see app/Http/Controllers/OfferOperationController.php:43
 * @route '/offers/operations/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::create
 * @see app/Http/Controllers/OfferOperationController.php:43
 * @route '/offers/operations/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::create
 * @see app/Http/Controllers/OfferOperationController.php:43
 * @route '/offers/operations/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::create
 * @see app/Http/Controllers/OfferOperationController.php:43
 * @route '/offers/operations/create'
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
 * @see \App\Http\Controllers\OfferOperationController::store
 * @see app/Http/Controllers/OfferOperationController.php:53
 * @route '/offers/operations'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/offers/operations',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\OfferOperationController::store
 * @see app/Http/Controllers/OfferOperationController.php:53
 * @route '/offers/operations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferOperationController::store
 * @see app/Http/Controllers/OfferOperationController.php:53
 * @route '/offers/operations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::store
 * @see app/Http/Controllers/OfferOperationController.php:53
 * @route '/offers/operations'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::store
 * @see app/Http/Controllers/OfferOperationController.php:53
 * @route '/offers/operations'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\OfferOperationController::show
 * @see app/Http/Controllers/OfferOperationController.php:100
 * @route '/offers/operations/{offerOperation}'
 */
export const show = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/offers/operations/{offerOperation}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferOperationController::show
 * @see app/Http/Controllers/OfferOperationController.php:100
 * @route '/offers/operations/{offerOperation}'
 */
show.url = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOperation: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOperation: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerOperation: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerOperation:
            typeof args.offerOperation === 'object'
                ? args.offerOperation.uuid
                : args.offerOperation,
    };

    return (
        show.definition.url
            .replace('{offerOperation}', parsedArgs.offerOperation.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferOperationController::show
 * @see app/Http/Controllers/OfferOperationController.php:100
 * @route '/offers/operations/{offerOperation}'
 */
show.get = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::show
 * @see app/Http/Controllers/OfferOperationController.php:100
 * @route '/offers/operations/{offerOperation}'
 */
show.head = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::show
 * @see app/Http/Controllers/OfferOperationController.php:100
 * @route '/offers/operations/{offerOperation}'
 */
const showForm = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::show
 * @see app/Http/Controllers/OfferOperationController.php:100
 * @route '/offers/operations/{offerOperation}'
 */
showForm.get = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::show
 * @see app/Http/Controllers/OfferOperationController.php:100
 * @route '/offers/operations/{offerOperation}'
 */
showForm.head = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferOperationController::edit
 * @see app/Http/Controllers/OfferOperationController.php:109
 * @route '/offers/operations/{offerOperation}/edit'
 */
export const edit = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/offers/operations/{offerOperation}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferOperationController::edit
 * @see app/Http/Controllers/OfferOperationController.php:109
 * @route '/offers/operations/{offerOperation}/edit'
 */
edit.url = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOperation: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOperation: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerOperation: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerOperation:
            typeof args.offerOperation === 'object'
                ? args.offerOperation.uuid
                : args.offerOperation,
    };

    return (
        edit.definition.url
            .replace('{offerOperation}', parsedArgs.offerOperation.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferOperationController::edit
 * @see app/Http/Controllers/OfferOperationController.php:109
 * @route '/offers/operations/{offerOperation}/edit'
 */
edit.get = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::edit
 * @see app/Http/Controllers/OfferOperationController.php:109
 * @route '/offers/operations/{offerOperation}/edit'
 */
edit.head = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::edit
 * @see app/Http/Controllers/OfferOperationController.php:109
 * @route '/offers/operations/{offerOperation}/edit'
 */
const editForm = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::edit
 * @see app/Http/Controllers/OfferOperationController.php:109
 * @route '/offers/operations/{offerOperation}/edit'
 */
editForm.get = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::edit
 * @see app/Http/Controllers/OfferOperationController.php:109
 * @route '/offers/operations/{offerOperation}/edit'
 */
editForm.head = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferOperationController::update
 * @see app/Http/Controllers/OfferOperationController.php:119
 * @route '/offers/operations/{offerOperation}'
 */
export const update = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put', 'patch'],
    url: '/offers/operations/{offerOperation}',
} satisfies RouteDefinition<['put', 'patch']>;

/**
 * @see \App\Http\Controllers\OfferOperationController::update
 * @see app/Http/Controllers/OfferOperationController.php:119
 * @route '/offers/operations/{offerOperation}'
 */
update.url = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOperation: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOperation: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerOperation: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerOperation:
            typeof args.offerOperation === 'object'
                ? args.offerOperation.uuid
                : args.offerOperation,
    };

    return (
        update.definition.url
            .replace('{offerOperation}', parsedArgs.offerOperation.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferOperationController::update
 * @see app/Http/Controllers/OfferOperationController.php:119
 * @route '/offers/operations/{offerOperation}'
 */
update.put = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::update
 * @see app/Http/Controllers/OfferOperationController.php:119
 * @route '/offers/operations/{offerOperation}'
 */
update.patch = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::update
 * @see app/Http/Controllers/OfferOperationController.php:119
 * @route '/offers/operations/{offerOperation}'
 */
const updateForm = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferOperationController::update
 * @see app/Http/Controllers/OfferOperationController.php:119
 * @route '/offers/operations/{offerOperation}'
 */
updateForm.put = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferOperationController::update
 * @see app/Http/Controllers/OfferOperationController.php:119
 * @route '/offers/operations/{offerOperation}'
 */
updateForm.patch = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferOperationController::destroy
 * @see app/Http/Controllers/OfferOperationController.php:171
 * @route '/offers/operations/{offerOperation}'
 */
export const destroy = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/offers/operations/{offerOperation}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\OfferOperationController::destroy
 * @see app/Http/Controllers/OfferOperationController.php:171
 * @route '/offers/operations/{offerOperation}'
 */
destroy.url = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOperation: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOperation: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offerOperation: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offerOperation:
            typeof args.offerOperation === 'object'
                ? args.offerOperation.uuid
                : args.offerOperation,
    };

    return (
        destroy.definition.url
            .replace('{offerOperation}', parsedArgs.offerOperation.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferOperationController::destroy
 * @see app/Http/Controllers/OfferOperationController.php:171
 * @route '/offers/operations/{offerOperation}'
 */
destroy.delete = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\OfferOperationController::destroy
 * @see app/Http/Controllers/OfferOperationController.php:171
 * @route '/offers/operations/{offerOperation}'
 */
const destroyForm = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferOperationController::destroy
 * @see app/Http/Controllers/OfferOperationController.php:171
 * @route '/offers/operations/{offerOperation}'
 */
destroyForm.delete = (
    args:
        | { offerOperation: string | { uuid: string } }
        | [offerOperation: string | { uuid: string }]
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

const offerOperations = {
    loadCategoryOperations: Object.assign(
        loadCategoryOperations,
        loadCategoryOperations,
    ),
    downloadFile: Object.assign(downloadFile, downloadFile),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
};

export default offerOperations;

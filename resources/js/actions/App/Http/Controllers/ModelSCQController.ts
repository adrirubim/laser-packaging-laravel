import {
    applyUrlDefaults,
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\ModelSCQController::generateCQUNumber
 * @see app/Http/Controllers/ModelSCQController.php:230
 * @route '/articles/cq-models/generate-cqu-number'
 */
export const generateCQUNumber = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: generateCQUNumber.url(options),
    method: 'get',
});

generateCQUNumber.definition = {
    methods: ['get', 'head'],
    url: '/articles/cq-models/generate-cqu-number',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ModelSCQController::generateCQUNumber
 * @see app/Http/Controllers/ModelSCQController.php:230
 * @route '/articles/cq-models/generate-cqu-number'
 */
generateCQUNumber.url = (options?: RouteQueryOptions) => {
    return generateCQUNumber.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ModelSCQController::generateCQUNumber
 * @see app/Http/Controllers/ModelSCQController.php:230
 * @route '/articles/cq-models/generate-cqu-number'
 */
generateCQUNumber.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: generateCQUNumber.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::generateCQUNumber
 * @see app/Http/Controllers/ModelSCQController.php:230
 * @route '/articles/cq-models/generate-cqu-number'
 */
generateCQUNumber.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: generateCQUNumber.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::generateCQUNumber
 * @see app/Http/Controllers/ModelSCQController.php:230
 * @route '/articles/cq-models/generate-cqu-number'
 */
const generateCQUNumberForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: generateCQUNumber.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::generateCQUNumber
 * @see app/Http/Controllers/ModelSCQController.php:230
 * @route '/articles/cq-models/generate-cqu-number'
 */
generateCQUNumberForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: generateCQUNumber.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::generateCQUNumber
 * @see app/Http/Controllers/ModelSCQController.php:230
 * @route '/articles/cq-models/generate-cqu-number'
 */
generateCQUNumberForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: generateCQUNumber.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

generateCQUNumber.form = generateCQUNumberForm;

/**
 * @see \App\Http\Controllers\ModelSCQController::downloadFile
 * @see app/Http/Controllers/ModelSCQController.php:244
 * @route '/articles/cq-models/{cqModel}/download-file'
 */
export const downloadFile = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadFile.url(args, options),
    method: 'get',
});

downloadFile.definition = {
    methods: ['get', 'head'],
    url: '/articles/cq-models/{cqModel}/download-file',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ModelSCQController::downloadFile
 * @see app/Http/Controllers/ModelSCQController.php:244
 * @route '/articles/cq-models/{cqModel}/download-file'
 */
downloadFile.url = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cqModel: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { cqModel: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            cqModel: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        cqModel:
            typeof args.cqModel === 'object' ? args.cqModel.uuid : args.cqModel,
    };

    return (
        downloadFile.definition.url
            .replace('{cqModel}', parsedArgs.cqModel.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ModelSCQController::downloadFile
 * @see app/Http/Controllers/ModelSCQController.php:244
 * @route '/articles/cq-models/{cqModel}/download-file'
 */
downloadFile.get = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadFile.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::downloadFile
 * @see app/Http/Controllers/ModelSCQController.php:244
 * @route '/articles/cq-models/{cqModel}/download-file'
 */
downloadFile.head = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: downloadFile.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::downloadFile
 * @see app/Http/Controllers/ModelSCQController.php:244
 * @route '/articles/cq-models/{cqModel}/download-file'
 */
const downloadFileForm = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadFile.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::downloadFile
 * @see app/Http/Controllers/ModelSCQController.php:244
 * @route '/articles/cq-models/{cqModel}/download-file'
 */
downloadFileForm.get = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadFile.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::downloadFile
 * @see app/Http/Controllers/ModelSCQController.php:244
 * @route '/articles/cq-models/{cqModel}/download-file'
 */
downloadFileForm.head = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ModelSCQController::index
 * @see app/Http/Controllers/ModelSCQController.php:15
 * @route '/articles/cq-models'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/articles/cq-models',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ModelSCQController::index
 * @see app/Http/Controllers/ModelSCQController.php:15
 * @route '/articles/cq-models'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ModelSCQController::index
 * @see app/Http/Controllers/ModelSCQController.php:15
 * @route '/articles/cq-models'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::index
 * @see app/Http/Controllers/ModelSCQController.php:15
 * @route '/articles/cq-models'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::index
 * @see app/Http/Controllers/ModelSCQController.php:15
 * @route '/articles/cq-models'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::index
 * @see app/Http/Controllers/ModelSCQController.php:15
 * @route '/articles/cq-models'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::index
 * @see app/Http/Controllers/ModelSCQController.php:15
 * @route '/articles/cq-models'
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
 * @see \App\Http\Controllers\ModelSCQController::create
 * @see app/Http/Controllers/ModelSCQController.php:59
 * @route '/articles/cq-models/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/articles/cq-models/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ModelSCQController::create
 * @see app/Http/Controllers/ModelSCQController.php:59
 * @route '/articles/cq-models/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ModelSCQController::create
 * @see app/Http/Controllers/ModelSCQController.php:59
 * @route '/articles/cq-models/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::create
 * @see app/Http/Controllers/ModelSCQController.php:59
 * @route '/articles/cq-models/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::create
 * @see app/Http/Controllers/ModelSCQController.php:59
 * @route '/articles/cq-models/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::create
 * @see app/Http/Controllers/ModelSCQController.php:59
 * @route '/articles/cq-models/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::create
 * @see app/Http/Controllers/ModelSCQController.php:59
 * @route '/articles/cq-models/create'
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
 * @see \App\Http\Controllers\ModelSCQController::store
 * @see app/Http/Controllers/ModelSCQController.php:71
 * @route '/articles/cq-models'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/articles/cq-models',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ModelSCQController::store
 * @see app/Http/Controllers/ModelSCQController.php:71
 * @route '/articles/cq-models'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ModelSCQController::store
 * @see app/Http/Controllers/ModelSCQController.php:71
 * @route '/articles/cq-models'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::store
 * @see app/Http/Controllers/ModelSCQController.php:71
 * @route '/articles/cq-models'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::store
 * @see app/Http/Controllers/ModelSCQController.php:71
 * @route '/articles/cq-models'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\ModelSCQController::show
 * @see app/Http/Controllers/ModelSCQController.php:129
 * @route '/articles/cq-models/{cqModel}'
 */
export const show = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/articles/cq-models/{cqModel}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ModelSCQController::show
 * @see app/Http/Controllers/ModelSCQController.php:129
 * @route '/articles/cq-models/{cqModel}'
 */
show.url = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cqModel: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { cqModel: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            cqModel: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        cqModel:
            typeof args.cqModel === 'object' ? args.cqModel.uuid : args.cqModel,
    };

    return (
        show.definition.url
            .replace('{cqModel}', parsedArgs.cqModel.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ModelSCQController::show
 * @see app/Http/Controllers/ModelSCQController.php:129
 * @route '/articles/cq-models/{cqModel}'
 */
show.get = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::show
 * @see app/Http/Controllers/ModelSCQController.php:129
 * @route '/articles/cq-models/{cqModel}'
 */
show.head = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::show
 * @see app/Http/Controllers/ModelSCQController.php:129
 * @route '/articles/cq-models/{cqModel}'
 */
const showForm = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::show
 * @see app/Http/Controllers/ModelSCQController.php:129
 * @route '/articles/cq-models/{cqModel}'
 */
showForm.get = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::show
 * @see app/Http/Controllers/ModelSCQController.php:129
 * @route '/articles/cq-models/{cqModel}'
 */
showForm.head = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ModelSCQController::edit
 * @see app/Http/Controllers/ModelSCQController.php:139
 * @route '/articles/cq-models/{cqModel}/edit'
 */
export const edit = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/articles/cq-models/{cqModel}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ModelSCQController::edit
 * @see app/Http/Controllers/ModelSCQController.php:139
 * @route '/articles/cq-models/{cqModel}/edit'
 */
edit.url = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cqModel: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { cqModel: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            cqModel: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        cqModel:
            typeof args.cqModel === 'object' ? args.cqModel.uuid : args.cqModel,
    };

    return (
        edit.definition.url
            .replace('{cqModel}', parsedArgs.cqModel.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ModelSCQController::edit
 * @see app/Http/Controllers/ModelSCQController.php:139
 * @route '/articles/cq-models/{cqModel}/edit'
 */
edit.get = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::edit
 * @see app/Http/Controllers/ModelSCQController.php:139
 * @route '/articles/cq-models/{cqModel}/edit'
 */
edit.head = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::edit
 * @see app/Http/Controllers/ModelSCQController.php:139
 * @route '/articles/cq-models/{cqModel}/edit'
 */
const editForm = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::edit
 * @see app/Http/Controllers/ModelSCQController.php:139
 * @route '/articles/cq-models/{cqModel}/edit'
 */
editForm.get = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::edit
 * @see app/Http/Controllers/ModelSCQController.php:139
 * @route '/articles/cq-models/{cqModel}/edit'
 */
editForm.head = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ModelSCQController::update
 * @see app/Http/Controllers/ModelSCQController.php:149
 * @route '/articles/cq-models/{cqModel}'
 */
export const update = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put', 'patch'],
    url: '/articles/cq-models/{cqModel}',
} satisfies RouteDefinition<['put', 'patch']>;

/**
 * @see \App\Http\Controllers\ModelSCQController::update
 * @see app/Http/Controllers/ModelSCQController.php:149
 * @route '/articles/cq-models/{cqModel}'
 */
update.url = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cqModel: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { cqModel: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            cqModel: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        cqModel:
            typeof args.cqModel === 'object' ? args.cqModel.uuid : args.cqModel,
    };

    return (
        update.definition.url
            .replace('{cqModel}', parsedArgs.cqModel.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ModelSCQController::update
 * @see app/Http/Controllers/ModelSCQController.php:149
 * @route '/articles/cq-models/{cqModel}'
 */
update.put = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::update
 * @see app/Http/Controllers/ModelSCQController.php:149
 * @route '/articles/cq-models/{cqModel}'
 */
update.patch = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::update
 * @see app/Http/Controllers/ModelSCQController.php:149
 * @route '/articles/cq-models/{cqModel}'
 */
const updateForm = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ModelSCQController::update
 * @see app/Http/Controllers/ModelSCQController.php:149
 * @route '/articles/cq-models/{cqModel}'
 */
updateForm.put = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ModelSCQController::update
 * @see app/Http/Controllers/ModelSCQController.php:149
 * @route '/articles/cq-models/{cqModel}'
 */
updateForm.patch = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ModelSCQController::destroy
 * @see app/Http/Controllers/ModelSCQController.php:218
 * @route '/articles/cq-models/{cqModel}'
 */
export const destroy = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/articles/cq-models/{cqModel}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\ModelSCQController::destroy
 * @see app/Http/Controllers/ModelSCQController.php:218
 * @route '/articles/cq-models/{cqModel}'
 */
destroy.url = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cqModel: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { cqModel: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            cqModel: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        cqModel:
            typeof args.cqModel === 'object' ? args.cqModel.uuid : args.cqModel,
    };

    return (
        destroy.definition.url
            .replace('{cqModel}', parsedArgs.cqModel.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ModelSCQController::destroy
 * @see app/Http/Controllers/ModelSCQController.php:218
 * @route '/articles/cq-models/{cqModel}'
 */
destroy.delete = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\ModelSCQController::destroy
 * @see app/Http/Controllers/ModelSCQController.php:218
 * @route '/articles/cq-models/{cqModel}'
 */
const destroyForm = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
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
 * @see \App\Http\Controllers\ModelSCQController::destroy
 * @see app/Http/Controllers/ModelSCQController.php:218
 * @route '/articles/cq-models/{cqModel}'
 */
destroyForm.delete = (
    args:
        | { cqModel: string | { uuid: string } }
        | [cqModel: string | { uuid: string }]
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

const ModelSCQController = {
    generateCQUNumber,
    downloadFile,
    index,
    create,
    store,
    show,
    edit,
    update,
    destroy,
};

export default ModelSCQController;

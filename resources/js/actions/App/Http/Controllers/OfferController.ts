import {
    applyUrlDefaults,
    queryParams,
    type RouteDefinition,
    type RouteFormDefinition,
    type RouteQueryOptions,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\OfferController::getDivisions
 * @see app/Http/Controllers/OfferController.php:922
 * @route '/offers/get-divisions'
 */
export const getDivisions = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: getDivisions.url(options),
    method: 'get',
});

getDivisions.definition = {
    methods: ['get', 'head'],
    url: '/offers/get-divisions',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferController::getDivisions
 * @see app/Http/Controllers/OfferController.php:922
 * @route '/offers/get-divisions'
 */
getDivisions.url = (options?: RouteQueryOptions) => {
    return getDivisions.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferController::getDivisions
 * @see app/Http/Controllers/OfferController.php:922
 * @route '/offers/get-divisions'
 */
getDivisions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDivisions.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::getDivisions
 * @see app/Http/Controllers/OfferController.php:922
 * @route '/offers/get-divisions'
 */
getDivisions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDivisions.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferController::getDivisions
 * @see app/Http/Controllers/OfferController.php:922
 * @route '/offers/get-divisions'
 */
const getDivisionsForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: getDivisions.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::getDivisions
 * @see app/Http/Controllers/OfferController.php:922
 * @route '/offers/get-divisions'
 */
getDivisionsForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: getDivisions.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::getDivisions
 * @see app/Http/Controllers/OfferController.php:922
 * @route '/offers/get-divisions'
 */
getDivisionsForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: getDivisions.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

getDivisions.form = getDivisionsForm;

/**
 * @see \App\Http\Controllers\OfferController::downloadPdf
 * @see app/Http/Controllers/OfferController.php:512
 * @route '/offers/{offer}/download-pdf'
 */
export const downloadPdf = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadPdf.url(args, options),
    method: 'get',
});

downloadPdf.definition = {
    methods: ['get', 'head'],
    url: '/offers/{offer}/download-pdf',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferController::downloadPdf
 * @see app/Http/Controllers/OfferController.php:512
 * @route '/offers/{offer}/download-pdf'
 */
downloadPdf.url = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offer: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offer: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offer: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offer: typeof args.offer === 'object' ? args.offer.uuid : args.offer,
    };

    return (
        downloadPdf.definition.url
            .replace('{offer}', parsedArgs.offer.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferController::downloadPdf
 * @see app/Http/Controllers/OfferController.php:512
 * @route '/offers/{offer}/download-pdf'
 */
downloadPdf.get = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadPdf.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::downloadPdf
 * @see app/Http/Controllers/OfferController.php:512
 * @route '/offers/{offer}/download-pdf'
 */
downloadPdf.head = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: downloadPdf.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferController::downloadPdf
 * @see app/Http/Controllers/OfferController.php:512
 * @route '/offers/{offer}/download-pdf'
 */
const downloadPdfForm = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadPdf.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::downloadPdf
 * @see app/Http/Controllers/OfferController.php:512
 * @route '/offers/{offer}/download-pdf'
 */
downloadPdfForm.get = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadPdf.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::downloadPdf
 * @see app/Http/Controllers/OfferController.php:512
 * @route '/offers/{offer}/download-pdf'
 */
downloadPdfForm.head = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadPdf.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

downloadPdf.form = downloadPdfForm;

/**
 * @see \App\Http\Controllers\OfferController::index
 * @see app/Http/Controllers/OfferController.php:54
 * @route '/offers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/offers',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferController::index
 * @see app/Http/Controllers/OfferController.php:54
 * @route '/offers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferController::index
 * @see app/Http/Controllers/OfferController.php:54
 * @route '/offers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::index
 * @see app/Http/Controllers/OfferController.php:54
 * @route '/offers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferController::index
 * @see app/Http/Controllers/OfferController.php:54
 * @route '/offers'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::index
 * @see app/Http/Controllers/OfferController.php:54
 * @route '/offers'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::index
 * @see app/Http/Controllers/OfferController.php:54
 * @route '/offers'
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
 * @see \App\Http\Controllers\OfferController::create
 * @see app/Http/Controllers/OfferController.php:109
 * @route '/offers/create'
 */
export const create = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

create.definition = {
    methods: ['get', 'head'],
    url: '/offers/create',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferController::create
 * @see app/Http/Controllers/OfferController.php:109
 * @route '/offers/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferController::create
 * @see app/Http/Controllers/OfferController.php:109
 * @route '/offers/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::create
 * @see app/Http/Controllers/OfferController.php:109
 * @route '/offers/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferController::create
 * @see app/Http/Controllers/OfferController.php:109
 * @route '/offers/create'
 */
const createForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::create
 * @see app/Http/Controllers/OfferController.php:109
 * @route '/offers/create'
 */
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::create
 * @see app/Http/Controllers/OfferController.php:109
 * @route '/offers/create'
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
 * @see \App\Http\Controllers\OfferController::store
 * @see app/Http/Controllers/OfferController.php:242
 * @route '/offers'
 */
export const store = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

store.definition = {
    methods: ['post'],
    url: '/offers',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\OfferController::store
 * @see app/Http/Controllers/OfferController.php:242
 * @route '/offers'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\OfferController::store
 * @see app/Http/Controllers/OfferController.php:242
 * @route '/offers'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\OfferController::store
 * @see app/Http/Controllers/OfferController.php:242
 * @route '/offers'
 */
const storeForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\OfferController::store
 * @see app/Http/Controllers/OfferController.php:242
 * @route '/offers'
 */
storeForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\OfferController::show
 * @see app/Http/Controllers/OfferController.php:263
 * @route '/offers/{offer}'
 */
export const show = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

show.definition = {
    methods: ['get', 'head'],
    url: '/offers/{offer}',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferController::show
 * @see app/Http/Controllers/OfferController.php:263
 * @route '/offers/{offer}'
 */
show.url = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offer: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offer: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offer: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offer: typeof args.offer === 'object' ? args.offer.uuid : args.offer,
    };

    return (
        show.definition.url
            .replace('{offer}', parsedArgs.offer.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferController::show
 * @see app/Http/Controllers/OfferController.php:263
 * @route '/offers/{offer}'
 */
show.get = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::show
 * @see app/Http/Controllers/OfferController.php:263
 * @route '/offers/{offer}'
 */
show.head = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferController::show
 * @see app/Http/Controllers/OfferController.php:263
 * @route '/offers/{offer}'
 */
const showForm = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::show
 * @see app/Http/Controllers/OfferController.php:263
 * @route '/offers/{offer}'
 */
showForm.get = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::show
 * @see app/Http/Controllers/OfferController.php:263
 * @route '/offers/{offer}'
 */
showForm.head = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferController::edit
 * @see app/Http/Controllers/OfferController.php:646
 * @route '/offers/{offer}/edit'
 */
export const edit = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

edit.definition = {
    methods: ['get', 'head'],
    url: '/offers/{offer}/edit',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\OfferController::edit
 * @see app/Http/Controllers/OfferController.php:646
 * @route '/offers/{offer}/edit'
 */
edit.url = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offer: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offer: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offer: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offer: typeof args.offer === 'object' ? args.offer.uuid : args.offer,
    };

    return (
        edit.definition.url
            .replace('{offer}', parsedArgs.offer.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferController::edit
 * @see app/Http/Controllers/OfferController.php:646
 * @route '/offers/{offer}/edit'
 */
edit.get = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::edit
 * @see app/Http/Controllers/OfferController.php:646
 * @route '/offers/{offer}/edit'
 */
edit.head = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\OfferController::edit
 * @see app/Http/Controllers/OfferController.php:646
 * @route '/offers/{offer}/edit'
 */
const editForm = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::edit
 * @see app/Http/Controllers/OfferController.php:646
 * @route '/offers/{offer}/edit'
 */
editForm.get = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\OfferController::edit
 * @see app/Http/Controllers/OfferController.php:646
 * @route '/offers/{offer}/edit'
 */
editForm.head = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferController::update
 * @see app/Http/Controllers/OfferController.php:866
 * @route '/offers/{offer}'
 */
export const update = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put', 'patch'],
    url: '/offers/{offer}',
} satisfies RouteDefinition<['put', 'patch']>;

/**
 * @see \App\Http\Controllers\OfferController::update
 * @see app/Http/Controllers/OfferController.php:866
 * @route '/offers/{offer}'
 */
update.url = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offer: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offer: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offer: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offer: typeof args.offer === 'object' ? args.offer.uuid : args.offer,
    };

    return (
        update.definition.url
            .replace('{offer}', parsedArgs.offer.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferController::update
 * @see app/Http/Controllers/OfferController.php:866
 * @route '/offers/{offer}'
 */
update.put = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\OfferController::update
 * @see app/Http/Controllers/OfferController.php:866
 * @route '/offers/{offer}'
 */
update.patch = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
});

/**
 * @see \App\Http\Controllers\OfferController::update
 * @see app/Http/Controllers/OfferController.php:866
 * @route '/offers/{offer}'
 */
const updateForm = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferController::update
 * @see app/Http/Controllers/OfferController.php:866
 * @route '/offers/{offer}'
 */
updateForm.put = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferController::update
 * @see app/Http/Controllers/OfferController.php:866
 * @route '/offers/{offer}'
 */
updateForm.patch = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferController::destroy
 * @see app/Http/Controllers/OfferController.php:893
 * @route '/offers/{offer}'
 */
export const destroy = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

destroy.definition = {
    methods: ['delete'],
    url: '/offers/{offer}',
} satisfies RouteDefinition<['delete']>;

/**
 * @see \App\Http\Controllers\OfferController::destroy
 * @see app/Http/Controllers/OfferController.php:893
 * @route '/offers/{offer}'
 */
destroy.url = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offer: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offer: args.uuid };
    }

    if (Array.isArray(args)) {
        args = {
            offer: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        offer: typeof args.offer === 'object' ? args.offer.uuid : args.offer,
    };

    return (
        destroy.definition.url
            .replace('{offer}', parsedArgs.offer.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\OfferController::destroy
 * @see app/Http/Controllers/OfferController.php:893
 * @route '/offers/{offer}'
 */
destroy.delete = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
        | string
        | { uuid: string },
    options?: RouteQueryOptions,
): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
});

/**
 * @see \App\Http\Controllers\OfferController::destroy
 * @see app/Http/Controllers/OfferController.php:893
 * @route '/offers/{offer}'
 */
const destroyForm = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
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
 * @see \App\Http\Controllers\OfferController::destroy
 * @see app/Http/Controllers/OfferController.php:893
 * @route '/offers/{offer}'
 */
destroyForm.delete = (
    args:
        | { offer: string | { uuid: string } }
        | [offer: string | { uuid: string }]
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

const OfferController = {
    getDivisions,
    downloadPdf,
    index,
    create,
    store,
    show,
    edit,
    update,
    destroy,
};

export default OfferController;

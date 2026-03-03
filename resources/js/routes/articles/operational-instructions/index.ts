import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ArticleIOController::generateIoNumber
* @see app/Http/Controllers/ArticleIOController.php:210
* @route '/articles/operational-instructions/generate-io-number'
*/
export const generateIoNumber = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generateIoNumber.url(options),
    method: 'get',
})

generateIoNumber.definition = {
    methods: ["get","head"],
    url: '/articles/operational-instructions/generate-io-number',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleIOController::generateIoNumber
* @see app/Http/Controllers/ArticleIOController.php:210
* @route '/articles/operational-instructions/generate-io-number'
*/
generateIoNumber.url = (options?: RouteQueryOptions) => {
    return generateIoNumber.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIOController::generateIoNumber
* @see app/Http/Controllers/ArticleIOController.php:210
* @route '/articles/operational-instructions/generate-io-number'
*/
generateIoNumber.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generateIoNumber.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::generateIoNumber
* @see app/Http/Controllers/ArticleIOController.php:210
* @route '/articles/operational-instructions/generate-io-number'
*/
generateIoNumber.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generateIoNumber.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIOController::generateIoNumber
* @see app/Http/Controllers/ArticleIOController.php:210
* @route '/articles/operational-instructions/generate-io-number'
*/
const generateIoNumberForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: generateIoNumber.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::generateIoNumber
* @see app/Http/Controllers/ArticleIOController.php:210
* @route '/articles/operational-instructions/generate-io-number'
*/
generateIoNumberForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: generateIoNumber.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::generateIoNumber
* @see app/Http/Controllers/ArticleIOController.php:210
* @route '/articles/operational-instructions/generate-io-number'
*/
generateIoNumberForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: generateIoNumber.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

generateIoNumber.form = generateIoNumberForm

/**
* @see \App\Http\Controllers\ArticleIOController::download
* @see app/Http/Controllers/ArticleIOController.php:191
* @route '/articles/operational-instructions/{operationalInstruction}/download'
*/
export const download = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/articles/operational-instructions/{operationalInstruction}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleIOController::download
* @see app/Http/Controllers/ArticleIOController.php:191
* @route '/articles/operational-instructions/{operationalInstruction}/download'
*/
download.url = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { operationalInstruction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { operationalInstruction: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            operationalInstruction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        operationalInstruction: typeof args.operationalInstruction === 'object'
        ? args.operationalInstruction.uuid
        : args.operationalInstruction,
    }

    return download.definition.url
            .replace('{operationalInstruction}', parsedArgs.operationalInstruction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIOController::download
* @see app/Http/Controllers/ArticleIOController.php:191
* @route '/articles/operational-instructions/{operationalInstruction}/download'
*/
download.get = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::download
* @see app/Http/Controllers/ArticleIOController.php:191
* @route '/articles/operational-instructions/{operationalInstruction}/download'
*/
download.head = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIOController::download
* @see app/Http/Controllers/ArticleIOController.php:191
* @route '/articles/operational-instructions/{operationalInstruction}/download'
*/
const downloadForm = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::download
* @see app/Http/Controllers/ArticleIOController.php:191
* @route '/articles/operational-instructions/{operationalInstruction}/download'
*/
downloadForm.get = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::download
* @see app/Http/Controllers/ArticleIOController.php:191
* @route '/articles/operational-instructions/{operationalInstruction}/download'
*/
downloadForm.head = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

/**
* @see \App\Http\Controllers\ArticleIOController::index
* @see app/Http/Controllers/ArticleIOController.php:23
* @route '/articles/operational-instructions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/articles/operational-instructions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleIOController::index
* @see app/Http/Controllers/ArticleIOController.php:23
* @route '/articles/operational-instructions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIOController::index
* @see app/Http/Controllers/ArticleIOController.php:23
* @route '/articles/operational-instructions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::index
* @see app/Http/Controllers/ArticleIOController.php:23
* @route '/articles/operational-instructions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIOController::index
* @see app/Http/Controllers/ArticleIOController.php:23
* @route '/articles/operational-instructions'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::index
* @see app/Http/Controllers/ArticleIOController.php:23
* @route '/articles/operational-instructions'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::index
* @see app/Http/Controllers/ArticleIOController.php:23
* @route '/articles/operational-instructions'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\ArticleIOController::create
* @see app/Http/Controllers/ArticleIOController.php:59
* @route '/articles/operational-instructions/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/articles/operational-instructions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleIOController::create
* @see app/Http/Controllers/ArticleIOController.php:59
* @route '/articles/operational-instructions/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIOController::create
* @see app/Http/Controllers/ArticleIOController.php:59
* @route '/articles/operational-instructions/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::create
* @see app/Http/Controllers/ArticleIOController.php:59
* @route '/articles/operational-instructions/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIOController::create
* @see app/Http/Controllers/ArticleIOController.php:59
* @route '/articles/operational-instructions/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::create
* @see app/Http/Controllers/ArticleIOController.php:59
* @route '/articles/operational-instructions/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::create
* @see app/Http/Controllers/ArticleIOController.php:59
* @route '/articles/operational-instructions/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\ArticleIOController::store
* @see app/Http/Controllers/ArticleIOController.php:67
* @route '/articles/operational-instructions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/articles/operational-instructions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ArticleIOController::store
* @see app/Http/Controllers/ArticleIOController.php:67
* @route '/articles/operational-instructions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIOController::store
* @see app/Http/Controllers/ArticleIOController.php:67
* @route '/articles/operational-instructions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleIOController::store
* @see app/Http/Controllers/ArticleIOController.php:67
* @route '/articles/operational-instructions'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleIOController::store
* @see app/Http/Controllers/ArticleIOController.php:67
* @route '/articles/operational-instructions'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ArticleIOController::show
* @see app/Http/Controllers/ArticleIOController.php:101
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
export const show = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/articles/operational-instructions/{operationalInstruction}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleIOController::show
* @see app/Http/Controllers/ArticleIOController.php:101
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
show.url = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { operationalInstruction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { operationalInstruction: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            operationalInstruction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        operationalInstruction: typeof args.operationalInstruction === 'object'
        ? args.operationalInstruction.uuid
        : args.operationalInstruction,
    }

    return show.definition.url
            .replace('{operationalInstruction}', parsedArgs.operationalInstruction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIOController::show
* @see app/Http/Controllers/ArticleIOController.php:101
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
show.get = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::show
* @see app/Http/Controllers/ArticleIOController.php:101
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
show.head = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIOController::show
* @see app/Http/Controllers/ArticleIOController.php:101
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
const showForm = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::show
* @see app/Http/Controllers/ArticleIOController.php:101
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
showForm.get = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::show
* @see app/Http/Controllers/ArticleIOController.php:101
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
showForm.head = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\ArticleIOController::edit
* @see app/Http/Controllers/ArticleIOController.php:113
* @route '/articles/operational-instructions/{operationalInstruction}/edit'
*/
export const edit = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/articles/operational-instructions/{operationalInstruction}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleIOController::edit
* @see app/Http/Controllers/ArticleIOController.php:113
* @route '/articles/operational-instructions/{operationalInstruction}/edit'
*/
edit.url = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { operationalInstruction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { operationalInstruction: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            operationalInstruction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        operationalInstruction: typeof args.operationalInstruction === 'object'
        ? args.operationalInstruction.uuid
        : args.operationalInstruction,
    }

    return edit.definition.url
            .replace('{operationalInstruction}', parsedArgs.operationalInstruction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIOController::edit
* @see app/Http/Controllers/ArticleIOController.php:113
* @route '/articles/operational-instructions/{operationalInstruction}/edit'
*/
edit.get = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::edit
* @see app/Http/Controllers/ArticleIOController.php:113
* @route '/articles/operational-instructions/{operationalInstruction}/edit'
*/
edit.head = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIOController::edit
* @see app/Http/Controllers/ArticleIOController.php:113
* @route '/articles/operational-instructions/{operationalInstruction}/edit'
*/
const editForm = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::edit
* @see app/Http/Controllers/ArticleIOController.php:113
* @route '/articles/operational-instructions/{operationalInstruction}/edit'
*/
editForm.get = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::edit
* @see app/Http/Controllers/ArticleIOController.php:113
* @route '/articles/operational-instructions/{operationalInstruction}/edit'
*/
editForm.head = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\ArticleIOController::update
* @see app/Http/Controllers/ArticleIOController.php:123
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
export const update = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/articles/operational-instructions/{operationalInstruction}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ArticleIOController::update
* @see app/Http/Controllers/ArticleIOController.php:123
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
update.url = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { operationalInstruction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { operationalInstruction: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            operationalInstruction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        operationalInstruction: typeof args.operationalInstruction === 'object'
        ? args.operationalInstruction.uuid
        : args.operationalInstruction,
    }

    return update.definition.url
            .replace('{operationalInstruction}', parsedArgs.operationalInstruction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIOController::update
* @see app/Http/Controllers/ArticleIOController.php:123
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
update.put = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ArticleIOController::update
* @see app/Http/Controllers/ArticleIOController.php:123
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
update.patch = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ArticleIOController::update
* @see app/Http/Controllers/ArticleIOController.php:123
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
const updateForm = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleIOController::update
* @see app/Http/Controllers/ArticleIOController.php:123
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
updateForm.put = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleIOController::update
* @see app/Http/Controllers/ArticleIOController.php:123
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
updateForm.patch = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\ArticleIOController::destroy
* @see app/Http/Controllers/ArticleIOController.php:177
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
export const destroy = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/articles/operational-instructions/{operationalInstruction}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ArticleIOController::destroy
* @see app/Http/Controllers/ArticleIOController.php:177
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
destroy.url = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { operationalInstruction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { operationalInstruction: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            operationalInstruction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        operationalInstruction: typeof args.operationalInstruction === 'object'
        ? args.operationalInstruction.uuid
        : args.operationalInstruction,
    }

    return destroy.definition.url
            .replace('{operationalInstruction}', parsedArgs.operationalInstruction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIOController::destroy
* @see app/Http/Controllers/ArticleIOController.php:177
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
destroy.delete = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ArticleIOController::destroy
* @see app/Http/Controllers/ArticleIOController.php:177
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
const destroyForm = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleIOController::destroy
* @see app/Http/Controllers/ArticleIOController.php:177
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
destroyForm.delete = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const operationalInstructions = {
    generateIoNumber: Object.assign(generateIoNumber, generateIoNumber),
    download: Object.assign(download, download),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default operationalInstructions
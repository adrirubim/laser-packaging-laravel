import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ArticleIPController::generateIPNumber
* @see app/Http/Controllers/ArticleIPController.php:238
* @route '/articles/palletization-instructions/generate-ip-number'
*/
export const generateIPNumber = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generateIPNumber.url(options),
    method: 'get',
})

generateIPNumber.definition = {
    methods: ["get","head"],
    url: '/articles/palletization-instructions/generate-ip-number',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleIPController::generateIPNumber
* @see app/Http/Controllers/ArticleIPController.php:238
* @route '/articles/palletization-instructions/generate-ip-number'
*/
generateIPNumber.url = (options?: RouteQueryOptions) => {
    return generateIPNumber.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIPController::generateIPNumber
* @see app/Http/Controllers/ArticleIPController.php:238
* @route '/articles/palletization-instructions/generate-ip-number'
*/
generateIPNumber.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generateIPNumber.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::generateIPNumber
* @see app/Http/Controllers/ArticleIPController.php:238
* @route '/articles/palletization-instructions/generate-ip-number'
*/
generateIPNumber.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generateIPNumber.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIPController::generateIPNumber
* @see app/Http/Controllers/ArticleIPController.php:238
* @route '/articles/palletization-instructions/generate-ip-number'
*/
const generateIPNumberForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: generateIPNumber.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::generateIPNumber
* @see app/Http/Controllers/ArticleIPController.php:238
* @route '/articles/palletization-instructions/generate-ip-number'
*/
generateIPNumberForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: generateIPNumber.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::generateIPNumber
* @see app/Http/Controllers/ArticleIPController.php:238
* @route '/articles/palletization-instructions/generate-ip-number'
*/
generateIPNumberForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: generateIPNumber.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

generateIPNumber.form = generateIPNumberForm

/**
* @see \App\Http\Controllers\ArticleIPController::download
* @see app/Http/Controllers/ArticleIPController.php:219
* @route '/articles/palletization-instructions/{palletizationInstruction}/download'
*/
export const download = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/articles/palletization-instructions/{palletizationInstruction}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleIPController::download
* @see app/Http/Controllers/ArticleIPController.php:219
* @route '/articles/palletization-instructions/{palletizationInstruction}/download'
*/
download.url = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { palletizationInstruction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { palletizationInstruction: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            palletizationInstruction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        palletizationInstruction: typeof args.palletizationInstruction === 'object'
        ? args.palletizationInstruction.uuid
        : args.palletizationInstruction,
    }

    return download.definition.url
            .replace('{palletizationInstruction}', parsedArgs.palletizationInstruction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIPController::download
* @see app/Http/Controllers/ArticleIPController.php:219
* @route '/articles/palletization-instructions/{palletizationInstruction}/download'
*/
download.get = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::download
* @see app/Http/Controllers/ArticleIPController.php:219
* @route '/articles/palletization-instructions/{palletizationInstruction}/download'
*/
download.head = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIPController::download
* @see app/Http/Controllers/ArticleIPController.php:219
* @route '/articles/palletization-instructions/{palletizationInstruction}/download'
*/
const downloadForm = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::download
* @see app/Http/Controllers/ArticleIPController.php:219
* @route '/articles/palletization-instructions/{palletizationInstruction}/download'
*/
downloadForm.get = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::download
* @see app/Http/Controllers/ArticleIPController.php:219
* @route '/articles/palletization-instructions/{palletizationInstruction}/download'
*/
downloadForm.head = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ArticleIPController::index
* @see app/Http/Controllers/ArticleIPController.php:23
* @route '/articles/palletization-instructions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/articles/palletization-instructions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleIPController::index
* @see app/Http/Controllers/ArticleIPController.php:23
* @route '/articles/palletization-instructions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIPController::index
* @see app/Http/Controllers/ArticleIPController.php:23
* @route '/articles/palletization-instructions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::index
* @see app/Http/Controllers/ArticleIPController.php:23
* @route '/articles/palletization-instructions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIPController::index
* @see app/Http/Controllers/ArticleIPController.php:23
* @route '/articles/palletization-instructions'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::index
* @see app/Http/Controllers/ArticleIPController.php:23
* @route '/articles/palletization-instructions'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::index
* @see app/Http/Controllers/ArticleIPController.php:23
* @route '/articles/palletization-instructions'
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
* @see \App\Http\Controllers\ArticleIPController::create
* @see app/Http/Controllers/ArticleIPController.php:59
* @route '/articles/palletization-instructions/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/articles/palletization-instructions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleIPController::create
* @see app/Http/Controllers/ArticleIPController.php:59
* @route '/articles/palletization-instructions/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIPController::create
* @see app/Http/Controllers/ArticleIPController.php:59
* @route '/articles/palletization-instructions/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::create
* @see app/Http/Controllers/ArticleIPController.php:59
* @route '/articles/palletization-instructions/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIPController::create
* @see app/Http/Controllers/ArticleIPController.php:59
* @route '/articles/palletization-instructions/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::create
* @see app/Http/Controllers/ArticleIPController.php:59
* @route '/articles/palletization-instructions/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::create
* @see app/Http/Controllers/ArticleIPController.php:59
* @route '/articles/palletization-instructions/create'
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
* @see \App\Http\Controllers\ArticleIPController::store
* @see app/Http/Controllers/ArticleIPController.php:67
* @route '/articles/palletization-instructions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/articles/palletization-instructions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ArticleIPController::store
* @see app/Http/Controllers/ArticleIPController.php:67
* @route '/articles/palletization-instructions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIPController::store
* @see app/Http/Controllers/ArticleIPController.php:67
* @route '/articles/palletization-instructions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleIPController::store
* @see app/Http/Controllers/ArticleIPController.php:67
* @route '/articles/palletization-instructions'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleIPController::store
* @see app/Http/Controllers/ArticleIPController.php:67
* @route '/articles/palletization-instructions'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ArticleIPController::show
* @see app/Http/Controllers/ArticleIPController.php:115
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
export const show = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/articles/palletization-instructions/{palletizationInstruction}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleIPController::show
* @see app/Http/Controllers/ArticleIPController.php:115
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
show.url = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { palletizationInstruction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { palletizationInstruction: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            palletizationInstruction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        palletizationInstruction: typeof args.palletizationInstruction === 'object'
        ? args.palletizationInstruction.uuid
        : args.palletizationInstruction,
    }

    return show.definition.url
            .replace('{palletizationInstruction}', parsedArgs.palletizationInstruction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIPController::show
* @see app/Http/Controllers/ArticleIPController.php:115
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
show.get = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::show
* @see app/Http/Controllers/ArticleIPController.php:115
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
show.head = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIPController::show
* @see app/Http/Controllers/ArticleIPController.php:115
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
const showForm = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::show
* @see app/Http/Controllers/ArticleIPController.php:115
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
showForm.get = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::show
* @see app/Http/Controllers/ArticleIPController.php:115
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
showForm.head = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ArticleIPController::edit
* @see app/Http/Controllers/ArticleIPController.php:127
* @route '/articles/palletization-instructions/{palletizationInstruction}/edit'
*/
export const edit = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/articles/palletization-instructions/{palletizationInstruction}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleIPController::edit
* @see app/Http/Controllers/ArticleIPController.php:127
* @route '/articles/palletization-instructions/{palletizationInstruction}/edit'
*/
edit.url = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { palletizationInstruction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { palletizationInstruction: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            palletizationInstruction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        palletizationInstruction: typeof args.palletizationInstruction === 'object'
        ? args.palletizationInstruction.uuid
        : args.palletizationInstruction,
    }

    return edit.definition.url
            .replace('{palletizationInstruction}', parsedArgs.palletizationInstruction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIPController::edit
* @see app/Http/Controllers/ArticleIPController.php:127
* @route '/articles/palletization-instructions/{palletizationInstruction}/edit'
*/
edit.get = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::edit
* @see app/Http/Controllers/ArticleIPController.php:127
* @route '/articles/palletization-instructions/{palletizationInstruction}/edit'
*/
edit.head = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIPController::edit
* @see app/Http/Controllers/ArticleIPController.php:127
* @route '/articles/palletization-instructions/{palletizationInstruction}/edit'
*/
const editForm = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::edit
* @see app/Http/Controllers/ArticleIPController.php:127
* @route '/articles/palletization-instructions/{palletizationInstruction}/edit'
*/
editForm.get = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::edit
* @see app/Http/Controllers/ArticleIPController.php:127
* @route '/articles/palletization-instructions/{palletizationInstruction}/edit'
*/
editForm.head = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ArticleIPController::update
* @see app/Http/Controllers/ArticleIPController.php:137
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
export const update = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/articles/palletization-instructions/{palletizationInstruction}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ArticleIPController::update
* @see app/Http/Controllers/ArticleIPController.php:137
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
update.url = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { palletizationInstruction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { palletizationInstruction: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            palletizationInstruction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        palletizationInstruction: typeof args.palletizationInstruction === 'object'
        ? args.palletizationInstruction.uuid
        : args.palletizationInstruction,
    }

    return update.definition.url
            .replace('{palletizationInstruction}', parsedArgs.palletizationInstruction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIPController::update
* @see app/Http/Controllers/ArticleIPController.php:137
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
update.put = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ArticleIPController::update
* @see app/Http/Controllers/ArticleIPController.php:137
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
update.patch = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ArticleIPController::update
* @see app/Http/Controllers/ArticleIPController.php:137
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
const updateForm = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleIPController::update
* @see app/Http/Controllers/ArticleIPController.php:137
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
updateForm.put = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleIPController::update
* @see app/Http/Controllers/ArticleIPController.php:137
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
updateForm.patch = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ArticleIPController::destroy
* @see app/Http/Controllers/ArticleIPController.php:205
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
export const destroy = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/articles/palletization-instructions/{palletizationInstruction}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ArticleIPController::destroy
* @see app/Http/Controllers/ArticleIPController.php:205
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
destroy.url = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { palletizationInstruction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { palletizationInstruction: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            palletizationInstruction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        palletizationInstruction: typeof args.palletizationInstruction === 'object'
        ? args.palletizationInstruction.uuid
        : args.palletizationInstruction,
    }

    return destroy.definition.url
            .replace('{palletizationInstruction}', parsedArgs.palletizationInstruction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIPController::destroy
* @see app/Http/Controllers/ArticleIPController.php:205
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
destroy.delete = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ArticleIPController::destroy
* @see app/Http/Controllers/ArticleIPController.php:205
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
const destroyForm = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleIPController::destroy
* @see app/Http/Controllers/ArticleIPController.php:205
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
destroyForm.delete = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const ArticleIPController = { generateIPNumber, download, index, create, store, show, edit, update, destroy }

export default ArticleIPController
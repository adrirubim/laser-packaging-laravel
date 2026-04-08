import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ArticleIOController::generateIoNumber
* @see app/Http/Controllers/ArticleIOController.php:190
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
* @see app/Http/Controllers/ArticleIOController.php:190
* @route '/articles/operational-instructions/generate-io-number'
*/
generateIoNumber.url = (options?: RouteQueryOptions) => {
    return generateIoNumber.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIOController::generateIoNumber
* @see app/Http/Controllers/ArticleIOController.php:190
* @route '/articles/operational-instructions/generate-io-number'
*/
generateIoNumber.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generateIoNumber.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::generateIoNumber
* @see app/Http/Controllers/ArticleIOController.php:190
* @route '/articles/operational-instructions/generate-io-number'
*/
generateIoNumber.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generateIoNumber.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIOController::download
* @see app/Http/Controllers/ArticleIOController.php:171
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
* @see app/Http/Controllers/ArticleIOController.php:171
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
* @see app/Http/Controllers/ArticleIOController.php:171
* @route '/articles/operational-instructions/{operationalInstruction}/download'
*/
download.get = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::download
* @see app/Http/Controllers/ArticleIOController.php:171
* @route '/articles/operational-instructions/{operationalInstruction}/download'
*/
download.head = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIOController::index
* @see app/Http/Controllers/ArticleIOController.php:29
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
* @see app/Http/Controllers/ArticleIOController.php:29
* @route '/articles/operational-instructions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIOController::index
* @see app/Http/Controllers/ArticleIOController.php:29
* @route '/articles/operational-instructions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::index
* @see app/Http/Controllers/ArticleIOController.php:29
* @route '/articles/operational-instructions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIOController::create
* @see app/Http/Controllers/ArticleIOController.php:42
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
* @see app/Http/Controllers/ArticleIOController.php:42
* @route '/articles/operational-instructions/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIOController::create
* @see app/Http/Controllers/ArticleIOController.php:42
* @route '/articles/operational-instructions/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::create
* @see app/Http/Controllers/ArticleIOController.php:42
* @route '/articles/operational-instructions/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIOController::store
* @see app/Http/Controllers/ArticleIOController.php:50
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
* @see app/Http/Controllers/ArticleIOController.php:50
* @route '/articles/operational-instructions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIOController::store
* @see app/Http/Controllers/ArticleIOController.php:50
* @route '/articles/operational-instructions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleIOController::show
* @see app/Http/Controllers/ArticleIOController.php:84
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
* @see app/Http/Controllers/ArticleIOController.php:84
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
* @see app/Http/Controllers/ArticleIOController.php:84
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
show.get = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::show
* @see app/Http/Controllers/ArticleIOController.php:84
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
show.head = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIOController::edit
* @see app/Http/Controllers/ArticleIOController.php:96
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
* @see app/Http/Controllers/ArticleIOController.php:96
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
* @see app/Http/Controllers/ArticleIOController.php:96
* @route '/articles/operational-instructions/{operationalInstruction}/edit'
*/
edit.get = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIOController::edit
* @see app/Http/Controllers/ArticleIOController.php:96
* @route '/articles/operational-instructions/{operationalInstruction}/edit'
*/
edit.head = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIOController::update
* @see app/Http/Controllers/ArticleIOController.php:106
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
* @see app/Http/Controllers/ArticleIOController.php:106
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
* @see app/Http/Controllers/ArticleIOController.php:106
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
update.put = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ArticleIOController::update
* @see app/Http/Controllers/ArticleIOController.php:106
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
update.patch = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ArticleIOController::destroy
* @see app/Http/Controllers/ArticleIOController.php:160
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
* @see app/Http/Controllers/ArticleIOController.php:160
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
* @see app/Http/Controllers/ArticleIOController.php:160
* @route '/articles/operational-instructions/{operationalInstruction}'
*/
destroy.delete = (args: { operationalInstruction: string | { uuid: string } } | [operationalInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

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
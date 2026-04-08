import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ArticleIPController::generateIPNumber
* @see app/Http/Controllers/ArticleIPController.php:212
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
* @see app/Http/Controllers/ArticleIPController.php:212
* @route '/articles/palletization-instructions/generate-ip-number'
*/
generateIPNumber.url = (options?: RouteQueryOptions) => {
    return generateIPNumber.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIPController::generateIPNumber
* @see app/Http/Controllers/ArticleIPController.php:212
* @route '/articles/palletization-instructions/generate-ip-number'
*/
generateIPNumber.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generateIPNumber.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::generateIPNumber
* @see app/Http/Controllers/ArticleIPController.php:212
* @route '/articles/palletization-instructions/generate-ip-number'
*/
generateIPNumber.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generateIPNumber.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIPController::download
* @see app/Http/Controllers/ArticleIPController.php:193
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
* @see app/Http/Controllers/ArticleIPController.php:193
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
* @see app/Http/Controllers/ArticleIPController.php:193
* @route '/articles/palletization-instructions/{palletizationInstruction}/download'
*/
download.get = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::download
* @see app/Http/Controllers/ArticleIPController.php:193
* @route '/articles/palletization-instructions/{palletizationInstruction}/download'
*/
download.head = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIPController::index
* @see app/Http/Controllers/ArticleIPController.php:29
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
* @see app/Http/Controllers/ArticleIPController.php:29
* @route '/articles/palletization-instructions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIPController::index
* @see app/Http/Controllers/ArticleIPController.php:29
* @route '/articles/palletization-instructions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::index
* @see app/Http/Controllers/ArticleIPController.php:29
* @route '/articles/palletization-instructions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIPController::create
* @see app/Http/Controllers/ArticleIPController.php:42
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
* @see app/Http/Controllers/ArticleIPController.php:42
* @route '/articles/palletization-instructions/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIPController::create
* @see app/Http/Controllers/ArticleIPController.php:42
* @route '/articles/palletization-instructions/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::create
* @see app/Http/Controllers/ArticleIPController.php:42
* @route '/articles/palletization-instructions/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIPController::store
* @see app/Http/Controllers/ArticleIPController.php:50
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
* @see app/Http/Controllers/ArticleIPController.php:50
* @route '/articles/palletization-instructions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleIPController::store
* @see app/Http/Controllers/ArticleIPController.php:50
* @route '/articles/palletization-instructions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleIPController::show
* @see app/Http/Controllers/ArticleIPController.php:95
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
* @see app/Http/Controllers/ArticleIPController.php:95
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
* @see app/Http/Controllers/ArticleIPController.php:95
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
show.get = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::show
* @see app/Http/Controllers/ArticleIPController.php:95
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
show.head = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIPController::edit
* @see app/Http/Controllers/ArticleIPController.php:107
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
* @see app/Http/Controllers/ArticleIPController.php:107
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
* @see app/Http/Controllers/ArticleIPController.php:107
* @route '/articles/palletization-instructions/{palletizationInstruction}/edit'
*/
edit.get = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleIPController::edit
* @see app/Http/Controllers/ArticleIPController.php:107
* @route '/articles/palletization-instructions/{palletizationInstruction}/edit'
*/
edit.head = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleIPController::update
* @see app/Http/Controllers/ArticleIPController.php:117
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
* @see app/Http/Controllers/ArticleIPController.php:117
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
* @see app/Http/Controllers/ArticleIPController.php:117
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
update.put = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ArticleIPController::update
* @see app/Http/Controllers/ArticleIPController.php:117
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
update.patch = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ArticleIPController::destroy
* @see app/Http/Controllers/ArticleIPController.php:182
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
* @see app/Http/Controllers/ArticleIPController.php:182
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
* @see app/Http/Controllers/ArticleIPController.php:182
* @route '/articles/palletization-instructions/{palletizationInstruction}'
*/
destroy.delete = (args: { palletizationInstruction: string | { uuid: string } } | [palletizationInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const ArticleIPController = { generateIPNumber, download, index, create, store, show, edit, update, destroy }

export default ArticleIPController
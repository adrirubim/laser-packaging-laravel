import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ArticleICController::generateICNumber
* @see app/Http/Controllers/ArticleICController.php:190
* @route '/articles/packaging-instructions/generate-ic-number'
*/
export const generateICNumber = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generateICNumber.url(options),
    method: 'get',
})

generateICNumber.definition = {
    methods: ["get","head"],
    url: '/articles/packaging-instructions/generate-ic-number',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleICController::generateICNumber
* @see app/Http/Controllers/ArticleICController.php:190
* @route '/articles/packaging-instructions/generate-ic-number'
*/
generateICNumber.url = (options?: RouteQueryOptions) => {
    return generateICNumber.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleICController::generateICNumber
* @see app/Http/Controllers/ArticleICController.php:190
* @route '/articles/packaging-instructions/generate-ic-number'
*/
generateICNumber.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generateICNumber.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleICController::generateICNumber
* @see app/Http/Controllers/ArticleICController.php:190
* @route '/articles/packaging-instructions/generate-ic-number'
*/
generateICNumber.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generateICNumber.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleICController::download
* @see app/Http/Controllers/ArticleICController.php:171
* @route '/articles/packaging-instructions/{packagingInstruction}/download'
*/
export const download = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/articles/packaging-instructions/{packagingInstruction}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleICController::download
* @see app/Http/Controllers/ArticleICController.php:171
* @route '/articles/packaging-instructions/{packagingInstruction}/download'
*/
download.url = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { packagingInstruction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { packagingInstruction: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            packagingInstruction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        packagingInstruction: typeof args.packagingInstruction === 'object'
        ? args.packagingInstruction.uuid
        : args.packagingInstruction,
    }

    return download.definition.url
            .replace('{packagingInstruction}', parsedArgs.packagingInstruction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleICController::download
* @see app/Http/Controllers/ArticleICController.php:171
* @route '/articles/packaging-instructions/{packagingInstruction}/download'
*/
download.get = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleICController::download
* @see app/Http/Controllers/ArticleICController.php:171
* @route '/articles/packaging-instructions/{packagingInstruction}/download'
*/
download.head = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleICController::index
* @see app/Http/Controllers/ArticleICController.php:29
* @route '/articles/packaging-instructions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/articles/packaging-instructions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleICController::index
* @see app/Http/Controllers/ArticleICController.php:29
* @route '/articles/packaging-instructions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleICController::index
* @see app/Http/Controllers/ArticleICController.php:29
* @route '/articles/packaging-instructions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleICController::index
* @see app/Http/Controllers/ArticleICController.php:29
* @route '/articles/packaging-instructions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleICController::create
* @see app/Http/Controllers/ArticleICController.php:42
* @route '/articles/packaging-instructions/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/articles/packaging-instructions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleICController::create
* @see app/Http/Controllers/ArticleICController.php:42
* @route '/articles/packaging-instructions/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleICController::create
* @see app/Http/Controllers/ArticleICController.php:42
* @route '/articles/packaging-instructions/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleICController::create
* @see app/Http/Controllers/ArticleICController.php:42
* @route '/articles/packaging-instructions/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleICController::store
* @see app/Http/Controllers/ArticleICController.php:50
* @route '/articles/packaging-instructions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/articles/packaging-instructions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ArticleICController::store
* @see app/Http/Controllers/ArticleICController.php:50
* @route '/articles/packaging-instructions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleICController::store
* @see app/Http/Controllers/ArticleICController.php:50
* @route '/articles/packaging-instructions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleICController::show
* @see app/Http/Controllers/ArticleICController.php:84
* @route '/articles/packaging-instructions/{packagingInstruction}'
*/
export const show = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/articles/packaging-instructions/{packagingInstruction}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleICController::show
* @see app/Http/Controllers/ArticleICController.php:84
* @route '/articles/packaging-instructions/{packagingInstruction}'
*/
show.url = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { packagingInstruction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { packagingInstruction: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            packagingInstruction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        packagingInstruction: typeof args.packagingInstruction === 'object'
        ? args.packagingInstruction.uuid
        : args.packagingInstruction,
    }

    return show.definition.url
            .replace('{packagingInstruction}', parsedArgs.packagingInstruction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleICController::show
* @see app/Http/Controllers/ArticleICController.php:84
* @route '/articles/packaging-instructions/{packagingInstruction}'
*/
show.get = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleICController::show
* @see app/Http/Controllers/ArticleICController.php:84
* @route '/articles/packaging-instructions/{packagingInstruction}'
*/
show.head = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleICController::edit
* @see app/Http/Controllers/ArticleICController.php:96
* @route '/articles/packaging-instructions/{packagingInstruction}/edit'
*/
export const edit = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/articles/packaging-instructions/{packagingInstruction}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleICController::edit
* @see app/Http/Controllers/ArticleICController.php:96
* @route '/articles/packaging-instructions/{packagingInstruction}/edit'
*/
edit.url = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { packagingInstruction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { packagingInstruction: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            packagingInstruction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        packagingInstruction: typeof args.packagingInstruction === 'object'
        ? args.packagingInstruction.uuid
        : args.packagingInstruction,
    }

    return edit.definition.url
            .replace('{packagingInstruction}', parsedArgs.packagingInstruction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleICController::edit
* @see app/Http/Controllers/ArticleICController.php:96
* @route '/articles/packaging-instructions/{packagingInstruction}/edit'
*/
edit.get = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleICController::edit
* @see app/Http/Controllers/ArticleICController.php:96
* @route '/articles/packaging-instructions/{packagingInstruction}/edit'
*/
edit.head = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleICController::update
* @see app/Http/Controllers/ArticleICController.php:106
* @route '/articles/packaging-instructions/{packagingInstruction}'
*/
export const update = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/articles/packaging-instructions/{packagingInstruction}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ArticleICController::update
* @see app/Http/Controllers/ArticleICController.php:106
* @route '/articles/packaging-instructions/{packagingInstruction}'
*/
update.url = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { packagingInstruction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { packagingInstruction: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            packagingInstruction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        packagingInstruction: typeof args.packagingInstruction === 'object'
        ? args.packagingInstruction.uuid
        : args.packagingInstruction,
    }

    return update.definition.url
            .replace('{packagingInstruction}', parsedArgs.packagingInstruction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleICController::update
* @see app/Http/Controllers/ArticleICController.php:106
* @route '/articles/packaging-instructions/{packagingInstruction}'
*/
update.put = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ArticleICController::update
* @see app/Http/Controllers/ArticleICController.php:106
* @route '/articles/packaging-instructions/{packagingInstruction}'
*/
update.patch = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ArticleICController::destroy
* @see app/Http/Controllers/ArticleICController.php:160
* @route '/articles/packaging-instructions/{packagingInstruction}'
*/
export const destroy = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/articles/packaging-instructions/{packagingInstruction}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ArticleICController::destroy
* @see app/Http/Controllers/ArticleICController.php:160
* @route '/articles/packaging-instructions/{packagingInstruction}'
*/
destroy.url = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { packagingInstruction: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { packagingInstruction: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            packagingInstruction: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        packagingInstruction: typeof args.packagingInstruction === 'object'
        ? args.packagingInstruction.uuid
        : args.packagingInstruction,
    }

    return destroy.definition.url
            .replace('{packagingInstruction}', parsedArgs.packagingInstruction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleICController::destroy
* @see app/Http/Controllers/ArticleICController.php:160
* @route '/articles/packaging-instructions/{packagingInstruction}'
*/
destroy.delete = (args: { packagingInstruction: string | { uuid: string } } | [packagingInstruction: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const ArticleICController = { generateICNumber, download, index, create, store, show, edit, update, destroy }

export default ArticleICController
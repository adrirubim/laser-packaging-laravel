import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LsResourceController::index
* @see app/Http/Controllers/LsResourceController.php:20
* @route '/offers/ls-resources'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/offers/ls-resources',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LsResourceController::index
* @see app/Http/Controllers/LsResourceController.php:20
* @route '/offers/ls-resources'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LsResourceController::index
* @see app/Http/Controllers/LsResourceController.php:20
* @route '/offers/ls-resources'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LsResourceController::index
* @see app/Http/Controllers/LsResourceController.php:20
* @route '/offers/ls-resources'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LsResourceController::create
* @see app/Http/Controllers/LsResourceController.php:41
* @route '/offers/ls-resources/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/offers/ls-resources/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LsResourceController::create
* @see app/Http/Controllers/LsResourceController.php:41
* @route '/offers/ls-resources/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LsResourceController::create
* @see app/Http/Controllers/LsResourceController.php:41
* @route '/offers/ls-resources/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LsResourceController::create
* @see app/Http/Controllers/LsResourceController.php:41
* @route '/offers/ls-resources/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LsResourceController::store
* @see app/Http/Controllers/LsResourceController.php:46
* @route '/offers/ls-resources'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/offers/ls-resources',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LsResourceController::store
* @see app/Http/Controllers/LsResourceController.php:46
* @route '/offers/ls-resources'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LsResourceController::store
* @see app/Http/Controllers/LsResourceController.php:46
* @route '/offers/ls-resources'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LsResourceController::show
* @see app/Http/Controllers/LsResourceController.php:66
* @route '/offers/ls-resources/{lsResource}'
*/
export const show = (args: { lsResource: string | { uuid: string } } | [lsResource: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/offers/ls-resources/{lsResource}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LsResourceController::show
* @see app/Http/Controllers/LsResourceController.php:66
* @route '/offers/ls-resources/{lsResource}'
*/
show.url = (args: { lsResource: string | { uuid: string } } | [lsResource: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lsResource: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { lsResource: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            lsResource: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lsResource: typeof args.lsResource === 'object'
        ? args.lsResource.uuid
        : args.lsResource,
    }

    return show.definition.url
            .replace('{lsResource}', parsedArgs.lsResource.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LsResourceController::show
* @see app/Http/Controllers/LsResourceController.php:66
* @route '/offers/ls-resources/{lsResource}'
*/
show.get = (args: { lsResource: string | { uuid: string } } | [lsResource: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LsResourceController::show
* @see app/Http/Controllers/LsResourceController.php:66
* @route '/offers/ls-resources/{lsResource}'
*/
show.head = (args: { lsResource: string | { uuid: string } } | [lsResource: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LsResourceController::edit
* @see app/Http/Controllers/LsResourceController.php:73
* @route '/offers/ls-resources/{lsResource}/edit'
*/
export const edit = (args: { lsResource: string | { uuid: string } } | [lsResource: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/offers/ls-resources/{lsResource}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LsResourceController::edit
* @see app/Http/Controllers/LsResourceController.php:73
* @route '/offers/ls-resources/{lsResource}/edit'
*/
edit.url = (args: { lsResource: string | { uuid: string } } | [lsResource: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lsResource: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { lsResource: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            lsResource: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lsResource: typeof args.lsResource === 'object'
        ? args.lsResource.uuid
        : args.lsResource,
    }

    return edit.definition.url
            .replace('{lsResource}', parsedArgs.lsResource.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LsResourceController::edit
* @see app/Http/Controllers/LsResourceController.php:73
* @route '/offers/ls-resources/{lsResource}/edit'
*/
edit.get = (args: { lsResource: string | { uuid: string } } | [lsResource: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LsResourceController::edit
* @see app/Http/Controllers/LsResourceController.php:73
* @route '/offers/ls-resources/{lsResource}/edit'
*/
edit.head = (args: { lsResource: string | { uuid: string } } | [lsResource: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LsResourceController::update
* @see app/Http/Controllers/LsResourceController.php:80
* @route '/offers/ls-resources/{lsResource}'
*/
export const update = (args: { lsResource: string | { uuid: string } } | [lsResource: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/offers/ls-resources/{lsResource}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\LsResourceController::update
* @see app/Http/Controllers/LsResourceController.php:80
* @route '/offers/ls-resources/{lsResource}'
*/
update.url = (args: { lsResource: string | { uuid: string } } | [lsResource: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lsResource: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { lsResource: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            lsResource: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lsResource: typeof args.lsResource === 'object'
        ? args.lsResource.uuid
        : args.lsResource,
    }

    return update.definition.url
            .replace('{lsResource}', parsedArgs.lsResource.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LsResourceController::update
* @see app/Http/Controllers/LsResourceController.php:80
* @route '/offers/ls-resources/{lsResource}'
*/
update.put = (args: { lsResource: string | { uuid: string } } | [lsResource: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\LsResourceController::update
* @see app/Http/Controllers/LsResourceController.php:80
* @route '/offers/ls-resources/{lsResource}'
*/
update.patch = (args: { lsResource: string | { uuid: string } } | [lsResource: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\LsResourceController::destroy
* @see app/Http/Controllers/LsResourceController.php:102
* @route '/offers/ls-resources/{lsResource}'
*/
export const destroy = (args: { lsResource: string | { uuid: string } } | [lsResource: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/offers/ls-resources/{lsResource}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LsResourceController::destroy
* @see app/Http/Controllers/LsResourceController.php:102
* @route '/offers/ls-resources/{lsResource}'
*/
destroy.url = (args: { lsResource: string | { uuid: string } } | [lsResource: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lsResource: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { lsResource: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            lsResource: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lsResource: typeof args.lsResource === 'object'
        ? args.lsResource.uuid
        : args.lsResource,
    }

    return destroy.definition.url
            .replace('{lsResource}', parsedArgs.lsResource.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LsResourceController::destroy
* @see app/Http/Controllers/LsResourceController.php:102
* @route '/offers/ls-resources/{lsResource}'
*/
destroy.delete = (args: { lsResource: string | { uuid: string } } | [lsResource: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const LsResourceController = { index, create, store, show, edit, update, destroy }

export default LsResourceController
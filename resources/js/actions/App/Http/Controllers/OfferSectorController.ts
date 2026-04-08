import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OfferSectorController::index
* @see app/Http/Controllers/OfferSectorController.php:22
* @route '/offers/sectors'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/offers/sectors',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferSectorController::index
* @see app/Http/Controllers/OfferSectorController.php:22
* @route '/offers/sectors'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferSectorController::index
* @see app/Http/Controllers/OfferSectorController.php:22
* @route '/offers/sectors'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferSectorController::index
* @see app/Http/Controllers/OfferSectorController.php:22
* @route '/offers/sectors'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferSectorController::create
* @see app/Http/Controllers/OfferSectorController.php:50
* @route '/offers/sectors/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/offers/sectors/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferSectorController::create
* @see app/Http/Controllers/OfferSectorController.php:50
* @route '/offers/sectors/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferSectorController::create
* @see app/Http/Controllers/OfferSectorController.php:50
* @route '/offers/sectors/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferSectorController::create
* @see app/Http/Controllers/OfferSectorController.php:50
* @route '/offers/sectors/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferSectorController::store
* @see app/Http/Controllers/OfferSectorController.php:55
* @route '/offers/sectors'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/offers/sectors',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OfferSectorController::store
* @see app/Http/Controllers/OfferSectorController.php:55
* @route '/offers/sectors'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferSectorController::store
* @see app/Http/Controllers/OfferSectorController.php:55
* @route '/offers/sectors'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OfferSectorController::show
* @see app/Http/Controllers/OfferSectorController.php:66
* @route '/offers/sectors/{offerSector}'
*/
export const show = (args: { offerSector: string | { uuid: string } } | [offerSector: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/offers/sectors/{offerSector}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferSectorController::show
* @see app/Http/Controllers/OfferSectorController.php:66
* @route '/offers/sectors/{offerSector}'
*/
show.url = (args: { offerSector: string | { uuid: string } } | [offerSector: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerSector: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerSector: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerSector: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerSector: typeof args.offerSector === 'object'
        ? args.offerSector.uuid
        : args.offerSector,
    }

    return show.definition.url
            .replace('{offerSector}', parsedArgs.offerSector.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferSectorController::show
* @see app/Http/Controllers/OfferSectorController.php:66
* @route '/offers/sectors/{offerSector}'
*/
show.get = (args: { offerSector: string | { uuid: string } } | [offerSector: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferSectorController::show
* @see app/Http/Controllers/OfferSectorController.php:66
* @route '/offers/sectors/{offerSector}'
*/
show.head = (args: { offerSector: string | { uuid: string } } | [offerSector: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferSectorController::edit
* @see app/Http/Controllers/OfferSectorController.php:73
* @route '/offers/sectors/{offerSector}/edit'
*/
export const edit = (args: { offerSector: string | { uuid: string } } | [offerSector: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/offers/sectors/{offerSector}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferSectorController::edit
* @see app/Http/Controllers/OfferSectorController.php:73
* @route '/offers/sectors/{offerSector}/edit'
*/
edit.url = (args: { offerSector: string | { uuid: string } } | [offerSector: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerSector: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerSector: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerSector: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerSector: typeof args.offerSector === 'object'
        ? args.offerSector.uuid
        : args.offerSector,
    }

    return edit.definition.url
            .replace('{offerSector}', parsedArgs.offerSector.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferSectorController::edit
* @see app/Http/Controllers/OfferSectorController.php:73
* @route '/offers/sectors/{offerSector}/edit'
*/
edit.get = (args: { offerSector: string | { uuid: string } } | [offerSector: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferSectorController::edit
* @see app/Http/Controllers/OfferSectorController.php:73
* @route '/offers/sectors/{offerSector}/edit'
*/
edit.head = (args: { offerSector: string | { uuid: string } } | [offerSector: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferSectorController::update
* @see app/Http/Controllers/OfferSectorController.php:80
* @route '/offers/sectors/{offerSector}'
*/
export const update = (args: { offerSector: string | { uuid: string } } | [offerSector: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/offers/sectors/{offerSector}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\OfferSectorController::update
* @see app/Http/Controllers/OfferSectorController.php:80
* @route '/offers/sectors/{offerSector}'
*/
update.url = (args: { offerSector: string | { uuid: string } } | [offerSector: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerSector: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerSector: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerSector: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerSector: typeof args.offerSector === 'object'
        ? args.offerSector.uuid
        : args.offerSector,
    }

    return update.definition.url
            .replace('{offerSector}', parsedArgs.offerSector.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferSectorController::update
* @see app/Http/Controllers/OfferSectorController.php:80
* @route '/offers/sectors/{offerSector}'
*/
update.put = (args: { offerSector: string | { uuid: string } } | [offerSector: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\OfferSectorController::update
* @see app/Http/Controllers/OfferSectorController.php:80
* @route '/offers/sectors/{offerSector}'
*/
update.patch = (args: { offerSector: string | { uuid: string } } | [offerSector: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\OfferSectorController::destroy
* @see app/Http/Controllers/OfferSectorController.php:88
* @route '/offers/sectors/{offerSector}'
*/
export const destroy = (args: { offerSector: string | { uuid: string } } | [offerSector: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/offers/sectors/{offerSector}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OfferSectorController::destroy
* @see app/Http/Controllers/OfferSectorController.php:88
* @route '/offers/sectors/{offerSector}'
*/
destroy.url = (args: { offerSector: string | { uuid: string } } | [offerSector: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerSector: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerSector: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerSector: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerSector: typeof args.offerSector === 'object'
        ? args.offerSector.uuid
        : args.offerSector,
    }

    return destroy.definition.url
            .replace('{offerSector}', parsedArgs.offerSector.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferSectorController::destroy
* @see app/Http/Controllers/OfferSectorController.php:88
* @route '/offers/sectors/{offerSector}'
*/
destroy.delete = (args: { offerSector: string | { uuid: string } } | [offerSector: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const OfferSectorController = { index, create, store, show, edit, update, destroy }

export default OfferSectorController
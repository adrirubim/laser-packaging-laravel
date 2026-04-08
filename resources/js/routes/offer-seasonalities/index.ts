import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\OfferSeasonalityController::index
* @see app/Http/Controllers/OfferSeasonalityController.php:22
* @route '/offers/seasonality'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/offers/seasonality',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferSeasonalityController::index
* @see app/Http/Controllers/OfferSeasonalityController.php:22
* @route '/offers/seasonality'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferSeasonalityController::index
* @see app/Http/Controllers/OfferSeasonalityController.php:22
* @route '/offers/seasonality'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferSeasonalityController::index
* @see app/Http/Controllers/OfferSeasonalityController.php:22
* @route '/offers/seasonality'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferSeasonalityController::create
* @see app/Http/Controllers/OfferSeasonalityController.php:50
* @route '/offers/seasonality/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/offers/seasonality/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferSeasonalityController::create
* @see app/Http/Controllers/OfferSeasonalityController.php:50
* @route '/offers/seasonality/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferSeasonalityController::create
* @see app/Http/Controllers/OfferSeasonalityController.php:50
* @route '/offers/seasonality/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferSeasonalityController::create
* @see app/Http/Controllers/OfferSeasonalityController.php:50
* @route '/offers/seasonality/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferSeasonalityController::store
* @see app/Http/Controllers/OfferSeasonalityController.php:55
* @route '/offers/seasonality'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/offers/seasonality',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OfferSeasonalityController::store
* @see app/Http/Controllers/OfferSeasonalityController.php:55
* @route '/offers/seasonality'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferSeasonalityController::store
* @see app/Http/Controllers/OfferSeasonalityController.php:55
* @route '/offers/seasonality'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OfferSeasonalityController::show
* @see app/Http/Controllers/OfferSeasonalityController.php:66
* @route '/offers/seasonality/{offerSeasonality}'
*/
export const show = (args: { offerSeasonality: string | { uuid: string } } | [offerSeasonality: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/offers/seasonality/{offerSeasonality}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferSeasonalityController::show
* @see app/Http/Controllers/OfferSeasonalityController.php:66
* @route '/offers/seasonality/{offerSeasonality}'
*/
show.url = (args: { offerSeasonality: string | { uuid: string } } | [offerSeasonality: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerSeasonality: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerSeasonality: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerSeasonality: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerSeasonality: typeof args.offerSeasonality === 'object'
        ? args.offerSeasonality.uuid
        : args.offerSeasonality,
    }

    return show.definition.url
            .replace('{offerSeasonality}', parsedArgs.offerSeasonality.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferSeasonalityController::show
* @see app/Http/Controllers/OfferSeasonalityController.php:66
* @route '/offers/seasonality/{offerSeasonality}'
*/
show.get = (args: { offerSeasonality: string | { uuid: string } } | [offerSeasonality: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferSeasonalityController::show
* @see app/Http/Controllers/OfferSeasonalityController.php:66
* @route '/offers/seasonality/{offerSeasonality}'
*/
show.head = (args: { offerSeasonality: string | { uuid: string } } | [offerSeasonality: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferSeasonalityController::edit
* @see app/Http/Controllers/OfferSeasonalityController.php:73
* @route '/offers/seasonality/{offerSeasonality}/edit'
*/
export const edit = (args: { offerSeasonality: string | { uuid: string } } | [offerSeasonality: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/offers/seasonality/{offerSeasonality}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferSeasonalityController::edit
* @see app/Http/Controllers/OfferSeasonalityController.php:73
* @route '/offers/seasonality/{offerSeasonality}/edit'
*/
edit.url = (args: { offerSeasonality: string | { uuid: string } } | [offerSeasonality: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerSeasonality: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerSeasonality: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerSeasonality: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerSeasonality: typeof args.offerSeasonality === 'object'
        ? args.offerSeasonality.uuid
        : args.offerSeasonality,
    }

    return edit.definition.url
            .replace('{offerSeasonality}', parsedArgs.offerSeasonality.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferSeasonalityController::edit
* @see app/Http/Controllers/OfferSeasonalityController.php:73
* @route '/offers/seasonality/{offerSeasonality}/edit'
*/
edit.get = (args: { offerSeasonality: string | { uuid: string } } | [offerSeasonality: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferSeasonalityController::edit
* @see app/Http/Controllers/OfferSeasonalityController.php:73
* @route '/offers/seasonality/{offerSeasonality}/edit'
*/
edit.head = (args: { offerSeasonality: string | { uuid: string } } | [offerSeasonality: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferSeasonalityController::update
* @see app/Http/Controllers/OfferSeasonalityController.php:80
* @route '/offers/seasonality/{offerSeasonality}'
*/
export const update = (args: { offerSeasonality: string | { uuid: string } } | [offerSeasonality: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/offers/seasonality/{offerSeasonality}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\OfferSeasonalityController::update
* @see app/Http/Controllers/OfferSeasonalityController.php:80
* @route '/offers/seasonality/{offerSeasonality}'
*/
update.url = (args: { offerSeasonality: string | { uuid: string } } | [offerSeasonality: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerSeasonality: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerSeasonality: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerSeasonality: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerSeasonality: typeof args.offerSeasonality === 'object'
        ? args.offerSeasonality.uuid
        : args.offerSeasonality,
    }

    return update.definition.url
            .replace('{offerSeasonality}', parsedArgs.offerSeasonality.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferSeasonalityController::update
* @see app/Http/Controllers/OfferSeasonalityController.php:80
* @route '/offers/seasonality/{offerSeasonality}'
*/
update.put = (args: { offerSeasonality: string | { uuid: string } } | [offerSeasonality: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\OfferSeasonalityController::update
* @see app/Http/Controllers/OfferSeasonalityController.php:80
* @route '/offers/seasonality/{offerSeasonality}'
*/
update.patch = (args: { offerSeasonality: string | { uuid: string } } | [offerSeasonality: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\OfferSeasonalityController::destroy
* @see app/Http/Controllers/OfferSeasonalityController.php:88
* @route '/offers/seasonality/{offerSeasonality}'
*/
export const destroy = (args: { offerSeasonality: string | { uuid: string } } | [offerSeasonality: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/offers/seasonality/{offerSeasonality}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OfferSeasonalityController::destroy
* @see app/Http/Controllers/OfferSeasonalityController.php:88
* @route '/offers/seasonality/{offerSeasonality}'
*/
destroy.url = (args: { offerSeasonality: string | { uuid: string } } | [offerSeasonality: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerSeasonality: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerSeasonality: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerSeasonality: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerSeasonality: typeof args.offerSeasonality === 'object'
        ? args.offerSeasonality.uuid
        : args.offerSeasonality,
    }

    return destroy.definition.url
            .replace('{offerSeasonality}', parsedArgs.offerSeasonality.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferSeasonalityController::destroy
* @see app/Http/Controllers/OfferSeasonalityController.php:88
* @route '/offers/seasonality/{offerSeasonality}'
*/
destroy.delete = (args: { offerSeasonality: string | { uuid: string } } | [offerSeasonality: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const offerSeasonalities = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default offerSeasonalities
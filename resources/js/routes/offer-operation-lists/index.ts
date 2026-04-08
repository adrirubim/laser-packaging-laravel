import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\OfferOperationListController::index
* @see app/Http/Controllers/OfferOperationListController.php:17
* @route '/offers/operation-lists'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/offers/operation-lists',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferOperationListController::index
* @see app/Http/Controllers/OfferOperationListController.php:17
* @route '/offers/operation-lists'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferOperationListController::index
* @see app/Http/Controllers/OfferOperationListController.php:17
* @route '/offers/operation-lists'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOperationListController::index
* @see app/Http/Controllers/OfferOperationListController.php:17
* @route '/offers/operation-lists'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferOperationListController::create
* @see app/Http/Controllers/OfferOperationListController.php:47
* @route '/offers/operation-lists/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/offers/operation-lists/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferOperationListController::create
* @see app/Http/Controllers/OfferOperationListController.php:47
* @route '/offers/operation-lists/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferOperationListController::create
* @see app/Http/Controllers/OfferOperationListController.php:47
* @route '/offers/operation-lists/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOperationListController::create
* @see app/Http/Controllers/OfferOperationListController.php:47
* @route '/offers/operation-lists/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferOperationListController::store
* @see app/Http/Controllers/OfferOperationListController.php:69
* @route '/offers/operation-lists'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/offers/operation-lists',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OfferOperationListController::store
* @see app/Http/Controllers/OfferOperationListController.php:69
* @route '/offers/operation-lists'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferOperationListController::store
* @see app/Http/Controllers/OfferOperationListController.php:69
* @route '/offers/operation-lists'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OfferOperationListController::show
* @see app/Http/Controllers/OfferOperationListController.php:99
* @route '/offers/operation-lists/{offerOperationList}'
*/
export const show = (args: { offerOperationList: string | { uuid: string } } | [offerOperationList: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/offers/operation-lists/{offerOperationList}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferOperationListController::show
* @see app/Http/Controllers/OfferOperationListController.php:99
* @route '/offers/operation-lists/{offerOperationList}'
*/
show.url = (args: { offerOperationList: string | { uuid: string } } | [offerOperationList: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOperationList: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOperationList: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerOperationList: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerOperationList: typeof args.offerOperationList === 'object'
        ? args.offerOperationList.uuid
        : args.offerOperationList,
    }

    return show.definition.url
            .replace('{offerOperationList}', parsedArgs.offerOperationList.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferOperationListController::show
* @see app/Http/Controllers/OfferOperationListController.php:99
* @route '/offers/operation-lists/{offerOperationList}'
*/
show.get = (args: { offerOperationList: string | { uuid: string } } | [offerOperationList: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOperationListController::show
* @see app/Http/Controllers/OfferOperationListController.php:99
* @route '/offers/operation-lists/{offerOperationList}'
*/
show.head = (args: { offerOperationList: string | { uuid: string } } | [offerOperationList: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferOperationListController::edit
* @see app/Http/Controllers/OfferOperationListController.php:111
* @route '/offers/operation-lists/{offerOperationList}/edit'
*/
export const edit = (args: { offerOperationList: string | { uuid: string } } | [offerOperationList: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/offers/operation-lists/{offerOperationList}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferOperationListController::edit
* @see app/Http/Controllers/OfferOperationListController.php:111
* @route '/offers/operation-lists/{offerOperationList}/edit'
*/
edit.url = (args: { offerOperationList: string | { uuid: string } } | [offerOperationList: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOperationList: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOperationList: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerOperationList: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerOperationList: typeof args.offerOperationList === 'object'
        ? args.offerOperationList.uuid
        : args.offerOperationList,
    }

    return edit.definition.url
            .replace('{offerOperationList}', parsedArgs.offerOperationList.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferOperationListController::edit
* @see app/Http/Controllers/OfferOperationListController.php:111
* @route '/offers/operation-lists/{offerOperationList}/edit'
*/
edit.get = (args: { offerOperationList: string | { uuid: string } } | [offerOperationList: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOperationListController::edit
* @see app/Http/Controllers/OfferOperationListController.php:111
* @route '/offers/operation-lists/{offerOperationList}/edit'
*/
edit.head = (args: { offerOperationList: string | { uuid: string } } | [offerOperationList: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferOperationListController::update
* @see app/Http/Controllers/OfferOperationListController.php:131
* @route '/offers/operation-lists/{offerOperationList}'
*/
export const update = (args: { offerOperationList: string | { uuid: string } } | [offerOperationList: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/offers/operation-lists/{offerOperationList}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\OfferOperationListController::update
* @see app/Http/Controllers/OfferOperationListController.php:131
* @route '/offers/operation-lists/{offerOperationList}'
*/
update.url = (args: { offerOperationList: string | { uuid: string } } | [offerOperationList: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOperationList: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOperationList: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerOperationList: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerOperationList: typeof args.offerOperationList === 'object'
        ? args.offerOperationList.uuid
        : args.offerOperationList,
    }

    return update.definition.url
            .replace('{offerOperationList}', parsedArgs.offerOperationList.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferOperationListController::update
* @see app/Http/Controllers/OfferOperationListController.php:131
* @route '/offers/operation-lists/{offerOperationList}'
*/
update.put = (args: { offerOperationList: string | { uuid: string } } | [offerOperationList: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\OfferOperationListController::update
* @see app/Http/Controllers/OfferOperationListController.php:131
* @route '/offers/operation-lists/{offerOperationList}'
*/
update.patch = (args: { offerOperationList: string | { uuid: string } } | [offerOperationList: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\OfferOperationListController::destroy
* @see app/Http/Controllers/OfferOperationListController.php:161
* @route '/offers/operation-lists/{offerOperationList}'
*/
export const destroy = (args: { offerOperationList: string | { uuid: string } } | [offerOperationList: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/offers/operation-lists/{offerOperationList}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OfferOperationListController::destroy
* @see app/Http/Controllers/OfferOperationListController.php:161
* @route '/offers/operation-lists/{offerOperationList}'
*/
destroy.url = (args: { offerOperationList: string | { uuid: string } } | [offerOperationList: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOperationList: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOperationList: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerOperationList: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerOperationList: typeof args.offerOperationList === 'object'
        ? args.offerOperationList.uuid
        : args.offerOperationList,
    }

    return destroy.definition.url
            .replace('{offerOperationList}', parsedArgs.offerOperationList.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferOperationListController::destroy
* @see app/Http/Controllers/OfferOperationListController.php:161
* @route '/offers/operation-lists/{offerOperationList}'
*/
destroy.delete = (args: { offerOperationList: string | { uuid: string } } | [offerOperationList: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const offerOperationLists = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default offerOperationLists
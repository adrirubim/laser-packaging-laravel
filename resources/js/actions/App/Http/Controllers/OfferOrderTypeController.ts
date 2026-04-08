import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OfferOrderTypeController::index
* @see app/Http/Controllers/OfferOrderTypeController.php:22
* @route '/offers/order-types'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/offers/order-types',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferOrderTypeController::index
* @see app/Http/Controllers/OfferOrderTypeController.php:22
* @route '/offers/order-types'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferOrderTypeController::index
* @see app/Http/Controllers/OfferOrderTypeController.php:22
* @route '/offers/order-types'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::index
* @see app/Http/Controllers/OfferOrderTypeController.php:22
* @route '/offers/order-types'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::index
* @see app/Http/Controllers/OfferOrderTypeController.php:22
* @route '/offers/order-types'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::index
* @see app/Http/Controllers/OfferOrderTypeController.php:22
* @route '/offers/order-types'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::index
* @see app/Http/Controllers/OfferOrderTypeController.php:22
* @route '/offers/order-types'
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
* @see \App\Http\Controllers\OfferOrderTypeController::create
* @see app/Http/Controllers/OfferOrderTypeController.php:53
* @route '/offers/order-types/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/offers/order-types/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferOrderTypeController::create
* @see app/Http/Controllers/OfferOrderTypeController.php:53
* @route '/offers/order-types/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferOrderTypeController::create
* @see app/Http/Controllers/OfferOrderTypeController.php:53
* @route '/offers/order-types/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::create
* @see app/Http/Controllers/OfferOrderTypeController.php:53
* @route '/offers/order-types/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::create
* @see app/Http/Controllers/OfferOrderTypeController.php:53
* @route '/offers/order-types/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::create
* @see app/Http/Controllers/OfferOrderTypeController.php:53
* @route '/offers/order-types/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::create
* @see app/Http/Controllers/OfferOrderTypeController.php:53
* @route '/offers/order-types/create'
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
* @see \App\Http\Controllers\OfferOrderTypeController::store
* @see app/Http/Controllers/OfferOrderTypeController.php:58
* @route '/offers/order-types'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/offers/order-types',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OfferOrderTypeController::store
* @see app/Http/Controllers/OfferOrderTypeController.php:58
* @route '/offers/order-types'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferOrderTypeController::store
* @see app/Http/Controllers/OfferOrderTypeController.php:58
* @route '/offers/order-types'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::store
* @see app/Http/Controllers/OfferOrderTypeController.php:58
* @route '/offers/order-types'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::store
* @see app/Http/Controllers/OfferOrderTypeController.php:58
* @route '/offers/order-types'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\OfferOrderTypeController::show
* @see app/Http/Controllers/OfferOrderTypeController.php:69
* @route '/offers/order-types/{offerOrderType}'
*/
export const show = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/offers/order-types/{offerOrderType}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferOrderTypeController::show
* @see app/Http/Controllers/OfferOrderTypeController.php:69
* @route '/offers/order-types/{offerOrderType}'
*/
show.url = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOrderType: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOrderType: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerOrderType: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerOrderType: typeof args.offerOrderType === 'object'
        ? args.offerOrderType.uuid
        : args.offerOrderType,
    }

    return show.definition.url
            .replace('{offerOrderType}', parsedArgs.offerOrderType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferOrderTypeController::show
* @see app/Http/Controllers/OfferOrderTypeController.php:69
* @route '/offers/order-types/{offerOrderType}'
*/
show.get = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::show
* @see app/Http/Controllers/OfferOrderTypeController.php:69
* @route '/offers/order-types/{offerOrderType}'
*/
show.head = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::show
* @see app/Http/Controllers/OfferOrderTypeController.php:69
* @route '/offers/order-types/{offerOrderType}'
*/
const showForm = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::show
* @see app/Http/Controllers/OfferOrderTypeController.php:69
* @route '/offers/order-types/{offerOrderType}'
*/
showForm.get = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::show
* @see app/Http/Controllers/OfferOrderTypeController.php:69
* @route '/offers/order-types/{offerOrderType}'
*/
showForm.head = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OfferOrderTypeController::edit
* @see app/Http/Controllers/OfferOrderTypeController.php:76
* @route '/offers/order-types/{offerOrderType}/edit'
*/
export const edit = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/offers/order-types/{offerOrderType}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferOrderTypeController::edit
* @see app/Http/Controllers/OfferOrderTypeController.php:76
* @route '/offers/order-types/{offerOrderType}/edit'
*/
edit.url = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOrderType: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOrderType: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerOrderType: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerOrderType: typeof args.offerOrderType === 'object'
        ? args.offerOrderType.uuid
        : args.offerOrderType,
    }

    return edit.definition.url
            .replace('{offerOrderType}', parsedArgs.offerOrderType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferOrderTypeController::edit
* @see app/Http/Controllers/OfferOrderTypeController.php:76
* @route '/offers/order-types/{offerOrderType}/edit'
*/
edit.get = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::edit
* @see app/Http/Controllers/OfferOrderTypeController.php:76
* @route '/offers/order-types/{offerOrderType}/edit'
*/
edit.head = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::edit
* @see app/Http/Controllers/OfferOrderTypeController.php:76
* @route '/offers/order-types/{offerOrderType}/edit'
*/
const editForm = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::edit
* @see app/Http/Controllers/OfferOrderTypeController.php:76
* @route '/offers/order-types/{offerOrderType}/edit'
*/
editForm.get = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::edit
* @see app/Http/Controllers/OfferOrderTypeController.php:76
* @route '/offers/order-types/{offerOrderType}/edit'
*/
editForm.head = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OfferOrderTypeController::update
* @see app/Http/Controllers/OfferOrderTypeController.php:83
* @route '/offers/order-types/{offerOrderType}'
*/
export const update = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/offers/order-types/{offerOrderType}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\OfferOrderTypeController::update
* @see app/Http/Controllers/OfferOrderTypeController.php:83
* @route '/offers/order-types/{offerOrderType}'
*/
update.url = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOrderType: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOrderType: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerOrderType: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerOrderType: typeof args.offerOrderType === 'object'
        ? args.offerOrderType.uuid
        : args.offerOrderType,
    }

    return update.definition.url
            .replace('{offerOrderType}', parsedArgs.offerOrderType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferOrderTypeController::update
* @see app/Http/Controllers/OfferOrderTypeController.php:83
* @route '/offers/order-types/{offerOrderType}'
*/
update.put = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::update
* @see app/Http/Controllers/OfferOrderTypeController.php:83
* @route '/offers/order-types/{offerOrderType}'
*/
update.patch = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::update
* @see app/Http/Controllers/OfferOrderTypeController.php:83
* @route '/offers/order-types/{offerOrderType}'
*/
const updateForm = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::update
* @see app/Http/Controllers/OfferOrderTypeController.php:83
* @route '/offers/order-types/{offerOrderType}'
*/
updateForm.put = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::update
* @see app/Http/Controllers/OfferOrderTypeController.php:83
* @route '/offers/order-types/{offerOrderType}'
*/
updateForm.patch = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\OfferOrderTypeController::destroy
* @see app/Http/Controllers/OfferOrderTypeController.php:94
* @route '/offers/order-types/{offerOrderType}'
*/
export const destroy = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/offers/order-types/{offerOrderType}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OfferOrderTypeController::destroy
* @see app/Http/Controllers/OfferOrderTypeController.php:94
* @route '/offers/order-types/{offerOrderType}'
*/
destroy.url = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerOrderType: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerOrderType: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerOrderType: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerOrderType: typeof args.offerOrderType === 'object'
        ? args.offerOrderType.uuid
        : args.offerOrderType,
    }

    return destroy.definition.url
            .replace('{offerOrderType}', parsedArgs.offerOrderType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferOrderTypeController::destroy
* @see app/Http/Controllers/OfferOrderTypeController.php:94
* @route '/offers/order-types/{offerOrderType}'
*/
destroy.delete = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::destroy
* @see app/Http/Controllers/OfferOrderTypeController.php:94
* @route '/offers/order-types/{offerOrderType}'
*/
const destroyForm = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OfferOrderTypeController::destroy
* @see app/Http/Controllers/OfferOrderTypeController.php:94
* @route '/offers/order-types/{offerOrderType}'
*/
destroyForm.delete = (args: { offerOrderType: string | { uuid: string } } | [offerOrderType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const OfferOrderTypeController = { index, create, store, show, edit, update, destroy }

export default OfferOrderTypeController
import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\OrderStateController::index
* @see app/Http/Controllers/OrderStateController.php:16
* @route '/order-states'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/order-states',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderStateController::index
* @see app/Http/Controllers/OrderStateController.php:16
* @route '/order-states'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderStateController::index
* @see app/Http/Controllers/OrderStateController.php:16
* @route '/order-states'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderStateController::index
* @see app/Http/Controllers/OrderStateController.php:16
* @route '/order-states'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderStateController::create
* @see app/Http/Controllers/OrderStateController.php:32
* @route '/order-states/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/order-states/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderStateController::create
* @see app/Http/Controllers/OrderStateController.php:32
* @route '/order-states/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderStateController::create
* @see app/Http/Controllers/OrderStateController.php:32
* @route '/order-states/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderStateController::create
* @see app/Http/Controllers/OrderStateController.php:32
* @route '/order-states/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderStateController::store
* @see app/Http/Controllers/OrderStateController.php:40
* @route '/order-states'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/order-states',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderStateController::store
* @see app/Http/Controllers/OrderStateController.php:40
* @route '/order-states'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderStateController::store
* @see app/Http/Controllers/OrderStateController.php:40
* @route '/order-states'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderStateController::show
* @see app/Http/Controllers/OrderStateController.php:66
* @route '/order-states/{orderState}'
*/
export const show = (args: { orderState: string | { uuid: string } } | [orderState: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/order-states/{orderState}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderStateController::show
* @see app/Http/Controllers/OrderStateController.php:66
* @route '/order-states/{orderState}'
*/
show.url = (args: { orderState: string | { uuid: string } } | [orderState: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { orderState: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { orderState: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            orderState: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        orderState: typeof args.orderState === 'object'
        ? args.orderState.uuid
        : args.orderState,
    }

    return show.definition.url
            .replace('{orderState}', parsedArgs.orderState.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderStateController::show
* @see app/Http/Controllers/OrderStateController.php:66
* @route '/order-states/{orderState}'
*/
show.get = (args: { orderState: string | { uuid: string } } | [orderState: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderStateController::show
* @see app/Http/Controllers/OrderStateController.php:66
* @route '/order-states/{orderState}'
*/
show.head = (args: { orderState: string | { uuid: string } } | [orderState: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderStateController::edit
* @see app/Http/Controllers/OrderStateController.php:78
* @route '/order-states/{orderState}/edit'
*/
export const edit = (args: { orderState: string | { uuid: string } } | [orderState: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/order-states/{orderState}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderStateController::edit
* @see app/Http/Controllers/OrderStateController.php:78
* @route '/order-states/{orderState}/edit'
*/
edit.url = (args: { orderState: string | { uuid: string } } | [orderState: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { orderState: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { orderState: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            orderState: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        orderState: typeof args.orderState === 'object'
        ? args.orderState.uuid
        : args.orderState,
    }

    return edit.definition.url
            .replace('{orderState}', parsedArgs.orderState.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderStateController::edit
* @see app/Http/Controllers/OrderStateController.php:78
* @route '/order-states/{orderState}/edit'
*/
edit.get = (args: { orderState: string | { uuid: string } } | [orderState: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderStateController::edit
* @see app/Http/Controllers/OrderStateController.php:78
* @route '/order-states/{orderState}/edit'
*/
edit.head = (args: { orderState: string | { uuid: string } } | [orderState: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderStateController::update
* @see app/Http/Controllers/OrderStateController.php:88
* @route '/order-states/{orderState}'
*/
export const update = (args: { orderState: string | { uuid: string } } | [orderState: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/order-states/{orderState}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\OrderStateController::update
* @see app/Http/Controllers/OrderStateController.php:88
* @route '/order-states/{orderState}'
*/
update.url = (args: { orderState: string | { uuid: string } } | [orderState: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { orderState: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { orderState: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            orderState: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        orderState: typeof args.orderState === 'object'
        ? args.orderState.uuid
        : args.orderState,
    }

    return update.definition.url
            .replace('{orderState}', parsedArgs.orderState.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderStateController::update
* @see app/Http/Controllers/OrderStateController.php:88
* @route '/order-states/{orderState}'
*/
update.put = (args: { orderState: string | { uuid: string } } | [orderState: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\OrderStateController::update
* @see app/Http/Controllers/OrderStateController.php:88
* @route '/order-states/{orderState}'
*/
update.patch = (args: { orderState: string | { uuid: string } } | [orderState: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\OrderStateController::destroy
* @see app/Http/Controllers/OrderStateController.php:105
* @route '/order-states/{orderState}'
*/
export const destroy = (args: { orderState: string | { uuid: string } } | [orderState: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/order-states/{orderState}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OrderStateController::destroy
* @see app/Http/Controllers/OrderStateController.php:105
* @route '/order-states/{orderState}'
*/
destroy.url = (args: { orderState: string | { uuid: string } } | [orderState: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { orderState: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { orderState: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            orderState: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        orderState: typeof args.orderState === 'object'
        ? args.orderState.uuid
        : args.orderState,
    }

    return destroy.definition.url
            .replace('{orderState}', parsedArgs.orderState.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderStateController::destroy
* @see app/Http/Controllers/OrderStateController.php:105
* @route '/order-states/{orderState}'
*/
destroy.delete = (args: { orderState: string | { uuid: string } } | [orderState: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const orderStates = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default orderStates
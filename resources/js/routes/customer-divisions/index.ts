import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CustomerDivisionController::index
* @see app/Http/Controllers/CustomerDivisionController.php:32
* @route '/customer-divisions'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/customer-divisions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerDivisionController::index
* @see app/Http/Controllers/CustomerDivisionController.php:32
* @route '/customer-divisions'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerDivisionController::index
* @see app/Http/Controllers/CustomerDivisionController.php:32
* @route '/customer-divisions'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerDivisionController::index
* @see app/Http/Controllers/CustomerDivisionController.php:32
* @route '/customer-divisions'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CustomerDivisionController::create
* @see app/Http/Controllers/CustomerDivisionController.php:47
* @route '/customer-divisions/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/customer-divisions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerDivisionController::create
* @see app/Http/Controllers/CustomerDivisionController.php:47
* @route '/customer-divisions/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerDivisionController::create
* @see app/Http/Controllers/CustomerDivisionController.php:47
* @route '/customer-divisions/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerDivisionController::create
* @see app/Http/Controllers/CustomerDivisionController.php:47
* @route '/customer-divisions/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CustomerDivisionController::store
* @see app/Http/Controllers/CustomerDivisionController.php:60
* @route '/customer-divisions'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/customer-divisions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CustomerDivisionController::store
* @see app/Http/Controllers/CustomerDivisionController.php:60
* @route '/customer-divisions'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerDivisionController::store
* @see app/Http/Controllers/CustomerDivisionController.php:60
* @route '/customer-divisions'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomerDivisionController::show
* @see app/Http/Controllers/CustomerDivisionController.php:74
* @route '/customer-divisions/{customerDivision}'
*/
export const show = (args: { customerDivision: string | { uuid: string } } | [customerDivision: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/customer-divisions/{customerDivision}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerDivisionController::show
* @see app/Http/Controllers/CustomerDivisionController.php:74
* @route '/customer-divisions/{customerDivision}'
*/
show.url = (args: { customerDivision: string | { uuid: string } } | [customerDivision: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customerDivision: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { customerDivision: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            customerDivision: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customerDivision: typeof args.customerDivision === 'object'
        ? args.customerDivision.uuid
        : args.customerDivision,
    }

    return show.definition.url
            .replace('{customerDivision}', parsedArgs.customerDivision.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerDivisionController::show
* @see app/Http/Controllers/CustomerDivisionController.php:74
* @route '/customer-divisions/{customerDivision}'
*/
show.get = (args: { customerDivision: string | { uuid: string } } | [customerDivision: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerDivisionController::show
* @see app/Http/Controllers/CustomerDivisionController.php:74
* @route '/customer-divisions/{customerDivision}'
*/
show.head = (args: { customerDivision: string | { uuid: string } } | [customerDivision: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CustomerDivisionController::edit
* @see app/Http/Controllers/CustomerDivisionController.php:88
* @route '/customer-divisions/{customerDivision}/edit'
*/
export const edit = (args: { customerDivision: string | { uuid: string } } | [customerDivision: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/customer-divisions/{customerDivision}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerDivisionController::edit
* @see app/Http/Controllers/CustomerDivisionController.php:88
* @route '/customer-divisions/{customerDivision}/edit'
*/
edit.url = (args: { customerDivision: string | { uuid: string } } | [customerDivision: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customerDivision: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { customerDivision: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            customerDivision: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customerDivision: typeof args.customerDivision === 'object'
        ? args.customerDivision.uuid
        : args.customerDivision,
    }

    return edit.definition.url
            .replace('{customerDivision}', parsedArgs.customerDivision.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerDivisionController::edit
* @see app/Http/Controllers/CustomerDivisionController.php:88
* @route '/customer-divisions/{customerDivision}/edit'
*/
edit.get = (args: { customerDivision: string | { uuid: string } } | [customerDivision: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerDivisionController::edit
* @see app/Http/Controllers/CustomerDivisionController.php:88
* @route '/customer-divisions/{customerDivision}/edit'
*/
edit.head = (args: { customerDivision: string | { uuid: string } } | [customerDivision: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CustomerDivisionController::update
* @see app/Http/Controllers/CustomerDivisionController.php:101
* @route '/customer-divisions/{customerDivision}'
*/
export const update = (args: { customerDivision: string | { uuid: string } } | [customerDivision: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/customer-divisions/{customerDivision}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CustomerDivisionController::update
* @see app/Http/Controllers/CustomerDivisionController.php:101
* @route '/customer-divisions/{customerDivision}'
*/
update.url = (args: { customerDivision: string | { uuid: string } } | [customerDivision: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customerDivision: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { customerDivision: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            customerDivision: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customerDivision: typeof args.customerDivision === 'object'
        ? args.customerDivision.uuid
        : args.customerDivision,
    }

    return update.definition.url
            .replace('{customerDivision}', parsedArgs.customerDivision.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerDivisionController::update
* @see app/Http/Controllers/CustomerDivisionController.php:101
* @route '/customer-divisions/{customerDivision}'
*/
update.put = (args: { customerDivision: string | { uuid: string } } | [customerDivision: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CustomerDivisionController::update
* @see app/Http/Controllers/CustomerDivisionController.php:101
* @route '/customer-divisions/{customerDivision}'
*/
update.patch = (args: { customerDivision: string | { uuid: string } } | [customerDivision: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\CustomerDivisionController::destroy
* @see app/Http/Controllers/CustomerDivisionController.php:119
* @route '/customer-divisions/{customerDivision}'
*/
export const destroy = (args: { customerDivision: string | { uuid: string } } | [customerDivision: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/customer-divisions/{customerDivision}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CustomerDivisionController::destroy
* @see app/Http/Controllers/CustomerDivisionController.php:119
* @route '/customer-divisions/{customerDivision}'
*/
destroy.url = (args: { customerDivision: string | { uuid: string } } | [customerDivision: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customerDivision: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { customerDivision: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            customerDivision: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customerDivision: typeof args.customerDivision === 'object'
        ? args.customerDivision.uuid
        : args.customerDivision,
    }

    return destroy.definition.url
            .replace('{customerDivision}', parsedArgs.customerDivision.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerDivisionController::destroy
* @see app/Http/Controllers/CustomerDivisionController.php:119
* @route '/customer-divisions/{customerDivision}'
*/
destroy.delete = (args: { customerDivision: string | { uuid: string } } | [customerDivision: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const customerDivisions = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default customerDivisions
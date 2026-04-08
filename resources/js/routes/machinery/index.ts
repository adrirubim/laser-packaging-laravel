import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\MachineryController::index
* @see app/Http/Controllers/MachineryController.php:25
* @route '/machinery'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/machinery',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MachineryController::index
* @see app/Http/Controllers/MachineryController.php:25
* @route '/machinery'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineryController::index
* @see app/Http/Controllers/MachineryController.php:25
* @route '/machinery'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::index
* @see app/Http/Controllers/MachineryController.php:25
* @route '/machinery'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MachineryController::create
* @see app/Http/Controllers/MachineryController.php:51
* @route '/machinery/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/machinery/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MachineryController::create
* @see app/Http/Controllers/MachineryController.php:51
* @route '/machinery/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineryController::create
* @see app/Http/Controllers/MachineryController.php:51
* @route '/machinery/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::create
* @see app/Http/Controllers/MachineryController.php:51
* @route '/machinery/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MachineryController::store
* @see app/Http/Controllers/MachineryController.php:63
* @route '/machinery'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/machinery',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MachineryController::store
* @see app/Http/Controllers/MachineryController.php:63
* @route '/machinery'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineryController::store
* @see app/Http/Controllers/MachineryController.php:63
* @route '/machinery'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MachineryController::show
* @see app/Http/Controllers/MachineryController.php:82
* @route '/machinery/{machinery}'
*/
export const show = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/machinery/{machinery}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MachineryController::show
* @see app/Http/Controllers/MachineryController.php:82
* @route '/machinery/{machinery}'
*/
show.url = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { machinery: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { machinery: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            machinery: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        machinery: typeof args.machinery === 'object'
        ? args.machinery.uuid
        : args.machinery,
    }

    return show.definition.url
            .replace('{machinery}', parsedArgs.machinery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineryController::show
* @see app/Http/Controllers/MachineryController.php:82
* @route '/machinery/{machinery}'
*/
show.get = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::show
* @see app/Http/Controllers/MachineryController.php:82
* @route '/machinery/{machinery}'
*/
show.head = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MachineryController::edit
* @see app/Http/Controllers/MachineryController.php:94
* @route '/machinery/{machinery}/edit'
*/
export const edit = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/machinery/{machinery}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MachineryController::edit
* @see app/Http/Controllers/MachineryController.php:94
* @route '/machinery/{machinery}/edit'
*/
edit.url = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { machinery: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { machinery: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            machinery: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        machinery: typeof args.machinery === 'object'
        ? args.machinery.uuid
        : args.machinery,
    }

    return edit.definition.url
            .replace('{machinery}', parsedArgs.machinery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineryController::edit
* @see app/Http/Controllers/MachineryController.php:94
* @route '/machinery/{machinery}/edit'
*/
edit.get = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::edit
* @see app/Http/Controllers/MachineryController.php:94
* @route '/machinery/{machinery}/edit'
*/
edit.head = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MachineryController::update
* @see app/Http/Controllers/MachineryController.php:108
* @route '/machinery/{machinery}'
*/
export const update = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/machinery/{machinery}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\MachineryController::update
* @see app/Http/Controllers/MachineryController.php:108
* @route '/machinery/{machinery}'
*/
update.url = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { machinery: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { machinery: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            machinery: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        machinery: typeof args.machinery === 'object'
        ? args.machinery.uuid
        : args.machinery,
    }

    return update.definition.url
            .replace('{machinery}', parsedArgs.machinery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineryController::update
* @see app/Http/Controllers/MachineryController.php:108
* @route '/machinery/{machinery}'
*/
update.put = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MachineryController::update
* @see app/Http/Controllers/MachineryController.php:108
* @route '/machinery/{machinery}'
*/
update.patch = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MachineryController::destroy
* @see app/Http/Controllers/MachineryController.php:122
* @route '/machinery/{machinery}'
*/
export const destroy = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/machinery/{machinery}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\MachineryController::destroy
* @see app/Http/Controllers/MachineryController.php:122
* @route '/machinery/{machinery}'
*/
destroy.url = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { machinery: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { machinery: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            machinery: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        machinery: typeof args.machinery === 'object'
        ? args.machinery.uuid
        : args.machinery,
    }

    return destroy.definition.url
            .replace('{machinery}', parsedArgs.machinery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineryController::destroy
* @see app/Http/Controllers/MachineryController.php:122
* @route '/machinery/{machinery}'
*/
destroy.delete = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const machinery = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default machinery
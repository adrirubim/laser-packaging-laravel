import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OfferTypeController::index
* @see app/Http/Controllers/OfferTypeController.php:22
* @route '/offers/types'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/offers/types',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferTypeController::index
* @see app/Http/Controllers/OfferTypeController.php:22
* @route '/offers/types'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferTypeController::index
* @see app/Http/Controllers/OfferTypeController.php:22
* @route '/offers/types'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferTypeController::index
* @see app/Http/Controllers/OfferTypeController.php:22
* @route '/offers/types'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferTypeController::index
* @see app/Http/Controllers/OfferTypeController.php:22
* @route '/offers/types'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferTypeController::index
* @see app/Http/Controllers/OfferTypeController.php:22
* @route '/offers/types'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferTypeController::index
* @see app/Http/Controllers/OfferTypeController.php:22
* @route '/offers/types'
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
* @see \App\Http\Controllers\OfferTypeController::create
* @see app/Http/Controllers/OfferTypeController.php:50
* @route '/offers/types/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/offers/types/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferTypeController::create
* @see app/Http/Controllers/OfferTypeController.php:50
* @route '/offers/types/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferTypeController::create
* @see app/Http/Controllers/OfferTypeController.php:50
* @route '/offers/types/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferTypeController::create
* @see app/Http/Controllers/OfferTypeController.php:50
* @route '/offers/types/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferTypeController::create
* @see app/Http/Controllers/OfferTypeController.php:50
* @route '/offers/types/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferTypeController::create
* @see app/Http/Controllers/OfferTypeController.php:50
* @route '/offers/types/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferTypeController::create
* @see app/Http/Controllers/OfferTypeController.php:50
* @route '/offers/types/create'
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
* @see \App\Http\Controllers\OfferTypeController::store
* @see app/Http/Controllers/OfferTypeController.php:55
* @route '/offers/types'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/offers/types',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OfferTypeController::store
* @see app/Http/Controllers/OfferTypeController.php:55
* @route '/offers/types'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferTypeController::store
* @see app/Http/Controllers/OfferTypeController.php:55
* @route '/offers/types'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OfferTypeController::store
* @see app/Http/Controllers/OfferTypeController.php:55
* @route '/offers/types'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OfferTypeController::store
* @see app/Http/Controllers/OfferTypeController.php:55
* @route '/offers/types'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\OfferTypeController::show
* @see app/Http/Controllers/OfferTypeController.php:66
* @route '/offers/types/{offerType}'
*/
export const show = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/offers/types/{offerType}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferTypeController::show
* @see app/Http/Controllers/OfferTypeController.php:66
* @route '/offers/types/{offerType}'
*/
show.url = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerType: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerType: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerType: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerType: typeof args.offerType === 'object'
        ? args.offerType.uuid
        : args.offerType,
    }

    return show.definition.url
            .replace('{offerType}', parsedArgs.offerType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferTypeController::show
* @see app/Http/Controllers/OfferTypeController.php:66
* @route '/offers/types/{offerType}'
*/
show.get = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferTypeController::show
* @see app/Http/Controllers/OfferTypeController.php:66
* @route '/offers/types/{offerType}'
*/
show.head = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferTypeController::show
* @see app/Http/Controllers/OfferTypeController.php:66
* @route '/offers/types/{offerType}'
*/
const showForm = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferTypeController::show
* @see app/Http/Controllers/OfferTypeController.php:66
* @route '/offers/types/{offerType}'
*/
showForm.get = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferTypeController::show
* @see app/Http/Controllers/OfferTypeController.php:66
* @route '/offers/types/{offerType}'
*/
showForm.head = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OfferTypeController::edit
* @see app/Http/Controllers/OfferTypeController.php:73
* @route '/offers/types/{offerType}/edit'
*/
export const edit = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/offers/types/{offerType}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferTypeController::edit
* @see app/Http/Controllers/OfferTypeController.php:73
* @route '/offers/types/{offerType}/edit'
*/
edit.url = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerType: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerType: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerType: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerType: typeof args.offerType === 'object'
        ? args.offerType.uuid
        : args.offerType,
    }

    return edit.definition.url
            .replace('{offerType}', parsedArgs.offerType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferTypeController::edit
* @see app/Http/Controllers/OfferTypeController.php:73
* @route '/offers/types/{offerType}/edit'
*/
edit.get = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferTypeController::edit
* @see app/Http/Controllers/OfferTypeController.php:73
* @route '/offers/types/{offerType}/edit'
*/
edit.head = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferTypeController::edit
* @see app/Http/Controllers/OfferTypeController.php:73
* @route '/offers/types/{offerType}/edit'
*/
const editForm = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferTypeController::edit
* @see app/Http/Controllers/OfferTypeController.php:73
* @route '/offers/types/{offerType}/edit'
*/
editForm.get = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferTypeController::edit
* @see app/Http/Controllers/OfferTypeController.php:73
* @route '/offers/types/{offerType}/edit'
*/
editForm.head = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OfferTypeController::update
* @see app/Http/Controllers/OfferTypeController.php:80
* @route '/offers/types/{offerType}'
*/
export const update = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/offers/types/{offerType}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\OfferTypeController::update
* @see app/Http/Controllers/OfferTypeController.php:80
* @route '/offers/types/{offerType}'
*/
update.url = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerType: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerType: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerType: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerType: typeof args.offerType === 'object'
        ? args.offerType.uuid
        : args.offerType,
    }

    return update.definition.url
            .replace('{offerType}', parsedArgs.offerType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferTypeController::update
* @see app/Http/Controllers/OfferTypeController.php:80
* @route '/offers/types/{offerType}'
*/
update.put = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\OfferTypeController::update
* @see app/Http/Controllers/OfferTypeController.php:80
* @route '/offers/types/{offerType}'
*/
update.patch = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\OfferTypeController::update
* @see app/Http/Controllers/OfferTypeController.php:80
* @route '/offers/types/{offerType}'
*/
const updateForm = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OfferTypeController::update
* @see app/Http/Controllers/OfferTypeController.php:80
* @route '/offers/types/{offerType}'
*/
updateForm.put = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OfferTypeController::update
* @see app/Http/Controllers/OfferTypeController.php:80
* @route '/offers/types/{offerType}'
*/
updateForm.patch = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\OfferTypeController::destroy
* @see app/Http/Controllers/OfferTypeController.php:91
* @route '/offers/types/{offerType}'
*/
export const destroy = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/offers/types/{offerType}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OfferTypeController::destroy
* @see app/Http/Controllers/OfferTypeController.php:91
* @route '/offers/types/{offerType}'
*/
destroy.url = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offerType: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offerType: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offerType: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offerType: typeof args.offerType === 'object'
        ? args.offerType.uuid
        : args.offerType,
    }

    return destroy.definition.url
            .replace('{offerType}', parsedArgs.offerType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferTypeController::destroy
* @see app/Http/Controllers/OfferTypeController.php:91
* @route '/offers/types/{offerType}'
*/
destroy.delete = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\OfferTypeController::destroy
* @see app/Http/Controllers/OfferTypeController.php:91
* @route '/offers/types/{offerType}'
*/
const destroyForm = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OfferTypeController::destroy
* @see app/Http/Controllers/OfferTypeController.php:91
* @route '/offers/types/{offerType}'
*/
destroyForm.delete = (args: { offerType: string | { uuid: string } } | [offerType: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const OfferTypeController = { index, create, store, show, edit, update, destroy }

export default OfferTypeController
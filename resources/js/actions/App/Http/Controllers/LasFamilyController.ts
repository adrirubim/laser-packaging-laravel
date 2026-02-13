import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LasFamilyController::index
* @see app/Http/Controllers/LasFamilyController.php:20
* @route '/offers/las-families'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/offers/las-families',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LasFamilyController::index
* @see app/Http/Controllers/LasFamilyController.php:20
* @route '/offers/las-families'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LasFamilyController::index
* @see app/Http/Controllers/LasFamilyController.php:20
* @route '/offers/las-families'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LasFamilyController::index
* @see app/Http/Controllers/LasFamilyController.php:20
* @route '/offers/las-families'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LasFamilyController::index
* @see app/Http/Controllers/LasFamilyController.php:20
* @route '/offers/las-families'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LasFamilyController::index
* @see app/Http/Controllers/LasFamilyController.php:20
* @route '/offers/las-families'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LasFamilyController::index
* @see app/Http/Controllers/LasFamilyController.php:20
* @route '/offers/las-families'
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
* @see \App\Http\Controllers\LasFamilyController::create
* @see app/Http/Controllers/LasFamilyController.php:41
* @route '/offers/las-families/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/offers/las-families/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LasFamilyController::create
* @see app/Http/Controllers/LasFamilyController.php:41
* @route '/offers/las-families/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LasFamilyController::create
* @see app/Http/Controllers/LasFamilyController.php:41
* @route '/offers/las-families/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LasFamilyController::create
* @see app/Http/Controllers/LasFamilyController.php:41
* @route '/offers/las-families/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LasFamilyController::create
* @see app/Http/Controllers/LasFamilyController.php:41
* @route '/offers/las-families/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LasFamilyController::create
* @see app/Http/Controllers/LasFamilyController.php:41
* @route '/offers/las-families/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LasFamilyController::create
* @see app/Http/Controllers/LasFamilyController.php:41
* @route '/offers/las-families/create'
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
* @see \App\Http\Controllers\LasFamilyController::store
* @see app/Http/Controllers/LasFamilyController.php:46
* @route '/offers/las-families'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/offers/las-families',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LasFamilyController::store
* @see app/Http/Controllers/LasFamilyController.php:46
* @route '/offers/las-families'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LasFamilyController::store
* @see app/Http/Controllers/LasFamilyController.php:46
* @route '/offers/las-families'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LasFamilyController::store
* @see app/Http/Controllers/LasFamilyController.php:46
* @route '/offers/las-families'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LasFamilyController::store
* @see app/Http/Controllers/LasFamilyController.php:46
* @route '/offers/las-families'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\LasFamilyController::show
* @see app/Http/Controllers/LasFamilyController.php:70
* @route '/offers/las-families/{lasFamily}'
*/
export const show = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/offers/las-families/{lasFamily}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LasFamilyController::show
* @see app/Http/Controllers/LasFamilyController.php:70
* @route '/offers/las-families/{lasFamily}'
*/
show.url = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lasFamily: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { lasFamily: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            lasFamily: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lasFamily: typeof args.lasFamily === 'object'
        ? args.lasFamily.uuid
        : args.lasFamily,
    }

    return show.definition.url
            .replace('{lasFamily}', parsedArgs.lasFamily.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LasFamilyController::show
* @see app/Http/Controllers/LasFamilyController.php:70
* @route '/offers/las-families/{lasFamily}'
*/
show.get = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LasFamilyController::show
* @see app/Http/Controllers/LasFamilyController.php:70
* @route '/offers/las-families/{lasFamily}'
*/
show.head = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LasFamilyController::show
* @see app/Http/Controllers/LasFamilyController.php:70
* @route '/offers/las-families/{lasFamily}'
*/
const showForm = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LasFamilyController::show
* @see app/Http/Controllers/LasFamilyController.php:70
* @route '/offers/las-families/{lasFamily}'
*/
showForm.get = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LasFamilyController::show
* @see app/Http/Controllers/LasFamilyController.php:70
* @route '/offers/las-families/{lasFamily}'
*/
showForm.head = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LasFamilyController::edit
* @see app/Http/Controllers/LasFamilyController.php:77
* @route '/offers/las-families/{lasFamily}/edit'
*/
export const edit = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/offers/las-families/{lasFamily}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LasFamilyController::edit
* @see app/Http/Controllers/LasFamilyController.php:77
* @route '/offers/las-families/{lasFamily}/edit'
*/
edit.url = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lasFamily: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { lasFamily: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            lasFamily: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lasFamily: typeof args.lasFamily === 'object'
        ? args.lasFamily.uuid
        : args.lasFamily,
    }

    return edit.definition.url
            .replace('{lasFamily}', parsedArgs.lasFamily.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LasFamilyController::edit
* @see app/Http/Controllers/LasFamilyController.php:77
* @route '/offers/las-families/{lasFamily}/edit'
*/
edit.get = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LasFamilyController::edit
* @see app/Http/Controllers/LasFamilyController.php:77
* @route '/offers/las-families/{lasFamily}/edit'
*/
edit.head = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LasFamilyController::edit
* @see app/Http/Controllers/LasFamilyController.php:77
* @route '/offers/las-families/{lasFamily}/edit'
*/
const editForm = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LasFamilyController::edit
* @see app/Http/Controllers/LasFamilyController.php:77
* @route '/offers/las-families/{lasFamily}/edit'
*/
editForm.get = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LasFamilyController::edit
* @see app/Http/Controllers/LasFamilyController.php:77
* @route '/offers/las-families/{lasFamily}/edit'
*/
editForm.head = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LasFamilyController::update
* @see app/Http/Controllers/LasFamilyController.php:84
* @route '/offers/las-families/{lasFamily}'
*/
export const update = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/offers/las-families/{lasFamily}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\LasFamilyController::update
* @see app/Http/Controllers/LasFamilyController.php:84
* @route '/offers/las-families/{lasFamily}'
*/
update.url = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lasFamily: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { lasFamily: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            lasFamily: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lasFamily: typeof args.lasFamily === 'object'
        ? args.lasFamily.uuid
        : args.lasFamily,
    }

    return update.definition.url
            .replace('{lasFamily}', parsedArgs.lasFamily.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LasFamilyController::update
* @see app/Http/Controllers/LasFamilyController.php:84
* @route '/offers/las-families/{lasFamily}'
*/
update.put = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\LasFamilyController::update
* @see app/Http/Controllers/LasFamilyController.php:84
* @route '/offers/las-families/{lasFamily}'
*/
update.patch = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\LasFamilyController::update
* @see app/Http/Controllers/LasFamilyController.php:84
* @route '/offers/las-families/{lasFamily}'
*/
const updateForm = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LasFamilyController::update
* @see app/Http/Controllers/LasFamilyController.php:84
* @route '/offers/las-families/{lasFamily}'
*/
updateForm.put = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LasFamilyController::update
* @see app/Http/Controllers/LasFamilyController.php:84
* @route '/offers/las-families/{lasFamily}'
*/
updateForm.patch = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\LasFamilyController::destroy
* @see app/Http/Controllers/LasFamilyController.php:104
* @route '/offers/las-families/{lasFamily}'
*/
export const destroy = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/offers/las-families/{lasFamily}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LasFamilyController::destroy
* @see app/Http/Controllers/LasFamilyController.php:104
* @route '/offers/las-families/{lasFamily}'
*/
destroy.url = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lasFamily: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { lasFamily: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            lasFamily: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        lasFamily: typeof args.lasFamily === 'object'
        ? args.lasFamily.uuid
        : args.lasFamily,
    }

    return destroy.definition.url
            .replace('{lasFamily}', parsedArgs.lasFamily.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LasFamilyController::destroy
* @see app/Http/Controllers/LasFamilyController.php:104
* @route '/offers/las-families/{lasFamily}'
*/
destroy.delete = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\LasFamilyController::destroy
* @see app/Http/Controllers/LasFamilyController.php:104
* @route '/offers/las-families/{lasFamily}'
*/
const destroyForm = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LasFamilyController::destroy
* @see app/Http/Controllers/LasFamilyController.php:104
* @route '/offers/las-families/{lasFamily}'
*/
destroyForm.delete = (args: { lasFamily: string | { uuid: string } } | [lasFamily: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const LasFamilyController = { index, create, store, show, edit, update, destroy }

export default LasFamilyController
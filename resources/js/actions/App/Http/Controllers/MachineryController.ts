import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MachineryController::index
* @see app/Http/Controllers/MachineryController.php:24
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
* @see app/Http/Controllers/MachineryController.php:24
* @route '/machinery'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineryController::index
* @see app/Http/Controllers/MachineryController.php:24
* @route '/machinery'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::index
* @see app/Http/Controllers/MachineryController.php:24
* @route '/machinery'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MachineryController::index
* @see app/Http/Controllers/MachineryController.php:24
* @route '/machinery'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::index
* @see app/Http/Controllers/MachineryController.php:24
* @route '/machinery'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::index
* @see app/Http/Controllers/MachineryController.php:24
* @route '/machinery'
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
* @see \App\Http\Controllers\MachineryController::create
* @see app/Http/Controllers/MachineryController.php:50
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
* @see app/Http/Controllers/MachineryController.php:50
* @route '/machinery/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineryController::create
* @see app/Http/Controllers/MachineryController.php:50
* @route '/machinery/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::create
* @see app/Http/Controllers/MachineryController.php:50
* @route '/machinery/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MachineryController::create
* @see app/Http/Controllers/MachineryController.php:50
* @route '/machinery/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::create
* @see app/Http/Controllers/MachineryController.php:50
* @route '/machinery/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::create
* @see app/Http/Controllers/MachineryController.php:50
* @route '/machinery/create'
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
* @see \App\Http\Controllers\MachineryController::store
* @see app/Http/Controllers/MachineryController.php:62
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
* @see app/Http/Controllers/MachineryController.php:62
* @route '/machinery'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MachineryController::store
* @see app/Http/Controllers/MachineryController.php:62
* @route '/machinery'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MachineryController::store
* @see app/Http/Controllers/MachineryController.php:62
* @route '/machinery'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MachineryController::store
* @see app/Http/Controllers/MachineryController.php:62
* @route '/machinery'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\MachineryController::show
* @see app/Http/Controllers/MachineryController.php:81
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
* @see app/Http/Controllers/MachineryController.php:81
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
* @see app/Http/Controllers/MachineryController.php:81
* @route '/machinery/{machinery}'
*/
show.get = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::show
* @see app/Http/Controllers/MachineryController.php:81
* @route '/machinery/{machinery}'
*/
show.head = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MachineryController::show
* @see app/Http/Controllers/MachineryController.php:81
* @route '/machinery/{machinery}'
*/
const showForm = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::show
* @see app/Http/Controllers/MachineryController.php:81
* @route '/machinery/{machinery}'
*/
showForm.get = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::show
* @see app/Http/Controllers/MachineryController.php:81
* @route '/machinery/{machinery}'
*/
showForm.head = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MachineryController::edit
* @see app/Http/Controllers/MachineryController.php:93
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
* @see app/Http/Controllers/MachineryController.php:93
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
* @see app/Http/Controllers/MachineryController.php:93
* @route '/machinery/{machinery}/edit'
*/
edit.get = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::edit
* @see app/Http/Controllers/MachineryController.php:93
* @route '/machinery/{machinery}/edit'
*/
edit.head = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\MachineryController::edit
* @see app/Http/Controllers/MachineryController.php:93
* @route '/machinery/{machinery}/edit'
*/
const editForm = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::edit
* @see app/Http/Controllers/MachineryController.php:93
* @route '/machinery/{machinery}/edit'
*/
editForm.get = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\MachineryController::edit
* @see app/Http/Controllers/MachineryController.php:93
* @route '/machinery/{machinery}/edit'
*/
editForm.head = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\MachineryController::update
* @see app/Http/Controllers/MachineryController.php:107
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
* @see app/Http/Controllers/MachineryController.php:107
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
* @see app/Http/Controllers/MachineryController.php:107
* @route '/machinery/{machinery}'
*/
update.put = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\MachineryController::update
* @see app/Http/Controllers/MachineryController.php:107
* @route '/machinery/{machinery}'
*/
update.patch = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\MachineryController::update
* @see app/Http/Controllers/MachineryController.php:107
* @route '/machinery/{machinery}'
*/
const updateForm = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MachineryController::update
* @see app/Http/Controllers/MachineryController.php:107
* @route '/machinery/{machinery}'
*/
updateForm.put = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MachineryController::update
* @see app/Http/Controllers/MachineryController.php:107
* @route '/machinery/{machinery}'
*/
updateForm.patch = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\MachineryController::destroy
* @see app/Http/Controllers/MachineryController.php:121
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
* @see app/Http/Controllers/MachineryController.php:121
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
* @see app/Http/Controllers/MachineryController.php:121
* @route '/machinery/{machinery}'
*/
destroy.delete = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\MachineryController::destroy
* @see app/Http/Controllers/MachineryController.php:121
* @route '/machinery/{machinery}'
*/
const destroyForm = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\MachineryController::destroy
* @see app/Http/Controllers/MachineryController.php:121
* @route '/machinery/{machinery}'
*/
destroyForm.delete = (args: { machinery: string | { uuid: string } } | [machinery: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const MachineryController = { index, create, store, show, edit, update, destroy }

export default MachineryController
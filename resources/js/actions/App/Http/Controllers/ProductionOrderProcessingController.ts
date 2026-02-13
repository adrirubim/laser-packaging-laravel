import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::index
* @see app/Http/Controllers/ProductionOrderProcessingController.php:16
* @route '/production-order-processing'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/production-order-processing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::index
* @see app/Http/Controllers/ProductionOrderProcessingController.php:16
* @route '/production-order-processing'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::index
* @see app/Http/Controllers/ProductionOrderProcessingController.php:16
* @route '/production-order-processing'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::index
* @see app/Http/Controllers/ProductionOrderProcessingController.php:16
* @route '/production-order-processing'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::index
* @see app/Http/Controllers/ProductionOrderProcessingController.php:16
* @route '/production-order-processing'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::index
* @see app/Http/Controllers/ProductionOrderProcessingController.php:16
* @route '/production-order-processing'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::index
* @see app/Http/Controllers/ProductionOrderProcessingController.php:16
* @route '/production-order-processing'
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
* @see \App\Http\Controllers\ProductionOrderProcessingController::create
* @see app/Http/Controllers/ProductionOrderProcessingController.php:145
* @route '/production-order-processing/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/production-order-processing/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::create
* @see app/Http/Controllers/ProductionOrderProcessingController.php:145
* @route '/production-order-processing/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::create
* @see app/Http/Controllers/ProductionOrderProcessingController.php:145
* @route '/production-order-processing/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::create
* @see app/Http/Controllers/ProductionOrderProcessingController.php:145
* @route '/production-order-processing/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::create
* @see app/Http/Controllers/ProductionOrderProcessingController.php:145
* @route '/production-order-processing/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::create
* @see app/Http/Controllers/ProductionOrderProcessingController.php:145
* @route '/production-order-processing/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::create
* @see app/Http/Controllers/ProductionOrderProcessingController.php:145
* @route '/production-order-processing/create'
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
* @see \App\Http\Controllers\ProductionOrderProcessingController::store
* @see app/Http/Controllers/ProductionOrderProcessingController.php:175
* @route '/production-order-processing'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/production-order-processing',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::store
* @see app/Http/Controllers/ProductionOrderProcessingController.php:175
* @route '/production-order-processing'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::store
* @see app/Http/Controllers/ProductionOrderProcessingController.php:175
* @route '/production-order-processing'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::store
* @see app/Http/Controllers/ProductionOrderProcessingController.php:175
* @route '/production-order-processing'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::store
* @see app/Http/Controllers/ProductionOrderProcessingController.php:175
* @route '/production-order-processing'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::show
* @see app/Http/Controllers/ProductionOrderProcessingController.php:222
* @route '/production-order-processing/{productionOrderProcessing}'
*/
export const show = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/production-order-processing/{productionOrderProcessing}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::show
* @see app/Http/Controllers/ProductionOrderProcessingController.php:222
* @route '/production-order-processing/{productionOrderProcessing}'
*/
show.url = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { productionOrderProcessing: args }
    }

    if (Array.isArray(args)) {
        args = {
            productionOrderProcessing: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        productionOrderProcessing: args.productionOrderProcessing,
    }

    return show.definition.url
            .replace('{productionOrderProcessing}', parsedArgs.productionOrderProcessing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::show
* @see app/Http/Controllers/ProductionOrderProcessingController.php:222
* @route '/production-order-processing/{productionOrderProcessing}'
*/
show.get = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::show
* @see app/Http/Controllers/ProductionOrderProcessingController.php:222
* @route '/production-order-processing/{productionOrderProcessing}'
*/
show.head = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::show
* @see app/Http/Controllers/ProductionOrderProcessingController.php:222
* @route '/production-order-processing/{productionOrderProcessing}'
*/
const showForm = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::show
* @see app/Http/Controllers/ProductionOrderProcessingController.php:222
* @route '/production-order-processing/{productionOrderProcessing}'
*/
showForm.get = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::show
* @see app/Http/Controllers/ProductionOrderProcessingController.php:222
* @route '/production-order-processing/{productionOrderProcessing}'
*/
showForm.head = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ProductionOrderProcessingController::edit
* @see app/Http/Controllers/ProductionOrderProcessingController.php:230
* @route '/production-order-processing/{productionOrderProcessing}/edit'
*/
export const edit = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/production-order-processing/{productionOrderProcessing}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::edit
* @see app/Http/Controllers/ProductionOrderProcessingController.php:230
* @route '/production-order-processing/{productionOrderProcessing}/edit'
*/
edit.url = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { productionOrderProcessing: args }
    }

    if (Array.isArray(args)) {
        args = {
            productionOrderProcessing: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        productionOrderProcessing: args.productionOrderProcessing,
    }

    return edit.definition.url
            .replace('{productionOrderProcessing}', parsedArgs.productionOrderProcessing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::edit
* @see app/Http/Controllers/ProductionOrderProcessingController.php:230
* @route '/production-order-processing/{productionOrderProcessing}/edit'
*/
edit.get = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::edit
* @see app/Http/Controllers/ProductionOrderProcessingController.php:230
* @route '/production-order-processing/{productionOrderProcessing}/edit'
*/
edit.head = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::edit
* @see app/Http/Controllers/ProductionOrderProcessingController.php:230
* @route '/production-order-processing/{productionOrderProcessing}/edit'
*/
const editForm = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::edit
* @see app/Http/Controllers/ProductionOrderProcessingController.php:230
* @route '/production-order-processing/{productionOrderProcessing}/edit'
*/
editForm.get = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::edit
* @see app/Http/Controllers/ProductionOrderProcessingController.php:230
* @route '/production-order-processing/{productionOrderProcessing}/edit'
*/
editForm.head = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ProductionOrderProcessingController::update
* @see app/Http/Controllers/ProductionOrderProcessingController.php:238
* @route '/production-order-processing/{productionOrderProcessing}'
*/
export const update = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/production-order-processing/{productionOrderProcessing}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::update
* @see app/Http/Controllers/ProductionOrderProcessingController.php:238
* @route '/production-order-processing/{productionOrderProcessing}'
*/
update.url = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { productionOrderProcessing: args }
    }

    if (Array.isArray(args)) {
        args = {
            productionOrderProcessing: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        productionOrderProcessing: args.productionOrderProcessing,
    }

    return update.definition.url
            .replace('{productionOrderProcessing}', parsedArgs.productionOrderProcessing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::update
* @see app/Http/Controllers/ProductionOrderProcessingController.php:238
* @route '/production-order-processing/{productionOrderProcessing}'
*/
update.put = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::update
* @see app/Http/Controllers/ProductionOrderProcessingController.php:238
* @route '/production-order-processing/{productionOrderProcessing}'
*/
update.patch = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::update
* @see app/Http/Controllers/ProductionOrderProcessingController.php:238
* @route '/production-order-processing/{productionOrderProcessing}'
*/
const updateForm = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::update
* @see app/Http/Controllers/ProductionOrderProcessingController.php:238
* @route '/production-order-processing/{productionOrderProcessing}'
*/
updateForm.put = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::update
* @see app/Http/Controllers/ProductionOrderProcessingController.php:238
* @route '/production-order-processing/{productionOrderProcessing}'
*/
updateForm.patch = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ProductionOrderProcessingController::destroy
* @see app/Http/Controllers/ProductionOrderProcessingController.php:246
* @route '/production-order-processing/{productionOrderProcessing}'
*/
export const destroy = (args: { productionOrderProcessing: string | { uuid: string } } | [productionOrderProcessing: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/production-order-processing/{productionOrderProcessing}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::destroy
* @see app/Http/Controllers/ProductionOrderProcessingController.php:246
* @route '/production-order-processing/{productionOrderProcessing}'
*/
destroy.url = (args: { productionOrderProcessing: string | { uuid: string } } | [productionOrderProcessing: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { productionOrderProcessing: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { productionOrderProcessing: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            productionOrderProcessing: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        productionOrderProcessing: typeof args.productionOrderProcessing === 'object'
        ? args.productionOrderProcessing.uuid
        : args.productionOrderProcessing,
    }

    return destroy.definition.url
            .replace('{productionOrderProcessing}', parsedArgs.productionOrderProcessing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::destroy
* @see app/Http/Controllers/ProductionOrderProcessingController.php:246
* @route '/production-order-processing/{productionOrderProcessing}'
*/
destroy.delete = (args: { productionOrderProcessing: string | { uuid: string } } | [productionOrderProcessing: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::destroy
* @see app/Http/Controllers/ProductionOrderProcessingController.php:246
* @route '/production-order-processing/{productionOrderProcessing}'
*/
const destroyForm = (args: { productionOrderProcessing: string | { uuid: string } } | [productionOrderProcessing: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::destroy
* @see app/Http/Controllers/ProductionOrderProcessingController.php:246
* @route '/production-order-processing/{productionOrderProcessing}'
*/
destroyForm.delete = (args: { productionOrderProcessing: string | { uuid: string } } | [productionOrderProcessing: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const ProductionOrderProcessingController = { index, create, store, show, edit, update, destroy }

export default ProductionOrderProcessingController
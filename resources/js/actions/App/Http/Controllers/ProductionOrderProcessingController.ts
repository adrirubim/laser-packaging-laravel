import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::index
* @see app/Http/Controllers/ProductionOrderProcessingController.php:19
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
* @see app/Http/Controllers/ProductionOrderProcessingController.php:19
* @route '/production-order-processing'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::index
* @see app/Http/Controllers/ProductionOrderProcessingController.php:19
* @route '/production-order-processing'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::index
* @see app/Http/Controllers/ProductionOrderProcessingController.php:19
* @route '/production-order-processing'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::create
* @see app/Http/Controllers/ProductionOrderProcessingController.php:148
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
* @see app/Http/Controllers/ProductionOrderProcessingController.php:148
* @route '/production-order-processing/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::create
* @see app/Http/Controllers/ProductionOrderProcessingController.php:148
* @route '/production-order-processing/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::create
* @see app/Http/Controllers/ProductionOrderProcessingController.php:148
* @route '/production-order-processing/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::store
* @see app/Http/Controllers/ProductionOrderProcessingController.php:178
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
* @see app/Http/Controllers/ProductionOrderProcessingController.php:178
* @route '/production-order-processing'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::store
* @see app/Http/Controllers/ProductionOrderProcessingController.php:178
* @route '/production-order-processing'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::show
* @see app/Http/Controllers/ProductionOrderProcessingController.php:225
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
* @see app/Http/Controllers/ProductionOrderProcessingController.php:225
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
* @see app/Http/Controllers/ProductionOrderProcessingController.php:225
* @route '/production-order-processing/{productionOrderProcessing}'
*/
show.get = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::show
* @see app/Http/Controllers/ProductionOrderProcessingController.php:225
* @route '/production-order-processing/{productionOrderProcessing}'
*/
show.head = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::edit
* @see app/Http/Controllers/ProductionOrderProcessingController.php:233
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
* @see app/Http/Controllers/ProductionOrderProcessingController.php:233
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
* @see app/Http/Controllers/ProductionOrderProcessingController.php:233
* @route '/production-order-processing/{productionOrderProcessing}/edit'
*/
edit.get = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::edit
* @see app/Http/Controllers/ProductionOrderProcessingController.php:233
* @route '/production-order-processing/{productionOrderProcessing}/edit'
*/
edit.head = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::update
* @see app/Http/Controllers/ProductionOrderProcessingController.php:241
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
* @see app/Http/Controllers/ProductionOrderProcessingController.php:241
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
* @see app/Http/Controllers/ProductionOrderProcessingController.php:241
* @route '/production-order-processing/{productionOrderProcessing}'
*/
update.put = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::update
* @see app/Http/Controllers/ProductionOrderProcessingController.php:241
* @route '/production-order-processing/{productionOrderProcessing}'
*/
update.patch = (args: { productionOrderProcessing: string | number } | [productionOrderProcessing: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ProductionOrderProcessingController::destroy
* @see app/Http/Controllers/ProductionOrderProcessingController.php:250
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
* @see app/Http/Controllers/ProductionOrderProcessingController.php:250
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
* @see app/Http/Controllers/ProductionOrderProcessingController.php:250
* @route '/production-order-processing/{productionOrderProcessing}'
*/
destroy.delete = (args: { productionOrderProcessing: string | { uuid: string } } | [productionOrderProcessing: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const ProductionOrderProcessingController = { index, create, store, show, edit, update, destroy }

export default ProductionOrderProcessingController
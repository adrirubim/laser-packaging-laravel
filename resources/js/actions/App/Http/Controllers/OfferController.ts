import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OfferController::getDivisions
* @see app/Http/Controllers/OfferController.php:657
* @route '/offers/get-divisions'
*/
export const getDivisions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDivisions.url(options),
    method: 'get',
})

getDivisions.definition = {
    methods: ["get","head"],
    url: '/offers/get-divisions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferController::getDivisions
* @see app/Http/Controllers/OfferController.php:657
* @route '/offers/get-divisions'
*/
getDivisions.url = (options?: RouteQueryOptions) => {
    return getDivisions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferController::getDivisions
* @see app/Http/Controllers/OfferController.php:657
* @route '/offers/get-divisions'
*/
getDivisions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDivisions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferController::getDivisions
* @see app/Http/Controllers/OfferController.php:657
* @route '/offers/get-divisions'
*/
getDivisions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDivisions.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferController::downloadPdf
* @see app/Http/Controllers/OfferController.php:362
* @route '/offers/{offer}/download-pdf'
*/
export const downloadPdf = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdf.url(args, options),
    method: 'get',
})

downloadPdf.definition = {
    methods: ["get","head"],
    url: '/offers/{offer}/download-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferController::downloadPdf
* @see app/Http/Controllers/OfferController.php:362
* @route '/offers/{offer}/download-pdf'
*/
downloadPdf.url = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offer: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offer: typeof args.offer === 'object'
        ? args.offer.uuid
        : args.offer,
    }

    return downloadPdf.definition.url
            .replace('{offer}', parsedArgs.offer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferController::downloadPdf
* @see app/Http/Controllers/OfferController.php:362
* @route '/offers/{offer}/download-pdf'
*/
downloadPdf.get = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdf.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferController::downloadPdf
* @see app/Http/Controllers/OfferController.php:362
* @route '/offers/{offer}/download-pdf'
*/
downloadPdf.head = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadPdf.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferController::index
* @see app/Http/Controllers/OfferController.php:84
* @route '/offers'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/offers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferController::index
* @see app/Http/Controllers/OfferController.php:84
* @route '/offers'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferController::index
* @see app/Http/Controllers/OfferController.php:84
* @route '/offers'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferController::index
* @see app/Http/Controllers/OfferController.php:84
* @route '/offers'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferController::create
* @see app/Http/Controllers/OfferController.php:148
* @route '/offers/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/offers/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferController::create
* @see app/Http/Controllers/OfferController.php:148
* @route '/offers/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferController::create
* @see app/Http/Controllers/OfferController.php:148
* @route '/offers/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferController::create
* @see app/Http/Controllers/OfferController.php:148
* @route '/offers/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferController::store
* @see app/Http/Controllers/OfferController.php:281
* @route '/offers'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/offers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OfferController::store
* @see app/Http/Controllers/OfferController.php:281
* @route '/offers'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferController::store
* @see app/Http/Controllers/OfferController.php:281
* @route '/offers'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OfferController::show
* @see app/Http/Controllers/OfferController.php:302
* @route '/offers/{offer}'
*/
export const show = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/offers/{offer}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferController::show
* @see app/Http/Controllers/OfferController.php:302
* @route '/offers/{offer}'
*/
show.url = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offer: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offer: typeof args.offer === 'object'
        ? args.offer.uuid
        : args.offer,
    }

    return show.definition.url
            .replace('{offer}', parsedArgs.offer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferController::show
* @see app/Http/Controllers/OfferController.php:302
* @route '/offers/{offer}'
*/
show.get = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferController::show
* @see app/Http/Controllers/OfferController.php:302
* @route '/offers/{offer}'
*/
show.head = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferController::edit
* @see app/Http/Controllers/OfferController.php:381
* @route '/offers/{offer}/edit'
*/
export const edit = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/offers/{offer}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OfferController::edit
* @see app/Http/Controllers/OfferController.php:381
* @route '/offers/{offer}/edit'
*/
edit.url = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offer: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offer: typeof args.offer === 'object'
        ? args.offer.uuid
        : args.offer,
    }

    return edit.definition.url
            .replace('{offer}', parsedArgs.offer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferController::edit
* @see app/Http/Controllers/OfferController.php:381
* @route '/offers/{offer}/edit'
*/
edit.get = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OfferController::edit
* @see app/Http/Controllers/OfferController.php:381
* @route '/offers/{offer}/edit'
*/
edit.head = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OfferController::update
* @see app/Http/Controllers/OfferController.php:601
* @route '/offers/{offer}'
*/
export const update = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/offers/{offer}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\OfferController::update
* @see app/Http/Controllers/OfferController.php:601
* @route '/offers/{offer}'
*/
update.url = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offer: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offer: typeof args.offer === 'object'
        ? args.offer.uuid
        : args.offer,
    }

    return update.definition.url
            .replace('{offer}', parsedArgs.offer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferController::update
* @see app/Http/Controllers/OfferController.php:601
* @route '/offers/{offer}'
*/
update.put = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\OfferController::update
* @see app/Http/Controllers/OfferController.php:601
* @route '/offers/{offer}'
*/
update.patch = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\OfferController::destroy
* @see app/Http/Controllers/OfferController.php:628
* @route '/offers/{offer}'
*/
export const destroy = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/offers/{offer}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OfferController::destroy
* @see app/Http/Controllers/OfferController.php:628
* @route '/offers/{offer}'
*/
destroy.url = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offer: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { offer: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            offer: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        offer: typeof args.offer === 'object'
        ? args.offer.uuid
        : args.offer,
    }

    return destroy.definition.url
            .replace('{offer}', parsedArgs.offer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OfferController::destroy
* @see app/Http/Controllers/OfferController.php:628
* @route '/offers/{offer}'
*/
destroy.delete = (args: { offer: string | { uuid: string } } | [offer: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const OfferController = { getDivisions, downloadPdf, index, create, store, show, edit, update, destroy }

export default OfferController
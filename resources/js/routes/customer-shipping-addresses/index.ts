import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CustomerShippingAddressController::loadDivisions
* @see app/Http/Controllers/CustomerShippingAddressController.php:175
* @route '/customer-shipping-addresses/load-divisions'
*/
export const loadDivisions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: loadDivisions.url(options),
    method: 'get',
})

loadDivisions.definition = {
    methods: ["get","head"],
    url: '/customer-shipping-addresses/load-divisions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::loadDivisions
* @see app/Http/Controllers/CustomerShippingAddressController.php:175
* @route '/customer-shipping-addresses/load-divisions'
*/
loadDivisions.url = (options?: RouteQueryOptions) => {
    return loadDivisions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::loadDivisions
* @see app/Http/Controllers/CustomerShippingAddressController.php:175
* @route '/customer-shipping-addresses/load-divisions'
*/
loadDivisions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: loadDivisions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::loadDivisions
* @see app/Http/Controllers/CustomerShippingAddressController.php:175
* @route '/customer-shipping-addresses/load-divisions'
*/
loadDivisions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: loadDivisions.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::loadDivisions
* @see app/Http/Controllers/CustomerShippingAddressController.php:175
* @route '/customer-shipping-addresses/load-divisions'
*/
const loadDivisionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: loadDivisions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::loadDivisions
* @see app/Http/Controllers/CustomerShippingAddressController.php:175
* @route '/customer-shipping-addresses/load-divisions'
*/
loadDivisionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: loadDivisions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::loadDivisions
* @see app/Http/Controllers/CustomerShippingAddressController.php:175
* @route '/customer-shipping-addresses/load-divisions'
*/
loadDivisionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: loadDivisions.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

loadDivisions.form = loadDivisionsForm

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::index
* @see app/Http/Controllers/CustomerShippingAddressController.php:38
* @route '/customer-shipping-addresses'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/customer-shipping-addresses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::index
* @see app/Http/Controllers/CustomerShippingAddressController.php:38
* @route '/customer-shipping-addresses'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::index
* @see app/Http/Controllers/CustomerShippingAddressController.php:38
* @route '/customer-shipping-addresses'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::index
* @see app/Http/Controllers/CustomerShippingAddressController.php:38
* @route '/customer-shipping-addresses'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::index
* @see app/Http/Controllers/CustomerShippingAddressController.php:38
* @route '/customer-shipping-addresses'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::index
* @see app/Http/Controllers/CustomerShippingAddressController.php:38
* @route '/customer-shipping-addresses'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::index
* @see app/Http/Controllers/CustomerShippingAddressController.php:38
* @route '/customer-shipping-addresses'
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
* @see \App\Http\Controllers\CustomerShippingAddressController::create
* @see app/Http/Controllers/CustomerShippingAddressController.php:53
* @route '/customer-shipping-addresses/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/customer-shipping-addresses/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::create
* @see app/Http/Controllers/CustomerShippingAddressController.php:53
* @route '/customer-shipping-addresses/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::create
* @see app/Http/Controllers/CustomerShippingAddressController.php:53
* @route '/customer-shipping-addresses/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::create
* @see app/Http/Controllers/CustomerShippingAddressController.php:53
* @route '/customer-shipping-addresses/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::create
* @see app/Http/Controllers/CustomerShippingAddressController.php:53
* @route '/customer-shipping-addresses/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::create
* @see app/Http/Controllers/CustomerShippingAddressController.php:53
* @route '/customer-shipping-addresses/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::create
* @see app/Http/Controllers/CustomerShippingAddressController.php:53
* @route '/customer-shipping-addresses/create'
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
* @see \App\Http\Controllers\CustomerShippingAddressController::store
* @see app/Http/Controllers/CustomerShippingAddressController.php:71
* @route '/customer-shipping-addresses'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/customer-shipping-addresses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::store
* @see app/Http/Controllers/CustomerShippingAddressController.php:71
* @route '/customer-shipping-addresses'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::store
* @see app/Http/Controllers/CustomerShippingAddressController.php:71
* @route '/customer-shipping-addresses'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::store
* @see app/Http/Controllers/CustomerShippingAddressController.php:71
* @route '/customer-shipping-addresses'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::store
* @see app/Http/Controllers/CustomerShippingAddressController.php:71
* @route '/customer-shipping-addresses'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::show
* @see app/Http/Controllers/CustomerShippingAddressController.php:88
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
export const show = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/customer-shipping-addresses/{customerShippingAddress}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::show
* @see app/Http/Controllers/CustomerShippingAddressController.php:88
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
show.url = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customerShippingAddress: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { customerShippingAddress: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            customerShippingAddress: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customerShippingAddress: typeof args.customerShippingAddress === 'object'
        ? args.customerShippingAddress.uuid
        : args.customerShippingAddress,
    }

    return show.definition.url
            .replace('{customerShippingAddress}', parsedArgs.customerShippingAddress.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::show
* @see app/Http/Controllers/CustomerShippingAddressController.php:88
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
show.get = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::show
* @see app/Http/Controllers/CustomerShippingAddressController.php:88
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
show.head = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::show
* @see app/Http/Controllers/CustomerShippingAddressController.php:88
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
const showForm = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::show
* @see app/Http/Controllers/CustomerShippingAddressController.php:88
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
showForm.get = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::show
* @see app/Http/Controllers/CustomerShippingAddressController.php:88
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
showForm.head = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CustomerShippingAddressController::edit
* @see app/Http/Controllers/CustomerShippingAddressController.php:100
* @route '/customer-shipping-addresses/{customerShippingAddress}/edit'
*/
export const edit = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/customer-shipping-addresses/{customerShippingAddress}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::edit
* @see app/Http/Controllers/CustomerShippingAddressController.php:100
* @route '/customer-shipping-addresses/{customerShippingAddress}/edit'
*/
edit.url = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customerShippingAddress: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { customerShippingAddress: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            customerShippingAddress: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customerShippingAddress: typeof args.customerShippingAddress === 'object'
        ? args.customerShippingAddress.uuid
        : args.customerShippingAddress,
    }

    return edit.definition.url
            .replace('{customerShippingAddress}', parsedArgs.customerShippingAddress.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::edit
* @see app/Http/Controllers/CustomerShippingAddressController.php:100
* @route '/customer-shipping-addresses/{customerShippingAddress}/edit'
*/
edit.get = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::edit
* @see app/Http/Controllers/CustomerShippingAddressController.php:100
* @route '/customer-shipping-addresses/{customerShippingAddress}/edit'
*/
edit.head = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::edit
* @see app/Http/Controllers/CustomerShippingAddressController.php:100
* @route '/customer-shipping-addresses/{customerShippingAddress}/edit'
*/
const editForm = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::edit
* @see app/Http/Controllers/CustomerShippingAddressController.php:100
* @route '/customer-shipping-addresses/{customerShippingAddress}/edit'
*/
editForm.get = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::edit
* @see app/Http/Controllers/CustomerShippingAddressController.php:100
* @route '/customer-shipping-addresses/{customerShippingAddress}/edit'
*/
editForm.head = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CustomerShippingAddressController::update
* @see app/Http/Controllers/CustomerShippingAddressController.php:120
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
export const update = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/customer-shipping-addresses/{customerShippingAddress}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::update
* @see app/Http/Controllers/CustomerShippingAddressController.php:120
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
update.url = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customerShippingAddress: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { customerShippingAddress: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            customerShippingAddress: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customerShippingAddress: typeof args.customerShippingAddress === 'object'
        ? args.customerShippingAddress.uuid
        : args.customerShippingAddress,
    }

    return update.definition.url
            .replace('{customerShippingAddress}', parsedArgs.customerShippingAddress.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::update
* @see app/Http/Controllers/CustomerShippingAddressController.php:120
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
update.put = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::update
* @see app/Http/Controllers/CustomerShippingAddressController.php:120
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
update.patch = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::update
* @see app/Http/Controllers/CustomerShippingAddressController.php:120
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
const updateForm = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::update
* @see app/Http/Controllers/CustomerShippingAddressController.php:120
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
updateForm.put = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::update
* @see app/Http/Controllers/CustomerShippingAddressController.php:120
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
updateForm.patch = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CustomerShippingAddressController::destroy
* @see app/Http/Controllers/CustomerShippingAddressController.php:146
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
export const destroy = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/customer-shipping-addresses/{customerShippingAddress}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::destroy
* @see app/Http/Controllers/CustomerShippingAddressController.php:146
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
destroy.url = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { customerShippingAddress: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { customerShippingAddress: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            customerShippingAddress: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        customerShippingAddress: typeof args.customerShippingAddress === 'object'
        ? args.customerShippingAddress.uuid
        : args.customerShippingAddress,
    }

    return destroy.definition.url
            .replace('{customerShippingAddress}', parsedArgs.customerShippingAddress.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::destroy
* @see app/Http/Controllers/CustomerShippingAddressController.php:146
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
destroy.delete = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::destroy
* @see app/Http/Controllers/CustomerShippingAddressController.php:146
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
const destroyForm = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CustomerShippingAddressController::destroy
* @see app/Http/Controllers/CustomerShippingAddressController.php:146
* @route '/customer-shipping-addresses/{customerShippingAddress}'
*/
destroyForm.delete = (args: { customerShippingAddress: string | { uuid: string } } | [customerShippingAddress: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const customerShippingAddresses = {
    loadDivisions: Object.assign(loadDivisions, loadDivisions),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default customerShippingAddresses
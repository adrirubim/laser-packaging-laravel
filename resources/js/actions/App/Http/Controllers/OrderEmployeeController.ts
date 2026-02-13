import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrderEmployeeController::manageOrder
* @see app/Http/Controllers/OrderEmployeeController.php:105
* @route '/orders/{order}/manage-employees'
*/
export const manageOrder = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageOrder.url(args, options),
    method: 'get',
})

manageOrder.definition = {
    methods: ["get","head"],
    url: '/orders/{order}/manage-employees',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderEmployeeController::manageOrder
* @see app/Http/Controllers/OrderEmployeeController.php:105
* @route '/orders/{order}/manage-employees'
*/
manageOrder.url = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { order: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: typeof args.order === 'object'
        ? args.order.uuid
        : args.order,
    }

    return manageOrder.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::manageOrder
* @see app/Http/Controllers/OrderEmployeeController.php:105
* @route '/orders/{order}/manage-employees'
*/
manageOrder.get = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageOrder.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::manageOrder
* @see app/Http/Controllers/OrderEmployeeController.php:105
* @route '/orders/{order}/manage-employees'
*/
manageOrder.head = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manageOrder.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::manageOrder
* @see app/Http/Controllers/OrderEmployeeController.php:105
* @route '/orders/{order}/manage-employees'
*/
const manageOrderForm = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageOrder.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::manageOrder
* @see app/Http/Controllers/OrderEmployeeController.php:105
* @route '/orders/{order}/manage-employees'
*/
manageOrderForm.get = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageOrder.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::manageOrder
* @see app/Http/Controllers/OrderEmployeeController.php:105
* @route '/orders/{order}/manage-employees'
*/
manageOrderForm.head = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageOrder.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

manageOrder.form = manageOrderForm

/**
* @see \App\Http\Controllers\OrderEmployeeController::getEmployeeAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:49
* @route '/order-employees/get-assignments'
*/
export const getEmployeeAssignments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getEmployeeAssignments.url(options),
    method: 'get',
})

getEmployeeAssignments.definition = {
    methods: ["get","head"],
    url: '/order-employees/get-assignments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderEmployeeController::getEmployeeAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:49
* @route '/order-employees/get-assignments'
*/
getEmployeeAssignments.url = (options?: RouteQueryOptions) => {
    return getEmployeeAssignments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::getEmployeeAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:49
* @route '/order-employees/get-assignments'
*/
getEmployeeAssignments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getEmployeeAssignments.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::getEmployeeAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:49
* @route '/order-employees/get-assignments'
*/
getEmployeeAssignments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getEmployeeAssignments.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::getEmployeeAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:49
* @route '/order-employees/get-assignments'
*/
const getEmployeeAssignmentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getEmployeeAssignments.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::getEmployeeAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:49
* @route '/order-employees/get-assignments'
*/
getEmployeeAssignmentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getEmployeeAssignments.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::getEmployeeAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:49
* @route '/order-employees/get-assignments'
*/
getEmployeeAssignmentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getEmployeeAssignments.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getEmployeeAssignments.form = getEmployeeAssignmentsForm

/**
* @see \App\Http\Controllers\OrderEmployeeController::saveEmployeeAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:66
* @route '/order-employees/save-assignments'
*/
export const saveEmployeeAssignments = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveEmployeeAssignments.url(options),
    method: 'post',
})

saveEmployeeAssignments.definition = {
    methods: ["post"],
    url: '/order-employees/save-assignments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderEmployeeController::saveEmployeeAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:66
* @route '/order-employees/save-assignments'
*/
saveEmployeeAssignments.url = (options?: RouteQueryOptions) => {
    return saveEmployeeAssignments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::saveEmployeeAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:66
* @route '/order-employees/save-assignments'
*/
saveEmployeeAssignments.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveEmployeeAssignments.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::saveEmployeeAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:66
* @route '/order-employees/save-assignments'
*/
const saveEmployeeAssignmentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveEmployeeAssignments.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::saveEmployeeAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:66
* @route '/order-employees/save-assignments'
*/
saveEmployeeAssignmentsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveEmployeeAssignments.url(options),
    method: 'post',
})

saveEmployeeAssignments.form = saveEmployeeAssignmentsForm

/**
* @see \App\Http\Controllers\OrderEmployeeController::checkEmployeeOrder
* @see app/Http/Controllers/OrderEmployeeController.php:87
* @route '/order-employees/check-assignment'
*/
export const checkEmployeeOrder = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkEmployeeOrder.url(options),
    method: 'get',
})

checkEmployeeOrder.definition = {
    methods: ["get","head"],
    url: '/order-employees/check-assignment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderEmployeeController::checkEmployeeOrder
* @see app/Http/Controllers/OrderEmployeeController.php:87
* @route '/order-employees/check-assignment'
*/
checkEmployeeOrder.url = (options?: RouteQueryOptions) => {
    return checkEmployeeOrder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::checkEmployeeOrder
* @see app/Http/Controllers/OrderEmployeeController.php:87
* @route '/order-employees/check-assignment'
*/
checkEmployeeOrder.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkEmployeeOrder.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::checkEmployeeOrder
* @see app/Http/Controllers/OrderEmployeeController.php:87
* @route '/order-employees/check-assignment'
*/
checkEmployeeOrder.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkEmployeeOrder.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::checkEmployeeOrder
* @see app/Http/Controllers/OrderEmployeeController.php:87
* @route '/order-employees/check-assignment'
*/
const checkEmployeeOrderForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkEmployeeOrder.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::checkEmployeeOrder
* @see app/Http/Controllers/OrderEmployeeController.php:87
* @route '/order-employees/check-assignment'
*/
checkEmployeeOrderForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkEmployeeOrder.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::checkEmployeeOrder
* @see app/Http/Controllers/OrderEmployeeController.php:87
* @route '/order-employees/check-assignment'
*/
checkEmployeeOrderForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkEmployeeOrder.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

checkEmployeeOrder.form = checkEmployeeOrderForm

/**
* @see \App\Http\Controllers\OrderEmployeeController::index
* @see app/Http/Controllers/OrderEmployeeController.php:25
* @route '/order-employees'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/order-employees',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderEmployeeController::index
* @see app/Http/Controllers/OrderEmployeeController.php:25
* @route '/order-employees'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::index
* @see app/Http/Controllers/OrderEmployeeController.php:25
* @route '/order-employees'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::index
* @see app/Http/Controllers/OrderEmployeeController.php:25
* @route '/order-employees'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::index
* @see app/Http/Controllers/OrderEmployeeController.php:25
* @route '/order-employees'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::index
* @see app/Http/Controllers/OrderEmployeeController.php:25
* @route '/order-employees'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::index
* @see app/Http/Controllers/OrderEmployeeController.php:25
* @route '/order-employees'
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
* @see \App\Http\Controllers\OrderEmployeeController::create
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/order-employees/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderEmployeeController::create
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::create
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::create
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::create
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::create
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::create
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/create'
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
* @see \App\Http\Controllers\OrderEmployeeController::store
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/order-employees',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderEmployeeController::store
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::store
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::store
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::store
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\OrderEmployeeController::show
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}'
*/
export const show = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/order-employees/{orderEmployee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderEmployeeController::show
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}'
*/
show.url = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { orderEmployee: args }
    }

    if (Array.isArray(args)) {
        args = {
            orderEmployee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        orderEmployee: args.orderEmployee,
    }

    return show.definition.url
            .replace('{orderEmployee}', parsedArgs.orderEmployee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::show
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}'
*/
show.get = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::show
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}'
*/
show.head = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::show
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}'
*/
const showForm = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::show
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}'
*/
showForm.get = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::show
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}'
*/
showForm.head = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OrderEmployeeController::edit
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}/edit'
*/
export const edit = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/order-employees/{orderEmployee}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderEmployeeController::edit
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}/edit'
*/
edit.url = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { orderEmployee: args }
    }

    if (Array.isArray(args)) {
        args = {
            orderEmployee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        orderEmployee: args.orderEmployee,
    }

    return edit.definition.url
            .replace('{orderEmployee}', parsedArgs.orderEmployee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::edit
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}/edit'
*/
edit.get = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::edit
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}/edit'
*/
edit.head = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::edit
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}/edit'
*/
const editForm = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::edit
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}/edit'
*/
editForm.get = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::edit
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}/edit'
*/
editForm.head = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OrderEmployeeController::update
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}'
*/
export const update = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/order-employees/{orderEmployee}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\OrderEmployeeController::update
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}'
*/
update.url = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { orderEmployee: args }
    }

    if (Array.isArray(args)) {
        args = {
            orderEmployee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        orderEmployee: args.orderEmployee,
    }

    return update.definition.url
            .replace('{orderEmployee}', parsedArgs.orderEmployee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::update
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}'
*/
update.put = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::update
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}'
*/
update.patch = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::update
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}'
*/
const updateForm = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::update
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}'
*/
updateForm.put = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::update
* @see app/Http/Controllers/OrderEmployeeController.php:0
* @route '/order-employees/{orderEmployee}'
*/
updateForm.patch = (args: { orderEmployee: string | number } | [orderEmployee: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\OrderEmployeeController::destroy
* @see app/Http/Controllers/OrderEmployeeController.php:129
* @route '/order-employees/{orderEmployee}'
*/
export const destroy = (args: { orderEmployee: string | { uuid: string } } | [orderEmployee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/order-employees/{orderEmployee}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OrderEmployeeController::destroy
* @see app/Http/Controllers/OrderEmployeeController.php:129
* @route '/order-employees/{orderEmployee}'
*/
destroy.url = (args: { orderEmployee: string | { uuid: string } } | [orderEmployee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { orderEmployee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { orderEmployee: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            orderEmployee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        orderEmployee: typeof args.orderEmployee === 'object'
        ? args.orderEmployee.uuid
        : args.orderEmployee,
    }

    return destroy.definition.url
            .replace('{orderEmployee}', parsedArgs.orderEmployee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::destroy
* @see app/Http/Controllers/OrderEmployeeController.php:129
* @route '/order-employees/{orderEmployee}'
*/
destroy.delete = (args: { orderEmployee: string | { uuid: string } } | [orderEmployee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::destroy
* @see app/Http/Controllers/OrderEmployeeController.php:129
* @route '/order-employees/{orderEmployee}'
*/
const destroyForm = (args: { orderEmployee: string | { uuid: string } } | [orderEmployee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::destroy
* @see app/Http/Controllers/OrderEmployeeController.php:129
* @route '/order-employees/{orderEmployee}'
*/
destroyForm.delete = (args: { orderEmployee: string | { uuid: string } } | [orderEmployee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const OrderEmployeeController = { manageOrder, getEmployeeAssignments, saveEmployeeAssignments, checkEmployeeOrder, index, create, store, show, edit, update, destroy }

export default OrderEmployeeController
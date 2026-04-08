import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\OrderEmployeeController::getAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:50
* @route '/order-employees/get-assignments'
*/
export const getAssignments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAssignments.url(options),
    method: 'get',
})

getAssignments.definition = {
    methods: ["get","head"],
    url: '/order-employees/get-assignments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderEmployeeController::getAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:50
* @route '/order-employees/get-assignments'
*/
getAssignments.url = (options?: RouteQueryOptions) => {
    return getAssignments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::getAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:50
* @route '/order-employees/get-assignments'
*/
getAssignments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAssignments.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::getAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:50
* @route '/order-employees/get-assignments'
*/
getAssignments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAssignments.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::saveAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:75
* @route '/order-employees/save-assignments'
*/
export const saveAssignments = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveAssignments.url(options),
    method: 'post',
})

saveAssignments.definition = {
    methods: ["post"],
    url: '/order-employees/save-assignments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderEmployeeController::saveAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:75
* @route '/order-employees/save-assignments'
*/
saveAssignments.url = (options?: RouteQueryOptions) => {
    return saveAssignments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::saveAssignments
* @see app/Http/Controllers/OrderEmployeeController.php:75
* @route '/order-employees/save-assignments'
*/
saveAssignments.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveAssignments.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::checkAssignment
* @see app/Http/Controllers/OrderEmployeeController.php:96
* @route '/order-employees/check-assignment'
*/
export const checkAssignment = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkAssignment.url(options),
    method: 'get',
})

checkAssignment.definition = {
    methods: ["get","head"],
    url: '/order-employees/check-assignment',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderEmployeeController::checkAssignment
* @see app/Http/Controllers/OrderEmployeeController.php:96
* @route '/order-employees/check-assignment'
*/
checkAssignment.url = (options?: RouteQueryOptions) => {
    return checkAssignment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::checkAssignment
* @see app/Http/Controllers/OrderEmployeeController.php:96
* @route '/order-employees/check-assignment'
*/
checkAssignment.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkAssignment.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::checkAssignment
* @see app/Http/Controllers/OrderEmployeeController.php:96
* @route '/order-employees/check-assignment'
*/
checkAssignment.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkAssignment.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::index
* @see app/Http/Controllers/OrderEmployeeController.php:26
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
* @see app/Http/Controllers/OrderEmployeeController.php:26
* @route '/order-employees'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::index
* @see app/Http/Controllers/OrderEmployeeController.php:26
* @route '/order-employees'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::index
* @see app/Http/Controllers/OrderEmployeeController.php:26
* @route '/order-employees'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

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
* @see \App\Http\Controllers\OrderEmployeeController::destroy
* @see app/Http/Controllers/OrderEmployeeController.php:146
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
* @see app/Http/Controllers/OrderEmployeeController.php:146
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
* @see app/Http/Controllers/OrderEmployeeController.php:146
* @route '/order-employees/{orderEmployee}'
*/
destroy.delete = (args: { orderEmployee: string | { uuid: string } } | [orderEmployee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const orderEmployees = {
    getAssignments: Object.assign(getAssignments, getAssignments),
    saveAssignments: Object.assign(saveAssignments, saveAssignments),
    checkAssignment: Object.assign(checkAssignment, checkAssignment),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default orderEmployees
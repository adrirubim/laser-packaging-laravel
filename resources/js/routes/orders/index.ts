import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\OrderController::productionAdvancements
* @see app/Http/Controllers/OrderController.php:197
* @route '/orders/production-advancements'
*/
export const productionAdvancements = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productionAdvancements.url(options),
    method: 'get',
})

productionAdvancements.definition = {
    methods: ["get","head"],
    url: '/orders/production-advancements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::productionAdvancements
* @see app/Http/Controllers/OrderController.php:197
* @route '/orders/production-advancements'
*/
productionAdvancements.url = (options?: RouteQueryOptions) => {
    return productionAdvancements.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::productionAdvancements
* @see app/Http/Controllers/OrderController.php:197
* @route '/orders/production-advancements'
*/
productionAdvancements.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productionAdvancements.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::productionAdvancements
* @see app/Http/Controllers/OrderController.php:197
* @route '/orders/production-advancements'
*/
productionAdvancements.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productionAdvancements.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::productionAdvancements
* @see app/Http/Controllers/OrderController.php:197
* @route '/orders/production-advancements'
*/
const productionAdvancementsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: productionAdvancements.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::productionAdvancements
* @see app/Http/Controllers/OrderController.php:197
* @route '/orders/production-advancements'
*/
productionAdvancementsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: productionAdvancements.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::productionAdvancements
* @see app/Http/Controllers/OrderController.php:197
* @route '/orders/production-advancements'
*/
productionAdvancementsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: productionAdvancements.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

productionAdvancements.form = productionAdvancementsForm

/**
* @see \App\Http\Controllers\OrderController::getShippingAddresses
* @see app/Http/Controllers/OrderController.php:213
* @route '/orders/get-shipping-addresses'
*/
export const getShippingAddresses = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getShippingAddresses.url(options),
    method: 'get',
})

getShippingAddresses.definition = {
    methods: ["get","head"],
    url: '/orders/get-shipping-addresses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::getShippingAddresses
* @see app/Http/Controllers/OrderController.php:213
* @route '/orders/get-shipping-addresses'
*/
getShippingAddresses.url = (options?: RouteQueryOptions) => {
    return getShippingAddresses.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::getShippingAddresses
* @see app/Http/Controllers/OrderController.php:213
* @route '/orders/get-shipping-addresses'
*/
getShippingAddresses.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getShippingAddresses.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::getShippingAddresses
* @see app/Http/Controllers/OrderController.php:213
* @route '/orders/get-shipping-addresses'
*/
getShippingAddresses.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getShippingAddresses.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::getShippingAddresses
* @see app/Http/Controllers/OrderController.php:213
* @route '/orders/get-shipping-addresses'
*/
const getShippingAddressesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getShippingAddresses.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::getShippingAddresses
* @see app/Http/Controllers/OrderController.php:213
* @route '/orders/get-shipping-addresses'
*/
getShippingAddressesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getShippingAddresses.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::getShippingAddresses
* @see app/Http/Controllers/OrderController.php:213
* @route '/orders/get-shipping-addresses'
*/
getShippingAddressesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getShippingAddresses.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getShippingAddresses.form = getShippingAddressesForm

/**
* @see \App\Http\Controllers\OrderEmployeeController::manageEmployees
* @see app/Http/Controllers/OrderEmployeeController.php:105
* @route '/orders/{order}/manage-employees'
*/
export const manageEmployees = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageEmployees.url(args, options),
    method: 'get',
})

manageEmployees.definition = {
    methods: ["get","head"],
    url: '/orders/{order}/manage-employees',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderEmployeeController::manageEmployees
* @see app/Http/Controllers/OrderEmployeeController.php:105
* @route '/orders/{order}/manage-employees'
*/
manageEmployees.url = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return manageEmployees.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderEmployeeController::manageEmployees
* @see app/Http/Controllers/OrderEmployeeController.php:105
* @route '/orders/{order}/manage-employees'
*/
manageEmployees.get = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageEmployees.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::manageEmployees
* @see app/Http/Controllers/OrderEmployeeController.php:105
* @route '/orders/{order}/manage-employees'
*/
manageEmployees.head = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manageEmployees.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::manageEmployees
* @see app/Http/Controllers/OrderEmployeeController.php:105
* @route '/orders/{order}/manage-employees'
*/
const manageEmployeesForm = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageEmployees.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::manageEmployees
* @see app/Http/Controllers/OrderEmployeeController.php:105
* @route '/orders/{order}/manage-employees'
*/
manageEmployeesForm.get = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageEmployees.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderEmployeeController::manageEmployees
* @see app/Http/Controllers/OrderEmployeeController.php:105
* @route '/orders/{order}/manage-employees'
*/
manageEmployeesForm.head = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageEmployees.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

manageEmployees.form = manageEmployeesForm

/**
* @see \App\Http\Controllers\OrderController::manageStatus
* @see app/Http/Controllers/OrderController.php:229
* @route '/orders/{order}/manage-status'
*/
export const manageStatus = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageStatus.url(args, options),
    method: 'get',
})

manageStatus.definition = {
    methods: ["get","head"],
    url: '/orders/{order}/manage-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::manageStatus
* @see app/Http/Controllers/OrderController.php:229
* @route '/orders/{order}/manage-status'
*/
manageStatus.url = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return manageStatus.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::manageStatus
* @see app/Http/Controllers/OrderController.php:229
* @route '/orders/{order}/manage-status'
*/
manageStatus.get = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: manageStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::manageStatus
* @see app/Http/Controllers/OrderController.php:229
* @route '/orders/{order}/manage-status'
*/
manageStatus.head = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: manageStatus.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::manageStatus
* @see app/Http/Controllers/OrderController.php:229
* @route '/orders/{order}/manage-status'
*/
const manageStatusForm = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::manageStatus
* @see app/Http/Controllers/OrderController.php:229
* @route '/orders/{order}/manage-status'
*/
manageStatusForm.get = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::manageStatus
* @see app/Http/Controllers/OrderController.php:229
* @route '/orders/{order}/manage-status'
*/
manageStatusForm.head = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: manageStatus.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

manageStatus.form = manageStatusForm

/**
* @see \App\Http\Controllers\OrderController::saveSemaforo
* @see app/Http/Controllers/OrderController.php:259
* @route '/orders/{order}/save-semaforo'
*/
export const saveSemaforo = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveSemaforo.url(args, options),
    method: 'post',
})

saveSemaforo.definition = {
    methods: ["post"],
    url: '/orders/{order}/save-semaforo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderController::saveSemaforo
* @see app/Http/Controllers/OrderController.php:259
* @route '/orders/{order}/save-semaforo'
*/
saveSemaforo.url = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return saveSemaforo.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::saveSemaforo
* @see app/Http/Controllers/OrderController.php:259
* @route '/orders/{order}/save-semaforo'
*/
saveSemaforo.post = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: saveSemaforo.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::saveSemaforo
* @see app/Http/Controllers/OrderController.php:259
* @route '/orders/{order}/save-semaforo'
*/
const saveSemaforoForm = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveSemaforo.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::saveSemaforo
* @see app/Http/Controllers/OrderController.php:259
* @route '/orders/{order}/save-semaforo'
*/
saveSemaforoForm.post = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: saveSemaforo.url(args, options),
    method: 'post',
})

saveSemaforo.form = saveSemaforoForm

/**
* @see \App\Http\Controllers\OrderController::changeStatus
* @see app/Http/Controllers/OrderController.php:299
* @route '/orders/{order}/change-status'
*/
export const changeStatus = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: changeStatus.url(args, options),
    method: 'post',
})

changeStatus.definition = {
    methods: ["post"],
    url: '/orders/{order}/change-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderController::changeStatus
* @see app/Http/Controllers/OrderController.php:299
* @route '/orders/{order}/change-status'
*/
changeStatus.url = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return changeStatus.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::changeStatus
* @see app/Http/Controllers/OrderController.php:299
* @route '/orders/{order}/change-status'
*/
changeStatus.post = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: changeStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::changeStatus
* @see app/Http/Controllers/OrderController.php:299
* @route '/orders/{order}/change-status'
*/
const changeStatusForm = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: changeStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::changeStatus
* @see app/Http/Controllers/OrderController.php:299
* @route '/orders/{order}/change-status'
*/
changeStatusForm.post = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: changeStatus.url(args, options),
    method: 'post',
})

changeStatus.form = changeStatusForm

/**
* @see \App\Http\Controllers\OrderController::downloadBarcode
* @see app/Http/Controllers/OrderController.php:383
* @route '/orders/{order}/download-barcode'
*/
export const downloadBarcode = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBarcode.url(args, options),
    method: 'get',
})

downloadBarcode.definition = {
    methods: ["get","head"],
    url: '/orders/{order}/download-barcode',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::downloadBarcode
* @see app/Http/Controllers/OrderController.php:383
* @route '/orders/{order}/download-barcode'
*/
downloadBarcode.url = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return downloadBarcode.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::downloadBarcode
* @see app/Http/Controllers/OrderController.php:383
* @route '/orders/{order}/download-barcode'
*/
downloadBarcode.get = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBarcode.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::downloadBarcode
* @see app/Http/Controllers/OrderController.php:383
* @route '/orders/{order}/download-barcode'
*/
downloadBarcode.head = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadBarcode.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::downloadBarcode
* @see app/Http/Controllers/OrderController.php:383
* @route '/orders/{order}/download-barcode'
*/
const downloadBarcodeForm = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadBarcode.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::downloadBarcode
* @see app/Http/Controllers/OrderController.php:383
* @route '/orders/{order}/download-barcode'
*/
downloadBarcodeForm.get = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadBarcode.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::downloadBarcode
* @see app/Http/Controllers/OrderController.php:383
* @route '/orders/{order}/download-barcode'
*/
downloadBarcodeForm.head = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadBarcode.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadBarcode.form = downloadBarcodeForm

/**
* @see \App\Http\Controllers\OrderController::downloadAutocontrollo
* @see app/Http/Controllers/OrderController.php:459
* @route '/orders/{order}/download-autocontrollo'
*/
export const downloadAutocontrollo = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAutocontrollo.url(args, options),
    method: 'get',
})

downloadAutocontrollo.definition = {
    methods: ["get","head"],
    url: '/orders/{order}/download-autocontrollo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::downloadAutocontrollo
* @see app/Http/Controllers/OrderController.php:459
* @route '/orders/{order}/download-autocontrollo'
*/
downloadAutocontrollo.url = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return downloadAutocontrollo.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::downloadAutocontrollo
* @see app/Http/Controllers/OrderController.php:459
* @route '/orders/{order}/download-autocontrollo'
*/
downloadAutocontrollo.get = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadAutocontrollo.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::downloadAutocontrollo
* @see app/Http/Controllers/OrderController.php:459
* @route '/orders/{order}/download-autocontrollo'
*/
downloadAutocontrollo.head = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadAutocontrollo.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::downloadAutocontrollo
* @see app/Http/Controllers/OrderController.php:459
* @route '/orders/{order}/download-autocontrollo'
*/
const downloadAutocontrolloForm = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadAutocontrollo.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::downloadAutocontrollo
* @see app/Http/Controllers/OrderController.php:459
* @route '/orders/{order}/download-autocontrollo'
*/
downloadAutocontrolloForm.get = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadAutocontrollo.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::downloadAutocontrollo
* @see app/Http/Controllers/OrderController.php:459
* @route '/orders/{order}/download-autocontrollo'
*/
downloadAutocontrolloForm.head = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadAutocontrollo.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadAutocontrollo.form = downloadAutocontrolloForm

/**
* @see \App\Http\Controllers\OrderController::index
* @see app/Http/Controllers/OrderController.php:52
* @route '/orders'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::index
* @see app/Http/Controllers/OrderController.php:52
* @route '/orders'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::index
* @see app/Http/Controllers/OrderController.php:52
* @route '/orders'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::index
* @see app/Http/Controllers/OrderController.php:52
* @route '/orders'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::index
* @see app/Http/Controllers/OrderController.php:52
* @route '/orders'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::index
* @see app/Http/Controllers/OrderController.php:52
* @route '/orders'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::index
* @see app/Http/Controllers/OrderController.php:52
* @route '/orders'
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
* @see \App\Http\Controllers\OrderController::create
* @see app/Http/Controllers/OrderController.php:69
* @route '/orders/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/orders/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::create
* @see app/Http/Controllers/OrderController.php:69
* @route '/orders/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::create
* @see app/Http/Controllers/OrderController.php:69
* @route '/orders/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::create
* @see app/Http/Controllers/OrderController.php:69
* @route '/orders/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::create
* @see app/Http/Controllers/OrderController.php:69
* @route '/orders/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::create
* @see app/Http/Controllers/OrderController.php:69
* @route '/orders/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::create
* @see app/Http/Controllers/OrderController.php:69
* @route '/orders/create'
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
* @see \App\Http\Controllers\OrderController::store
* @see app/Http/Controllers/OrderController.php:103
* @route '/orders'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/orders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderController::store
* @see app/Http/Controllers/OrderController.php:103
* @route '/orders'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::store
* @see app/Http/Controllers/OrderController.php:103
* @route '/orders'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::store
* @see app/Http/Controllers/OrderController.php:103
* @route '/orders'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::store
* @see app/Http/Controllers/OrderController.php:103
* @route '/orders'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\OrderController::show
* @see app/Http/Controllers/OrderController.php:121
* @route '/orders/{order}'
*/
export const show = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/orders/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::show
* @see app/Http/Controllers/OrderController.php:121
* @route '/orders/{order}'
*/
show.url = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::show
* @see app/Http/Controllers/OrderController.php:121
* @route '/orders/{order}'
*/
show.get = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::show
* @see app/Http/Controllers/OrderController.php:121
* @route '/orders/{order}'
*/
show.head = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::show
* @see app/Http/Controllers/OrderController.php:121
* @route '/orders/{order}'
*/
const showForm = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::show
* @see app/Http/Controllers/OrderController.php:121
* @route '/orders/{order}'
*/
showForm.get = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::show
* @see app/Http/Controllers/OrderController.php:121
* @route '/orders/{order}'
*/
showForm.head = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OrderController::edit
* @see app/Http/Controllers/OrderController.php:145
* @route '/orders/{order}/edit'
*/
export const edit = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/orders/{order}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::edit
* @see app/Http/Controllers/OrderController.php:145
* @route '/orders/{order}/edit'
*/
edit.url = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::edit
* @see app/Http/Controllers/OrderController.php:145
* @route '/orders/{order}/edit'
*/
edit.get = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::edit
* @see app/Http/Controllers/OrderController.php:145
* @route '/orders/{order}/edit'
*/
edit.head = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::edit
* @see app/Http/Controllers/OrderController.php:145
* @route '/orders/{order}/edit'
*/
const editForm = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::edit
* @see app/Http/Controllers/OrderController.php:145
* @route '/orders/{order}/edit'
*/
editForm.get = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::edit
* @see app/Http/Controllers/OrderController.php:145
* @route '/orders/{order}/edit'
*/
editForm.head = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OrderController::update
* @see app/Http/Controllers/OrderController.php:171
* @route '/orders/{order}'
*/
export const update = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/orders/{order}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\OrderController::update
* @see app/Http/Controllers/OrderController.php:171
* @route '/orders/{order}'
*/
update.url = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::update
* @see app/Http/Controllers/OrderController.php:171
* @route '/orders/{order}'
*/
update.put = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\OrderController::update
* @see app/Http/Controllers/OrderController.php:171
* @route '/orders/{order}'
*/
update.patch = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\OrderController::update
* @see app/Http/Controllers/OrderController.php:171
* @route '/orders/{order}'
*/
const updateForm = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::update
* @see app/Http/Controllers/OrderController.php:171
* @route '/orders/{order}'
*/
updateForm.put = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::update
* @see app/Http/Controllers/OrderController.php:171
* @route '/orders/{order}'
*/
updateForm.patch = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\OrderController::destroy
* @see app/Http/Controllers/OrderController.php:186
* @route '/orders/{order}'
*/
export const destroy = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/orders/{order}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OrderController::destroy
* @see app/Http/Controllers/OrderController.php:186
* @route '/orders/{order}'
*/
destroy.url = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::destroy
* @see app/Http/Controllers/OrderController.php:186
* @route '/orders/{order}'
*/
destroy.delete = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\OrderController::destroy
* @see app/Http/Controllers/OrderController.php:186
* @route '/orders/{order}'
*/
const destroyForm = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::destroy
* @see app/Http/Controllers/OrderController.php:186
* @route '/orders/{order}'
*/
destroyForm.delete = (args: { order: string | { uuid: string } } | [order: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const orders = {
    productionAdvancements: Object.assign(productionAdvancements, productionAdvancements),
    getShippingAddresses: Object.assign(getShippingAddresses, getShippingAddresses),
    manageEmployees: Object.assign(manageEmployees, manageEmployees),
    manageStatus: Object.assign(manageStatus, manageStatus),
    saveSemaforo: Object.assign(saveSemaforo, saveSemaforo),
    changeStatus: Object.assign(changeStatus, changeStatus),
    downloadBarcode: Object.assign(downloadBarcode, downloadBarcode),
    downloadAutocontrollo: Object.assign(downloadAutocontrollo, downloadAutocontrollo),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default orders
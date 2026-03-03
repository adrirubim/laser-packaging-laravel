import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeController::contracts
* @see app/Http/Controllers/EmployeeController.php:286
* @route '/employees/{employee}/contracts'
*/
export const contracts = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contracts.url(args, options),
    method: 'get',
})

contracts.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}/contracts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::contracts
* @see app/Http/Controllers/EmployeeController.php:286
* @route '/employees/{employee}/contracts'
*/
contracts.url = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { employee: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            employee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.uuid
        : args.employee,
    }

    return contracts.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::contracts
* @see app/Http/Controllers/EmployeeController.php:286
* @route '/employees/{employee}/contracts'
*/
contracts.get = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contracts.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::contracts
* @see app/Http/Controllers/EmployeeController.php:286
* @route '/employees/{employee}/contracts'
*/
contracts.head = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contracts.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployeeController::contracts
* @see app/Http/Controllers/EmployeeController.php:286
* @route '/employees/{employee}/contracts'
*/
const contractsForm = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: contracts.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::contracts
* @see app/Http/Controllers/EmployeeController.php:286
* @route '/employees/{employee}/contracts'
*/
contractsForm.get = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: contracts.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::contracts
* @see app/Http/Controllers/EmployeeController.php:286
* @route '/employees/{employee}/contracts'
*/
contractsForm.head = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: contracts.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

contracts.form = contractsForm

/**
* @see \App\Http\Controllers\EmployeeController::downloadBarcode
* @see app/Http/Controllers/EmployeeController.php:477
* @route '/employees/{employee}/download-barcode'
*/
export const downloadBarcode = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBarcode.url(args, options),
    method: 'get',
})

downloadBarcode.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}/download-barcode',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::downloadBarcode
* @see app/Http/Controllers/EmployeeController.php:477
* @route '/employees/{employee}/download-barcode'
*/
downloadBarcode.url = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { employee: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            employee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.uuid
        : args.employee,
    }

    return downloadBarcode.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::downloadBarcode
* @see app/Http/Controllers/EmployeeController.php:477
* @route '/employees/{employee}/download-barcode'
*/
downloadBarcode.get = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBarcode.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::downloadBarcode
* @see app/Http/Controllers/EmployeeController.php:477
* @route '/employees/{employee}/download-barcode'
*/
downloadBarcode.head = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadBarcode.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployeeController::downloadBarcode
* @see app/Http/Controllers/EmployeeController.php:477
* @route '/employees/{employee}/download-barcode'
*/
const downloadBarcodeForm = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadBarcode.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::downloadBarcode
* @see app/Http/Controllers/EmployeeController.php:477
* @route '/employees/{employee}/download-barcode'
*/
downloadBarcodeForm.get = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadBarcode.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::downloadBarcode
* @see app/Http/Controllers/EmployeeController.php:477
* @route '/employees/{employee}/download-barcode'
*/
downloadBarcodeForm.head = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeController::updatePassword
* @see app/Http/Controllers/EmployeeController.php:158
* @route '/employees/{employee}/update-password'
*/
export const updatePassword = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePassword.url(args, options),
    method: 'put',
})

updatePassword.definition = {
    methods: ["put"],
    url: '/employees/{employee}/update-password',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeeController::updatePassword
* @see app/Http/Controllers/EmployeeController.php:158
* @route '/employees/{employee}/update-password'
*/
updatePassword.url = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { employee: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            employee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.uuid
        : args.employee,
    }

    return updatePassword.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::updatePassword
* @see app/Http/Controllers/EmployeeController.php:158
* @route '/employees/{employee}/update-password'
*/
updatePassword.put = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePassword.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\EmployeeController::updatePassword
* @see app/Http/Controllers/EmployeeController.php:158
* @route '/employees/{employee}/update-password'
*/
const updatePasswordForm = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePassword.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployeeController::updatePassword
* @see app/Http/Controllers/EmployeeController.php:158
* @route '/employees/{employee}/update-password'
*/
updatePasswordForm.put = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePassword.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updatePassword.form = updatePasswordForm

/**
* @see \App\Http\Controllers\EmployeeController::storeContract
* @see app/Http/Controllers/EmployeeController.php:417
* @route '/employees/{employee}/store-contract'
*/
export const storeContract = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeContract.url(args, options),
    method: 'post',
})

storeContract.definition = {
    methods: ["post"],
    url: '/employees/{employee}/store-contract',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::storeContract
* @see app/Http/Controllers/EmployeeController.php:417
* @route '/employees/{employee}/store-contract'
*/
storeContract.url = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { employee: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            employee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.uuid
        : args.employee,
    }

    return storeContract.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::storeContract
* @see app/Http/Controllers/EmployeeController.php:417
* @route '/employees/{employee}/store-contract'
*/
storeContract.post = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeContract.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployeeController::storeContract
* @see app/Http/Controllers/EmployeeController.php:417
* @route '/employees/{employee}/store-contract'
*/
const storeContractForm = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeContract.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployeeController::storeContract
* @see app/Http/Controllers/EmployeeController.php:417
* @route '/employees/{employee}/store-contract'
*/
storeContractForm.post = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeContract.url(args, options),
    method: 'post',
})

storeContract.form = storeContractForm

/**
* @see \App\Http\Controllers\EmployeeController::updateContract
* @see app/Http/Controllers/EmployeeController.php:437
* @route '/employees/{employee}/contracts/{contract}'
*/
export const updateContract = (args: { employee: string | { uuid: string }, contract: string | { uuid: string } } | [employee: string | { uuid: string }, contract: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateContract.url(args, options),
    method: 'put',
})

updateContract.definition = {
    methods: ["put"],
    url: '/employees/{employee}/contracts/{contract}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeeController::updateContract
* @see app/Http/Controllers/EmployeeController.php:437
* @route '/employees/{employee}/contracts/{contract}'
*/
updateContract.url = (args: { employee: string | { uuid: string }, contract: string | { uuid: string } } | [employee: string | { uuid: string }, contract: string | { uuid: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            employee: args[0],
            contract: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.uuid
        : args.employee,
        contract: typeof args.contract === 'object'
        ? args.contract.uuid
        : args.contract,
    }

    return updateContract.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{contract}', parsedArgs.contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::updateContract
* @see app/Http/Controllers/EmployeeController.php:437
* @route '/employees/{employee}/contracts/{contract}'
*/
updateContract.put = (args: { employee: string | { uuid: string }, contract: string | { uuid: string } } | [employee: string | { uuid: string }, contract: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateContract.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\EmployeeController::updateContract
* @see app/Http/Controllers/EmployeeController.php:437
* @route '/employees/{employee}/contracts/{contract}'
*/
const updateContractForm = (args: { employee: string | { uuid: string }, contract: string | { uuid: string } } | [employee: string | { uuid: string }, contract: string | { uuid: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateContract.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployeeController::updateContract
* @see app/Http/Controllers/EmployeeController.php:437
* @route '/employees/{employee}/contracts/{contract}'
*/
updateContractForm.put = (args: { employee: string | { uuid: string }, contract: string | { uuid: string } } | [employee: string | { uuid: string }, contract: string | { uuid: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateContract.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateContract.form = updateContractForm

/**
* @see \App\Http\Controllers\EmployeeController::destroyContract
* @see app/Http/Controllers/EmployeeController.php:462
* @route '/employees/{employee}/contracts/{contract}'
*/
export const destroyContract = (args: { employee: string | { uuid: string }, contract: string | { uuid: string } } | [employee: string | { uuid: string }, contract: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyContract.url(args, options),
    method: 'delete',
})

destroyContract.definition = {
    methods: ["delete"],
    url: '/employees/{employee}/contracts/{contract}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeController::destroyContract
* @see app/Http/Controllers/EmployeeController.php:462
* @route '/employees/{employee}/contracts/{contract}'
*/
destroyContract.url = (args: { employee: string | { uuid: string }, contract: string | { uuid: string } } | [employee: string | { uuid: string }, contract: string | { uuid: string } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            employee: args[0],
            contract: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.uuid
        : args.employee,
        contract: typeof args.contract === 'object'
        ? args.contract.uuid
        : args.contract,
    }

    return destroyContract.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{contract}', parsedArgs.contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::destroyContract
* @see app/Http/Controllers/EmployeeController.php:462
* @route '/employees/{employee}/contracts/{contract}'
*/
destroyContract.delete = (args: { employee: string | { uuid: string }, contract: string | { uuid: string } } | [employee: string | { uuid: string }, contract: string | { uuid: string } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyContract.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\EmployeeController::destroyContract
* @see app/Http/Controllers/EmployeeController.php:462
* @route '/employees/{employee}/contracts/{contract}'
*/
const destroyContractForm = (args: { employee: string | { uuid: string }, contract: string | { uuid: string } } | [employee: string | { uuid: string }, contract: string | { uuid: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyContract.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployeeController::destroyContract
* @see app/Http/Controllers/EmployeeController.php:462
* @route '/employees/{employee}/contracts/{contract}'
*/
destroyContractForm.delete = (args: { employee: string | { uuid: string }, contract: string | { uuid: string } } | [employee: string | { uuid: string }, contract: string | { uuid: string } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyContract.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyContract.form = destroyContractForm

/**
* @see \App\Http\Controllers\EmployeeController::togglePortal
* @see app/Http/Controllers/EmployeeController.php:184
* @route '/employees/{employee}/toggle-portal'
*/
export const togglePortal = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: togglePortal.url(args, options),
    method: 'post',
})

togglePortal.definition = {
    methods: ["post"],
    url: '/employees/{employee}/toggle-portal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::togglePortal
* @see app/Http/Controllers/EmployeeController.php:184
* @route '/employees/{employee}/toggle-portal'
*/
togglePortal.url = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { employee: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            employee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.uuid
        : args.employee,
    }

    return togglePortal.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::togglePortal
* @see app/Http/Controllers/EmployeeController.php:184
* @route '/employees/{employee}/toggle-portal'
*/
togglePortal.post = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: togglePortal.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployeeController::togglePortal
* @see app/Http/Controllers/EmployeeController.php:184
* @route '/employees/{employee}/toggle-portal'
*/
const togglePortalForm = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: togglePortal.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployeeController::togglePortal
* @see app/Http/Controllers/EmployeeController.php:184
* @route '/employees/{employee}/toggle-portal'
*/
togglePortalForm.post = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: togglePortal.url(args, options),
    method: 'post',
})

togglePortal.form = togglePortalForm

/**
* @see \App\Http\Controllers\EmployeeController::index
* @see app/Http/Controllers/EmployeeController.php:22
* @route '/employees'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employees',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::index
* @see app/Http/Controllers/EmployeeController.php:22
* @route '/employees'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::index
* @see app/Http/Controllers/EmployeeController.php:22
* @route '/employees'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::index
* @see app/Http/Controllers/EmployeeController.php:22
* @route '/employees'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployeeController::index
* @see app/Http/Controllers/EmployeeController.php:22
* @route '/employees'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::index
* @see app/Http/Controllers/EmployeeController.php:22
* @route '/employees'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::index
* @see app/Http/Controllers/EmployeeController.php:22
* @route '/employees'
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
* @see \App\Http\Controllers\EmployeeController::create
* @see app/Http/Controllers/EmployeeController.php:70
* @route '/employees/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/employees/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::create
* @see app/Http/Controllers/EmployeeController.php:70
* @route '/employees/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::create
* @see app/Http/Controllers/EmployeeController.php:70
* @route '/employees/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::create
* @see app/Http/Controllers/EmployeeController.php:70
* @route '/employees/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployeeController::create
* @see app/Http/Controllers/EmployeeController.php:70
* @route '/employees/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::create
* @see app/Http/Controllers/EmployeeController.php:70
* @route '/employees/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::create
* @see app/Http/Controllers/EmployeeController.php:70
* @route '/employees/create'
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
* @see \App\Http\Controllers\EmployeeController::store
* @see app/Http/Controllers/EmployeeController.php:78
* @route '/employees'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employees',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::store
* @see app/Http/Controllers/EmployeeController.php:78
* @route '/employees'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::store
* @see app/Http/Controllers/EmployeeController.php:78
* @route '/employees'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployeeController::store
* @see app/Http/Controllers/EmployeeController.php:78
* @route '/employees'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployeeController::store
* @see app/Http/Controllers/EmployeeController.php:78
* @route '/employees'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\EmployeeController::show
* @see app/Http/Controllers/EmployeeController.php:95
* @route '/employees/{employee}'
*/
export const show = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::show
* @see app/Http/Controllers/EmployeeController.php:95
* @route '/employees/{employee}'
*/
show.url = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { employee: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            employee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.uuid
        : args.employee,
    }

    return show.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::show
* @see app/Http/Controllers/EmployeeController.php:95
* @route '/employees/{employee}'
*/
show.get = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::show
* @see app/Http/Controllers/EmployeeController.php:95
* @route '/employees/{employee}'
*/
show.head = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployeeController::show
* @see app/Http/Controllers/EmployeeController.php:95
* @route '/employees/{employee}'
*/
const showForm = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::show
* @see app/Http/Controllers/EmployeeController.php:95
* @route '/employees/{employee}'
*/
showForm.get = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::show
* @see app/Http/Controllers/EmployeeController.php:95
* @route '/employees/{employee}'
*/
showForm.head = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeController::edit
* @see app/Http/Controllers/EmployeeController.php:107
* @route '/employees/{employee}/edit'
*/
export const edit = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::edit
* @see app/Http/Controllers/EmployeeController.php:107
* @route '/employees/{employee}/edit'
*/
edit.url = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { employee: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            employee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.uuid
        : args.employee,
    }

    return edit.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::edit
* @see app/Http/Controllers/EmployeeController.php:107
* @route '/employees/{employee}/edit'
*/
edit.get = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::edit
* @see app/Http/Controllers/EmployeeController.php:107
* @route '/employees/{employee}/edit'
*/
edit.head = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmployeeController::edit
* @see app/Http/Controllers/EmployeeController.php:107
* @route '/employees/{employee}/edit'
*/
const editForm = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::edit
* @see app/Http/Controllers/EmployeeController.php:107
* @route '/employees/{employee}/edit'
*/
editForm.get = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmployeeController::edit
* @see app/Http/Controllers/EmployeeController.php:107
* @route '/employees/{employee}/edit'
*/
editForm.head = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeController::update
* @see app/Http/Controllers/EmployeeController.php:119
* @route '/employees/{employee}'
*/
export const update = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/employees/{employee}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EmployeeController::update
* @see app/Http/Controllers/EmployeeController.php:119
* @route '/employees/{employee}'
*/
update.url = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { employee: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            employee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.uuid
        : args.employee,
    }

    return update.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::update
* @see app/Http/Controllers/EmployeeController.php:119
* @route '/employees/{employee}'
*/
update.put = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\EmployeeController::update
* @see app/Http/Controllers/EmployeeController.php:119
* @route '/employees/{employee}'
*/
update.patch = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\EmployeeController::update
* @see app/Http/Controllers/EmployeeController.php:119
* @route '/employees/{employee}'
*/
const updateForm = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployeeController::update
* @see app/Http/Controllers/EmployeeController.php:119
* @route '/employees/{employee}'
*/
updateForm.put = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployeeController::update
* @see app/Http/Controllers/EmployeeController.php:119
* @route '/employees/{employee}'
*/
updateForm.patch = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmployeeController::destroy
* @see app/Http/Controllers/EmployeeController.php:139
* @route '/employees/{employee}'
*/
export const destroy = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employees/{employee}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeController::destroy
* @see app/Http/Controllers/EmployeeController.php:139
* @route '/employees/{employee}'
*/
destroy.url = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { employee: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            employee: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        employee: typeof args.employee === 'object'
        ? args.employee.uuid
        : args.employee,
    }

    return destroy.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::destroy
* @see app/Http/Controllers/EmployeeController.php:139
* @route '/employees/{employee}'
*/
destroy.delete = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\EmployeeController::destroy
* @see app/Http/Controllers/EmployeeController.php:139
* @route '/employees/{employee}'
*/
const destroyForm = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmployeeController::destroy
* @see app/Http/Controllers/EmployeeController.php:139
* @route '/employees/{employee}'
*/
destroyForm.delete = (args: { employee: string | { uuid: string } } | [employee: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const employees = {
    contracts: Object.assign(contracts, contracts),
    downloadBarcode: Object.assign(downloadBarcode, downloadBarcode),
    updatePassword: Object.assign(updatePassword, updatePassword),
    storeContract: Object.assign(storeContract, storeContract),
    updateContract: Object.assign(updateContract, updateContract),
    destroyContract: Object.assign(destroyContract, destroyContract),
    togglePortal: Object.assign(togglePortal, togglePortal),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default employees
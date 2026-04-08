import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PalletSheetController::downloadFile
* @see app/Http/Controllers/PalletSheetController.php:212
* @route '/articles/pallet-sheets/{palletSheet}/download-file'
*/
export const downloadFile = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadFile.url(args, options),
    method: 'get',
})

downloadFile.definition = {
    methods: ["get","head"],
    url: '/articles/pallet-sheets/{palletSheet}/download-file',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PalletSheetController::downloadFile
* @see app/Http/Controllers/PalletSheetController.php:212
* @route '/articles/pallet-sheets/{palletSheet}/download-file'
*/
downloadFile.url = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { palletSheet: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { palletSheet: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            palletSheet: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        palletSheet: typeof args.palletSheet === 'object'
        ? args.palletSheet.uuid
        : args.palletSheet,
    }

    return downloadFile.definition.url
            .replace('{palletSheet}', parsedArgs.palletSheet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PalletSheetController::downloadFile
* @see app/Http/Controllers/PalletSheetController.php:212
* @route '/articles/pallet-sheets/{palletSheet}/download-file'
*/
downloadFile.get = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadFile.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PalletSheetController::downloadFile
* @see app/Http/Controllers/PalletSheetController.php:212
* @route '/articles/pallet-sheets/{palletSheet}/download-file'
*/
downloadFile.head = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadFile.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PalletSheetController::index
* @see app/Http/Controllers/PalletSheetController.php:15
* @route '/articles/pallet-sheets'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/articles/pallet-sheets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PalletSheetController::index
* @see app/Http/Controllers/PalletSheetController.php:15
* @route '/articles/pallet-sheets'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PalletSheetController::index
* @see app/Http/Controllers/PalletSheetController.php:15
* @route '/articles/pallet-sheets'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PalletSheetController::index
* @see app/Http/Controllers/PalletSheetController.php:15
* @route '/articles/pallet-sheets'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PalletSheetController::create
* @see app/Http/Controllers/PalletSheetController.php:59
* @route '/articles/pallet-sheets/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/articles/pallet-sheets/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PalletSheetController::create
* @see app/Http/Controllers/PalletSheetController.php:59
* @route '/articles/pallet-sheets/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PalletSheetController::create
* @see app/Http/Controllers/PalletSheetController.php:59
* @route '/articles/pallet-sheets/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PalletSheetController::create
* @see app/Http/Controllers/PalletSheetController.php:59
* @route '/articles/pallet-sheets/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PalletSheetController::store
* @see app/Http/Controllers/PalletSheetController.php:67
* @route '/articles/pallet-sheets'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/articles/pallet-sheets',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PalletSheetController::store
* @see app/Http/Controllers/PalletSheetController.php:67
* @route '/articles/pallet-sheets'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PalletSheetController::store
* @see app/Http/Controllers/PalletSheetController.php:67
* @route '/articles/pallet-sheets'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PalletSheetController::show
* @see app/Http/Controllers/PalletSheetController.php:117
* @route '/articles/pallet-sheets/{palletSheet}'
*/
export const show = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/articles/pallet-sheets/{palletSheet}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PalletSheetController::show
* @see app/Http/Controllers/PalletSheetController.php:117
* @route '/articles/pallet-sheets/{palletSheet}'
*/
show.url = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { palletSheet: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { palletSheet: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            palletSheet: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        palletSheet: typeof args.palletSheet === 'object'
        ? args.palletSheet.uuid
        : args.palletSheet,
    }

    return show.definition.url
            .replace('{palletSheet}', parsedArgs.palletSheet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PalletSheetController::show
* @see app/Http/Controllers/PalletSheetController.php:117
* @route '/articles/pallet-sheets/{palletSheet}'
*/
show.get = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PalletSheetController::show
* @see app/Http/Controllers/PalletSheetController.php:117
* @route '/articles/pallet-sheets/{palletSheet}'
*/
show.head = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PalletSheetController::edit
* @see app/Http/Controllers/PalletSheetController.php:127
* @route '/articles/pallet-sheets/{palletSheet}/edit'
*/
export const edit = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/articles/pallet-sheets/{palletSheet}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PalletSheetController::edit
* @see app/Http/Controllers/PalletSheetController.php:127
* @route '/articles/pallet-sheets/{palletSheet}/edit'
*/
edit.url = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { palletSheet: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { palletSheet: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            palletSheet: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        palletSheet: typeof args.palletSheet === 'object'
        ? args.palletSheet.uuid
        : args.palletSheet,
    }

    return edit.definition.url
            .replace('{palletSheet}', parsedArgs.palletSheet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PalletSheetController::edit
* @see app/Http/Controllers/PalletSheetController.php:127
* @route '/articles/pallet-sheets/{palletSheet}/edit'
*/
edit.get = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PalletSheetController::edit
* @see app/Http/Controllers/PalletSheetController.php:127
* @route '/articles/pallet-sheets/{palletSheet}/edit'
*/
edit.head = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PalletSheetController::update
* @see app/Http/Controllers/PalletSheetController.php:137
* @route '/articles/pallet-sheets/{palletSheet}'
*/
export const update = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/articles/pallet-sheets/{palletSheet}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\PalletSheetController::update
* @see app/Http/Controllers/PalletSheetController.php:137
* @route '/articles/pallet-sheets/{palletSheet}'
*/
update.url = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { palletSheet: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { palletSheet: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            palletSheet: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        palletSheet: typeof args.palletSheet === 'object'
        ? args.palletSheet.uuid
        : args.palletSheet,
    }

    return update.definition.url
            .replace('{palletSheet}', parsedArgs.palletSheet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PalletSheetController::update
* @see app/Http/Controllers/PalletSheetController.php:137
* @route '/articles/pallet-sheets/{palletSheet}'
*/
update.put = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PalletSheetController::update
* @see app/Http/Controllers/PalletSheetController.php:137
* @route '/articles/pallet-sheets/{palletSheet}'
*/
update.patch = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\PalletSheetController::destroy
* @see app/Http/Controllers/PalletSheetController.php:200
* @route '/articles/pallet-sheets/{palletSheet}'
*/
export const destroy = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/articles/pallet-sheets/{palletSheet}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PalletSheetController::destroy
* @see app/Http/Controllers/PalletSheetController.php:200
* @route '/articles/pallet-sheets/{palletSheet}'
*/
destroy.url = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { palletSheet: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { palletSheet: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            palletSheet: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        palletSheet: typeof args.palletSheet === 'object'
        ? args.palletSheet.uuid
        : args.palletSheet,
    }

    return destroy.definition.url
            .replace('{palletSheet}', parsedArgs.palletSheet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PalletSheetController::destroy
* @see app/Http/Controllers/PalletSheetController.php:200
* @route '/articles/pallet-sheets/{palletSheet}'
*/
destroy.delete = (args: { palletSheet: string | { uuid: string } } | [palletSheet: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const palletSheets = {
    downloadFile: Object.assign(downloadFile, downloadFile),
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default palletSheets
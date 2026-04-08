import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CriticalIssueController::index
* @see app/Http/Controllers/CriticalIssueController.php:23
* @route '/critical-issues'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/critical-issues',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CriticalIssueController::index
* @see app/Http/Controllers/CriticalIssueController.php:23
* @route '/critical-issues'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CriticalIssueController::index
* @see app/Http/Controllers/CriticalIssueController.php:23
* @route '/critical-issues'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CriticalIssueController::index
* @see app/Http/Controllers/CriticalIssueController.php:23
* @route '/critical-issues'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CriticalIssueController::create
* @see app/Http/Controllers/CriticalIssueController.php:47
* @route '/critical-issues/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/critical-issues/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CriticalIssueController::create
* @see app/Http/Controllers/CriticalIssueController.php:47
* @route '/critical-issues/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CriticalIssueController::create
* @see app/Http/Controllers/CriticalIssueController.php:47
* @route '/critical-issues/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CriticalIssueController::create
* @see app/Http/Controllers/CriticalIssueController.php:47
* @route '/critical-issues/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CriticalIssueController::store
* @see app/Http/Controllers/CriticalIssueController.php:55
* @route '/critical-issues'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/critical-issues',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CriticalIssueController::store
* @see app/Http/Controllers/CriticalIssueController.php:55
* @route '/critical-issues'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CriticalIssueController::store
* @see app/Http/Controllers/CriticalIssueController.php:55
* @route '/critical-issues'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CriticalIssueController::show
* @see app/Http/Controllers/CriticalIssueController.php:73
* @route '/critical-issues/{criticalIssue}'
*/
export const show = (args: { criticalIssue: string | { uuid: string } } | [criticalIssue: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/critical-issues/{criticalIssue}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CriticalIssueController::show
* @see app/Http/Controllers/CriticalIssueController.php:73
* @route '/critical-issues/{criticalIssue}'
*/
show.url = (args: { criticalIssue: string | { uuid: string } } | [criticalIssue: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { criticalIssue: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { criticalIssue: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            criticalIssue: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        criticalIssue: typeof args.criticalIssue === 'object'
        ? args.criticalIssue.uuid
        : args.criticalIssue,
    }

    return show.definition.url
            .replace('{criticalIssue}', parsedArgs.criticalIssue.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CriticalIssueController::show
* @see app/Http/Controllers/CriticalIssueController.php:73
* @route '/critical-issues/{criticalIssue}'
*/
show.get = (args: { criticalIssue: string | { uuid: string } } | [criticalIssue: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CriticalIssueController::show
* @see app/Http/Controllers/CriticalIssueController.php:73
* @route '/critical-issues/{criticalIssue}'
*/
show.head = (args: { criticalIssue: string | { uuid: string } } | [criticalIssue: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CriticalIssueController::edit
* @see app/Http/Controllers/CriticalIssueController.php:85
* @route '/critical-issues/{criticalIssue}/edit'
*/
export const edit = (args: { criticalIssue: string | { uuid: string } } | [criticalIssue: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/critical-issues/{criticalIssue}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CriticalIssueController::edit
* @see app/Http/Controllers/CriticalIssueController.php:85
* @route '/critical-issues/{criticalIssue}/edit'
*/
edit.url = (args: { criticalIssue: string | { uuid: string } } | [criticalIssue: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { criticalIssue: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { criticalIssue: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            criticalIssue: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        criticalIssue: typeof args.criticalIssue === 'object'
        ? args.criticalIssue.uuid
        : args.criticalIssue,
    }

    return edit.definition.url
            .replace('{criticalIssue}', parsedArgs.criticalIssue.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CriticalIssueController::edit
* @see app/Http/Controllers/CriticalIssueController.php:85
* @route '/critical-issues/{criticalIssue}/edit'
*/
edit.get = (args: { criticalIssue: string | { uuid: string } } | [criticalIssue: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CriticalIssueController::edit
* @see app/Http/Controllers/CriticalIssueController.php:85
* @route '/critical-issues/{criticalIssue}/edit'
*/
edit.head = (args: { criticalIssue: string | { uuid: string } } | [criticalIssue: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CriticalIssueController::update
* @see app/Http/Controllers/CriticalIssueController.php:95
* @route '/critical-issues/{criticalIssue}'
*/
export const update = (args: { criticalIssue: string | { uuid: string } } | [criticalIssue: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/critical-issues/{criticalIssue}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CriticalIssueController::update
* @see app/Http/Controllers/CriticalIssueController.php:95
* @route '/critical-issues/{criticalIssue}'
*/
update.url = (args: { criticalIssue: string | { uuid: string } } | [criticalIssue: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { criticalIssue: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { criticalIssue: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            criticalIssue: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        criticalIssue: typeof args.criticalIssue === 'object'
        ? args.criticalIssue.uuid
        : args.criticalIssue,
    }

    return update.definition.url
            .replace('{criticalIssue}', parsedArgs.criticalIssue.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CriticalIssueController::update
* @see app/Http/Controllers/CriticalIssueController.php:95
* @route '/critical-issues/{criticalIssue}'
*/
update.put = (args: { criticalIssue: string | { uuid: string } } | [criticalIssue: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CriticalIssueController::update
* @see app/Http/Controllers/CriticalIssueController.php:95
* @route '/critical-issues/{criticalIssue}'
*/
update.patch = (args: { criticalIssue: string | { uuid: string } } | [criticalIssue: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\CriticalIssueController::destroy
* @see app/Http/Controllers/CriticalIssueController.php:110
* @route '/critical-issues/{criticalIssue}'
*/
export const destroy = (args: { criticalIssue: string | { uuid: string } } | [criticalIssue: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/critical-issues/{criticalIssue}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CriticalIssueController::destroy
* @see app/Http/Controllers/CriticalIssueController.php:110
* @route '/critical-issues/{criticalIssue}'
*/
destroy.url = (args: { criticalIssue: string | { uuid: string } } | [criticalIssue: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { criticalIssue: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { criticalIssue: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            criticalIssue: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        criticalIssue: typeof args.criticalIssue === 'object'
        ? args.criticalIssue.uuid
        : args.criticalIssue,
    }

    return destroy.definition.url
            .replace('{criticalIssue}', parsedArgs.criticalIssue.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CriticalIssueController::destroy
* @see app/Http/Controllers/CriticalIssueController.php:110
* @route '/critical-issues/{criticalIssue}'
*/
destroy.delete = (args: { criticalIssue: string | { uuid: string } } | [criticalIssue: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const criticalIssues = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    show: Object.assign(show, show),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default criticalIssues
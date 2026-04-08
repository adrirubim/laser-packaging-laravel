import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ArticleController::getLasCode
* @see app/Http/Controllers/ArticleController.php:549
* @route '/articles/get-las-code'
*/
export const getLasCode = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getLasCode.url(options),
    method: 'get',
})

getLasCode.definition = {
    methods: ["get","head"],
    url: '/articles/get-las-code',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleController::getLasCode
* @see app/Http/Controllers/ArticleController.php:549
* @route '/articles/get-las-code'
*/
getLasCode.url = (options?: RouteQueryOptions) => {
    return getLasCode.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleController::getLasCode
* @see app/Http/Controllers/ArticleController.php:549
* @route '/articles/get-las-code'
*/
getLasCode.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getLasCode.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleController::getLasCode
* @see app/Http/Controllers/ArticleController.php:549
* @route '/articles/get-las-code'
*/
getLasCode.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getLasCode.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleController::downloadLineLayoutFile
* @see app/Http/Controllers/ArticleController.php:611
* @route '/articles/{article}/download-line-layout'
*/
export const downloadLineLayoutFile = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadLineLayoutFile.url(args, options),
    method: 'get',
})

downloadLineLayoutFile.definition = {
    methods: ["get","head"],
    url: '/articles/{article}/download-line-layout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleController::downloadLineLayoutFile
* @see app/Http/Controllers/ArticleController.php:611
* @route '/articles/{article}/download-line-layout'
*/
downloadLineLayoutFile.url = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { article: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { article: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            article: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        article: typeof args.article === 'object'
        ? args.article.uuid
        : args.article,
    }

    return downloadLineLayoutFile.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleController::downloadLineLayoutFile
* @see app/Http/Controllers/ArticleController.php:611
* @route '/articles/{article}/download-line-layout'
*/
downloadLineLayoutFile.get = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadLineLayoutFile.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleController::downloadLineLayoutFile
* @see app/Http/Controllers/ArticleController.php:611
* @route '/articles/{article}/download-line-layout'
*/
downloadLineLayoutFile.head = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadLineLayoutFile.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleController::index
* @see app/Http/Controllers/ArticleController.php:54
* @route '/articles'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/articles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleController::index
* @see app/Http/Controllers/ArticleController.php:54
* @route '/articles'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleController::index
* @see app/Http/Controllers/ArticleController.php:54
* @route '/articles'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleController::index
* @see app/Http/Controllers/ArticleController.php:54
* @route '/articles'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleController::create
* @see app/Http/Controllers/ArticleController.php:106
* @route '/articles/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/articles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleController::create
* @see app/Http/Controllers/ArticleController.php:106
* @route '/articles/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleController::create
* @see app/Http/Controllers/ArticleController.php:106
* @route '/articles/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleController::create
* @see app/Http/Controllers/ArticleController.php:106
* @route '/articles/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleController::store
* @see app/Http/Controllers/ArticleController.php:195
* @route '/articles'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/articles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ArticleController::store
* @see app/Http/Controllers/ArticleController.php:195
* @route '/articles'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleController::store
* @see app/Http/Controllers/ArticleController.php:195
* @route '/articles'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ArticleController::show
* @see app/Http/Controllers/ArticleController.php:314
* @route '/articles/{article}'
*/
export const show = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/articles/{article}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleController::show
* @see app/Http/Controllers/ArticleController.php:314
* @route '/articles/{article}'
*/
show.url = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { article: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { article: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            article: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        article: typeof args.article === 'object'
        ? args.article.uuid
        : args.article,
    }

    return show.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleController::show
* @see app/Http/Controllers/ArticleController.php:314
* @route '/articles/{article}'
*/
show.get = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleController::show
* @see app/Http/Controllers/ArticleController.php:314
* @route '/articles/{article}'
*/
show.head = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleController::edit
* @see app/Http/Controllers/ArticleController.php:340
* @route '/articles/{article}/edit'
*/
export const edit = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/articles/{article}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ArticleController::edit
* @see app/Http/Controllers/ArticleController.php:340
* @route '/articles/{article}/edit'
*/
edit.url = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { article: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { article: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            article: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        article: typeof args.article === 'object'
        ? args.article.uuid
        : args.article,
    }

    return edit.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleController::edit
* @see app/Http/Controllers/ArticleController.php:340
* @route '/articles/{article}/edit'
*/
edit.get = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ArticleController::edit
* @see app/Http/Controllers/ArticleController.php:340
* @route '/articles/{article}/edit'
*/
edit.head = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ArticleController::update
* @see app/Http/Controllers/ArticleController.php:394
* @route '/articles/{article}'
*/
export const update = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/articles/{article}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ArticleController::update
* @see app/Http/Controllers/ArticleController.php:394
* @route '/articles/{article}'
*/
update.url = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { article: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { article: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            article: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        article: typeof args.article === 'object'
        ? args.article.uuid
        : args.article,
    }

    return update.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleController::update
* @see app/Http/Controllers/ArticleController.php:394
* @route '/articles/{article}'
*/
update.put = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ArticleController::update
* @see app/Http/Controllers/ArticleController.php:394
* @route '/articles/{article}'
*/
update.patch = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ArticleController::destroy
* @see app/Http/Controllers/ArticleController.php:524
* @route '/articles/{article}'
*/
export const destroy = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/articles/{article}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ArticleController::destroy
* @see app/Http/Controllers/ArticleController.php:524
* @route '/articles/{article}'
*/
destroy.url = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { article: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'uuid' in args) {
        args = { article: args.uuid }
    }

    if (Array.isArray(args)) {
        args = {
            article: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        article: typeof args.article === 'object'
        ? args.article.uuid
        : args.article,
    }

    return destroy.definition.url
            .replace('{article}', parsedArgs.article.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ArticleController::destroy
* @see app/Http/Controllers/ArticleController.php:524
* @route '/articles/{article}'
*/
destroy.delete = (args: { article: string | { uuid: string } } | [article: string | { uuid: string } ] | string | { uuid: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

const ArticleController = { getLasCode, downloadLineLayoutFile, index, create, store, show, edit, update, destroy }

export default ArticleController
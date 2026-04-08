import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see routes/api.php:65
* @route '/api/production/foglio-pallet/{uuid}/print'
*/
export const print = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/api/production/foglio-pallet/{uuid}/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/api.php:65
* @route '/api/production/foglio-pallet/{uuid}/print'
*/
print.url = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { uuid: args }
    }

    if (Array.isArray(args)) {
        args = {
            uuid: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        uuid: args.uuid,
    }

    return print.definition.url
            .replace('{uuid}', parsedArgs.uuid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see routes/api.php:65
* @route '/api/production/foglio-pallet/{uuid}/print'
*/
print.get = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

/**
* @see routes/api.php:65
* @route '/api/production/foglio-pallet/{uuid}/print'
*/
print.head = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(args, options),
    method: 'head',
})

const foglioPallet = {
    print: Object.assign(print, print),
}

export default foglioPallet
import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
import foglioPallet from './foglio-pallet'
/**
* @see \App\Http\Controllers\Api\ProductionPortalController::authenticate
* @see app/Http/Controllers/Api/ProductionPortalController.php:70
* @route '/api/production/authenticate'
*/
export const authenticate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: authenticate.url(options),
    method: 'post',
})

authenticate.definition = {
    methods: ["post"],
    url: '/api/production/authenticate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::authenticate
* @see app/Http/Controllers/Api/ProductionPortalController.php:70
* @route '/api/production/authenticate'
*/
authenticate.url = (options?: RouteQueryOptions) => {
    return authenticate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::authenticate
* @see app/Http/Controllers/Api/ProductionPortalController.php:70
* @route '/api/production/authenticate'
*/
authenticate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: authenticate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::login
* @see app/Http/Controllers/Api/ProductionPortalController.php:107
* @route '/api/production/login'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/api/production/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::login
* @see app/Http/Controllers/Api/ProductionPortalController.php:107
* @route '/api/production/login'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::login
* @see app/Http/Controllers/Api/ProductionPortalController.php:107
* @route '/api/production/login'
*/
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::checkToken
* @see app/Http/Controllers/Api/ProductionPortalController.php:164
* @route '/api/production/check-token'
*/
export const checkToken = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkToken.url(options),
    method: 'post',
})

checkToken.definition = {
    methods: ["post"],
    url: '/api/production/check-token',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::checkToken
* @see app/Http/Controllers/Api/ProductionPortalController.php:164
* @route '/api/production/check-token'
*/
checkToken.url = (options?: RouteQueryOptions) => {
    return checkToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::checkToken
* @see app/Http/Controllers/Api/ProductionPortalController.php:164
* @route '/api/production/check-token'
*/
checkToken.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkToken.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::addPalletQuantity
* @see app/Http/Controllers/Api/ProductionPortalController.php:199
* @route '/api/production/add-pallet-quantity'
*/
export const addPalletQuantity = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addPalletQuantity.url(options),
    method: 'post',
})

addPalletQuantity.definition = {
    methods: ["post"],
    url: '/api/production/add-pallet-quantity',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::addPalletQuantity
* @see app/Http/Controllers/Api/ProductionPortalController.php:199
* @route '/api/production/add-pallet-quantity'
*/
addPalletQuantity.url = (options?: RouteQueryOptions) => {
    return addPalletQuantity.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::addPalletQuantity
* @see app/Http/Controllers/Api/ProductionPortalController.php:199
* @route '/api/production/add-pallet-quantity'
*/
addPalletQuantity.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addPalletQuantity.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::addManualQuantity
* @see app/Http/Controllers/Api/ProductionPortalController.php:231
* @route '/api/production/add-manual-quantity'
*/
export const addManualQuantity = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addManualQuantity.url(options),
    method: 'post',
})

addManualQuantity.definition = {
    methods: ["post"],
    url: '/api/production/add-manual-quantity',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::addManualQuantity
* @see app/Http/Controllers/Api/ProductionPortalController.php:231
* @route '/api/production/add-manual-quantity'
*/
addManualQuantity.url = (options?: RouteQueryOptions) => {
    return addManualQuantity.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::addManualQuantity
* @see app/Http/Controllers/Api/ProductionPortalController.php:231
* @route '/api/production/add-manual-quantity'
*/
addManualQuantity.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addManualQuantity.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::suspendOrder
* @see app/Http/Controllers/Api/ProductionPortalController.php:268
* @route '/api/production/suspend-order'
*/
export const suspendOrder = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suspendOrder.url(options),
    method: 'post',
})

suspendOrder.definition = {
    methods: ["post"],
    url: '/api/production/suspend-order',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::suspendOrder
* @see app/Http/Controllers/Api/ProductionPortalController.php:268
* @route '/api/production/suspend-order'
*/
suspendOrder.url = (options?: RouteQueryOptions) => {
    return suspendOrder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::suspendOrder
* @see app/Http/Controllers/Api/ProductionPortalController.php:268
* @route '/api/production/suspend-order'
*/
suspendOrder.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suspendOrder.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::confirmAutocontrollo
* @see app/Http/Controllers/Api/ProductionPortalController.php:299
* @route '/api/production/confirm-autocontrollo'
*/
export const confirmAutocontrollo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmAutocontrollo.url(options),
    method: 'post',
})

confirmAutocontrollo.definition = {
    methods: ["post"],
    url: '/api/production/confirm-autocontrollo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::confirmAutocontrollo
* @see app/Http/Controllers/Api/ProductionPortalController.php:299
* @route '/api/production/confirm-autocontrollo'
*/
confirmAutocontrollo.url = (options?: RouteQueryOptions) => {
    return confirmAutocontrollo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::confirmAutocontrollo
* @see app/Http/Controllers/Api/ProductionPortalController.php:299
* @route '/api/production/confirm-autocontrollo'
*/
confirmAutocontrollo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmAutocontrollo.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::employeeOrderList
* @see app/Http/Controllers/Api/ProductionPortalController.php:330
* @route '/api/production/employee-order-list'
*/
export const employeeOrderList = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: employeeOrderList.url(options),
    method: 'post',
})

employeeOrderList.definition = {
    methods: ["post"],
    url: '/api/production/employee-order-list',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::employeeOrderList
* @see app/Http/Controllers/Api/ProductionPortalController.php:330
* @route '/api/production/employee-order-list'
*/
employeeOrderList.url = (options?: RouteQueryOptions) => {
    return employeeOrderList.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::employeeOrderList
* @see app/Http/Controllers/Api/ProductionPortalController.php:330
* @route '/api/production/employee-order-list'
*/
employeeOrderList.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: employeeOrderList.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::getInfo
* @see app/Http/Controllers/Api/ProductionPortalController.php:363
* @route '/api/production/get-info'
*/
export const getInfo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: getInfo.url(options),
    method: 'post',
})

getInfo.definition = {
    methods: ["post"],
    url: '/api/production/get-info',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::getInfo
* @see app/Http/Controllers/Api/ProductionPortalController.php:363
* @route '/api/production/get-info'
*/
getInfo.url = (options?: RouteQueryOptions) => {
    return getInfo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ProductionPortalController::getInfo
* @see app/Http/Controllers/Api/ProductionPortalController.php:363
* @route '/api/production/get-info'
*/
getInfo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: getInfo.url(options),
    method: 'post',
})

const production = {
    authenticate: Object.assign(authenticate, authenticate),
    login: Object.assign(login, login),
    checkToken: Object.assign(checkToken, checkToken),
    addPalletQuantity: Object.assign(addPalletQuantity, addPalletQuantity),
    addManualQuantity: Object.assign(addManualQuantity, addManualQuantity),
    suspendOrder: Object.assign(suspendOrder, suspendOrder),
    confirmAutocontrollo: Object.assign(confirmAutocontrollo, confirmAutocontrollo),
    employeeOrderList: Object.assign(employeeOrderList, employeeOrderList),
    getInfo: Object.assign(getInfo, getInfo),
    foglioPallet: Object.assign(foglioPallet, foglioPallet),
}

export default production
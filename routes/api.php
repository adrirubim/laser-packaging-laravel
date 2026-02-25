<?php

use App\Http\Controllers\Api\ProductionPortalController;
use App\Http\Controllers\Planning\PlanningController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Production Portal
|--------------------------------------------------------------------------
|
| Estas rutas son para el portal de producción, utilizadas por dispositivos
| móviles y lectores de códigos de barras. No requieren autenticación web
| tradicional, sino tokens generados por el sistema.
|
*/

Route::prefix('production')->group(function () {
    // Authentication
    Route::post('/authenticate', [ProductionPortalController::class, 'authenticate'])
        ->name('api.production.authenticate');

    Route::post('/login', [ProductionPortalController::class, 'login'])
        ->name('api.production.login');

    Route::post('/check-token', [ProductionPortalController::class, 'checkToken'])
        ->name('api.production.check-token');

    // Order processing (requires token - validation in controller)
    // Note: Token validation is done directly in controllers
    Route::post('/add-pallet-quantity', [ProductionPortalController::class, 'addPalletQuantity'])
        ->name('api.production.add-pallet-quantity');

    Route::post('/add-manual-quantity', [ProductionPortalController::class, 'addManualQuantity'])
        ->name('api.production.add-manual-quantity');

    Route::post('/suspend-order', [ProductionPortalController::class, 'suspendOrder'])
        ->name('api.production.suspend-order');

    Route::post('/confirm-autocontrollo', [ProductionPortalController::class, 'confirmAutocontrollo'])
        ->name('api.production.confirm-autocontrollo');

    Route::post('/employee-order-list', [ProductionPortalController::class, 'getEmployeeOrderList'])
        ->name('api.production.employee-order-list');

    Route::post('/get-info', [ProductionPortalController::class, 'getInfo'])
        ->name('api.production.get-info');
});

// Production planning (API used by /planning page, same domain).
// GET /planning page is already protected by web auth; Inertia API calls are same-origin.
// To require auth on API too: configure SANCTUM_STATEFUL_DOMAINS (e.g. localhost:8000) in .env
// e sostituire il gruppo con: ->middleware('auth:sanctum')->group(function () {
Route::prefix('planning')->group(function () {
    Route::post('/data', [PlanningController::class, 'data'])->name('api.planning.data');
    Route::post('/save', [PlanningController::class, 'save'])->name('api.planning.save');
    Route::post('/summary/save', [PlanningController::class, 'saveSummary'])->name('api.planning.summary.save');
    Route::post('/calculate-hours', [PlanningController::class, 'calculateHours'])->name('api.planning.calculate-hours');
    Route::post('/check-today', [PlanningController::class, 'checkToday'])->name('api.planning.check-today');
    Route::post('/force-reschedule', [PlanningController::class, 'forceReschedule'])->name('api.planning.force-reschedule');
});

// Route for pallet sheet printing (if implemented)
Route::get('/production/foglio-pallet/{uuid}/print', function ($uuid) {
    // TODO: Implement PDF generation or printing
    return response()->json(['message' => 'Print functionality not yet implemented']);
})->name('api.production.foglio-pallet.print');

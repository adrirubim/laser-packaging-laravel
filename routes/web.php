<?php

use App\Http\Controllers\ArticleCategoryController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ArticleICController;
use App\Http\Controllers\ArticleIOController;
use App\Http\Controllers\ArticleIPController;
use App\Http\Controllers\CriticalIssueController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerDivisionController;
use App\Http\Controllers\CustomerShippingAddressController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LasFamilyController;
use App\Http\Controllers\LasWorkLineController;
use App\Http\Controllers\LsResourceController;
use App\Http\Controllers\MachineryController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\ModelSCQController;
use App\Http\Controllers\OfferActivityController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\OfferOperationCategoryController;
use App\Http\Controllers\OfferOperationController;
use App\Http\Controllers\OfferOperationListController;
use App\Http\Controllers\OfferOrderTypeController;
use App\Http\Controllers\OfferSeasonalityController;
use App\Http\Controllers\OfferSectorController;
use App\Http\Controllers\OfferTypeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderEmployeeController;
use App\Http\Controllers\OrderStateController;
use App\Http\Controllers\PalletSheetController;
use App\Http\Controllers\PalletTypeController;
use App\Http\Controllers\Planning\PlanningController;
use App\Http\Controllers\ProductionOrderProcessingController;
use App\Http\Controllers\ProductionPortalWebController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ValueTypesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'url' => url()->current(),
    ]);
})->name('home');

Route::post('/locale', function (Request $request) {
    $request->validate(['locale' => 'required|string|in:it,es,en']);
    $request->session()->put('locale', $request->input('locale'));

    return redirect()->back();
})->name('locale.update');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('dashboard/stats', [DashboardController::class, 'stats'])->name('dashboard.stats');
    Route::post('dashboard/alerts/acknowledge', [DashboardController::class, 'acknowledgeAlert'])->name('dashboard.alerts.acknowledge');

    // Resource routes for main modules
    // Specific routes must be defined BEFORE resource routes to avoid conflicts
    Route::get('orders/production-advancements', [OrderController::class, 'productionAdvancements'])->name('orders.production-advancements');
    Route::get('orders/get-shipping-addresses', [OrderController::class, 'getShippingAddresses'])->name('orders.get-shipping-addresses');
    Route::get('orders/{order}/manage-employees', [OrderEmployeeController::class, 'manageOrder'])->name('orders.manage-employees');
    Route::get('orders/{order}/manage-status', [OrderController::class, 'manageStatus'])->name('orders.manage-status');
    Route::post('orders/{order}/save-semaforo', [OrderController::class, 'saveSemaforo'])->name('orders.save-semaforo');
    Route::post('orders/{order}/change-status', [OrderController::class, 'changeStatus'])->name('orders.change-status');
    Route::get('orders/{order}/download-barcode', [OrderController::class, 'downloadBarcode'])->name('orders.download-barcode');
    Route::get('orders/{order}/download-autocontrollo', [OrderController::class, 'downloadAutocontrollo'])->name('orders.download-autocontrollo');
    Route::resource('orders', OrderController::class);
    Route::resource('production-order-processing', ProductionOrderProcessingController::class)->parameters([
        'production-order-processing' => 'productionOrderProcessing',
    ]);
    Route::resource('order-states', OrderStateController::class)->parameters([
        'order-states' => 'orderState',
    ]);
    Route::get('order-employees/get-assignments', [OrderEmployeeController::class, 'getEmployeeAssignments'])->name('order-employees.get-assignments');
    Route::post('order-employees/save-assignments', [OrderEmployeeController::class, 'saveEmployeeAssignments'])->name('order-employees.save-assignments');
    Route::get('order-employees/check-assignment', [OrderEmployeeController::class, 'checkEmployeeOrder'])->name('order-employees.check-assignment');
    Route::resource('order-employees', OrderEmployeeController::class)->parameters([
        'order-employees' => 'orderEmployee',
    ]);

    // Articles sub-routes (must be defined BEFORE the main 'articles' route)
    Route::get('articles/packaging-instructions/generate-ic-number', [ArticleICController::class, 'generateICNumber'])->name('articles.packaging-instructions.generate-ic-number');
    Route::get('articles/packaging-instructions/{packagingInstruction}/download', [ArticleICController::class, 'download'])->name('articles.packaging-instructions.download');
    Route::resource('articles/packaging-instructions', ArticleICController::class)->parameters([
        'packaging-instructions' => 'packagingInstruction',
    ])->names([
        'index' => 'articles.packaging-instructions.index',
        'create' => 'articles.packaging-instructions.create',
        'store' => 'articles.packaging-instructions.store',
        'show' => 'articles.packaging-instructions.show',
        'edit' => 'articles.packaging-instructions.edit',
        'update' => 'articles.packaging-instructions.update',
        'destroy' => 'articles.packaging-instructions.destroy',
    ]);

    Route::get('articles/palletization-instructions/generate-ip-number', [ArticleIPController::class, 'generateIPNumber'])->name('articles.palletization-instructions.generate-ip-number');
    Route::get('articles/palletization-instructions/{palletizationInstruction}/download', [ArticleIPController::class, 'download'])->name('articles.palletization-instructions.download');
    Route::resource('articles/palletization-instructions', ArticleIPController::class)->parameters([
        'palletization-instructions' => 'palletizationInstruction',
    ])->names([
        'index' => 'articles.palletization-instructions.index',
        'create' => 'articles.palletization-instructions.create',
        'store' => 'articles.palletization-instructions.store',
        'show' => 'articles.palletization-instructions.show',
        'edit' => 'articles.palletization-instructions.edit',
        'update' => 'articles.palletization-instructions.update',
        'destroy' => 'articles.palletization-instructions.destroy',
    ]);

    Route::get('articles/operational-instructions/generate-io-number', [ArticleIOController::class, 'generateIONumber'])->name('articles.operational-instructions.generate-io-number');
    Route::get('articles/operational-instructions/{operationalInstruction}/download', [ArticleIOController::class, 'download'])->name('articles.operational-instructions.download');
    Route::resource('articles/operational-instructions', ArticleIOController::class)->parameters([
        'operational-instructions' => 'operationalInstruction',
    ])->names([
        'index' => 'articles.operational-instructions.index',
        'create' => 'articles.operational-instructions.create',
        'store' => 'articles.operational-instructions.store',
        'show' => 'articles.operational-instructions.show',
        'edit' => 'articles.operational-instructions.edit',
        'update' => 'articles.operational-instructions.update',
        'destroy' => 'articles.operational-instructions.destroy',
    ]);

    // Specific routes must be defined BEFORE resource routes to avoid conflicts
    Route::get('articles/cq-models/generate-cqu-number', [ModelSCQController::class, 'generateCQUNumber'])->name('articles.cq-models.generate-cqu-number');
    Route::get('articles/cq-models/{cqModel}/download-file', [ModelSCQController::class, 'downloadFile'])->name('articles.cq-models.download-file');
    Route::resource('articles/cq-models', ModelSCQController::class)->parameters([
        'cq-models' => 'cqModel',
    ])->names([
        'index' => 'articles.cq-models.index',
        'create' => 'articles.cq-models.create',
        'store' => 'articles.cq-models.store',
        'show' => 'articles.cq-models.show',
        'edit' => 'articles.cq-models.edit',
        'update' => 'articles.cq-models.update',
        'destroy' => 'articles.cq-models.destroy',
    ]);

    Route::get('articles/pallet-sheets/{palletSheet}/download-file', [PalletSheetController::class, 'downloadFile'])->name('articles.pallet-sheets.download-file');
    Route::resource('articles/pallet-sheets', PalletSheetController::class)->parameters([
        'pallet-sheets' => 'palletSheet',
    ])->names([
        'index' => 'articles.pallet-sheets.index',
        'create' => 'articles.pallet-sheets.create',
        'store' => 'articles.pallet-sheets.store',
        'show' => 'articles.pallet-sheets.show',
        'edit' => 'articles.pallet-sheets.edit',
        'update' => 'articles.pallet-sheets.update',
        'destroy' => 'articles.pallet-sheets.destroy',
    ]);

    Route::get('articles/get-las-code', [ArticleController::class, 'getLasCode'])->name('articles.get-las-code');
    Route::get('articles/{article}/download-line-layout', [ArticleController::class, 'downloadLineLayoutFile'])->name('articles.download-line-layout');
    Route::resource('articles', ArticleController::class);
    Route::resource('customers', CustomerController::class);
    Route::resource('customer-divisions', CustomerDivisionController::class)->parameters([
        'customer-divisions' => 'customerDivision',
    ]);
    Route::get('customer-shipping-addresses/load-divisions', [CustomerShippingAddressController::class, 'loadDivisions'])->name('customer-shipping-addresses.load-divisions');
    Route::resource('customer-shipping-addresses', CustomerShippingAddressController::class)->parameters([
        'customer-shipping-addresses' => 'customerShippingAddress',
    ]);
    Route::resource('suppliers', SupplierController::class);
    Route::resource('materials', MaterialController::class);
    Route::resource('machinery', MachineryController::class);
    Route::resource('pallet-types', PalletTypeController::class)->parameters([
        'pallet-types' => 'palletType',
    ]);
    Route::resource('critical-issues', CriticalIssueController::class)->parameters([
        'critical-issues' => 'criticalIssue',
    ]);
    Route::resource('article-categories', ArticleCategoryController::class)->parameters([
        'article-categories' => 'articleCategory',
    ]);
    // Specific routes must be defined BEFORE resource routes to avoid conflicts
    Route::get('employees/contracts', [EmployeeController::class, 'contractsIndex'])->name('employees.contracts.index');
    Route::get('employees/contracts/create', [EmployeeController::class, 'createContract'])->name('employees.contracts.create');
    Route::post('employees/contracts', [EmployeeController::class, 'storeContract'])->name('employees.contracts.store');
    Route::get('employees/contracts/{contract}/edit', [EmployeeController::class, 'editContract'])->name('employees.contracts.edit');
    Route::put('employees/contracts/{contract}', [EmployeeController::class, 'updateContract'])->name('employees.contracts.update');
    Route::delete('employees/contracts/{contract}', [EmployeeController::class, 'destroyContract'])->name('employees.contracts.destroy');
    Route::get('employees/{employee}/contracts', [EmployeeController::class, 'contracts'])->name('employees.contracts');
    Route::get('employees/{employee}/download-barcode', [EmployeeController::class, 'downloadBarcode'])->name('employees.download-barcode');
    Route::put('employees/{employee}/update-password', [EmployeeController::class, 'updatePassword'])->name('employees.update-password');
    Route::post('employees/{employee}/store-contract', [EmployeeController::class, 'storeContractLegacy'])->name('employees.store-contract');
    Route::put('employees/{employee}/contracts/{contract}', [EmployeeController::class, 'updateContractLegacy'])->name('employees.update-contract');
    Route::delete('employees/{employee}/contracts/{contract}', [EmployeeController::class, 'destroyContractLegacy'])->name('employees.destroy-contract');
    Route::post('employees/{employee}/toggle-portal', [EmployeeController::class, 'togglePortal'])->name('employees.toggle-portal');
    Route::resource('employees', EmployeeController::class);

    // Offerte sub-modules (must be defined BEFORE the main 'offers' route)
    Route::resource('offers/activities', OfferActivityController::class)->parameters([
        'activities' => 'offerActivity',
    ])->names([
        'index' => 'offer-activities.index',
        'create' => 'offer-activities.create',
        'store' => 'offer-activities.store',
        'show' => 'offer-activities.show',
        'edit' => 'offer-activities.edit',
        'update' => 'offer-activities.update',
        'destroy' => 'offer-activities.destroy',
    ]);

    Route::resource('offers/types', OfferTypeController::class)->parameters([
        'types' => 'offerType',
    ])->names([
        'index' => 'offer-types.index',
        'create' => 'offer-types.create',
        'store' => 'offer-types.store',
        'show' => 'offer-types.show',
        'edit' => 'offer-types.edit',
        'update' => 'offer-types.update',
        'destroy' => 'offer-types.destroy',
    ]);

    Route::resource('offers/sectors', OfferSectorController::class)->parameters([
        'sectors' => 'offerSector',
    ])->names([
        'index' => 'offer-sectors.index',
        'create' => 'offer-sectors.create',
        'store' => 'offer-sectors.store',
        'show' => 'offer-sectors.show',
        'edit' => 'offer-sectors.edit',
        'update' => 'offer-sectors.update',
        'destroy' => 'offer-sectors.destroy',
    ]);

    Route::resource('offers/seasonality', OfferSeasonalityController::class)->parameters([
        'seasonality' => 'offerSeasonality',
    ])->names([
        'index' => 'offer-seasonalities.index',
        'create' => 'offer-seasonalities.create',
        'store' => 'offer-seasonalities.store',
        'show' => 'offer-seasonalities.show',
        'edit' => 'offer-seasonalities.edit',
        'update' => 'offer-seasonalities.update',
        'destroy' => 'offer-seasonalities.destroy',
    ]);

    Route::resource('offers/las-families', LasFamilyController::class)->parameters([
        'las-families' => 'lasFamily',
    ])->names([
        'index' => 'las-families.index',
        'create' => 'las-families.create',
        'store' => 'las-families.store',
        'show' => 'las-families.show',
        'edit' => 'las-families.edit',
        'update' => 'las-families.update',
        'destroy' => 'las-families.destroy',
    ]);

    Route::resource('offers/las-work-lines', LasWorkLineController::class)->parameters([
        'las-work-lines' => 'lasWorkLine',
    ])->names([
        'index' => 'las-work-lines.index',
        'create' => 'las-work-lines.create',
        'store' => 'las-work-lines.store',
        'show' => 'las-work-lines.show',
        'edit' => 'las-work-lines.edit',
        'update' => 'las-work-lines.update',
        'destroy' => 'las-work-lines.destroy',
    ]);

    Route::resource('offers/ls-resources', LsResourceController::class)->parameters([
        'ls-resources' => 'lsResource',
    ])->names([
        'index' => 'ls-resources.index',
        'create' => 'ls-resources.create',
        'store' => 'ls-resources.store',
        'show' => 'ls-resources.show',
        'edit' => 'ls-resources.edit',
        'update' => 'ls-resources.update',
        'destroy' => 'ls-resources.destroy',
    ]);

    Route::resource('offers/order-types', OfferOrderTypeController::class)->parameters([
        'order-types' => 'offerOrderType',
    ])->names([
        'index' => 'offer-order-types.index',
        'create' => 'offer-order-types.create',
        'store' => 'offer-order-types.store',
        'show' => 'offer-order-types.show',
        'edit' => 'offer-order-types.edit',
        'update' => 'offer-order-types.update',
        'destroy' => 'offer-order-types.destroy',
    ]);

    Route::get('offers/operation-categories/load-categories', [OfferOperationCategoryController::class, 'loadCategories'])->name('offer-operation-categories.load-categories');
    Route::resource('offers/operation-categories', OfferOperationCategoryController::class)->parameters([
        'operation-categories' => 'offerOperationCategory',
    ])->names([
        'index' => 'offer-operation-categories.index',
        'create' => 'offer-operation-categories.create',
        'store' => 'offer-operation-categories.store',
        'show' => 'offer-operation-categories.show',
        'edit' => 'offer-operation-categories.edit',
        'update' => 'offer-operation-categories.update',
        'destroy' => 'offer-operation-categories.destroy',
    ]);

    Route::get('offers/operations/load-category-operations', [OfferOperationController::class, 'loadCategoryOperations'])->name('offer-operations.load-category-operations');
    Route::get('offers/operations/{offerOperation}/download-file', [OfferOperationController::class, 'downloadFile'])->name('offer-operations.download-file');
    Route::resource('offers/operations', OfferOperationController::class)->parameters([
        'operations' => 'offerOperation',
    ])->names([
        'index' => 'offer-operations.index',
        'create' => 'offer-operations.create',
        'store' => 'offer-operations.store',
        'show' => 'offer-operations.show',
        'edit' => 'offer-operations.edit',
        'update' => 'offer-operations.update',
        'destroy' => 'offer-operations.destroy',
    ]);

    Route::resource('offers/operation-lists', OfferOperationListController::class)->parameters([
        'operation-lists' => 'offerOperationList',
    ])->names([
        'index' => 'offer-operation-lists.index',
        'create' => 'offer-operation-lists.create',
        'store' => 'offer-operation-lists.store',
        'show' => 'offer-operation-lists.show',
        'edit' => 'offer-operation-lists.edit',
        'update' => 'offer-operation-lists.update',
        'destroy' => 'offer-operation-lists.destroy',
    ]);

    // Main offers route (must be defined AFTER nested routes)
    Route::get('offers/get-divisions', [OfferController::class, 'getDivisions'])->name('offers.get-divisions');
    Route::get('offers/{offer}/download-pdf', [OfferController::class, 'downloadPdf'])->name('offers.download-pdf');
    Route::resource('offers', OfferController::class);

    // Value Types
    Route::resource('value-types', ValueTypesController::class)->parameters([
        'value-types' => 'valueType',
    ])->names([
        'index' => 'value-types.index',
        'create' => 'value-types.create',
        'store' => 'value-types.store',
        'show' => 'value-types.show',
        'edit' => 'value-types.edit',
        'update' => 'value-types.update',
        'destroy' => 'value-types.destroy',
    ]);

    // Pianificazione produzione (UI Inertia): index = vista principal
    Route::get('planning', [PlanningController::class, 'index'])->name('planning.index');
});

// Production Portal Web Frontend (public routes, uses session tokens)
Route::prefix('production-portal')->name('production-portal.')->group(function () {
    Route::get('/login', [ProductionPortalWebController::class, 'login'])->name('login');
    Route::post('/authenticate', [ProductionPortalWebController::class, 'authenticate'])->name('authenticate');
    Route::post('/logout', [ProductionPortalWebController::class, 'logout'])->name('logout');
    Route::get('/dashboard', [ProductionPortalWebController::class, 'dashboard'])->name('dashboard');
    Route::get('/order/{order}', [ProductionPortalWebController::class, 'showOrder'])->name('order');
});

require __DIR__.'/settings.php';

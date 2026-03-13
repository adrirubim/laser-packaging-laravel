<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\OrderLabelStatus;
use App\Enums\OrderStatus;
use App\Http\Controllers\Concerns\HandlesActionErrors;
use App\Http\Requests\ChangeOrderStatusRequest;
use App\Http\Requests\SaveSemaforoRequest;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\Api\ApiResponseResource;
use App\Http\Resources\OrderResource;
use App\Http\Resources\OrderShippingAddressResource;
use App\Models\Order;
use App\Repositories\OrderRepository;
use App\Services\OrderProductionNumberService;
use App\Services\Planning\PlanningReplanService;
use Domain\Orders\Actions\ChangeOrderStatusAction;
use Domain\Orders\Actions\CreateOrderAction;
use Domain\Orders\Actions\GenerateOrderAutocontrolloPdfAction;
use Domain\Orders\Actions\GenerateOrderBarcodePdfAction;
use Domain\Orders\Actions\GetOrderLabelDataAction;
use Domain\Orders\Actions\UpdateOrderAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    use HandlesActionErrors;

    protected OrderProductionNumberService $orderProductionNumberService;

    protected OrderRepository $orderRepository;

    protected CreateOrderAction $createOrderAction;

    protected UpdateOrderAction $updateOrderAction;

    protected PlanningReplanService $planningReplanService;

    protected GetOrderLabelDataAction $getOrderLabelDataAction;

    protected ChangeOrderStatusAction $changeOrderStatusAction;

    protected GenerateOrderBarcodePdfAction $generateOrderBarcodePdfAction;

    protected GenerateOrderAutocontrolloPdfAction $generateOrderAutocontrolloPdfAction;

    public function __construct(
        OrderProductionNumberService $orderProductionNumberService,
        OrderRepository $orderRepository,
        CreateOrderAction $createOrderAction,
        UpdateOrderAction $updateOrderAction,
        PlanningReplanService $planningReplanService,
        GetOrderLabelDataAction $getOrderLabelDataAction,
        ChangeOrderStatusAction $changeOrderStatusAction,
        GenerateOrderBarcodePdfAction $generateOrderBarcodePdfAction,
        GenerateOrderAutocontrolloPdfAction $generateOrderAutocontrolloPdfAction,
    ) {
        $this->orderProductionNumberService = $orderProductionNumberService;
        $this->orderRepository = $orderRepository;
        $this->createOrderAction = $createOrderAction;
        $this->updateOrderAction = $updateOrderAction;
        $this->planningReplanService = $planningReplanService;
        $this->getOrderLabelDataAction = $getOrderLabelDataAction;
        $this->changeOrderStatusAction = $changeOrderStatusAction;
        $this->generateOrderBarcodePdfAction = $generateOrderBarcodePdfAction;
        $this->generateOrderAutocontrolloPdfAction = $generateOrderAutocontrolloPdfAction;
    }

    /**
     * Display a listing of orders.
     */
    public function index(Request $request): Response
    {
        $orders = $this->orderRepository->getForIndex($request);
        // For filter, only show articles that have orders
        $formOptions = $this->orderRepository->getFormOptions(onlyWithOrders: true);

        $ordersTransformed = $orders->through(
            static fn (Order $order) => OrderResource::make($order)->toArray($request)
        );

        return Inertia::render('Orders/Index', [
            'orders' => $ordersTransformed->toArray(),
            'articles' => $formOptions['articles']->map(
                static function ($article): array {
                    $uuid = is_array($article) ? ($article['uuid'] ?? null) : $article->uuid;
                    $codArticleLas = is_array($article) ? ($article['cod_article_las'] ?? null) : $article->cod_article_las;
                    $articleDescr = is_array($article) ? ($article['article_descr'] ?? null) : $article->article_descr;
                    $offerUuid = is_array($article) ? ($article['offer_uuid'] ?? null) : $article->offer_uuid;

                    return [
                        'uuid' => $uuid,
                        'cod_article_las' => $codArticleLas,
                        'article_descr' => $articleDescr,
                        'offer_uuid' => $offerUuid,
                    ];
                },
            ),
            'customers' => $formOptions['customers'] ?? collect([]),
            'filters' => $request->only(['search', 'article_uuid', 'status', 'customer_uuid', 'date_from', 'date_to', 'autocontrollo', 'sort_by', 'sort_order', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new order.
     */
    public function create(Request $request): Response
    {
        $formOptions = $this->orderRepository->getFormOptions();
        $articleUuid = $request->get('article_uuid');

        $article = $this->orderRepository->getArticleForForm($articleUuid);
        $shippingAddresses = $this->orderRepository->getShippingAddressesForArticle($articleUuid);

        // Generate production number automatically
        $productionNumber = $this->orderProductionNumberService->generateNext();

        // Prefill delivery address when there is only one (Create Order from Articles flow)
        $initialShippingAddressUuid = $shippingAddresses->count() === 1
            ? $shippingAddresses->first()->uuid
            : null;

        return Inertia::render('Orders/Create', [
            'articles' => $formOptions['articles'],
            'shippingAddresses' => $shippingAddresses,
            'article' => $article,
            'productionNumber' => $productionNumber,
            'initialShippingAddressUuid' => $initialShippingAddressUuid,
            'labelOptions' => OrderLabelStatus::options(),
            'lotTypeOptions' => [
                ['value' => 0, 'label' => 'Inserimento Manuale'],
                ['value' => 1, 'label' => 'Lotto a 6 cifre'],
                ['value' => 2, 'label' => 'Lotto a 4 cifre'],
            ],
        ]);
    }

    /**
     * Store a newly created order.
     */
    public function store(StoreOrderRequest $request)
    {
        $result = $this->createOrderAction->execute($request->validated());

        // If action returns error, redirect with errors
        if (is_array($result) && isset($result['error']) && $result['error']) {
            return back()->withErrors([
                $result['field'] => $result['message'],
            ])->withInput();
        }

        return redirect()->route('orders.index')
            ->with('success', __('flash.order.created'));
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order): Response
    {
        $order->load([
            'article.offer.customer',
            'article.offer.customerDivision',
            'article.palletSheet',
            'article.materials' => function ($query) {
                $query->select('materials.uuid', 'materials.cod', 'materials.description')
                    ->where('articlematerials.removed', false);
            },
            'shippingAddress.customerDivision.customer',
        ]);

        // Calculate remain_quantity
        $order->remain_quantity = $order->quantity - ($order->worked_quantity ?? 0);

        $orderResource = OrderResource::make($order)->toArray(request());

        return Inertia::render('Orders/Show', [
            'order' => $orderResource,
        ]);
    }

    /**
     * Show the form for editing the specified order.
     */
    public function edit(Order $order): Response
    {
        $order->load(['article.offer.customerDivision']);

        $formOptions = $this->orderRepository->getFormOptions();
        $articleUuid = $order->article_uuid;
        $shippingAddresses = $this->orderRepository->getShippingAddressesForArticle($articleUuid);
        $article = $this->orderRepository->getArticleForForm($articleUuid);

        return Inertia::render('Orders/Edit', [
            'order' => $order,
            'articles' => $formOptions['articles'],
            'shippingAddresses' => $shippingAddresses,
            'article' => $article,
            'labelOptions' => OrderLabelStatus::options(),
            'lotTypeOptions' => [
                ['value' => 0, 'label' => 'Inserimento Manuale'],
                ['value' => 1, 'label' => 'Lotto a 6 cifre'],
                ['value' => 2, 'label' => 'Lotto a 4 cifre'],
            ],
        ]);
    }

    /**
     * Update the specified order.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        $validated = $request->validated();
        $result = $this->updateOrderAction->execute($order, $validated);

        if ($errorResponse = $this->handleActionError($result)) {
            return $errorResponse;
        }

        // Mirror Pianificazione Produzione: reajustar planning si cambia worked_quantity
        if (array_key_exists('worked_quantity', $validated)) {
            $this->planningReplanService->adjustForWorkedQuantity($order->uuid);
        }

        return redirect()->route('orders.index')
            ->with('success', __('flash.order.updated'));
    }

    /**
     * Remove the specified order (soft delete).
     */
    public function destroy(Order $order)
    {
        $order->update(['removed' => true]);

        return redirect()->route('orders.index')
            ->with('success', __('flash.order.deleted'));
    }

    /**
     * Display production advancements (orders in progress).
     */
    public function productionAdvancements(Request $request): Response
    {
        $orders = $this->orderRepository->getForProductionAdvancements($request);
        // For filter, only show articles with orders in status 2 (Lanciato) or 3 (In Avanzamento)
        $formOptions = $this->orderRepository->getFormOptions(onlyWithOrders: true, statusFilter: [OrderStatus::LANCIATO->value, OrderStatus::IN_AVANZAMENTO->value]);

        $ordersTransformed = $orders->through(
            static fn (Order $order) => OrderResource::make($order)->toArray($request)
        );

        return Inertia::render('Orders/ProductionAdvancements', [
            'orders' => $ordersTransformed->toArray(),
            'articles' => $formOptions['articles'],
            'filters' => $request->only(['search', 'article_uuid', 'per_page', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Get shipping addresses for an article (AJAX endpoint).
     */
    public function getShippingAddresses(Request $request)
    {
        $request->validate([
            'article_uuid' => 'required|exists:articles,uuid',
        ]);

        $shippingAddresses = $this->orderRepository->getShippingAddressesForArticle(
            $request->get('article_uuid')
        );

        $resource = OrderShippingAddressResource::collection($shippingAddresses);

        // Mantener contrato legacy: raíz = array de direcciones
        $resolved = $resource->resolve();

        $response = ApiResponseResource::success(
            true,
            null,
            $resolved
        )->response();

        // Sobrescribe el payload JSON para que la raíz sea el array esperado por los tests
        $response->setData($resolved);

        return $response;
    }

    /**
     * Show the manage status dialog for an order.
     */
    public function manageStatus(Order $order): Response
    {
        $order->load([
            'article.offer.customer',
            'article.offer.customerDivision',
        ]);

        // Parse status_semaforo if it's a string
        $statusSemaforo = $order->status_semaforo;
        if (is_string($statusSemaforo)) {
            $statusSemaforo = json_decode($statusSemaforo, true);
        }
        if (! is_array($statusSemaforo)) {
            $statusSemaforo = [
                'etichette' => 0,
                'packaging' => 0,
                'prodotto' => 0,
            ];
        }

        return Inertia::render('Orders/ManageStatus', [
            'order' => $order,
            'statusSemaforo' => $statusSemaforo,
            'statusOptions' => OrderStatus::options(),
        ]);
    }

    /**
     * Save semaforo status for an order.
     */
    public function saveSemaforo(SaveSemaforoRequest $request, Order $order): JsonResponse
    {
        try {
            $statusSemaforo = [
                'etichette' => (int) $request->input('etichette'),
                'packaging' => (int) $request->input('packaging'),
                'prodotto' => (int) $request->input('prodotto'),
            ];

            $order->update([
                'status_semaforo' => $statusSemaforo,
            ]);

            // Check if all semaphores are green (2)
            $allGreen = $statusSemaforo['etichette'] === 2
                && $statusSemaforo['packaging'] === 2
                && $statusSemaforo['prodotto'] === 2;

            return ApiResponseResource::success(
                true,
                __('flash.semaforo_saved'),
                [
                    'all_green' => $allGreen,
                    'can_change_to_lanciato' => $allGreen && $order->status === OrderStatus::IN_ALLESTIMENTO->value,
                ]
            )->response();
        } catch (\Exception $e) {
            Log::error('Errore salvataggio semaforo', [
                'order_uuid' => $order->uuid,
                'error' => $e->getMessage(),
            ]);

            return ApiResponseResource::error(
                __('flash.semaforo_error')
            )->response()->setStatusCode(500);
        }
    }

    /**
     * Change order status.
     */
    public function changeStatus(ChangeOrderStatusRequest $request, Order $order): JsonResponse
    {
        try {
            $result = $this->changeOrderStatusAction->execute($order, $request);

            if ($result['success'] !== true) {
                return ApiResponseResource::error(
                    $result['message']
                )->response()->setStatusCode($result['status']);
            }

            return ApiResponseResource::success(
                true,
                $result['message'],
                $result['data']
            )->response();
        } catch (\Exception $e) {
            Log::error('Errore cambio stato ordine', [
                'order_uuid' => $order->uuid,
                'new_status' => $request->input('status'),
                'error' => $e->getMessage(),
            ]);

            return ApiResponseResource::error(
                __('flash.order_state_error')
            )->response()->setStatusCode(500);
        }
    }

    /**
     * Download barcode PDF for an order.
     */
    public function downloadBarcode(Order $order): HttpResponse
    {
        try {
            $result = $this->generateOrderBarcodePdfAction->execute($order);

            return response($result['pdf'], 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="'.$result['filename'].'"',
                'Content-Length' => strlen($result['pdf']),
            ]);
        } catch (\Exception $e) {
            Log::error('Errore download barcode', [
                'order_uuid' => $order->uuid,
                'error' => $e->getMessage(),
            ]);

            return ApiResponseResource::error(
                __('flash.barcode_error').': '.$e->getMessage()
            )->response()->setStatusCode(500);
        }
    }

    /**
     * Download autocontrollo PDF for an order.
     */
    public function downloadAutocontrollo(Order $order): HttpResponse
    {
        try {
            $result = $this->generateOrderAutocontrolloPdfAction->execute($order);

            return response($result['pdf'], 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="'.$result['filename'].'"',
                'Content-Length' => strlen($result['pdf']),
            ]);
        } catch (\Exception $e) {
            Log::error('Errore download autocontrollo', [
                'order_uuid' => $order->uuid,
                'error' => $e->getMessage(),
            ]);

            return ApiResponseResource::error(
                __('flash.autocontrollo_pdf_error').': '.$e->getMessage()
            )->response()->setStatusCode(500);
        }
    }
}

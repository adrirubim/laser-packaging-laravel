<?php

namespace App\Http\Controllers;

use App\Actions\CreateOrderAction;
use App\Actions\UpdateOrderAction;
use App\Enums\OrderLabelStatus;
use App\Enums\OrderStatus;
use App\Http\Controllers\Concerns\HandlesActionErrors;
use App\Http\Requests\ChangeOrderStatusRequest;
use App\Http\Requests\SaveSemaforoRequest;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Repositories\OrderRepository;
use App\Services\OrderProductionNumberService;
use App\Services\Planning\PlanningReplanService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Picqer\Barcode\BarcodeGeneratorHTML;

class OrderController extends Controller
{
    use HandlesActionErrors;

    protected OrderProductionNumberService $orderProductionNumberService;

    protected OrderRepository $orderRepository;

    protected CreateOrderAction $createOrderAction;

    protected UpdateOrderAction $updateOrderAction;

    protected PlanningReplanService $planningReplanService;

    public function __construct(
        OrderProductionNumberService $orderProductionNumberService,
        OrderRepository $orderRepository,
        CreateOrderAction $createOrderAction,
        UpdateOrderAction $updateOrderAction,
        PlanningReplanService $planningReplanService
    ) {
        $this->orderProductionNumberService = $orderProductionNumberService;
        $this->orderRepository = $orderRepository;
        $this->createOrderAction = $createOrderAction;
        $this->updateOrderAction = $updateOrderAction;
        $this->planningReplanService = $planningReplanService;
    }

    /**
     * Display a listing of orders.
     */
    public function index(Request $request): Response
    {
        $orders = $this->orderRepository->getForIndex($request);
        // For filter, only show articles that have orders
        $formOptions = $this->orderRepository->getFormOptions(onlyWithOrders: true);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'articles' => $formOptions['articles'],
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

        return Inertia::render('Orders/Show', [
            'order' => $order,
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

        return Inertia::render('Orders/ProductionAdvancements', [
            'orders' => $orders,
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

        return response()->json($shippingAddresses);
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

            return response()->json([
                'success' => true,
                'message' => __('flash.semaforo_saved'),
                'all_green' => $allGreen,
                'can_change_to_lanciato' => $allGreen && $order->status === OrderStatus::IN_ALLESTIMENTO->value,
            ]);
        } catch (\Exception $e) {
            Log::error('Errore salvataggio semaforo', [
                'order_uuid' => $order->uuid,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => __('flash.semaforo_error'),
            ], 500);
        }
    }

    /**
     * Change order status.
     */
    public function changeStatus(ChangeOrderStatusRequest $request, Order $order): JsonResponse
    {
        try {
            $newStatus = (int) $request->input('status');
            $currentStatus = $order->status;

            // Validate transition
            $validTransition = $this->isValidStatusTransition($currentStatus, $newStatus);
            if (! $validTransition) {
                return response()->json([
                    'success' => false,
                    'message' => __('flash.invalid_state_transition'),
                ], 400);
            }

            $updateData = ['status' => $newStatus];

            // If changing to SOSPESO, require motivazione
            if ($newStatus === OrderStatus::SOSPESO->value) {
                $updateData['motivazione'] = $request->input('motivazione');
            }

            // If forcing to IN_AVANZAMENTO, set autocontrollo to 0
            if ($newStatus === OrderStatus::IN_AVANZAMENTO->value && $request->has('force')) {
                $updateData['autocontrollo'] = false;
            }

            $order->update($updateData);

            return response()->json([
                'success' => true,
                'message' => __('flash.order_state_updated'),
                'order' => $order->fresh(),
            ]);
        } catch (\Exception $e) {
            Log::error('Errore cambio stato ordine', [
                'order_uuid' => $order->uuid,
                'new_status' => $request->input('status'),
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => __('flash.order_state_error'),
            ], 500);
        }
    }

    /**
     * Validate if status transition is valid.
     */
    protected function isValidStatusTransition(int $currentStatus, int $newStatus): bool
    {
        // If order is already SALDATO, no status change is allowed
        if ($currentStatus === OrderStatus::SALDATO->value) {
            return false;
        }

        // Can always change to SOSPESO
        if ($newStatus === OrderStatus::SOSPESO->value) {
            return true;
        }

        // Can always change from SOSPESO to any other status (except itself)
        if ($currentStatus === OrderStatus::SOSPESO->value) {
            return $newStatus !== OrderStatus::SOSPESO->value;
        }

        // Define valid transitions
        $validTransitions = [
            OrderStatus::PIANIFICATO->value => [OrderStatus::IN_ALLESTIMENTO->value],
            OrderStatus::IN_ALLESTIMENTO->value => [OrderStatus::LANCIATO->value],
            OrderStatus::LANCIATO->value => [OrderStatus::IN_AVANZAMENTO->value],
            OrderStatus::IN_AVANZAMENTO->value => [OrderStatus::EVASO->value],
            OrderStatus::EVASO->value => [OrderStatus::SALDATO->value],
        ];

        return isset($validTransitions[$currentStatus])
            && in_array($newStatus, $validTransitions[$currentStatus]);
    }

    /**
     * Download barcode PDF for an order.
     */
    public function downloadBarcode(Order $order): HttpResponse
    {
        try {
            // Generate barcode code (pad order ID to 13 digits)
            $code = str_pad((string) $order->id, 13, '0', STR_PAD_LEFT);

            // Generate barcode HTML
            $generator = new BarcodeGeneratorHTML;
            $barcodeHtml = $generator->getBarcode($code, $generator::TYPE_CODE_128, 3, 60);

            // Create temporary directory if it doesn't exist
            $tmpDir = storage_path('app/tmp/orders/barcodes');
            if (! is_dir($tmpDir)) {
                mkdir($tmpDir, 0755, true);
            }

            // Render HTML view
            $html = view('orders.barcode', [
                'order' => $order,
                'barcode' => $barcodeHtml,
                'code' => $code,
            ])->render();

            // Save HTML to temporary file
            $tmpFile = $tmpDir.'/'.$order->uuid.'.html';
            file_put_contents($tmpFile, $html);

            // Get wkhtmltopdf path from config or environment
            $wkhtmltopdfPath = env('WKHTMLTOPDF_PATH', '/usr/bin/wkhtmltopdf');
            if (! file_exists($wkhtmltopdfPath)) {
                // Try common locations
                $commonPaths = ['/usr/local/bin/wkhtmltopdf', 'wkhtmltopdf'];
                foreach ($commonPaths as $path) {
                    if (file_exists($path) || shell_exec("which {$path}")) {
                        $wkhtmltopdfPath = $path;
                        break;
                    }
                }
            }

            $pdfTitle = 'Barcode ORDINE '.$order->order_production_number;
            $command = "ulimit -n 4096; {$wkhtmltopdfPath} --title \"{$pdfTitle}\" {$tmpFile} - 2>&1";

            Log::debug('[ORDER] BARCODE PDF - Executing command: '.$command);

            $pdf = shell_exec($command);

            if (empty($pdf)) {
                throw new \Exception(__('flash.wkhtmltopdf_error'));
            }

            // Clean up temporary file
            @unlink($tmpFile);

            $filename = 'barcode_ordine_'.$order->order_production_number.'.pdf';

            return response($pdf, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="'.$filename.'"',
                'Content-Length' => strlen($pdf),
            ]);
        } catch (\Exception $e) {
            Log::error('Errore download barcode', [
                'order_uuid' => $order->uuid,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => __('flash.barcode_error').': '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Download autocontrollo PDF for an order.
     */
    public function downloadAutocontrollo(Order $order): HttpResponse
    {
        try {
            // Load all necessary relationships
            $order->load([
                'article.offer.customer',
                'article.offer.customerDivision',
                'article.palletSheet',
                'article.materials' => function ($query) {
                    $query->where('articlematerials.removed', false);
                },
                'article.criticalIssues',
                'article.packagingInstructions',
                'article.palletizingInstructions',
            ]);

            if (! $order->article) {
                throw new \Exception(__('flash.article_not_found_for_order'));
            }

            $article = $order->article;

            // Get packaging and palletizing instructions
            $packagingInstruct = '';
            $palletizingInstruct = '';

            // Try to get from related instructions if available
            if ($article->packagingInstructions && $article->packagingInstructions->isNotEmpty()) {
                $packagingInstruct = $article->packagingInstructions->pluck('description')->implode(' - ');
            }

            if ($article->palletizingInstructions && $article->palletizingInstructions->isNotEmpty()) {
                $palletizingInstruct = $article->palletizingInstructions->pluck('description')->implode(' - ');
            }

            // Prepare data for the view
            $data = [
                'order' => $order,
                'article' => $article,
                'um' => $article->um ?? '-',
                'cod_article_cliente' => $article->cod_article_client ?? '-',
                'article_descr' => $article->article_descr ?? '-',
                'order_production_number' => $order->order_production_number,
                'quantity' => number_format((float) ($order->quantity ?? 0), 2, ',', ' '),
                'lot' => $order->lot ?? '-',
                'expiration_date' => $order->expiration_date ? $order->expiration_date->format('d/m/Y') : '-',
                'additional_descr' => $article->additional_descr ?? '-',
                'notes' => $article->offer->notes ?? '-',
                'packaging_instruct' => $packagingInstruct ?: '-',
                'palletizing_instruct' => $palletizingInstruct ?: '-',
                'pallet_plans' => $article->pallet_plans ?? '-',
                'interlayer_every_floors' => $article->interlayer_every_floors ?? '-',
                'label_info' => $this->getLabelInfo($article),
                'criticita' => $this->getCriticita($article),
                'customer_samples' => $this->getCustomerSamples($article),
                'pallet' => $article->palletSheet ?? null,
                'article_material_list' => $this->getArticleMaterials($article),
                'weight_info' => $this->getWeightInfo($article),
            ];

            // Create temporary directory if it doesn't exist
            $tmpDir = storage_path('app/tmp/orders/autocontrollo');
            if (! is_dir($tmpDir)) {
                mkdir($tmpDir, 0755, true);
            }

            // Render HTML view
            $html = view('orders.autocontrollo', $data)->render();

            // Save HTML to temporary file
            $tmpFile = $tmpDir.'/'.$order->uuid.'.html';
            file_put_contents($tmpFile, $html);

            // Get wkhtmltopdf path from config or environment
            $wkhtmltopdfPath = env('WKHTMLTOPDF_PATH', '/usr/bin/wkhtmltopdf');
            if (! file_exists($wkhtmltopdfPath)) {
                // Try common locations
                $commonPaths = ['/usr/local/bin/wkhtmltopdf', 'wkhtmltopdf'];
                foreach ($commonPaths as $path) {
                    if (file_exists($path) || shell_exec("which {$path}")) {
                        $wkhtmltopdfPath = $path;
                        break;
                    }
                }
            }

            $pdfTitle = 'Autocontrollo ORDINE '.$order->order_production_number;
            $command = "ulimit -n 4096; {$wkhtmltopdfPath} --title \"{$pdfTitle}\" --margin-left 2mm --margin-right 2mm {$tmpFile} - 2>&1";

            Log::debug('[ORDER] Autocontrollo PDF - Executing command: '.$command);

            $pdf = shell_exec($command);

            if (empty($pdf)) {
                throw new \Exception(__('flash.wkhtmltopdf_error'));
            }

            // Clean up temporary file
            @unlink($tmpFile);

            $filename = 'autocontrollo_ordine_'.$order->order_production_number.'.pdf';

            return response($pdf, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="'.$filename.'"',
                'Content-Length' => strlen($pdf),
            ]);
        } catch (\Exception $e) {
            Log::error('Errore download autocontrollo', [
                'order_uuid' => $order->uuid,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => __('flash.autocontrollo_pdf_error').': '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get label information for the article.
     */
    protected function getLabelInfo($article): string
    {
        $ingredient = $this->getLabelValue($article->labels_ingredient ?? null);
        $variable = $this->getLabelValue($article->labels_data_variable ?? null);
        $jumpers = $this->getLabelValue($article->label_of_jumpers ?? null);

        return "{$ingredient} / {$variable} / {$jumpers}";
    }

    /**
     * Get label value helper.
     */
    protected function getLabelValue($value): string
    {
        if ($value === null) {
            return '-';
        }

        // Map values to labels (simplified - adjust based on your actual enum/constants)
        $labels = [
            0 => __('common.no'),
            1 => __('common.yes'),
            2 => __('common.partial'),
        ];

        return $labels[$value] ?? (string) $value;
    }

    /**
     * Get critical issues for the article.
     */
    protected function getCriticita($article): string
    {
        if (! $article->criticalIssues || $article->criticalIssues->isEmpty()) {
            return '-';
        }

        return $article->criticalIssues->pluck('name')->implode(', ');
    }

    /**
     * Get customer samples for the article.
     */
    protected function getCustomerSamples($article): ?string
    {
        // This would need to be implemented based on your actual data structure
        return $article->customer_samples_list ?? null;
    }

    /**
     * Get article materials list.
     */
    protected function getArticleMaterials($article): array
    {
        if (! $article->materials || $article->materials->isEmpty()) {
            return [];
        }

        return $article->materials->map(function ($material) {
            return [
                'uuid' => $material->uuid,
                'cod' => $material->cod ?? '-',
                'description' => $material->description ?? '-',
            ];
        })->toArray();
    }

    /**
     * Get weight information for the article.
     */
    protected function getWeightInfo($article): string
    {
        $nominal = $this->getWeightControlValue($article->nominal_weight_control ?? null);
        $unit = $article->weight_unit_of_measur ?? '';
        $value = $article->weight_value ?? '';
        $object = $this->getWeightControlValue($article->object_control_weight ?? null);

        return "{$nominal}  {$unit}  {$value}  {$object}";
    }

    /**
     * Get weight control value helper.
     */
    protected function getWeightControlValue($value): string
    {
        if ($value === null) {
            return '';
        }

        // Map values to labels (simplified - adjust based on your actual enum/constants)
        return (string) $value;
    }
}

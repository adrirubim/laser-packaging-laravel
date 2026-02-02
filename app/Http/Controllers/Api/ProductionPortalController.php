<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeePortalToken;
use App\Models\FoglioPallet;
use App\Models\Order;
use App\Models\ProductionOrderProcessing;
use App\Services\PalletCalculationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductionPortalController extends Controller
{
    protected PalletCalculationService $palletCalculationService;

    public function __construct(PalletCalculationService $palletCalculationService)
    {
        $this->palletCalculationService = $palletCalculationService;
    }

    /**
     * Helper: Get employee from token
     */
    protected function getEmployeeFromToken(?string $token): ?Employee
    {
        if (empty($token)) {
            return null;
        }

        $portalToken = EmployeePortalToken::where('token', $token)
            ->active()
            ->valid()
            ->with('employee')
            ->first();

        if (! $portalToken || ! $portalToken->employee) {
            return null;
        }

        $employee = $portalToken->employee;
        if ($employee->removed || ! $employee->portal_enabled) {
            return null;
        }

        return $employee;
    }

    /**
     * Helper: Update order worked_quantity and status
     */
    protected function updateOrderWorkedQuantity(string $orderUuid): void
    {
        $processedQuantity = ProductionOrderProcessing::loadProcessedQuantity($orderUuid);

        $order = Order::where('uuid', $orderUuid)
            ->where('removed', false)
            ->first();

        if ($order) {
            $order->worked_quantity = $processedQuantity;

            // Cambio automatico di stato: se status <= 2 e c'è worked_quantity > 0, impostare a 3
            if ($order->status <= Order::STATUS_LANCIATO && $processedQuantity > 0) {
                $order->status = Order::STATUS_IN_AVANZAMENTO;
            }

            $order->save();
        }
    }

    /**
     * Helper: Generate print URL for foglio pallet
     */
    protected function generatePrintUrl(?string $foglioPalletUuid): ?string
    {
        if (empty($foglioPalletUuid)) {
            return null;
        }

        try {
            $foglioPallet = FoglioPallet::where('uuid', $foglioPalletUuid)
                ->where('removed', false)
                ->first();

            if ($foglioPallet && ! empty($foglioPallet->filename)) {
                // Generare URL di stampa (adattare in base all'implementazione file)
                return route('api.production.foglio-pallet.print', ['uuid' => $foglioPallet->uuid]);
            }
        } catch (\Exception $e) {
            // In caso di errore, restituire null
        }

        return null;
    }

    /**
     * 1. Authenticate with EAN codes
     * POST /api/production/authenticate
     */
    public function authenticate(Request $request)
    {
        $request->validate([
            'employee_number' => 'required|string',
            'order_number' => 'required|string',
        ]);

        // Rimuovere zeri a sinistra da entrambi gli EAN
        $employeeNumber = ltrim($request->get('employee_number'), '0');
        $orderNumber = ltrim($request->get('order_number'), '0');

        // Cercare dipendente per ID
        $employee = Employee::where('id', $employeeNumber)
            ->where('removed', false)
            ->where('portal_enabled', true)
            ->first();

        if (! $employee) {
            return response()->json(['error' => 'Dipendente non trovato o non abilitato'], 404);
        }

        // Cercare ordine per ID
        $order = Order::where('id', $orderNumber)
            ->where('removed', false)
            ->first();

        if (! $order) {
            return response()->json(['error' => 'Ordine non trovato'], 404);
        }

        // Verificare: ordine deve essere in stato 2 o 3
        if ($order->status !== Order::STATUS_LANCIATO && $order->status !== Order::STATUS_IN_AVANZAMENTO) {
            return response()->json(['error' => 'L\'ordine non è in uno stato valido (deve essere Lanciato o In Avanzamento)'], 400);
        }

        // Generare token temporaneo (base64 encoded)
        $token = base64_encode(Str::random(32).'|'.time());

        // Salvare token in employeeportaltoken
        EmployeePortalToken::create([
            'employee_uuid' => $employee->uuid,
            'token' => $token,
        ]);

        return response()->json([
            'ok' => 1,
            'order_uuid' => $order->uuid,
            'autocontrollo' => $order->autocontrollo ? 1 : 0,
            'employee' => [
                'uuid' => $employee->uuid,
                'name' => $employee->name,
                'surname' => $employee->surname,
                'matriculation_number' => $employee->matriculation_number,
                'token' => $token,
            ],
        ]);
    }

    /**
     * 2. Login with matriculation number and password
     * POST /api/production/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'matriculation_number' => 'required|string',
            'password' => 'required|string',
        ]);

        $employee = Employee::where('matriculation_number', $request->get('matriculation_number'))
            ->where('removed', false)
            ->where('portal_enabled', true)
            ->first();

        if (! $employee || ! $employee->verifyPassword($request->get('password'))) {
            return response()->json(['error' => 'Credenziali non valide'], 401);
        }

        // Generare token temporaneo
        $token = base64_encode(Str::random(32).'|'.time());

        // Salvare token
        EmployeePortalToken::create([
            'employee_uuid' => $employee->uuid,
            'token' => $token,
        ]);

        return response()->json([
            'ok' => 1,
            'employee' => [
                'uuid' => $employee->uuid,
                'name' => $employee->name,
                'surname' => $employee->surname,
                'matriculation_number' => $employee->matriculation_number,
                'token' => $token,
            ],
        ]);
    }

    /**
     * 3. Check token validity
     * POST /api/production/check-token
     */
    public function checkToken(Request $request)
    {
        $token = $request->get('token') ?? $request->input('user_data.token');

        if (empty($token)) {
            return response()->json(['error' => 'Token non fornito'], 400);
        }

        $employee = $this->getEmployeeFromToken($token);

        if (! $employee) {
            return response()->json(['error' => 'Token non valido o scaduto'], 401);
        }

        return response()->json(['ok' => 1]);
    }

    /**
     * 4. Add complete pallet quantity
     * POST /api/production/add-pallet-quantity
     */
    public function addPalletQuantity(Request $request)
    {
        $request->validate([
            'order_uuid' => 'required|string|exists:orderorder,uuid',
            'token' => 'required|string',
        ]);

        $employee = $this->getEmployeeFromToken($request->get('token'));
        if (! $employee) {
            return response()->json(['error' => 'Token non valido o scaduto'], 401);
        }

        return DB::transaction(function () use ($request, $employee) {
            $order = Order::where('uuid', $request->get('order_uuid'))
                ->where('removed', false)
                ->with('article')
                ->firstOrFail();

            $article = $order->article;
            if (! $article) {
                return response()->json(['error' => 'L\'ordine non ha articolo associato'], 400);
            }

            // Calcolare quantità per pallet
            $palletQuantity = $this->palletCalculationService->getPalletQuantity($article->uuid);

            // Calcolare quantità processata
            $processedQuantity = $this->palletCalculationService->getProcessedQuantity($order->uuid);

            // Calcolare quantità da aggiungere: pallet_quantity - (processed % pallet_quantity)
            $quantityToAdd = $palletQuantity - ((int) $processedQuantity % $palletQuantity);

            // Registrare lavorazione
            ProductionOrderProcessing::create([
                'employee_uuid' => $employee->uuid,
                'order_uuid' => $order->uuid,
                'quantity' => $quantityToAdd,
                'processed_datetime' => now(),
            ]);

            // Aggiornare worked_quantity e stato
            $this->updateOrderWorkedQuantity($order->uuid);

            // Verificare se si completa pallet
            $newProcessedQuantity = $processedQuantity + $quantityToAdd;
            $printUrl = null;

            if ($newProcessedQuantity % $palletQuantity === 0) {
                // Completato un pallet, generare URL di stampa
                // Nota: nel sistema legacy si cerca il foglio pallet associato all'articolo
                // Per ora restituiamo null, si può implementare la logica di ricerca
                $printUrl = $this->generatePrintUrl(null); // TODO: implementare ricerca foglio pallet
            }

            return response()->json([
                'ok' => 1,
                'print_url' => $printUrl,
            ]);
        });
    }

    /**
     * 5. Add manual quantity
     * POST /api/production/add-manual-quantity
     */
    public function addManualQuantity(Request $request)
    {
        $request->validate([
            'order_uuid' => 'required|string|exists:orderorder,uuid',
            'quantity' => 'required|numeric|min:0.01',
            'token' => 'required|string',
        ]);

        $employee = $this->getEmployeeFromToken($request->get('token'));
        if (! $employee) {
            return response()->json(['error' => 'Token non valido o scaduto'], 401);
        }

        return DB::transaction(function () use ($request, $employee) {
            $order = Order::where('uuid', $request->get('order_uuid'))
                ->where('removed', false)
                ->with('article')
                ->firstOrFail();

            $quantity = (float) $request->get('quantity');

            // Calcolare quantità per completare pallet
            $quantityToFinishPallet = $this->palletCalculationService->getQuantityToFinishPallet($order->uuid);

            // Registrare lavorazione
            ProductionOrderProcessing::create([
                'employee_uuid' => $employee->uuid,
                'order_uuid' => $order->uuid,
                'quantity' => $quantity,
                'processed_datetime' => now(),
            ]);

            // Aggiornare worked_quantity e stato
            $this->updateOrderWorkedQuantity($order->uuid);

            // Se quantity >= quantity_to_finish_pallet, generare URL di stampa
            $printUrl = null;
            if ($quantity >= $quantityToFinishPallet) {
                $printUrl = $this->generatePrintUrl(null); // TODO: implementare ricerca foglio pallet
            }

            return response()->json([
                'ok' => 1,
                'print_url' => $printUrl,
            ]);
        });
    }

    /**
     * 6. Suspend order
     * POST /api/production/suspend-order
     */
    public function suspendOrder(Request $request)
    {
        $request->validate([
            'order_uuid' => 'required|string|exists:orderorder,uuid',
            'token' => 'required|string',
        ]);

        $employee = $this->getEmployeeFromToken($request->get('token'));
        if (! $employee) {
            return response()->json(['error' => 'Token non valido o scaduto'], 401);
        }

        $order = Order::where('uuid', $request->get('order_uuid'))
            ->where('removed', false)
            ->firstOrFail();

        // Impostare stato a 4 (Sospeso)
        $order->status = Order::STATUS_SOSPESO;
        $order->motivazione = 'Autocontrollo Non Superato';
        $order->save();

        return response()->json(['ok' => 1]);
    }

    /**
     * 7. Confirm autocontrollo
     * POST /api/production/confirm-autocontrollo
     */
    public function confirmAutocontrollo(Request $request)
    {
        $request->validate([
            'order_uuid' => 'required|string|exists:orderorder,uuid',
            'token' => 'required|string',
        ]);

        $employee = $this->getEmployeeFromToken($request->get('token'));
        if (! $employee) {
            return response()->json(['error' => 'Token non valido o scaduto'], 401);
        }

        $order = Order::where('uuid', $request->get('order_uuid'))
            ->where('removed', false)
            ->firstOrFail();

        // Marcar autocontrollo = 1
        $order->autocontrollo = true;
        $order->save();

        return response()->json(['ok' => 1]);
    }

    /**
     * 8. Get employee order list
     * POST /api/production/employee-order-list
     */
    public function getEmployeeOrderList(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $employee = $this->getEmployeeFromToken($request->get('token'));
        if (! $employee) {
            return response()->json(['error' => 'Token non valido o scaduto'], 401);
        }

        // Ottenere ordini con stato 2 o 3
        $orders = Order::whereIn('status', [Order::STATUS_LANCIATO, Order::STATUS_IN_AVANZAMENTO])
            ->where('removed', false)
            ->with([
                'article.offer.customer',
                'article.offer.customerDivision',
                'shippingAddress',
            ])
            ->get();

        // Arricchire con dati e calcolare remain_quantity
        $ordersData = $orders->map(function ($order) {
            $remainQuantity = $order->quantity - $order->worked_quantity;

            return [
                'uuid' => $order->uuid,
                'order_production_number' => $order->order_production_number,
                'number_customer_reference_order' => $order->number_customer_reference_order,
                'quantity' => $order->quantity,
                'worked_quantity' => $order->worked_quantity,
                'remain_quantity' => $remainQuantity,
                'status' => $order->status,
                'status_label' => $order->status_label,
                'autocontrollo' => $order->autocontrollo ? 1 : 0,
                'article' => $order->article ? [
                    'uuid' => $order->article->uuid,
                    'cod_article_las' => $order->article->cod_article_las,
                    'article_descr' => $order->article->article_descr,
                ] : null,
                'customer' => $order->article && $order->article->offer && $order->article->offer->customer ? [
                    'uuid' => $order->article->offer->customer->uuid,
                    'company_name' => $order->article->offer->customer->company_name,
                ] : null,
                'division' => $order->article && $order->article->offer && $order->article->offer->customerDivision ? [
                    'uuid' => $order->article->offer->customerDivision->uuid,
                    'name' => $order->article->offer->customerDivision->name,
                ] : null,
                'shipping_address' => $order->shippingAddress ? [
                    'uuid' => $order->shippingAddress->uuid,
                    'street' => $order->shippingAddress->street,
                    'city' => $order->shippingAddress->city,
                ] : null,
            ];
        });

        return response()->json([
            'ok' => 1,
            'order' => $ordersData,
        ]);
    }

    /**
     * 9. Get complete order information
     * POST /api/production/get-info
     */
    public function getInfo(Request $request)
    {
        $request->validate([
            'order_uuid' => 'required|string|exists:orderorder,uuid',
            'token' => 'required|string',
        ]);

        $employee = $this->getEmployeeFromToken($request->get('token'));
        if (! $employee) {
            return response()->json(['error' => 'Token non valido o scaduto'], 401);
        }

        $order = Order::where('uuid', $request->get('order_uuid'))
            ->where('removed', false)
            ->with([
                'article.offer.lasWorkLine',
                'article.palletType',
                'article.offer.customer',
                'article.offer.customerDivision',
                'shippingAddress',
            ])
            ->firstOrFail();

        $remainQuantity = $order->quantity - $order->worked_quantity;

        return response()->json([
            'ok' => 1,
            'order' => [
                'uuid' => $order->uuid,
                'order_production_number' => $order->order_production_number,
                'number_customer_reference_order' => $order->number_customer_reference_order,
                'quantity' => $order->quantity,
                'worked_quantity' => $order->worked_quantity,
                'remain_quantity' => $remainQuantity,
                'status' => $order->status,
                'status_label' => $order->status_label,
                'autocontrollo' => $order->autocontrollo ? 1 : 0,
                'article' => $order->article ? [
                    'uuid' => $order->article->uuid,
                    'cod_article_las' => $order->article->cod_article_las,
                    'article_descr' => $order->article->article_descr,
                    'plan_packaging' => $order->article->plan_packaging,
                    'pallet_plans' => $order->article->pallet_plans,
                ] : null,
                'offer' => $order->article && $order->article->offer ? [
                    'uuid' => $order->article->offer->uuid,
                    'offer_number' => $order->article->offer->offer_number,
                ] : null,
                'las_work_line' => $order->article && $order->article->offer && $order->article->offer->lasWorkLine ? [
                    'uuid' => $order->article->offer->lasWorkLine->uuid,
                    'code' => $order->article->offer->lasWorkLine->code,
                    'name' => $order->article->offer->lasWorkLine->name,
                ] : null,
                'pallet_type' => $order->article && $order->article->palletType ? [
                    'uuid' => $order->article->palletType->uuid,
                    'cod' => $order->article->palletType->cod,
                    'description' => $order->article->palletType->description,
                ] : null,
                'customer' => $order->article && $order->article->offer && $order->article->offer->customer ? [
                    'uuid' => $order->article->offer->customer->uuid,
                    'company_name' => $order->article->offer->customer->company_name,
                ] : null,
                'division' => $order->article && $order->article->offer && $order->article->offer->customerDivision ? [
                    'uuid' => $order->article->offer->customerDivision->uuid,
                    'name' => $order->article->offer->customerDivision->name,
                ] : null,
                'shipping_address' => $order->shippingAddress ? [
                    'uuid' => $order->shippingAddress->uuid,
                    'street' => $order->shippingAddress->street,
                    'city' => $order->shippingAddress->city,
                    'postal_code' => $order->shippingAddress->postal_code,
                ] : null,
            ],
        ]);
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ApiResponseResource;
use App\Models\Employee;
use App\Models\EmployeePortalToken;
use App\Services\PalletCalculationService;
use Domain\Production\Actions\AuthenticateEmployeeAction;
use Domain\Production\Actions\ConfirmAutocontrolloAction;
use Domain\Production\Actions\GetEmployeeOrderListAction;
use Domain\Production\Actions\GetProductionOrderInfoAction;
use Domain\Production\Actions\ProcessPalletQuantityAction;
use Domain\Production\Actions\RegisterManualQuantityAction;
use Domain\Production\Actions\SuspendOrderAction;
use Domain\Production\Actions\UpdateOrderWorkedQuantityAction;
use Domain\Production\DTOs\PalletMovementDto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductionPortalController extends Controller
{
    public function __construct(
        protected PalletCalculationService $palletCalculationService,
        protected ProcessPalletQuantityAction $processPalletQuantityAction,
        protected AuthenticateEmployeeAction $authenticateEmployeeAction,
        protected UpdateOrderWorkedQuantityAction $updateOrderWorkedQuantityAction,
        protected RegisterManualQuantityAction $registerManualQuantityAction,
        protected SuspendOrderAction $suspendOrderAction,
        protected ConfirmAutocontrolloAction $confirmAutocontrolloAction,
        protected GetEmployeeOrderListAction $getEmployeeOrderListAction,
        protected GetProductionOrderInfoAction $getProductionOrderInfoAction,
    ) {}

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
     * 1. Authenticate with EAN codes
     * POST /api/production/authenticate
     */
    public function authenticate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'employee_number' => 'required|string',
            'order_number' => 'required|string',
        ]);

        $result = $this->authenticateEmployeeAction->execute(
            $validated['employee_number'],
            $validated['order_number'],
        );

        if ($result['success'] === false) {
            return ApiResponseResource::error(
                $result['message'] ?? '',
                null
            )->additional([
                'error' => $result['message'] ?? '',
            ])->response()->setStatusCode($result['status']);
        }

        return ApiResponseResource::success(
            true,
            null,
            $result['data']
        )->additional([
            'ok' => 1,
            'order_uuid' => $result['data']['order_uuid'] ?? null,
            'autocontrollo' => $result['data']['autocontrollo'] ?? 0,
            'employee' => $result['data']['employee'] ?? null,
        ])->response()->setStatusCode($result['status']);
    }

    /**
     * 2. Login with matriculation number and password
     * POST /api/production/login
     */
    public function login(Request $request): JsonResponse
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
            return ApiResponseResource::error(
                __('production_portal.invalid_credentials')
            )->additional([
                'error' => __('production_portal.invalid_credentials'),
            ])->response()->setStatusCode(401);
        }

        // Generate temporary token
        $token = base64_encode(Str::random(32).'|'.time());

        // Salvare token
        EmployeePortalToken::create([
            'employee_uuid' => $employee->uuid,
            'token' => $token,
        ]);

        return ApiResponseResource::success(
            true,
            null,
            [
                'employee' => [
                    'uuid' => $employee->uuid,
                    'name' => $employee->name,
                    'surname' => $employee->surname,
                    'matriculation_number' => $employee->matriculation_number,
                    'token' => $token,
                ],
            ]
        )->additional([
            'ok' => 1,
            'employee' => [
                'uuid' => $employee->uuid,
                'name' => $employee->name,
                'surname' => $employee->surname,
                'matriculation_number' => $employee->matriculation_number,
                'token' => $token,
            ],
        ])->response();
    }

    /**
     * 3. Check token validity
     * POST /api/production/check-token
     */
    public function checkToken(Request $request): JsonResponse
    {
        $token = $request->get('token') ?? $request->input('user_data.token');

        if (empty($token)) {
            return ApiResponseResource::error(
                __('production_portal.token_not_provided')
            )->additional([
                'error' => __('production_portal.token_not_provided'),
            ])->response()->setStatusCode(400);
        }

        $employee = $this->getEmployeeFromToken($token);

        if (! $employee) {
            return ApiResponseResource::error(
                __('production_portal.token_invalid_expired')
            )->additional([
                'error' => __('production_portal.token_invalid_expired'),
            ])->response()->setStatusCode(401);
        }

        return ApiResponseResource::success(
            true,
            null,
            ['ok' => 1]
        )->additional([
            'ok' => 1,
        ])->response();
    }

    /**
     * 4. Add complete pallet quantity
     * POST /api/production/add-pallet-quantity
     */
    public function addPalletQuantity(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_uuid' => 'required|string|exists:orderorder,uuid',
            'token' => 'required|string',
        ]);

        $employee = $this->getEmployeeFromToken($validated['token']);
        if ($employee === null) {
            return ApiResponseResource::error(
                __('production_portal.token_invalid_expired')
            )->additional([
                'error' => __('production_portal.token_invalid_expired'),
            ])->response()->setStatusCode(401);
        }

        $dto = new PalletMovementDto(
            orderUuid: $validated['order_uuid'],
            employeeUuid: $employee->uuid,
        );

        $response = $this->processPalletQuantityAction->execute($dto);

        $this->updateOrderWorkedQuantityAction->execute($validated['order_uuid']);

        return $response;
    }

    /**
     * 5. Add manual quantity
     * POST /api/production/add-manual-quantity
     */
    public function addManualQuantity(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_uuid' => 'required|string|exists:orderorder,uuid',
            'quantity' => 'required|numeric|min:0.01',
            'token' => 'required|string',
        ]);

        $employee = $this->getEmployeeFromToken($validated['token']);
        if (! $employee) {
            return ApiResponseResource::error(
                __('production_portal.token_invalid_expired')
            )->additional([
                'error' => __('production_portal.token_invalid_expired'),
            ])->response()->setStatusCode(401);
        }

        $result = $this->registerManualQuantityAction->execute(
            $validated['order_uuid'],
            $employee->uuid,
            (float) $validated['quantity'],
        );

        return ApiResponseResource::success(
            $result['success'],
            $result['message'],
            $result['data']
        )->additional([
            'ok' => $result['success'] === true ? 1 : 0,
            'print_url' => $result['data']['print_url'] ?? null,
        ])->response()->setStatusCode($result['status']);
    }

    /**
     * 6. Suspend order
     * POST /api/production/suspend-order
     */
    public function suspendOrder(Request $request): JsonResponse
    {
        $request->validate([
            'order_uuid' => 'required|string|exists:orderorder,uuid',
            'token' => 'required|string',
        ]);

        $employee = $this->getEmployeeFromToken($request->get('token'));
        if (! $employee) {
            return ApiResponseResource::error(
                __('production_portal.token_invalid_expired')
            )->additional([
                'error' => __('production_portal.token_invalid_expired'),
            ])->response()->setStatusCode(401);
        }

        $this->suspendOrderAction->execute($request->get('order_uuid'));

        return ApiResponseResource::success(
            true,
            null,
            ['ok' => 1]
        )->additional([
            'ok' => 1,
        ])->response();
    }

    /**
     * 7. Confirm autocontrollo
     * POST /api/production/confirm-autocontrollo
     */
    public function confirmAutocontrollo(Request $request): JsonResponse
    {
        $request->validate([
            'order_uuid' => 'required|string|exists:orderorder,uuid',
            'token' => 'required|string',
        ]);

        $employee = $this->getEmployeeFromToken($request->get('token'));
        if (! $employee) {
            return ApiResponseResource::error(
                __('production_portal.token_invalid_expired')
            )->additional([
                'error' => __('production_portal.token_invalid_expired'),
            ])->response()->setStatusCode(401);
        }

        $this->confirmAutocontrolloAction->execute($request->get('order_uuid'));

        return ApiResponseResource::success(
            true,
            null,
            ['ok' => 1]
        )->additional([
            'ok' => 1,
        ])->response();
    }

    /**
     * 8. Get employee order list
     * POST /api/production/employee-order-list
     */
    public function getEmployeeOrderList(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        $employee = $this->getEmployeeFromToken($request->get('token'));
        if (! $employee) {
            return ApiResponseResource::error(
                __('production_portal.token_invalid_expired')
            )->additional([
                'error' => __('production_portal.token_invalid_expired'),
            ])->response()->setStatusCode(401);
        }

        $ordersData = $this->getEmployeeOrderListAction->execute();

        return ApiResponseResource::success(
            true,
            null,
            [
                'order' => $ordersData,
            ]
        )->additional([
            'ok' => 1,
            'order' => $ordersData,
        ])->response();
    }

    /**
     * 9. Get complete order information
     * POST /api/production/get-info
     */
    public function getInfo(Request $request): JsonResponse
    {
        $request->validate([
            'order_uuid' => 'required|string|exists:orderorder,uuid',
            'token' => 'required|string',
        ]);

        $employee = $this->getEmployeeFromToken($request->get('token'));
        if (! $employee) {
            return ApiResponseResource::error(
                __('production_portal.token_invalid_expired')
            )->additional([
                'error' => __('production_portal.token_invalid_expired'),
            ])->response()->setStatusCode(401);
        }

        $payload = $this->getProductionOrderInfoAction->execute($request->get('order_uuid'));

        return ApiResponseResource::success(
            true,
            null,
            [
                'order' => $payload,
            ]
        )->additional([
            'ok' => 1,
            'order' => $payload,
        ])->response();
    }
}

<?php

declare(strict_types=1);

namespace Domain\Orders\Actions;

use App\Enums\OrderStatus;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;

class ChangeOrderStatusAction
{
    /**
     * @return array{success: bool, status: int, message: string, data: array<string, mixed>|null}
     */
    public function execute(Order $order, Request $request): array
    {
        $newStatus = (int) $request->input('status');
        $currentStatus = $order->status;

        if ($this->isValidStatusTransition($currentStatus, $newStatus) !== true) {
            return [
                'success' => false,
                'status' => 400,
                'message' => __('flash.invalid_state_transition'),
                'data' => null,
            ];
        }

        $updateData = ['status' => $newStatus];

        if ($newStatus === OrderStatus::SOSPESO->value) {
            $updateData['motivazione'] = $request->input('motivazione');
        }

        if ($newStatus === OrderStatus::IN_AVANZAMENTO->value && $request->has('force')) {
            $updateData['autocontrollo'] = false;
        }

        $order->update($updateData);

        $freshOrder = $order->fresh();

        return [
            'success' => true,
            'status' => 200,
            'message' => __('flash.order_state_updated'),
            'data' => $freshOrder !== null ? OrderResource::make($freshOrder)->toArray($request) : null,
        ];
    }

    protected function isValidStatusTransition(int $currentStatus, int $newStatus): bool
    {
        if ($currentStatus === OrderStatus::SALDATO->value) {
            return false;
        }

        if ($newStatus === OrderStatus::SOSPESO->value) {
            return true;
        }

        if ($currentStatus === OrderStatus::SOSPESO->value) {
            return $newStatus !== OrderStatus::SOSPESO->value;
        }

        $validTransitions = [
            OrderStatus::PIANIFICATO->value => [OrderStatus::IN_ALLESTIMENTO->value],
            OrderStatus::IN_ALLESTIMENTO->value => [OrderStatus::LANCIATO->value],
            OrderStatus::LANCIATO->value => [OrderStatus::IN_AVANZAMENTO->value],
            OrderStatus::IN_AVANZAMENTO->value => [OrderStatus::EVASO->value],
            OrderStatus::EVASO->value => [OrderStatus::SALDATO->value],
        ];

        return isset($validTransitions[$currentStatus])
            && in_array($newStatus, $validTransitions[$currentStatus], true);
    }
}

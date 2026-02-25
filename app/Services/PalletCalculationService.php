<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Order;
use App\Models\ProductionOrderProcessing;

class PalletCalculationService
{
    /**
     * Calcola la quantità per pallet in base all'articolo
     *
     * Formula: pallet_quantity = plan_packaging * pallet_plans
     *
     * @param  string  $articleUuid  UUID dell'articolo
     * @return int Quantità per pallet
     *
     * @throws \Exception Se l'articolo non esiste
     */
    public function getPalletQuantity(string $articleUuid): int
    {
        $article = Article::where('uuid', $articleUuid)
            ->where('removed', false)
            ->firstOrFail();

        $planPackaging = $article->plan_packaging ?? 0;
        $palletPlans = $article->pallet_plans ?? 0;

        if ($planPackaging <= 0 || $palletPlans <= 0) {
            throw new \Exception(__('services.pallet.invalid_packaging'));
        }

        return $planPackaging * $palletPlans;
    }

    /**
     * Calcola la quantità processata di un ordine
     *
     * @param  string  $orderUuid  UUID dell'ordine
     * @return float Quantità processata
     */
    public function getProcessedQuantity(string $orderUuid): float
    {
        return ProductionOrderProcessing::where('order_uuid', $orderUuid)
            ->where('removed', false)
            ->sum('quantity') ?? 0;
    }

    /**
     * Calcola la quantità restante per completare un pallet
     *
     * Formula: quantity_to_finish = pallet_quantity - (processed % pallet_quantity)
     *
     * @param  string  $orderUuid  UUID dell'ordine
     * @return int Quantità restante per completare pallet
     */
    public function getQuantityToFinishPallet(string $orderUuid): int
    {
        $order = Order::where('uuid', $orderUuid)
            ->where('removed', false)
            ->with('article')
            ->firstOrFail();

        $article = $order->article;
        if (! $article) {
            throw new \Exception(__('services.pallet.order_has_no_article'));
        }

        $palletQuantity = $this->getPalletQuantity($article->uuid);
        $processedQuantity = $this->getProcessedQuantity($orderUuid);

        return $palletQuantity - ((int) $processedQuantity % $palletQuantity);
    }

    /**
     * Verifica si al añadir una cantidad se completa un pallet
     *
     * @param  string  $orderUuid  UUID de la orden
     * @param  float  $quantity  Cantidad a añadir
     * @return bool True se si completa il pallet
     */
    public function willCompletePallet(string $orderUuid, float $quantity): bool
    {
        $order = Order::where('uuid', $orderUuid)
            ->where('removed', false)
            ->with('article')
            ->firstOrFail();

        $article = $order->article;
        if (! $article) {
            return false;
        }

        $palletQuantity = $this->getPalletQuantity($article->uuid);
        $processedQuantity = $this->getProcessedQuantity($orderUuid);

        // Verify that adding quantity, total is multiple of pallet_quantity
        return ($processedQuantity + $quantity) % $palletQuantity === 0;
    }

    /**
     * Calcula cuántos pallets completos hay en una cantidad procesada
     *
     * @param  string  $orderUuid  UUID de la orden
     * @return int Número de pallets completos
     */
    public function getCompletedPallets(string $orderUuid): int
    {
        $order = Order::where('uuid', $orderUuid)
            ->where('removed', false)
            ->with('article')
            ->firstOrFail();

        $article = $order->article;
        if (! $article) {
            return 0;
        }

        $palletQuantity = $this->getPalletQuantity($article->uuid);
        $processedQuantity = $this->getProcessedQuantity($orderUuid);

        return (int) ($processedQuantity / $palletQuantity);
    }
}

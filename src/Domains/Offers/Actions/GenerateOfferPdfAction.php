<?php

declare(strict_types=1);

namespace Domain\Offers\Actions;

use App\Models\Offer;
use App\Models\OfferLsResource;
use App\Models\OfferOperationList;
use Illuminate\Support\Facades\Log;

class GenerateOfferPdfAction
{
    /**
     * Genera el PDF de una oferta y devuelve contenido y nombre de archivo.
     *
     * @return array{pdf: string, filename: string}
     */
    public function execute(Offer $offer): array
    {
        $tmpDir = storage_path('app/tmp/offers');
        if (! is_dir($tmpDir)) {
            mkdir($tmpDir, 0755, true);
        }

        if ($offer->lsresource_uuid && ! $offer->lsResource) {
            $lsResource = OfferLsResource::withoutGlobalScopes()
                ->where('uuid', $offer->lsresource_uuid)
                ->first();
            $offer->setRelation('lsResource', $lsResource);
        }

        $operationLists = OfferOperationList::withoutGlobalScopes()
            ->where('offer_uuid', $offer->uuid)
            ->where('removed', false)
            ->with('operation')
            ->get();

        $totalSec = 0.0;
        foreach ($operationLists as $operationList) {
            $operation = $operationList->operation;
            if (! $operation) {
                continue;
            }

            $secOp = (float) ($operation->secondi_operazione ?? 0);
            $numOp = (float) ($operationList->num_op ?? 0);
            $totalSec += $secOp * $numOp;
        }

        $unexpected = $totalSec * 0.05;
        $totalTheoreticalTime = $totalSec + $unexpected;
        $productionTimeCfz = ($totalTheoreticalTime * 8) / 7;

        $productionAverageCfz = 0.0;
        if ($productionTimeCfz > 0) {
            $productionAverageCfz = 3600 / $productionTimeCfz;
        }

        $expectedWorkers = (float) ($offer->expected_workers ?? 0);
        $hourlyProductivity = $expectedWorkers * $productionAverageCfz;

        $rateIncreaseCfz = (float) ($offer->rate_increase_cfz ?? 0);
        $rateRoundingCfz = (float) ($offer->rate_rounding_cfz ?? 0);
        $lsSetupCost = (float) ($offer->ls_setup_cost ?? 0);
        $quantity = (float) ($offer->quantity ?? 0);

        $finalRateCfz = $rateIncreaseCfz + $rateRoundingCfz;
        $runningCostCfz = $finalRateCfz - ($finalRateCfz * ($lsSetupCost / 100));
        $setupCost = $finalRateCfz * ($lsSetupCost / 100) * $quantity;
        $setupCostCfz = $finalRateCfz * ($lsSetupCost / 100);

        $lsResource = $offer->lsResource;

        $data = [
            'offer_date' => optional($offer->offer_date)->format('d.m.Y'),
            'offer_number' => $offer->offer_number,
            'customer_ref' => $offer->customer_ref ?? '',
            'provisional_description' => $offer->provisional_description ?? '',
            'hourly_productivity' => round($hourlyProductivity, 2),
            'ls_resource_code' => $lsResource?->code ?? '',
            'ls_resource_description' => $lsResource?->name ?? '',
            'final_rate_cfz' => $finalRateCfz,
            'running_cost_cfz' => $runningCostCfz,
            'setup_cost' => $setupCost,
            'quantity' => $quantity,
            'setup_cost_cfz' => $setupCostCfz,
            'ls_other_costs' => (float) ($offer->ls_other_costs ?? 0),
        ];

        $html = view('offers.pdf', $data)->render();

        $tmpFile = $tmpDir.'/'.$offer->uuid.'.html';
        file_put_contents($tmpFile, $html);

        $wkhtmltopdfPath = config('app.wkhtmltopdf_path', 'wkhtmltopdf');

        $pdfTitle = sprintf(
            'Offerta n. %s del %s',
            $offer->offer_number,
            optional($offer->offer_date)->format('d.m.Y') ?? date('d.m.Y')
        );

        $command = sprintf(
            'ulimit -n 4096; %s --title "%s" %s -',
            escapeshellarg($wkhtmltopdfPath),
            escapeshellarg($pdfTitle),
            escapeshellarg($tmpFile)
        );

        Log::debug('[OFFER] PDF - Executing command: '.$command);

        $pdf = shell_exec($command);

        if (file_exists($tmpFile)) {
            @unlink($tmpFile);
        }

        if ($pdf === null || $pdf === '') {
            throw new \RuntimeException(__('flash.wkhtmltopdf_error'));
        }

        $fileName = sprintf('offerta_%s.pdf', $offer->offer_number);

        return [
            'pdf' => $pdf,
            'filename' => $fileName,
        ];
    }
}

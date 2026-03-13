<?php

declare(strict_types=1);

namespace Domain\Orders\Actions;

use App\Models\Order;
use Illuminate\Support\Facades\Log;

class GenerateOrderAutocontrolloPdfAction
{
    /**
     * Genera el PDF de autocontrollo para un pedido.
     *
     * @return array{pdf: string, filename: string}
     */
    public function execute(Order $order): array
    {
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
            throw new \RuntimeException(__('flash.article_not_found_for_order'));
        }

        $article = $order->article;

        $packagingInstruct = '';
        $palletizingInstruct = '';

        if ($article->packagingInstructions && $article->packagingInstructions->isNotEmpty()) {
            $packagingInstruct = $article->packagingInstructions->pluck('description')->implode(' - ');
        }

        if ($article->palletizingInstructions && $article->palletizingInstructions->isNotEmpty()) {
            $palletizingInstruct = $article->palletizingInstructions->pluck('description')->implode(' - ');
        }

        $labelData = app(GetOrderLabelDataAction::class)->execute($article);

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
            'packaging_instruct' => $packagingInstruct !== '' ? $packagingInstruct : '-',
            'palletizing_instruct' => $palletizingInstruct !== '' ? $palletizingInstruct : '-',
            'pallet_plans' => $article->pallet_plans ?? '-',
            'interlayer_every_floors' => $article->interlayer_every_floors ?? '-',
            'label_info' => $labelData->labelInfo,
            'criticita' => $labelData->criticita,
            'customer_samples' => $labelData->customerSamples,
            'pallet' => $article->palletSheet ?? null,
            'article_material_list' => $labelData->articleMaterials,
            'weight_info' => $labelData->weightInfo,
        ];

        $tmpDir = storage_path('app/tmp/orders/autocontrollo');
        if (! is_dir($tmpDir)) {
            mkdir($tmpDir, 0755, true);
        }

        $html = view('orders.autocontrollo', $data)->render();

        $tmpFile = $tmpDir.'/'.$order->uuid.'.html';
        file_put_contents($tmpFile, $html);

        $wkhtmltopdfPath = env('WKHTMLTOPDF_PATH', '/usr/bin/wkhtmltopdf');
        if (! file_exists($wkhtmltopdfPath)) {
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

        if (file_exists($tmpFile)) {
            @unlink($tmpFile);
        }

        if ($pdf === null || $pdf === '') {
            throw new \RuntimeException(__('flash.wkhtmltopdf_error'));
        }

        $filename = 'autocontrollo_ordine_'.$order->order_production_number.'.pdf';

        return [
            'pdf' => $pdf,
            'filename' => $filename,
        ];
    }
}

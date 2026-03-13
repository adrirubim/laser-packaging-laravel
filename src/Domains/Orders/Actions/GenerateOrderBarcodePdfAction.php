<?php

declare(strict_types=1);

namespace Domain\Orders\Actions;

use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Picqer\Barcode\BarcodeGeneratorHTML;

class GenerateOrderBarcodePdfAction
{
    /**
     * Genera el PDF de barcode para un pedido.
     *
     * @return array{pdf: string, filename: string}
     */
    public function execute(Order $order): array
    {
        $code = str_pad((string) $order->id, 13, '0', STR_PAD_LEFT);

        $generator = new BarcodeGeneratorHTML;
        $barcodeHtml = $generator->getBarcode($code, $generator::TYPE_CODE_128, 3, 60);

        $tmpDir = storage_path('app/tmp/orders/barcodes');
        if (! is_dir($tmpDir)) {
            mkdir($tmpDir, 0755, true);
        }

        $html = view('orders.barcode', [
            'order' => $order,
            'barcode' => $barcodeHtml,
            'code' => $code,
        ])->render();

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

        $pdfTitle = 'Barcode ORDINE '.$order->order_production_number;
        $command = "ulimit -n 4096; {$wkhtmltopdfPath} --title \"{$pdfTitle}\" {$tmpFile} - 2>&1";

        Log::debug('[ORDER] BARCODE PDF - Executing command: '.$command);

        $pdf = shell_exec($command);

        if (file_exists($tmpFile)) {
            @unlink($tmpFile);
        }

        if ($pdf === null || $pdf === '') {
            throw new \RuntimeException(__('flash.wkhtmltopdf_error'));
        }

        $filename = 'barcode_ordine_'.$order->order_production_number.'.pdf';

        return [
            'pdf' => $pdf,
            'filename' => $filename,
        ];
    }
}

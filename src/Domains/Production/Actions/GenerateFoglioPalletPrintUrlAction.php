<?php

declare(strict_types=1);

namespace Domain\Production\Actions;

use App\Models\FoglioPallet;

class GenerateFoglioPalletPrintUrlAction
{
    public function execute(?string $foglioPalletUuid): ?string
    {
        if ($foglioPalletUuid === null || $foglioPalletUuid === '') {
            return null;
        }

        try {
            $foglioPallet = FoglioPallet::where('uuid', $foglioPalletUuid)
                ->where('removed', false)
                ->first();

            if ($foglioPallet !== null && $foglioPallet->filename !== null && $foglioPallet->filename !== '') {
                return route('api.production.foglio-pallet.print', ['uuid' => $foglioPallet->uuid]);
            }
        } catch (\Throwable) {
            // En caso de error, restituir null para no romper el flujo del portal
        }

        return null;
    }
}

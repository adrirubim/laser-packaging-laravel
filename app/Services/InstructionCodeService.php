<?php

namespace App\Services;

use App\Models\ArticleIC;
use App\Models\ArticleIO;
use App\Models\ArticleIP;
use Illuminate\Support\Facades\DB;

class InstructionCodeService
{
    /**
     * Genera el próximo código IC (Instrucciones de Confezionamento)
     *
     * Formato: IC + NNNN
     * - IC: Prefijo fijo
     * - NNNN: Número progresivo a 4 dígitos (0001, 0002, ...)
     *
     * @return string Código IC generado (ej: "IC0001")
     */
    public function generateNextIC(): string
    {
        return DB::transaction(function () {
            // Cercare ultimo codice IC
            // PostgreSQL no tiene UNSIGNED, usar INTEGER o CAST a INTEGER
            $driver = DB::connection()->getDriverName();
            if ($driver === 'pgsql') {
                $lastIC = ArticleIC::where('code', 'like', 'IC%')
                    ->where('removed', false)
                    ->orderByRaw('CAST(SUBSTRING(code, 3) AS INTEGER) DESC')
                    ->lockForUpdate()
                    ->first();
            } else {
                $lastIC = ArticleIC::where('code', 'like', 'IC%')
                    ->where('removed', false)
                    ->orderByRaw('CAST(SUBSTRING(code, 3) AS UNSIGNED) DESC')
                    ->lockForUpdate()
                    ->first();
            }

            $progressive = 1;
            if ($lastIC && ! empty($lastIC->code)) {
                $lastICCode = $lastIC->code;
                $progressive = (int) substr($lastICCode, 2) + 1; // Estrae dopo "IC"
            }

            return sprintf('IC%04d', $progressive);
        });
    }

    /**
     * Genera el próximo código IO (Instrucciones Operative)
     *
     * Formato: IO + NNNN
     *
     * @return string Código IO generado (ej: "IO0001")
     */
    public function generateNextIO(): string
    {
        return DB::transaction(function () {
            // Buscar último código IO
            // PostgreSQL no tiene UNSIGNED, usar INTEGER o CAST a INTEGER
            $driver = DB::connection()->getDriverName();
            if ($driver === 'pgsql') {
                $lastIO = ArticleIO::where('code', 'like', 'IO%')
                    ->where('removed', false)
                    ->orderByRaw('CAST(SUBSTRING(code, 3) AS INTEGER) DESC')
                    ->lockForUpdate()
                    ->first();
            } else {
                $lastIO = ArticleIO::where('code', 'like', 'IO%')
                    ->where('removed', false)
                    ->orderByRaw('CAST(SUBSTRING(code, 3) AS UNSIGNED) DESC')
                    ->lockForUpdate()
                    ->first();
            }

            $progressive = 1;
            if ($lastIO && ! empty($lastIO->code)) {
                $lastIOCode = $lastIO->code;
                $progressive = (int) substr($lastIOCode, 2) + 1; // Extrae después de "IO"
            }

            return sprintf('IO%04d', $progressive);
        });
    }

    /**
     * Genera el próximo código IP (Instrucciones de Palletizzazione)
     *
     * Formato: IP + NNNN
     *
     * @return string Código IP generado (ej: "IP0001")
     */
    public function generateNextIP(): string
    {
        return DB::transaction(function () {
            // Cercare ultimo codice IP
            // PostgreSQL no tiene UNSIGNED, usar INTEGER o CAST a INTEGER
            $driver = DB::connection()->getDriverName();
            if ($driver === 'pgsql') {
                $lastIP = ArticleIP::where('code', 'like', 'IP%')
                    ->where('removed', false)
                    ->orderByRaw('CAST(SUBSTRING(code, 3) AS INTEGER) DESC')
                    ->lockForUpdate()
                    ->first();
            } else {
                $lastIP = ArticleIP::where('code', 'like', 'IP%')
                    ->where('removed', false)
                    ->orderByRaw('CAST(SUBSTRING(code, 3) AS UNSIGNED) DESC')
                    ->lockForUpdate()
                    ->first();
            }

            $progressive = 1;
            if ($lastIP && ! empty($lastIP->code)) {
                $lastIPCode = $lastIP->code;
                $progressive = (int) substr($lastIPCode, 2) + 1; // Estrae dopo "IP"
            }

            return sprintf('IP%04d', $progressive);
        });
    }
}

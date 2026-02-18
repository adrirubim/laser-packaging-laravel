<?php

namespace App\Services\Planning;

/**
 * Ore lavorative per ordine in base a turni (stessa logica usata dal sistema di pianificazione originale).
 *
 * Modalità (shift_mode):
 * - 0 = Giornata (8-16): solo mattina fino alle 16.
 * - 1 = Turni (6-22): in base a shift_morning e shift_afternoon.
 *
 * Combinazioni:
 * - Giornata (shift_mode=0): 8-16 (ore abilitate 8,9,…,15).
 * - Solo mattina (shift_mode=1, shift_morning=1, shift_afternoon=0): 6-14.
 * - Solo pomeriggio (shift_mode=1, shift_morning=0, shift_afternoon=1): 14-22.
 * - Mattina + Pomeriggio (shift_mode=1, shift_morning=1, shift_afternoon=1): 6-22.
 *
 * Non esiste turno notte nella logica attuale.
 */
class OrderShiftHours
{
    /** Modalità Giornata: 8-16 */
    public const SHIFT_MODE_GIORNATA = 0;

    /** Modalità Turni: 6-22 con mattina/pomeriggio */
    public const SHIFT_MODE_TURNI = 1;

    /**
     * Etichette modalità (allineate ai valori di shift_mode dell'ordine).
     *
     * @return array<int, string>
     */
    public static function shiftModeLabels(): array
    {
        return [
            self::SHIFT_MODE_GIORNATA => 'Giornata (8-16)',
            self::SHIFT_MODE_TURNI => 'Turni (6-22)',
        ];
    }

    /**
     * Restituisce [startHour, endHour, hoursPerDay] per l'ordine (réplica legacy getWorkingHoursForOrder).
     *
     * @param  array{shift_mode?: int, shift_morning?: int|bool, shift_afternoon?: int|bool}  $orderData
     * @return array{startHour: int, endHour: int, hoursPerDay: int}
     */
    public static function forOrder(array $orderData): array
    {
        $shiftMode = (int) ($orderData['shift_mode'] ?? 0);

        if ($shiftMode === self::SHIFT_MODE_GIORNATA) {
            return ['startHour' => 8, 'endHour' => 16, 'hoursPerDay' => 8];
        }

        $shiftMorning = (int) (bool) ($orderData['shift_morning'] ?? false);
        $shiftAfternoon = (int) (bool) ($orderData['shift_afternoon'] ?? false);

        if ($shiftMorning && $shiftAfternoon) {
            return ['startHour' => 6, 'endHour' => 22, 'hoursPerDay' => 16];
        }
        if ($shiftMorning) {
            return ['startHour' => 6, 'endHour' => 14, 'hoursPerDay' => 8];
        }
        if ($shiftAfternoon) {
            return ['startHour' => 14, 'endHour' => 22, 'hoursPerDay' => 8];
        }

        return ['startHour' => 8, 'endHour' => 16, 'hoursPerDay' => 8];
    }

    /**
     * Indica se l'ora (0-23) è abilitata per l'ordine (stessa logica del frontend isCellEnabledForOrder).
     *
     * @param  array{shift_mode?: int, shift_morning?: int|bool, shift_afternoon?: int|bool}  $orderData
     */
    public static function isHourEnabled(array $orderData, int $hour): bool
    {
        $h = self::forOrder($orderData);

        return $hour >= $h['startHour'] && $hour < $h['endHour'];
    }
}

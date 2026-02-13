<?php

namespace App\Services\Planning;

use App\Models\Order;
use App\Models\ProductionPlanning;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

/**
 * Replan and auto-schedule logic mirroring legacy production\planning.
 * Uses shift_mode, shift_morning, shift_afternoon, work_saturday for working hours and days.
 */
class PlanningReplanService
{
    public function __construct(
        protected PlanningCalculationService $calculationService
    ) {}

    /**
     * Build order data array for working hours / replan (legacy getOrderFormulaData shape).
     */
    protected function getOrderFormulaData(string $orderUuid): ?array
    {
        $order = Order::query()->with(['article.offer'])->where('uuid', $orderUuid)->first();
        if (! $order) {
            return null;
        }

        $calc = $this->calculationService->calculateForOrder($order);
        if (($calc['error_code'] ?? 0) !== 0) {
            return null;
        }

        return [
            'quantity' => (float) $calc['quantity'],
            'worked_quantity' => (float) $calc['worked_quantity'],
            'media_reale_pz_h_ps' => (float) $calc['media_reale_pz_h_ps'],
            'expected_workers' => (int) $calc['expected_workers'],
            'lasworkline_uuid' => $calc['lasworkline_uuid'] ?? null,
            'delivery_requested_date' => $order->delivery_requested_date?->getTimestamp(),
            'shift_mode' => (int) ($order->shift_mode ?? 0),
            'shift_morning' => (int) (bool) $order->shift_morning,
            'shift_afternoon' => (int) (bool) $order->shift_afternoon,
            'work_saturday' => (int) (bool) $order->work_saturday,
        ];
    }

    protected function getWorkingHoursForOrder(array $orderData): array
    {
        $shiftMode = (int) ($orderData['shift_mode'] ?? 0);
        if ($shiftMode === 0) {
            return ['startHour' => 8, 'endHour' => 16, 'hoursPerDay' => 8];
        }
        $shiftMorning = (int) ($orderData['shift_morning'] ?? 0);
        $shiftAfternoon = (int) ($orderData['shift_afternoon'] ?? 0);
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

    protected function isWorkingDay(Carbon $date, array $orderData): bool
    {
        $dayOfWeek = (int) $date->format('N');
        if ($dayOfWeek === 7) {
            return false;
        }
        if ($dayOfWeek === 6) {
            return (int) ($orderData['work_saturday'] ?? 0) === 1;
        }
        return true;
    }

    protected function getCurrentSlotKey(Carbon $dt): int
    {
        $hour = (int) $dt->format('H');
        $minute = (int) floor((int) $dt->format('i') / 15) * 15;
        return $hour * 100 + $minute;
    }

    protected function isSlotFuture(string $slotDate, $slotKey, string $currentDate, int $currentSlotKey): bool
    {
        if (strcmp($slotDate, $currentDate) > 0) {
            return true;
        }
        if ($slotDate === $currentDate && (int) $slotKey >= $currentSlotKey) {
            return true;
        }
        return false;
    }

    /**
     * Get future slots for an order (from now or from given datetime).
     */
    protected function getFutureSlots(string $orderUuid, ?Carbon $from = null): array
    {
        $from = $from ?? Carbon::now();
        $currentDateStr = $from->format('Y-m-d');
        $currentSlotKey = $this->getCurrentSlotKey($from);

        $allPlanning = ProductionPlanning::query()
            ->where('order_uuid', $orderUuid)
            ->orderBy('date')
            ->get();

        $futureSlots = [];
        foreach ($allPlanning as $record) {
            $recordDate = $record->date->format('Y-m-d');
            $hours = $record->hours ?? [];
            foreach ($hours as $slotKey => $workers) {
                if ($this->isSlotFuture($recordDate, $slotKey, $currentDateStr, $currentSlotKey)) {
                    $futureSlots[] = ['date' => $recordDate, 'slot' => $slotKey, 'workers' => $workers];
                }
            }
        }
        return $futureSlots;
    }

    protected function findLastPlannedSlot(string $orderUuid): ?array
    {
        $allPlanning = ProductionPlanning::query()
            ->where('order_uuid', $orderUuid)
            ->orderBy('date')
            ->get();

        $slots = [];
        foreach ($allPlanning as $record) {
            $recordDate = $record->date->format('Y-m-d');
            $hours = $record->hours ?? [];
            foreach ($hours as $slotKey => $workers) {
                $slots[] = [
                    'date' => $recordDate,
                    'slotKey' => (int) $slotKey,
                    'workers' => $workers,
                ];
            }
        }
        if (empty($slots)) {
            return null;
        }
        usort($slots, fn ($a, $b) => strcmp($a['date'], $b['date']) ?: $a['slotKey'] <=> $b['slotKey']);
        return end($slots);
    }

    protected function removeFuturePlanning(string $orderUuid): void
    {
        $now = Carbon::now();
        $currentDateStr = $now->format('Y-m-d');
        $currentSlotKey = $this->getCurrentSlotKey($now);

        $allPlanning = ProductionPlanning::query()
            ->where('order_uuid', $orderUuid)
            ->get();

        foreach ($allPlanning as $record) {
            $recordDate = $record->date->format('Y-m-d');
            if (strcmp($recordDate, $currentDateStr) > 0) {
                $record->delete();
            } elseif ($recordDate === $currentDateStr) {
                $hours = $record->hours ?? [];
                $filtered = [];
                foreach ($hours as $slotKey => $workers) {
                    if ((int) $slotKey < $currentSlotKey) {
                        $filtered[(string) $slotKey] = $workers;
                    }
                }
                if (empty($filtered)) {
                    $record->delete();
                } else {
                    $record->hours = $filtered;
                    $record->save();
                }
            }
        }
    }

    protected function addQuartersCount(string $orderUuid, int $quartersToAdd, array $orderData): array
    {
        if ($quartersToAdd <= 0) {
            return ['error' => false, 'message' => 'Nessun quarto da aggiungere', 'quarters_added' => 0, 'quarters_removed' => 0];
        }

        $lineUuid = $orderData['lasworkline_uuid'] ?? null;
        if (empty($lineUuid)) {
            return ['error' => false, 'message' => 'Nessuna linea LAS associata', 'quarters_added' => 0, 'quarters_removed' => 0];
        }
        $expectedWorkers = (int) $orderData['expected_workers'];
        $workingHours = $this->getWorkingHoursForOrder($orderData);
        $workStartHour = $workingHours['startHour'];
        $workEndHour = $workingHours['endHour'];

        $lastSlot = $this->findLastPlannedSlot($orderUuid);
        if (! $lastSlot) {
            return $this->autoScheduleOrder($orderUuid, false);
        }

        $currentDate = Carbon::parse($lastSlot['date']);
        $slotHour = (int) ($lastSlot['slotKey'] / 100);
        $slotMinute = $lastSlot['slotKey'] % 100;
        $slotMinute += 15;
        if ($slotMinute >= 60) {
            $slotMinute = 0;
            $slotHour++;
        }
        if ($slotHour >= $workEndHour) {
            $currentDate->addDay();
            while (! $this->isWorkingDay($currentDate, $orderData)) {
                $currentDate->addDay();
            }
            $slotHour = $workStartHour;
            $slotMinute = 0;
        }

        $quartersRemaining = $quartersToAdd;
        $quartersAdded = 0;

        while ($quartersRemaining > 0) {
            while (! $this->isWorkingDay($currentDate, $orderData)) {
                $currentDate->addDay();
                $slotHour = $workStartHour;
                $slotMinute = 0;
            }
            $dateStr = $currentDate->format('Y-m-d');
            $hoursArray = [];
            while ($quartersRemaining > 0 && $slotHour < $workEndHour) {
                $slotKey = (string) ($slotHour * 100 + $slotMinute);
                $hoursArray[$slotKey] = $expectedWorkers;
                $quartersRemaining--;
                $quartersAdded++;
                $slotMinute += 15;
                if ($slotMinute >= 60) {
                    $slotMinute = 0;
                    $slotHour++;
                }
            }
            if (! empty($hoursArray)) {
                $existing = ProductionPlanning::query()
                    ->where('order_uuid', $orderUuid)
                    ->where('lasworkline_uuid', $lineUuid)
                    ->whereDate('date', $dateStr)
                    ->first();
                if ($existing) {
                    $existingHours = $existing->hours ?? [];
                    $existing->hours = $existingHours + $hoursArray;
                    $existing->save();
                } else {
                    ProductionPlanning::create([
                        'order_uuid' => $orderUuid,
                        'lasworkline_uuid' => $lineUuid,
                        'date' => $dateStr,
                        'hours' => $hoursArray,
                    ]);
                }
            }
            $currentDate->addDay();
            $slotHour = $workStartHour;
            $slotMinute = 0;
        }

        return [
            'error' => false,
            'message' => "Aggiunti {$quartersAdded} quarti",
            'quarters_added' => $quartersAdded,
            'quarters_removed' => 0,
            'workers_per_slot' => $expectedWorkers,
        ];
    }

    protected function removeQuartersCount(string $orderUuid, int $quartersToRemove, array $orderData): array
    {
        if ($quartersToRemove <= 0) {
            return ['error' => false, 'message' => 'Nessun quarto da rimuovere', 'quarters_added' => 0, 'quarters_removed' => 0];
        }
        $futureSlots = $this->getFutureSlots($orderUuid);
        if (empty($futureSlots)) {
            return ['error' => false, 'message' => 'Nessuno slot futuro da rimuovere', 'quarters_added' => 0, 'quarters_removed' => 0];
        }
        usort($futureSlots, fn ($a, $b) => strcmp($a['date'], $b['date']) ?: (int) $a['slot'] <=> (int) $b['slot']);
        $quartersToRemove = min($quartersToRemove, count($futureSlots));
        $slotsToRemove = array_slice($futureSlots, -$quartersToRemove);

        $removeByDate = [];
        foreach ($slotsToRemove as $slot) {
            $removeByDate[$slot['date']][] = $slot['slot'];
        }

        $allPlanning = ProductionPlanning::query()->where('order_uuid', $orderUuid)->get();
        $planningByDate = [];
        foreach ($allPlanning as $record) {
            $planningByDate[$record->date->format('Y-m-d')] = $record;
        }

        $quartersRemoved = 0;
        foreach ($removeByDate as $date => $slotsKeys) {
            if (! isset($planningByDate[$date])) {
                continue;
            }
            $record = $planningByDate[$date];
            $hours = $record->hours ?? [];
            foreach ($slotsKeys as $slotKey) {
                unset($hours[(string) $slotKey]);
                $quartersRemoved++;
            }
            if (empty($hours)) {
                $record->delete();
            } else {
                $record->hours = $hours;
                $record->save();
            }
        }
        return [
            'error' => false,
            'message' => "Rimossi {$quartersRemoved} quarti",
            'quarters_added' => 0,
            'quarters_removed' => $quartersRemoved,
        ];
    }

    public function replanFutureAfterManualEdit(string $orderUuid, ?string $dateFrom = null): array
    {
        $order = Order::query()->where('uuid', $orderUuid)->first();
        if (! $order) {
            return ['error' => true, 'message' => 'Ordine non trovato'];
        }
        $orderData = $this->getOrderFormulaData($orderUuid);
        if (! $orderData) {
            return ['error' => false, 'message' => 'Dati insufficienti per il ricalcolo', 'quarters_added' => 0, 'quarters_removed' => 0];
        }
        $quantity = (float) $orderData['quantity'];
        $workedQuantity = (float) $orderData['worked_quantity'];
        $mediaReale = (float) $orderData['media_reale_pz_h_ps'];
        $expectedWorkers = (int) $orderData['expected_workers'];

        if ($mediaReale <= 0 || $expectedWorkers <= 0) {
            return [
                'error' => true,
                'message' => 'Dati insufficienti per il ricalcolo automatico',
                'quantity' => $quantity,
                'worked_quantity' => $workedQuantity,
                'media_reale_pz_h_ps' => $mediaReale,
                'expected_workers' => $expectedWorkers,
            ];
        }

        $remainingQty = $quantity - $workedQuantity;
        if ($remainingQty <= 0) {
            $this->removeFuturePlanning($orderUuid);
            return ['error' => false, 'message' => 'Ordine completato, planning futuro rimosso', 'saldo' => 0, 'quarters_added' => 0, 'quarters_removed' => 0];
        }

        $hoursNeeded = $remainingQty / ($mediaReale * $expectedWorkers);
        $quartersNeeded = (int) ceil($hoursNeeded * 4);
        $futureSlots = $this->getFutureSlots($orderUuid);
        $quartersPlanned = count($futureSlots);
        $diff = $quartersNeeded - $quartersPlanned;

        if ($diff === 0) {
            return [
                'error' => false,
                'message' => 'Planning allineato',
                'quarters_needed' => $quartersNeeded,
                'quarters_planned' => $quartersPlanned,
                'quarters_added' => 0,
                'quarters_removed' => 0,
            ];
        }
        if ($diff > 0) {
            return $this->addQuartersCount($orderUuid, $diff, $orderData);
        }
        return $this->removeQuartersCount($orderUuid, (int) abs($diff), $orderData);
    }

    public function adjustForWorkedQuantity(string $orderUuid): array
    {
        $order = Order::query()->with(['article.offer'])->where('uuid', $orderUuid)->first();
        if (! $order) {
            return ['error' => true, 'message' => 'Ordine non trovato'];
        }
        $calc = $this->calculationService->calculateForOrder($order);
        if (($calc['error_code'] ?? 0) !== 0) {
            return ['error' => false, 'message' => $calc['message'] ?? 'Dati insufficienti', 'quarters_removed' => 0];
        }

        $hoursNeeded = (float) ($calc['hours_needed'] ?? 0);
        $totalQuartersNeeded = (int) ceil($hoursNeeded * 4);
        $expectedWorkers = (int) $calc['expected_workers'];
        $lineUuid = $calc['lasworkline_uuid'] ?? null;
        if (empty($lineUuid)) {
            return ['error' => false, 'message' => 'Nessuna linea LAS associata all\'ordine', 'quarters_removed' => 0];
        }
        $orderData = $this->getOrderFormulaData($orderUuid);
        if (! $orderData) {
            return ['error' => true, 'message' => 'Ordine non trovato'];
        }

        if ($totalQuartersNeeded <= 0) {
            ProductionPlanning::query()->where('order_uuid', $orderUuid)->delete();
            return ['error' => false, 'message' => 'Ordine completato, planning rimosso', 'quarters_removed' => 0];
        }

        $workingHours = $this->getWorkingHoursForOrder($orderData);
        $workStartHour = $workingHours['startHour'];
        $workEndHour = $workingHours['endHour'];

        $allPlanning = ProductionPlanning::query()->where('order_uuid', $orderUuid)->orderBy('date')->get();
        $slots = [];
        foreach ($allPlanning as $record) {
            $hours = $record->hours ?? [];
            foreach ($hours as $slotKey => $workers) {
                $slots[] = [
                    'date' => $record->date->format('Y-m-d'),
                    'slotKey' => $slotKey,
                    'planningId' => $record->id,
                ];
            }
        }
        usort($slots, fn ($a, $b) => strcmp($a['date'], $b['date']) ?: (int) $a['slotKey'] <=> (int) $b['slotKey']);
        $totalQuartersPlanned = count($slots);
        $diff = $totalQuartersNeeded - $totalQuartersPlanned;

        if ($diff === 0) {
            return ['error' => false, 'message' => 'Planning allineato', 'quarters_removed' => 0];
        }

        if ($diff < 0) {
            $toRemove = (int) abs($diff);
            $slotsToRemove = array_slice($slots, -$toRemove);
            $removeByRecord = [];
            foreach ($slotsToRemove as $s) {
                $removeByRecord[$s['planningId']][] = $s['slotKey'];
            }
            foreach ($removeByRecord as $planningId => $keys) {
                $record = $allPlanning->firstWhere('id', $planningId);
                if (! $record) {
                    continue;
                }
                $hours = $record->hours ?? [];
                foreach ($keys as $key) {
                    unset($hours[(string) $key]);
                }
                if (empty($hours)) {
                    $record->delete();
                } else {
                    $record->hours = $hours;
                    $record->save();
                }
            }
            return ['error' => false, 'message' => "Planning aggiustato: diff={$diff} quarti", 'quarters_removed' => $toRemove];
        }

        $toAdd = $diff;
        if (empty($slots)) {
            return $this->autoScheduleOrder($orderUuid, true);
        }
        $lastSlot = end($slots);
        $lastDate = $lastSlot['date'];
        $lastSlotKey = (int) $lastSlot['slotKey'];
        $slotHour = (int) ($lastSlotKey / 100);
        $slotMinute = $lastSlotKey % 100;
        $slotMinute += 15;
        if ($slotMinute >= 60) {
            $slotMinute = 0;
            $slotHour++;
        }
        $currentDate = Carbon::parse($lastDate);
        if ($slotHour >= $workEndHour) {
            $currentDate->addDay();
            while (! $this->isWorkingDay($currentDate, $orderData)) {
                $currentDate->addDay();
            }
            $slotHour = $workStartHour;
            $slotMinute = 0;
        }

        $quartersRemaining = $toAdd;
        while ($quartersRemaining > 0) {
            while (! $this->isWorkingDay($currentDate, $orderData)) {
                $currentDate->addDay();
                $slotHour = $workStartHour;
                $slotMinute = 0;
            }
            $dateStr = $currentDate->format('Y-m-d');
            $hoursArray = [];
            while ($quartersRemaining > 0 && $slotHour < $workEndHour) {
                $slotKey = (string) ($slotHour * 100 + $slotMinute);
                $hoursArray[$slotKey] = $expectedWorkers;
                $quartersRemaining--;
                $slotMinute += 15;
                if ($slotMinute >= 60) {
                    $slotMinute = 0;
                    $slotHour++;
                }
            }
            if (! empty($hoursArray)) {
                $existing = ProductionPlanning::query()
                    ->where('order_uuid', $orderUuid)
                    ->where('lasworkline_uuid', $lineUuid)
                    ->whereDate('date', $dateStr)
                    ->first();
                if ($existing) {
                    $existingHours = $existing->hours ?? [];
                    $existing->hours = $existingHours + $hoursArray;
                    $existing->save();
                } else {
                    ProductionPlanning::create([
                        'order_uuid' => $orderUuid,
                        'lasworkline_uuid' => $lineUuid,
                        'date' => $dateStr,
                        'hours' => $hoursArray,
                    ]);
                }
            }
            $currentDate->addDay();
            $slotHour = $workStartHour;
            $slotMinute = 0;
        }
        return ['error' => false, 'message' => "Planning aggiustato: diff={$diff} quarti", 'quarters_removed' => 0];
    }

    public function autoScheduleOrder(string $orderUuid, bool $isNew = true): array
    {
        $order = Order::query()->with(['article.offer'])->where('uuid', $orderUuid)->first();
        if (! $order) {
            return ['error' => true, 'message' => 'Ordine non trovato'];
        }
        $calc = $this->calculationService->calculateForOrder($order);
        if (($calc['error_code'] ?? 0) !== 0) {
            return ['error' => false, 'message' => $calc['message'] ?? 'Dati insufficienti', 'order_uuid' => $orderUuid, 'quarters_added' => 0, 'quarters_removed' => 0];
        }

        $hoursNeeded = (float) ($calc['hours_needed'] ?? 0);
        $totalQuarters = (int) ceil($hoursNeeded * 4);
        $expectedWorkers = (int) $calc['expected_workers'];
        $lineUuid = $calc['lasworkline_uuid'] ?? null;
        if (empty($lineUuid)) {
            return ['error' => false, 'message' => 'Nessuna linea LAS associata all\'ordine', 'order_uuid' => $orderUuid, 'quarters_added' => 0, 'quarters_removed' => 0];
        }
        $orderData = $this->getOrderFormulaData($orderUuid);
        if (! $orderData) {
            return ['error' => true, 'message' => 'Dati insufficienti', 'order_uuid' => $orderUuid];
        }

        if ($totalQuarters <= 0) {
            return ['error' => false, 'message' => 'Nessun quarto da pianificare', 'order_uuid' => $orderUuid, 'quarters_added' => 0, 'quarters_removed' => 0];
        }

        $deliveryTimestamp = $orderData['delivery_requested_date'] ?? null;
        if (empty($deliveryTimestamp)) {
            return ['error' => true, 'message' => 'Data di consegna mancante', 'order_uuid' => $orderUuid];
        }

        $workingHours = $this->getWorkingHoursForOrder($orderData);
        $workStartHour = $workingHours['startHour'];
        $workEndHour = $workingHours['endHour'];

        $deliveryDate = Carbon::createFromTimestamp($deliveryTimestamp);
        $now = Carbon::now();
        if ($deliveryDate->lt($now)) {
            return ['error' => true, 'message' => 'Data di consegna nel passato, pianificazione non possibile', 'order_uuid' => $orderUuid];
        }

        $deliveryWeekMonday = $deliveryDate->copy()->startOfWeek(Carbon::MONDAY);
        $mondayRef = $deliveryWeekMonday->copy()->subWeek()->setTime($workStartHour, 0, 0);

        if ($isNew) {
            ProductionPlanning::query()->where('order_uuid', $orderUuid)->delete();
            $startDateTime = $mondayRef->copy();
        } else {
            if ($mondayRef->lt($now)) {
                $minute = (int) $now->format('i');
                $roundedMinute = (int) (ceil($minute / 15) * 15);
                if ($roundedMinute >= 60) {
                    $now->addHour()->setTime((int) $now->format('H'), 0, 0);
                } else {
                    $now->setTime((int) $now->format('H'), $roundedMinute, 0);
                }
                $hour = (int) $now->format('H');
                if ($hour >= $workEndHour || $hour < $workStartHour) {
                    $now->addDay()->setTime($workStartHour, 0, 0);
                    while (! $this->isWorkingDay($now, $orderData)) {
                        $now->addDay();
                    }
                }
                while (! $this->isWorkingDay($now, $orderData)) {
                    $now->addDay()->setTime($workStartHour, 0, 0);
                }
                $startDateTime = $now->copy();
            } else {
                $startDateTime = $mondayRef->copy();
            }
            ProductionPlanning::query()
                ->where('order_uuid', $orderUuid)
                ->whereDate('date', '>=', $startDateTime->format('Y-m-d'))
                ->delete();
        }

        $currentDate = $startDateTime->copy();
        $slotHour = (int) $currentDate->format('H');
        $slotMinute = (int) $currentDate->format('i');
        $quartersRemaining = $totalQuarters;
        $slotsCreated = 0;

        while ($quartersRemaining > 0) {
            while (! $this->isWorkingDay($currentDate, $orderData)) {
                $currentDate->addDay()->setTime($workStartHour, 0, 0);
                $slotHour = $workStartHour;
                $slotMinute = 0;
            }
            $dateStr = $currentDate->format('Y-m-d');
            $hoursArray = [];
            while ($quartersRemaining > 0 && $slotHour < $workEndHour) {
                $slotKey = (string) ($slotHour * 100 + $slotMinute);
                $hoursArray[$slotKey] = $expectedWorkers;
                $quartersRemaining--;
                $slotsCreated++;
                $slotMinute += 15;
                if ($slotMinute >= 60) {
                    $slotMinute = 0;
                    $slotHour++;
                }
            }
            if (! empty($hoursArray)) {
                $existing = ProductionPlanning::query()
                    ->where('order_uuid', $orderUuid)
                    ->where('lasworkline_uuid', $lineUuid)
                    ->whereDate('date', $dateStr)
                    ->first();
                if ($existing) {
                    $existing->hours = $hoursArray;
                    $existing->save();
                } else {
                    ProductionPlanning::create([
                        'order_uuid' => $orderUuid,
                        'lasworkline_uuid' => $lineUuid,
                        'date' => $dateStr,
                        'hours' => $hoursArray,
                    ]);
                }
            }
            $currentDate->addDay()->setTime($workStartHour, 0, 0);
            $slotHour = $workStartHour;
            $slotMinute = 0;
        }

        return [
            'error' => false,
            'message' => 'Pianificazione completata',
            'order_uuid' => $orderUuid,
            'is_new' => $isNew,
            'hours_needed' => $hoursNeeded,
            'total_quarters' => $totalQuarters,
            'slots_created' => $slotsCreated,
            'quarters_added' => $slotsCreated,
            'quarters_removed' => 0,
            'start_date' => $startDateTime->format('Y-m-d H:i'),
            'expected_workers_per_slot' => $expectedWorkers,
            'work_hours' => "{$workStartHour}:00-{$workEndHour}:00",
            'work_saturday' => (int) ($orderData['work_saturday'] ?? 0) === 1,
        ];
    }
}

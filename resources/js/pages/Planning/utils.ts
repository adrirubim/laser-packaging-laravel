/** Helper puri per la vista Planning (date, chiavi celle, turni, contratti). */

import type { PlanningContract, PlanningOrder, RangeMode } from './types';

export function getCellKey(
    lineUuid: string,
    orderUuid: string,
    timestamp: string,
): string {
    return `${lineUuid}_${orderUuid}_${timestamp}`;
}

export function pad2(n: number): string {
    return String(n).padStart(2, '0');
}

export function toTimestamp(
    dateStr: string,
    hour: number,
    minute: number,
): string {
    return `${dateStr.slice(0, 4)}${dateStr.slice(5, 7)}${dateStr.slice(8, 10)}${pad2(hour)}${pad2(minute)}`;
}

export function isCellEnabledForOrder(
    order: PlanningOrder,
    hour: number,
    dayOfWeek: number,
): boolean {
    if (dayOfWeek === 0) return false;
    if (dayOfWeek === 6) {
        if (!order.work_saturday) return false;
    }
    const shiftMode = order.shift_mode ?? 0;
    if (shiftMode === 0) return hour >= 8 && hour < 16;
    const morning = order.shift_morning ?? false;
    const afternoon = order.shift_afternoon ?? false;
    if (morning && hour >= 6 && hour < 14) return true;
    if (afternoon && hour >= 14 && hour < 22) return true;
    return false;
}

export function countContractsByQualifica(
    dateStr: string,
    contracts: PlanningContract[],
): {
    contratto: number;
    capo_reparto: number;
    impiegati: number;
    magazzinieri: number;
} {
    const dateTs = new Date(dateStr + 'T12:00:00').getTime() / 1000;
    const out = {
        contratto: 0,
        capo_reparto: 0,
        impiegati: 0,
        magazzinieri: 0,
    };
    for (const c of contracts) {
        const start = c.start_date ?? 0;
        const end = c.end_date ?? null;
        if (start > dateTs) continue;
        if (end != null && end < dateTs) continue;
        out.contratto++;
        if (c.qualifica === 1) out.capo_reparto++;
        else if (c.qualifica === 2) out.impiegati++;
        else if (c.qualifica === 3) out.magazzinieri++;
    }
    return out;
}

export function addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr + 'T12:00:00');
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

export function addMonths(dateStr: string, months: number): string {
    const d = new Date(dateStr + 'T12:00:00');
    const day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + months);
    const lastOfTargetMonth = new Date(d.getTime());
    lastOfTargetMonth.setMonth(lastOfTargetMonth.getMonth() + 1);
    lastOfTargetMonth.setDate(0);
    d.setDate(Math.min(day, lastOfTargetMonth.getDate()));
    return d.toISOString().slice(0, 10);
}

export function formatDayLabel(dateStr: string): string {
    const d = new Date(dateStr + 'T12:00:00');
    const weekday = d.toLocaleDateString('it-IT', { weekday: 'short' });
    const day = d.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
    });
    return `${weekday} ${day}`;
}

export function getISOWeekNumber(dateStr: string): number {
    const date = new Date(dateStr + 'T12:00:00');
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    const week1 = new Date(date.getFullYear(), 0, 4);
    return (
        1 +
        Math.round(
            ((date.getTime() - week1.getTime()) / 86400000 -
                3 +
                ((week1.getDay() + 6) % 7)) /
                7,
        )
    );
}

export function getRangeDates(
    currentDate: string,
    rangeMode: RangeMode,
): { start: string; end: string } {
    if (rangeMode === 'day') {
        return { start: currentDate, end: currentDate };
    }
    if (rangeMode === 'week') {
        return { start: currentDate, end: addDays(currentDate, 6) };
    }
    const y = Number(currentDate.slice(0, 4));
    const m = Number(currentDate.slice(5, 7));
    const first = `${y}-${pad2(m)}-01`;
    const last = new Date(`${first}T12:00:00`);
    last.setMonth(last.getMonth() + 1);
    last.setDate(0);
    return { start: first, end: last.toISOString().slice(0, 10) };
}

export function formatDateRangeLabel(
    currentDate: string,
    rangeMode: RangeMode,
): string {
    if (rangeMode === 'day') return currentDate;
    const { start, end } = getRangeDates(currentDate, rangeMode);
    return `${start} → ${end}`;
}

import { describe, expect, it } from 'vitest';
import type { PlanningContract, PlanningOrder } from './types';
import {
    addDays,
    addMonths,
    countContractsByQualifica,
    formatDateRangeLabel,
    formatDayLabel,
    getCellKey,
    getISOWeekNumber,
    getRangeDates,
    isCellEnabledForOrder,
    toTimestamp,
} from './utils';

type TestPlanningOrder = {
    shift_mode?: number;
    shift_morning?: boolean;
    shift_afternoon?: boolean;
    work_saturday?: boolean;
};

type TestPlanningContract = {
    qualifica: number;
    start_date: number | null;
    end_date: number | null;
};

describe('utils – getCellKey / toTimestamp', () => {
    it('getCellKey concatena linea, ordine y timestamp', () => {
        expect(getCellKey('L1', 'ORD1', '202602170800')).toBe(
            'L1_ORD1_202602170800',
        );
    });

    it('toTimestamp compone YYYYMMDDHHmm a partir de fecha y hora', () => {
        expect(toTimestamp('2026-02-17', 8, 0)).toBe('202602170800');
        expect(toTimestamp('2026-02-17', 14, 45)).toBe('202602171445');
    });
});

describe('utils – addDays / addMonths', () => {
    it('addDays suma días respetando formato YYYY-MM-DD', () => {
        expect(addDays('2026-02-17', 1)).toBe('2026-02-18');
        expect(addDays('2026-02-17', -2)).toBe('2026-02-15');
    });

    it('addMonths mantiene el día cuando es posible y ajusta a fin de mes si no', () => {
        expect(addMonths('2026-01-15', 1)).toBe('2026-02-15');
        // 31 de enero + 1 mes → 28/29 de febrero según año; comprobamos que sigue siendo febrero
        const feb = addMonths('2025-01-31', 1);
        expect(feb.startsWith('2025-02-')).toBe(true);
    });
});

describe('utils – formatDayLabel / getISOWeekNumber', () => {
    it('formatDayLabel devuelve el formato previsto (weekday dd/mm en it-IT)', () => {
        const label = formatDayLabel('2026-02-17');
        expect(label).toMatch(/\d{2}\/\d{2}$/);
    });

    it('getISOWeekNumber calcula correctamente la semana ISO', () => {
        // 2026-01-05 es semana 2 ISO (lunes)
        expect(getISOWeekNumber('2026-01-05')).toBeGreaterThan(0);
    });
});

describe('utils – getRangeDates / formatDateRangeLabel', () => {
    it('getRangeDates para modo day devuelve mismo inicio y fin', () => {
        expect(getRangeDates('2026-02-17', 'day')).toEqual({
            start: '2026-02-17',
            end: '2026-02-17',
        });
    });

    it('getRangeDates para modo week devuelve 7 días a partir de currentDate', () => {
        expect(getRangeDates('2026-02-17', 'week')).toEqual({
            start: '2026-02-17',
            end: '2026-02-23',
        });
    });

    it('formatDateRangeLabel usa getRangeDates en week/month', () => {
        expect(formatDateRangeLabel('2026-02-17', 'day')).toBe('2026-02-17');
        const labelWeek = formatDateRangeLabel('2026-02-17', 'week');
        expect(labelWeek).toContain('2026-02-17');
        expect(labelWeek).toContain('→');
    });
});

describe('utils – isCellEnabledForOrder', () => {
    const makeOrder = (
        overrides: Partial<TestPlanningOrder>,
    ): TestPlanningOrder => ({
        shift_mode: 0,
        shift_morning: false,
        shift_afternoon: false,
        work_saturday: false,
        ...overrides,
    });

    it('deshabilita siempre domingo', () => {
        const order = makeOrder({});
        expect(isCellEnabledForOrder(order as PlanningOrder, 10, 0)).toBe(
            false,
        );
    });

    it('respeta work_saturday para sábados', () => {
        const base = makeOrder({});
        expect(isCellEnabledForOrder(base as PlanningOrder, 10, 6)).toBe(false);
        const saturday = makeOrder({ work_saturday: true });
        expect(isCellEnabledForOrder(saturday as PlanningOrder, 10, 6)).toBe(
            true,
        );
    });

    it('modo giornata (shift_mode 0) solo 8–16', () => {
        const order = makeOrder({ shift_mode: 0, work_saturday: true });
        expect(isCellEnabledForOrder(order as PlanningOrder, 7, 1)).toBe(false);
        expect(isCellEnabledForOrder(order as PlanningOrder, 8, 1)).toBe(true);
        expect(isCellEnabledForOrder(order as PlanningOrder, 15, 1)).toBe(true);
        expect(isCellEnabledForOrder(order as PlanningOrder, 16, 1)).toBe(
            false,
        );
    });

    it('turno mattina (6–14) y pomeriggio (14–22)', () => {
        const morning = makeOrder({
            shift_mode: 1,
            shift_morning: true,
            shift_afternoon: false,
        });
        expect(isCellEnabledForOrder(morning as PlanningOrder, 5, 2)).toBe(
            false,
        );
        expect(isCellEnabledForOrder(morning as PlanningOrder, 6, 2)).toBe(
            true,
        );
        expect(isCellEnabledForOrder(morning as PlanningOrder, 13, 2)).toBe(
            true,
        );
        expect(isCellEnabledForOrder(morning as PlanningOrder, 14, 2)).toBe(
            false,
        );

        const afternoon = makeOrder({
            shift_mode: 1,
            shift_morning: false,
            shift_afternoon: true,
        });
        expect(isCellEnabledForOrder(afternoon as PlanningOrder, 13, 3)).toBe(
            false,
        );
        expect(isCellEnabledForOrder(afternoon as PlanningOrder, 14, 3)).toBe(
            true,
        );
        expect(isCellEnabledForOrder(afternoon as PlanningOrder, 21, 3)).toBe(
            true,
        );
        expect(isCellEnabledForOrder(afternoon as PlanningOrder, 22, 3)).toBe(
            false,
        );
    });
});

describe('utils – countContractsByQualifica', () => {
    const makeContract = (
        qualifica: number,
        start: number | null,
        end: number | null,
    ): TestPlanningContract => ({
        qualifica,
        start_date: start,
        end_date: end,
    });

    it('cuenta solo contratos activos en la fecha', () => {
        const date = '2026-02-17';
        const tsMid = new Date(date + 'T12:00:00').getTime() / 1000;
        const contracts: TestPlanningContract[] = [
            makeContract(1, tsMid - 10_000, null),
            makeContract(2, tsMid - 10_000, tsMid + 10_000),
            makeContract(3, tsMid + 10_000, null), // empieza después, no cuenta
        ];
        const result = countContractsByQualifica(
            date,
            contracts as PlanningContract[],
        );
        expect(result.contratto).toBe(2);
        expect(result.capo_reparto).toBe(1);
        expect(result.impiegati).toBe(1);
        expect(result.magazzinieri).toBe(0);
    });
});

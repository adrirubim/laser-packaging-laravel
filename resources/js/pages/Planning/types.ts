/** Tipi condivisi per la vista Planning (toolbar, legenda, griglia). */

import type {
    DomainPlanningBoard,
    DomainPlanningContract,
    DomainPlanningLine,
    DomainPlanningOrder,
    DomainPlanningRow,
    DomainPlanningSummary,
    DomainPlanningSummaryRow,
} from '@/types/DomainModels';

export type RangeMode = 'day' | 'week' | 'month';
export type ZoomLevel = 'hour' | 'quarter';

// --- Dominio (alias dei modelli di dominio strict) ---

export type PlanningOrder = DomainPlanningOrder;

export type PlanningLine = DomainPlanningLine;

export type PlanningRow = DomainPlanningRow;

export type PlanningSummaryRow = DomainPlanningSummaryRow;

export type PlanningContract = DomainPlanningContract;

export type BoardDay = {
    dateStr: string;
    label: string;
    isWeekend: boolean;
};

export type SlotColumn = {
    timestamp: string;
    dateStr: string;
    hour: number;
    minute: number;
    label: string;
    isWeekend: boolean;
    isDayEnd: boolean;
};

// --- API responses ---

export type PlanningDataResponse = DomainPlanningBoard;

export type ReplanResult = {
    message?: string;
    quarters_added?: number;
    quarters_removed?: number;
};

export type SavePlanningResponse = {
    error_code: DomainPlanningSummary['error_code'];
    message: DomainPlanningSummary['message'];
    planning_id: DomainPlanningSummary['planning_id'];
    replan_result?: ReplanResult;
};

export type SaveSummaryResponse = {
    error_code: DomainPlanningSummary['error_code'];
    message: DomainPlanningSummary['message'];
    summary_id: DomainPlanningSummary['summary_id'];
};

export type BoardOccupancy = Record<string, Record<string, number>>;

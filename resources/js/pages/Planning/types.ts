/** Tipi condivisi per la vista Planning (toolbar, legenda, griglia). */

export type RangeMode = 'day' | 'week' | 'month';
export type ZoomLevel = 'hour' | 'quarter';

// --- Dominio ---

export type PlanningOrder = {
    uuid: string;
    code: string;
    article_code?: string;
    description?: string;
    delivery_requested_date?: number;
    quantity: number;
    worked_quantity: number;
    status: number;
    shift_mode?: number;
    shift_morning?: boolean;
    shift_afternoon?: boolean;
    work_saturday?: boolean;
};

export type PlanningLine = {
    uuid: string;
    code: string;
    name: string;
    orders: PlanningOrder[];
};

export type PlanningRow = {
    id: number | null;
    order_uuid: string;
    lasworkline_uuid: string;
    date: string | null;
    hours: string;
};

export type PlanningSummaryRow = {
    id: number | null;
    date: string | null;
    summary_type: string;
    hours: string;
};

export type PlanningContract = {
    id: number;
    employee_uuid: string;
    qualifica: number;
    start_date: number | null;
    end_date: number | null;
};

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

export type PlanningDataResponse = {
    error_code: number;
    message?: string;
    lines?: PlanningLine[];
    planning?: PlanningRow[];
    contracts?: PlanningContract[];
    summary?: PlanningSummaryRow[];
};

export type ReplanResult = {
    message?: string;
    quarters_added?: number;
    quarters_removed?: number;
};

export type SavePlanningResponse = {
    error_code: number;
    message?: string;
    planning_id?: number;
    replan_result?: ReplanResult;
};

export type SaveSummaryResponse = {
    error_code: number;
    message?: string;
    summary_id?: number;
};

export type BoardOccupancy = Record<string, Record<string, number>>;

/**
 * Planning Board — Vista moderna 2026
 *
 * Zoom ore/quarti, editing celle e riepilogo,
 * turni, weekend, overdue, deadline, navigazione Tab/Enter, gestione errori.
 * Solo Tailwind, nessun CSS aggiuntivo esterno.
 */
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import api from '@/routes/api';
import planningRoutes from '@/routes/planning';
import type { BreadcrumbItem, PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Fragment,
    type ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

type PlanningRoutes = {
    index: { url: () => string };
};
const planningNav = planningRoutes as unknown as PlanningRoutes;

type PlanningBoardProps = PageProps<{ today: string }>;

type RangeMode = 'day' | 'week' | 'month';
type ZoomLevel = 'hour' | 'quarter';

type PlanningOrder = {
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

type PlanningLine = {
    uuid: string;
    code: string;
    name: string;
    orders: PlanningOrder[];
};

type PlanningRow = {
    id: number | null;
    order_uuid: string;
    lasworkline_uuid: string;
    date: string | null;
    hours: string;
};

type PlanningSummaryRow = {
    id: number | null;
    date: string | null;
    summary_type: string;
    hours: string;
};

type PlanningContract = {
    id: number;
    employee_uuid: string;
    qualifica: number;
    start_date: number | null;
    end_date: number | null;
};

type BoardDay = {
    dateStr: string;
    label: string;
    isWeekend: boolean;
};

type BoardOccupancy = Record<string, Record<string, number>>;

/** Configurazione orari e righe riepilogo (allineata a ZOOM_LEVELS / SUMMARY_ROWS storici) */
const PLANNING_CONFIG = {
    startHour: 6,
    endHour: 22,
} as const;

const START_HOUR = PLANNING_CONFIG.startHour;
const END_HOUR = PLANNING_CONFIG.endHour;

const SUMMARY_ROWS: { id: string; label: string; editable?: boolean }[] = [
    { id: 'totale_impegno', label: 'TOTALE IMPEGNO' },
    { id: 'da_impiegare', label: 'DA IMPIEGARE' },
    { id: 'assenze', label: 'ASSENZE', editable: true },
    { id: 'disponibili', label: 'DISPONIBILI' },
    { id: 'caporeparto', label: 'CAPOREPARTO', editable: true },
    { id: 'magazzinieri', label: 'MAGAZZINIERI', editable: true },
];

function getCellKey(
    lineUuid: string,
    orderUuid: string,
    timestamp: string,
): string {
    return `${lineUuid}_${orderUuid}_${timestamp}`;
}

function isCellEnabledForOrder(
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

type SlotColumn = {
    timestamp: string;
    dateStr: string;
    hour: number;
    minute: number;
    label: string;
    isWeekend: boolean;
    isDayEnd: boolean;
};

function pad2(n: number): string {
    return String(n).padStart(2, '0');
}

function toTimestamp(dateStr: string, hour: number, minute: number): string {
    return `${dateStr.slice(0, 4)}${dateStr.slice(5, 7)}${dateStr.slice(8, 10)}${pad2(hour)}${pad2(minute)}`;
}

function countContractsByQualifica(
    dateStr: string,
    contracts: PlanningContract[],
) {
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

function addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr + 'T12:00:00');
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

function addMonths(dateStr: string, months: number): string {
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

function formatDayLabel(dateStr: string): string {
    const d = new Date(dateStr + 'T12:00:00');
    const weekday = d.toLocaleDateString('it-IT', { weekday: 'short' });
    const day = d.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
    });
    return `${weekday} ${day}`;
}

function getISOWeekNumber(dateStr: string): number {
    const date = new Date(dateStr + 'T12:00:00');
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
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

function getRangeDates(
    currentDate: string,
    rangeMode: RangeMode,
): { start: string; end: string } {
    if (rangeMode === 'day') {
        return {
            start: currentDate,
            end: currentDate,
        };
    }

    if (rangeMode === 'week') {
        return { start: currentDate, end: addDays(currentDate, 6) };
    }

    // rangeMode === 'month'
    const y = Number(currentDate.slice(0, 4));
    const m = Number(currentDate.slice(5, 7));
    const first = `${y}-${pad2(m)}-01`;
    const last = new Date(`${first}T12:00:00`);
    last.setMonth(last.getMonth() + 1);
    last.setDate(0);
    return { start: first, end: last.toISOString().slice(0, 10) };
}

function formatDateRangeLabel(
    currentDate: string,
    rangeMode: RangeMode,
): string {
    if (rangeMode === 'day') {
        return currentDate;
    }

    const { start, end } = getRangeDates(currentDate, rangeMode);
    return `${start} → ${end}`;
}

function BoardCell({
    value,
    children,
}: {
    value: number;
    children?: ReactNode;
}) {
    if (value <= 0) {
        return (
            <div className="flex h-10 items-center justify-center rounded-md border border-dashed border-muted bg-background/40 text-xs text-muted-foreground">
                {children ?? '-'}
            </div>
        );
    }

    return (
        <div className="flex h-10 items-center justify-center rounded-md border border-emerald-500/60 bg-emerald-500/80 px-2 text-xs font-semibold text-emerald-50 shadow-sm">
            {value}
        </div>
    );
}

type DayGridViewProps = {
    slotColumns: SlotColumn[];
    lines: PlanningLine[];
    planningData: Record<string, number>;
    totalsByTimestamp: Record<string, number>;
    zoomLevel: 'hour' | 'quarter';
    onZoomDay?: (dateStr: string) => void;
    getSummaryValueForSlot: (
        timestamp: string,
        summaryType: string,
        defaultValue: number,
    ) => number;
    isSummaryValueCustom: (timestamp: string, summaryType: string) => boolean;
    contracts: PlanningContract[];
    loading: boolean;
    editingCellKey: string | null;
    editingValue: string;
    setEditingCellKey: (k: string | null) => void;
    setEditingValue: (v: string) => void;
    onSavePlanningCell: (cellKey: string, value: number) => Promise<void>;
    editingSummaryKey: string | null;
    editingSummaryValue: string;
    setEditingSummaryKey: (k: string | null) => void;
    setEditingSummaryValue: (v: string) => void;
    onSaveSummaryCell: (summaryKey: string, value: string) => Promise<void>;
};

function DayGridView({
    slotColumns,
    lines,
    planningData,
    totalsByTimestamp,
    zoomLevel,
    onZoomDay,
    getSummaryValueForSlot,
    isSummaryValueCustom,
    contracts,
    loading,
    editingCellKey,
    editingValue,
    setEditingCellKey,
    setEditingValue,
    onSavePlanningCell,
    editingSummaryKey,
    editingSummaryValue,
    setEditingSummaryKey,
    setEditingSummaryValue,
    onSaveSummaryCell,
}: DayGridViewProps) {
    const contractCountsByDate = useMemo(() => {
        const map: Record<
            string,
            ReturnType<typeof countContractsByQualifica>
        > = {};
        for (const col of slotColumns) {
            if (!map[col.dateStr]) {
                map[col.dateStr] = countContractsByQualifica(
                    col.dateStr,
                    contracts,
                );
            }
        }
        return map;
    }, [slotColumns, contracts]);

    const planningGrid = useMemo(
        () =>
            lines.flatMap((line) =>
                (line.orders ?? []).map((order) =>
                    slotColumns
                        .filter((c) => {
                            const dow = new Date(
                                c.dateStr + 'T12:00:00',
                            ).getDay();
                            return isCellEnabledForOrder(order, c.hour, dow);
                        })
                        .map((c) =>
                            getCellKey(line.uuid, order.uuid, c.timestamp),
                        ),
                ),
            ),
        [lines, slotColumns],
    );

    const getNextPlanningKey = useCallback(
        (
            cellKey: string,
            direction: 'left' | 'right' | 'up' | 'down',
        ): string | null => {
            let rowIdx = -1;
            let colIdx = -1;
            planningGrid.forEach((row, r) => {
                const c = row.indexOf(cellKey);
                if (c >= 0) {
                    rowIdx = r;
                    colIdx = c;
                }
            });
            if (rowIdx < 0) return null;
            if (direction === 'left')
                return colIdx > 0 ? planningGrid[rowIdx][colIdx - 1] : null;
            if (direction === 'right')
                return colIdx < planningGrid[rowIdx].length - 1
                    ? planningGrid[rowIdx][colIdx + 1]
                    : null;
            if (direction === 'up')
                return rowIdx > 0 ? planningGrid[rowIdx - 1][colIdx] : null;
            if (direction === 'down')
                return rowIdx < planningGrid.length - 1
                    ? planningGrid[rowIdx + 1][colIdx]
                    : null;
            return null;
        },
        [planningGrid],
    );

    const summaryKeysByColumn = useMemo(
        () =>
            slotColumns
                .filter((c) => !c.isWeekend)
                .flatMap((c) =>
                    (['assenze', 'caporeparto', 'magazzinieri'] as const).map(
                        (t) => `${c.timestamp}_${t}`,
                    ),
                ),
        [slotColumns],
    );

    const getNextSummaryKey = useCallback(
        (
            summaryKey: string,
            direction: 'left' | 'right' | 'up' | 'down',
        ): string | null => {
            const idx = summaryKeysByColumn.indexOf(summaryKey);
            if (idx < 0) return null;
            const colsPerSlot = 3;
            const colIdx = Math.floor(idx / colsPerSlot);
            const rowInSlot = idx % colsPerSlot;
            if (direction === 'left')
                return colIdx > 0
                    ? summaryKeysByColumn[idx - colsPerSlot]
                    : null;
            if (direction === 'right')
                return colIdx < summaryKeysByColumn.length / colsPerSlot - 1
                    ? summaryKeysByColumn[idx + colsPerSlot]
                    : null;
            if (direction === 'up')
                return rowInSlot > 0 ? summaryKeysByColumn[idx - 1] : null;
            if (direction === 'down')
                return rowInSlot < 2 ? summaryKeysByColumn[idx + 1] : null;
            return null;
        },
        [summaryKeysByColumn],
    );

    const handlePlanningKeyDown = useCallback(
        (e: React.KeyboardEvent, cellKey: string) => {
            const val = Number.parseInt(editingValue, 10);
            const validVal = !Number.isNaN(val) && val >= 0;

            if (e.key === 'Escape') {
                setEditingCellKey(null);
                setEditingValue('');
                return;
            }

            if (e.key === 'Tab') {
                e.preventDefault();
                const nextKey = getNextPlanningKey(
                    cellKey,
                    e.shiftKey ? 'left' : 'right',
                );
                if (nextKey) {
                    if (validVal) {
                        void onSavePlanningCell(cellKey, val).then(() => {
                            setEditingCellKey(nextKey);
                            setEditingValue(
                                String(planningData[nextKey] ?? ''),
                            );
                        });
                    } else {
                        setEditingCellKey(nextKey);
                        setEditingValue(String(planningData[nextKey] ?? ''));
                    }
                } else if (validVal) {
                    void onSavePlanningCell(cellKey, val).then(() => {
                        setEditingCellKey(null);
                        setEditingValue('');
                    });
                }
                return;
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                const nextKey = getNextPlanningKey(
                    cellKey,
                    e.shiftKey ? 'up' : 'down',
                );
                if (nextKey) {
                    if (validVal) {
                        void onSavePlanningCell(cellKey, val).then(() => {
                            setEditingCellKey(nextKey);
                            setEditingValue(
                                String(planningData[nextKey] ?? ''),
                            );
                        });
                    } else {
                        setEditingCellKey(nextKey);
                        setEditingValue(String(planningData[nextKey] ?? ''));
                    }
                } else if (validVal) {
                    void onSavePlanningCell(cellKey, val).then(() => {
                        setEditingCellKey(null);
                        setEditingValue('');
                    });
                }
                return;
            }
        },
        [
            editingValue,
            getNextPlanningKey,
            onSavePlanningCell,
            planningData,
            setEditingCellKey,
            setEditingValue,
        ],
    );

    const handleSummaryKeyDown = useCallback(
        (e: React.KeyboardEvent, summaryKey: string) => {
            if (e.key === 'Escape') {
                setEditingSummaryKey(null);
                setEditingSummaryValue('');
                return;
            }

            if (e.key === 'Tab') {
                e.preventDefault();
                const nextKey = getNextSummaryKey(
                    summaryKey,
                    e.shiftKey ? 'left' : 'right',
                );
                if (nextKey) {
                    void onSaveSummaryCell(
                        summaryKey,
                        editingSummaryValue,
                    ).then(() => {
                        setEditingSummaryKey(nextKey);
                        const [ts, type] = [
                            nextKey.slice(0, 12),
                            nextKey.slice(13),
                        ];
                        const dateStr = `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}`;
                        const counts = contractCountsByDate[dateStr];
                        const defaultVal =
                            type === 'caporeparto'
                                ? (counts?.capo_reparto ?? 0)
                                : type === 'magazzinieri'
                                  ? (counts?.magazzinieri ?? 0)
                                  : 0;
                        setEditingSummaryValue(
                            String(
                                getSummaryValueForSlot(ts, type, defaultVal),
                            ),
                        );
                    });
                } else {
                    void onSaveSummaryCell(
                        summaryKey,
                        editingSummaryValue,
                    ).then(() => {
                        setEditingSummaryKey(null);
                        setEditingSummaryValue('');
                    });
                }
                return;
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                const nextKey = getNextSummaryKey(
                    summaryKey,
                    e.shiftKey ? 'up' : 'down',
                );
                if (nextKey) {
                    void onSaveSummaryCell(
                        summaryKey,
                        editingSummaryValue,
                    ).then(() => {
                        setEditingSummaryKey(nextKey);
                        const [ts, type] = [
                            nextKey.slice(0, 12),
                            nextKey.slice(13),
                        ];
                        const dateStr = `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}`;
                        const counts = contractCountsByDate[dateStr];
                        const defaultVal =
                            type === 'caporeparto'
                                ? (counts?.capo_reparto ?? 0)
                                : type === 'magazzinieri'
                                  ? (counts?.magazzinieri ?? 0)
                                  : 0;
                        setEditingSummaryValue(
                            String(
                                getSummaryValueForSlot(ts, type, defaultVal),
                            ),
                        );
                    });
                } else {
                    void onSaveSummaryCell(
                        summaryKey,
                        editingSummaryValue,
                    ).then(() => {
                        setEditingSummaryKey(null);
                        setEditingSummaryValue('');
                    });
                }
                return;
            }
        },
        [
            contractCountsByDate,
            editingSummaryValue,
            getNextSummaryKey,
            getSummaryValueForSlot,
            onSaveSummaryCell,
            setEditingSummaryKey,
            setEditingSummaryValue,
        ],
    );

    const headerGroups = useMemo(() => {
        const weeks: { week: number; colspan: number }[] = [];
        const days: {
            dateStr: string;
            label: string;
            colspan: number;
            isWeekend: boolean;
            showZoomButton: boolean;
        }[] = [];

        // Solo tiene sentido mostrar la fila de semanas cuando hay más de un día
        // (vista semanal). En vista diaria se omite Wn.
        const uniqueDays = new Set(slotColumns.map((c) => c.dateStr));
        if (uniqueDays.size > 1) {
            let currentWeek: { week: number; colspan: number } | null = null;
            for (const col of slotColumns) {
                const weekNum = getISOWeekNumber(col.dateStr);
                if (!currentWeek || currentWeek.week !== weekNum) {
                    currentWeek = { week: weekNum, colspan: 0 };
                    weeks.push(currentWeek);
                }
                currentWeek.colspan++;
            }
        }

        let currentDay: {
            dateStr: string;
            label: string;
            colspan: number;
            isWeekend: boolean;
            showZoomButton: boolean;
        } | null = null;
        for (const col of slotColumns) {
            if (!currentDay || currentDay.dateStr !== col.dateStr) {
                const dow = new Date(col.dateStr + 'T12:00:00').getDay();
                const isWeekend = dow === 0 || dow === 6;
                currentDay = {
                    dateStr: col.dateStr,
                    label: formatDayLabel(col.dateStr),
                    colspan: 0,
                    isWeekend,
                    showZoomButton:
                        zoomLevel === 'hour' && !isWeekend && !!onZoomDay,
                };
                days.push(currentDay);
            }
            currentDay.colspan++;
        }

        return { weeks, days };
    }, [slotColumns, zoomLevel, onZoomDay]);

    if (slotColumns.length === 0) {
        return (
            <div className="rounded-md border border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                Nessuna colonna disponibile per il periodo selezionato.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto overflow-y-visible">
            <table className="min-w-full border-collapse text-sm">
                <thead className="sticky top-0 z-20 border-b-2 border-border bg-card shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                    <tr>
                        <th
                            rowSpan={3}
                            scope="col"
                            className="sticky left-0 z-30 w-32 border-r border-border/60 bg-muted/40 px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground"
                        >
                            Linea
                        </th>
                        <th
                            rowSpan={3}
                            scope="col"
                            className="sticky left-[8rem] z-30 w-40 border-r border-border/60 bg-muted/40 px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground"
                        >
                            Ordine
                        </th>
                        {headerGroups.weeks.map((w) => (
                            <th
                                key={`w_${w.week}`}
                                scope="col"
                                colSpan={w.colspan}
                                className="px-1 py-1.5 text-center text-[10px] font-semibold text-muted-foreground"
                            >
                                W{w.week}
                            </th>
                        ))}
                    </tr>
                    <tr>
                        {headerGroups.days.map((d) => (
                            <th
                                key={`d_${d.dateStr}`}
                                scope="col"
                                colSpan={d.colspan}
                                className={`px-1 py-1.5 text-center text-[10px] font-semibold ${
                                    d.isWeekend
                                        ? 'bg-muted/50 text-muted-foreground'
                                        : 'text-muted-foreground'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    <span>{d.label}</span>
                                    {d.showZoomButton ? (
                                        <button
                                            type="button"
                                            className="inline-flex size-5 items-center justify-center rounded border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none"
                                            title="Zoom quarti"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onZoomDay?.(d.dateStr);
                                            }}
                                            disabled={loading}
                                        >
                                            +
                                        </button>
                                    ) : null}
                                </div>
                            </th>
                        ))}
                    </tr>
                    <tr>
                        {slotColumns.map((col) => (
                            <th
                                key={col.timestamp}
                                scope="col"
                                className={`min-w-[3rem] px-1 py-2 text-center text-[10px] font-medium ${
                                    col.isWeekend
                                        ? 'bg-muted/50 text-muted-foreground'
                                        : 'text-muted-foreground'
                                }`}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td
                                colSpan={2 + slotColumns.length}
                                className="px-4 py-8 text-center text-muted-foreground"
                            >
                                Caricamento…
                            </td>
                        </tr>
                    ) : lines.length === 0 ? (
                        <tr>
                            <td
                                colSpan={2 + slotColumns.length}
                                className="px-4 py-8 text-center text-muted-foreground"
                            >
                                Nessuna linea nel periodo.
                            </td>
                        </tr>
                    ) : (
                        <>
                            {lines.map((line) =>
                                (line.orders ?? []).map((order, orderIdx) => {
                                    const isFirstOrder = orderIdx === 0;
                                    const deliveryDateStr =
                                        order.delivery_requested_date
                                            ? new Date(
                                                  order.delivery_requested_date *
                                                      1000,
                                              )
                                                  .toISOString()
                                                  .slice(0, 10)
                                            : null;
                                    return (
                                        <tr
                                            key={order.uuid}
                                            className="border-b border-border/60 align-middle"
                                        >
                                            <td className="sticky left-0 z-10 bg-card px-2 py-1.5 text-xs font-medium text-foreground shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
                                                {isFirstOrder ? (
                                                    <>
                                                        <span>{line.code}</span>
                                                        <span className="block truncate text-[10px] font-normal text-muted-foreground">
                                                            {line.name}
                                                        </span>
                                                    </>
                                                ) : (
                                                    '\u00A0'
                                                )}
                                            </td>
                                            <td
                                                className="sticky left-[8rem] z-10 bg-card py-1.5 pr-2 pl-2 text-xs text-muted-foreground shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
                                                title={
                                                    [
                                                        order.code,
                                                        order.article_code,
                                                        order.description,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(' — ') ||
                                                    order.code
                                                }
                                            >
                                                <span className="block truncate">
                                                    {order.code}
                                                    {order.article_code
                                                        ? ` — ${order.article_code}`
                                                        : ''}
                                                </span>
                                            </td>
                                            {slotColumns.map((col, colIdx) => {
                                                const cellKey = getCellKey(
                                                    line.uuid,
                                                    order.uuid,
                                                    col.timestamp,
                                                );
                                                const colDayOfWeek = new Date(
                                                    col.dateStr + 'T12:00:00',
                                                ).getDay();
                                                const enabled =
                                                    isCellEnabledForOrder(
                                                        order,
                                                        col.hour,
                                                        colDayOfWeek,
                                                    );
                                                const isOverdue =
                                                    !!deliveryDateStr &&
                                                    col.dateStr >
                                                        deliveryDateStr;
                                                const isDeadlineBorder =
                                                    !!deliveryDateStr &&
                                                    col.dateStr <=
                                                        deliveryDateStr &&
                                                    colIdx <
                                                        slotColumns.length -
                                                            1 &&
                                                    (slotColumns[colIdx + 1]
                                                        ?.dateStr ?? '') >
                                                        deliveryDateStr;
                                                let value: number;
                                                let displayMixed = false;
                                                if (zoomLevel === 'hour') {
                                                    const q0 =
                                                        planningData[
                                                            getCellKey(
                                                                line.uuid,
                                                                order.uuid,
                                                                toTimestamp(
                                                                    col.dateStr,
                                                                    col.hour,
                                                                    0,
                                                                ),
                                                            )
                                                        ] ?? 0;
                                                    const q15 =
                                                        planningData[
                                                            getCellKey(
                                                                line.uuid,
                                                                order.uuid,
                                                                toTimestamp(
                                                                    col.dateStr,
                                                                    col.hour,
                                                                    15,
                                                                ),
                                                            )
                                                        ] ?? 0;
                                                    const q30 =
                                                        planningData[
                                                            getCellKey(
                                                                line.uuid,
                                                                order.uuid,
                                                                toTimestamp(
                                                                    col.dateStr,
                                                                    col.hour,
                                                                    30,
                                                                ),
                                                            )
                                                        ] ?? 0;
                                                    const q45 =
                                                        planningData[
                                                            getCellKey(
                                                                line.uuid,
                                                                order.uuid,
                                                                toTimestamp(
                                                                    col.dateStr,
                                                                    col.hour,
                                                                    45,
                                                                ),
                                                            )
                                                        ] ?? 0;
                                                    const vals = [
                                                        q0,
                                                        q15,
                                                        q30,
                                                        q45,
                                                    ].filter((v) => v > 0);
                                                    if (vals.length === 0)
                                                        value = 0;
                                                    else if (
                                                        vals.length === 4 &&
                                                        vals.every(
                                                            (v) =>
                                                                v === vals[0],
                                                        )
                                                    )
                                                        value = vals[0];
                                                    else {
                                                        value = Math.round(
                                                            (q0 +
                                                                q15 +
                                                                q30 +
                                                                q45) /
                                                                4,
                                                        );
                                                        displayMixed = true;
                                                    }
                                                } else {
                                                    value =
                                                        planningData[cellKey] ??
                                                        0;
                                                }
                                                // Solo esta celda (cellKey === editingCellKey) debe verse en edición; nunca la fila entera
                                                const isEditing =
                                                    editingCellKey !== null &&
                                                    editingCellKey === cellKey;

                                                if (isEditing) {
                                                    const editDeadlineClass =
                                                        isDeadlineBorder
                                                            ? ' border-r-2 border-amber-500'
                                                            : '';
                                                    return (
                                                        <td
                                                            key={col.timestamp}
                                                            data-editing-cell="true"
                                                            className={
                                                                'min-w-[3rem] border border-primary p-0 align-middle' +
                                                                editDeadlineClass
                                                            }
                                                        >
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                className="h-9 w-full border-0 bg-primary/10 px-1 text-center text-xs focus:outline-none"
                                                                value={
                                                                    editingValue
                                                                }
                                                                onChange={(e) =>
                                                                    setEditingValue(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                onBlur={() => {
                                                                    const val =
                                                                        Number.parseInt(
                                                                            editingValue,
                                                                            10,
                                                                        );
                                                                    if (
                                                                        !Number.isNaN(
                                                                            val,
                                                                        ) &&
                                                                        val >= 0
                                                                    ) {
                                                                        void onSavePlanningCell(
                                                                            cellKey,
                                                                            val,
                                                                        ).then(
                                                                            () => {
                                                                                setEditingCellKey(
                                                                                    null,
                                                                                );
                                                                                setEditingValue(
                                                                                    '',
                                                                                );
                                                                            },
                                                                        );
                                                                    } else {
                                                                        setEditingCellKey(
                                                                            null,
                                                                        );
                                                                        setEditingValue(
                                                                            '',
                                                                        );
                                                                    }
                                                                }}
                                                                onKeyDown={(
                                                                    e,
                                                                ) =>
                                                                    handlePlanningKeyDown(
                                                                        e,
                                                                        cellKey,
                                                                    )
                                                                }
                                                                autoFocus
                                                            />
                                                        </td>
                                                    );
                                                }

                                                const base =
                                                    'min-w-[3rem] cursor-pointer px-1 py-1.5 text-center text-xs align-middle';
                                                const style = !enabled
                                                    ? `${base} bg-muted/50 text-muted-foreground`
                                                    : isOverdue
                                                      ? `${base} bg-red-500/80 text-red-50 font-medium`
                                                      : value > 0 ||
                                                          displayMixed
                                                        ? `${base} border border-emerald-500/60 bg-emerald-500/80 text-emerald-50`
                                                        : `${base} border border-dashed border-muted bg-background/40`;
                                                const deadlineClass =
                                                    isDeadlineBorder
                                                        ? ' border-r-2 border-amber-500'
                                                        : '';

                                                return (
                                                    <td
                                                        key={col.timestamp}
                                                        className={
                                                            style +
                                                            deadlineClass
                                                        }
                                                        onClick={() => {
                                                            if (enabled) {
                                                                setEditingCellKey(
                                                                    cellKey,
                                                                );
                                                                setEditingValue(
                                                                    zoomLevel ===
                                                                        'hour' &&
                                                                        displayMixed
                                                                        ? ''
                                                                        : value >
                                                                            0
                                                                          ? String(
                                                                                value,
                                                                            )
                                                                          : '',
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {displayMixed
                                                            ? '*'
                                                            : value > 0
                                                              ? value
                                                              : '—'}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                }),
                            )}
                            {SUMMARY_ROWS.map((row) => {
                                const isEditable = row.editable === true;
                                return (
                                    <tr
                                        key={`sum_${row.id}`}
                                        className="border-t-2 border-border bg-muted/40 align-middle"
                                    >
                                        <td
                                            colSpan={2}
                                            className="sticky left-0 z-10 bg-muted/50 px-2 py-2 text-xs font-semibold text-foreground"
                                        >
                                            {row.label}
                                        </td>
                                        {slotColumns.map((col) => {
                                            if (col.isWeekend) {
                                                return (
                                                    <td
                                                        key={col.timestamp}
                                                        className="min-w-[3rem] px-1 py-2 text-center text-xs text-muted-foreground"
                                                    >
                                                        —
                                                    </td>
                                                );
                                            }
                                            const contractCounts =
                                                contractCountsByDate[
                                                    col.dateStr
                                                ] ??
                                                countContractsByQualifica(
                                                    col.dateStr,
                                                    contracts,
                                                );
                                            const totaleImpegno =
                                                totalsByTimestamp[
                                                    col.timestamp
                                                ] ?? 0;
                                            const assenze =
                                                getSummaryValueForSlot(
                                                    col.timestamp,
                                                    'assenze',
                                                    0,
                                                );
                                            const caporeparto =
                                                getSummaryValueForSlot(
                                                    col.timestamp,
                                                    'caporeparto',
                                                    contractCounts.capo_reparto,
                                                );
                                            const magazzinieri =
                                                getSummaryValueForSlot(
                                                    col.timestamp,
                                                    'magazzinieri',
                                                    contractCounts.magazzinieri,
                                                );
                                            const daImpiegare =
                                                contractCounts.contratto -
                                                assenze -
                                                caporeparto -
                                                magazzinieri;
                                            const disponibili =
                                                daImpiegare - totaleImpegno;

                                            let displayVal: number;
                                            if (row.id === 'totale_impegno')
                                                displayVal = totaleImpegno;
                                            else if (row.id === 'da_impiegare')
                                                displayVal = daImpiegare;
                                            else if (row.id === 'assenze')
                                                displayVal = assenze;
                                            else if (row.id === 'disponibili')
                                                displayVal = disponibili;
                                            else if (row.id === 'caporeparto')
                                                displayVal = caporeparto;
                                            else if (row.id === 'magazzinieri')
                                                displayVal = magazzinieri;
                                            else displayVal = 0;

                                            const summaryKey = `${col.timestamp}_${row.id}`;
                                            const isSummaryEditing =
                                                isEditable &&
                                                editingSummaryKey ===
                                                    summaryKey;

                                            if (
                                                isEditable &&
                                                (row.id === 'assenze' ||
                                                    row.id === 'caporeparto' ||
                                                    row.id === 'magazzinieri')
                                            ) {
                                                const defaultVal =
                                                    row.id === 'caporeparto'
                                                        ? contractCounts.capo_reparto
                                                        : row.id ===
                                                            'magazzinieri'
                                                          ? contractCounts.magazzinieri
                                                          : 0;
                                                const currentVal =
                                                    getSummaryValueForSlot(
                                                        col.timestamp,
                                                        row.id,
                                                        defaultVal,
                                                    );
                                                if (isSummaryEditing) {
                                                    return (
                                                        <td
                                                            key={col.timestamp}
                                                            className="min-w-[3rem] border border-primary p-0 align-middle"
                                                        >
                                                            <input
                                                                type="number"
                                                                min={0}
                                                                className="h-8 w-full border-0 bg-primary/10 px-1 text-center text-xs focus:outline-none"
                                                                value={
                                                                    editingSummaryValue
                                                                }
                                                                onChange={(e) =>
                                                                    setEditingSummaryValue(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                onBlur={() => {
                                                                    void onSaveSummaryCell(
                                                                        summaryKey,
                                                                        editingSummaryValue,
                                                                    ).then(
                                                                        () => {
                                                                            setEditingSummaryKey(
                                                                                null,
                                                                            );
                                                                            setEditingSummaryValue(
                                                                                '',
                                                                            );
                                                                        },
                                                                    );
                                                                }}
                                                                onKeyDown={(
                                                                    e,
                                                                ) =>
                                                                    handleSummaryKeyDown(
                                                                        e,
                                                                        summaryKey,
                                                                    )
                                                                }
                                                                autoFocus
                                                            />
                                                        </td>
                                                    );
                                                }
                                                return (
                                                    <td
                                                        key={col.timestamp}
                                                        className="min-w-[3rem] cursor-pointer border border-border bg-background px-1 py-2 text-center align-middle text-xs hover:bg-accent/50"
                                                        onClick={() => {
                                                            setEditingSummaryKey(
                                                                summaryKey,
                                                            );
                                                            setEditingSummaryValue(
                                                                String(
                                                                    currentVal,
                                                                ),
                                                            );
                                                        }}
                                                    >
                                                        {currentVal > 0
                                                            ? currentVal
                                                            : isSummaryValueCustom(
                                                                    col.timestamp,
                                                                    row.id,
                                                                ) &&
                                                                currentVal === 0
                                                              ? '0'
                                                              : ''}
                                                    </td>
                                                );
                                            }

                                            const isDisponibiliWarning =
                                                row.id === 'disponibili' &&
                                                displayVal !== 0;
                                            return (
                                                <td
                                                    key={col.timestamp}
                                                    className={`min-w-[3rem] px-1 py-2 text-center align-middle text-xs ${
                                                        isDisponibiliWarning
                                                            ? 'bg-red-500/80 font-medium text-red-50'
                                                            : 'border border-border bg-background'
                                                    }`}
                                                >
                                                    {displayVal}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </>
                    )}
                </tbody>
            </table>
        </div>
    );
}

type PlanningMonthSummaryProps = {
    rangeDays: BoardDay[];
    lines: PlanningLine[];
    loading: boolean;
    occupancyByLineAndDay: BoardOccupancy;
    occupancyByOrderAndDay: Record<string, Record<string, number>>;
    summaryValuesByDay: Record<string, Record<string, number>>;
    editingSummaryKey: string | null;
    editingSummaryValue: string;
    setEditingSummaryKey: (k: string | null) => void;
    setEditingSummaryValue: (v: string) => void;
    saveSummaryCell: (summaryKey: string, value: string) => Promise<void>;
    openDay: (dateStr: string, zoom?: ZoomLevel) => void;
};

function PlanningMonthSummary({
    rangeDays,
    lines,
    loading,
    occupancyByLineAndDay,
    occupancyByOrderAndDay,
    summaryValuesByDay,
    editingSummaryKey,
    editingSummaryValue,
    setEditingSummaryKey,
    setEditingSummaryValue,
    saveSummaryCell,
    openDay,
}: PlanningMonthSummaryProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
                <thead>
                    <tr>
                        <th className="sticky left-0 z-10 bg-card px-2 py-2 text-left text-xs font-semibold text-muted-foreground">
                            Linea
                        </th>
                        {rangeDays.map((day) => (
                            <th
                                key={day.dateStr}
                                className="px-2 py-2 text-center text-xs font-semibold text-muted-foreground"
                            >
                                <button
                                    type="button"
                                    className="rounded px-1 py-0.5 hover:bg-accent/50"
                                    onClick={() => openDay(day.dateStr, 'hour')}
                                    disabled={loading}
                                    title="Apri dettaglio giorno"
                                >
                                    {day.label}
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {lines.length === 0 ? (
                        <tr>
                            <td
                                colSpan={1 + rangeDays.length}
                                className="px-3 py-6 text-center text-sm text-muted-foreground"
                            >
                                {loading
                                    ? 'Caricamento planning…'
                                    : 'Nessuna linea LAS attiva nel periodo selezionato.'}
                            </td>
                        </tr>
                    ) : (
                        <>
                            {lines.map((line) => {
                                const lineMap =
                                    occupancyByLineAndDay[line.uuid] ?? {};
                                return (
                                    <Fragment key={line.uuid}>
                                        <tr className="border-b border-border/60 bg-muted/20 align-top">
                                            <td className="sticky left-0 z-10 bg-muted/30 px-2 py-2 text-xs font-semibold text-foreground shadow-sm">
                                                <div className="flex flex-col">
                                                    <span>{line.code}</span>
                                                    <span className="truncate text-[11px] font-normal text-muted-foreground">
                                                        {line.name}
                                                    </span>
                                                </div>
                                            </td>
                                            {rangeDays.map((day) => (
                                                <td
                                                    key={day.dateStr}
                                                    className="px-1 py-2 align-middle"
                                                >
                                                    <button
                                                        type="button"
                                                        className="block w-full"
                                                        onClick={() =>
                                                            openDay(
                                                                day.dateStr,
                                                                'hour',
                                                            )
                                                        }
                                                        disabled={loading}
                                                        title="Apri dettaglio giorno"
                                                    >
                                                        <BoardCell
                                                            value={
                                                                lineMap[
                                                                    day.dateStr
                                                                ] ?? 0
                                                            }
                                                        />
                                                    </button>
                                                </td>
                                            ))}
                                        </tr>
                                        {(line.orders ?? []).map((order) => {
                                            const orderMap =
                                                occupancyByOrderAndDay[
                                                    order.uuid
                                                ] ?? {};
                                            return (
                                                <tr
                                                    key={order.uuid}
                                                    className="align-top"
                                                >
                                                    <td className="sticky left-0 z-10 bg-card py-1.5 pr-2 pl-6 text-xs text-muted-foreground shadow-sm">
                                                        <span
                                                            className="block truncate"
                                                            title={`${order.code} - ${order.article_code ?? ''}`}
                                                        >
                                                            {order.code}
                                                            {order.article_code
                                                                ? ` — ${order.article_code}`
                                                                : ''}
                                                        </span>
                                                    </td>
                                                    {rangeDays.map((day) => (
                                                        <td
                                                            key={day.dateStr}
                                                            className="px-1 py-1.5 align-middle"
                                                        >
                                                            <button
                                                                type="button"
                                                                className="block w-full"
                                                                onClick={() =>
                                                                    openDay(
                                                                        day.dateStr,
                                                                        'hour',
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                                title="Apri dettaglio giorno"
                                                            >
                                                                <BoardCell
                                                                    value={
                                                                        orderMap[
                                                                            day
                                                                                .dateStr
                                                                        ] ?? 0
                                                                    }
                                                                />
                                                            </button>
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </Fragment>
                                );
                            })}
                            {SUMMARY_ROWS.map((row) => (
                                <tr
                                    key={`summary_${row.id}`}
                                    className="border-t-2 border-border bg-muted/40 align-middle"
                                >
                                    <td className="sticky left-0 z-10 bg-muted/50 px-2 py-2 text-xs font-semibold text-foreground shadow-sm">
                                        {row.label}
                                    </td>
                                    {rangeDays.map((day) => {
                                        if (day.isWeekend) {
                                            return (
                                                <td
                                                    key={day.dateStr}
                                                    className="px-1 py-2 text-center text-xs text-muted-foreground"
                                                >
                                                    —
                                                </td>
                                            );
                                        }

                                        const values =
                                            summaryValuesByDay[day.dateStr];
                                        const value = values
                                            ? (values[row.id] ?? 0)
                                            : 0;
                                        const isDisponibiliWarning =
                                            row.id === 'disponibili' &&
                                            value !== 0;
                                        const summaryKeyRiepilogo = `${toTimestamp(day.dateStr, 8, 0)}_${row.id}`;
                                        const isSummaryEditing =
                                            editingSummaryKey ===
                                            summaryKeyRiepilogo;

                                        if (row.editable && isSummaryEditing) {
                                            return (
                                                <td
                                                    key={day.dateStr}
                                                    className="min-w-[3rem] border border-primary p-0 align-middle"
                                                >
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        className="h-8 w-full border-0 bg-primary/10 px-1 text-center text-xs focus:outline-none"
                                                        value={
                                                            editingSummaryValue
                                                        }
                                                        onChange={(e) =>
                                                            setEditingSummaryValue(
                                                                e.target.value,
                                                            )
                                                        }
                                                        onBlur={() => {
                                                            void saveSummaryCell(
                                                                summaryKeyRiepilogo,
                                                                editingSummaryValue,
                                                            ).then(() => {
                                                                setEditingSummaryKey(
                                                                    null,
                                                                );
                                                                setEditingSummaryValue(
                                                                    '',
                                                                );
                                                            });
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key ===
                                                                'Escape'
                                                            ) {
                                                                setEditingSummaryKey(
                                                                    null,
                                                                );
                                                                setEditingSummaryValue(
                                                                    '',
                                                                );
                                                            }
                                                        }}
                                                        autoFocus
                                                    />
                                                </td>
                                            );
                                        }

                                        if (row.editable) {
                                            return (
                                                <td
                                                    key={day.dateStr}
                                                    className="min-w-[3rem] cursor-pointer px-1 py-2 align-middle"
                                                >
                                                    <div
                                                        className="flex h-8 items-center justify-center rounded-md border border-border bg-background text-xs font-medium text-foreground hover:bg-accent/50"
                                                        onClick={() => {
                                                            setEditingSummaryKey(
                                                                summaryKeyRiepilogo,
                                                            );
                                                            setEditingSummaryValue(
                                                                String(value),
                                                            );
                                                        }}
                                                    >
                                                        {value > 0 ? value : ''}
                                                    </div>
                                                </td>
                                            );
                                        }

                                        return (
                                            <td
                                                key={day.dateStr}
                                                className="px-1 py-2 align-middle"
                                            >
                                                <div
                                                    className={`flex h-8 items-center justify-center rounded-md text-xs font-medium ${
                                                        isDisponibiliWarning
                                                            ? 'bg-red-500/80 text-red-50'
                                                            : 'border border-border bg-background text-foreground'
                                                    }`}
                                                >
                                                    {value}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default function PlanningBoard({ today }: PlanningBoardProps) {
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: 'Dashboard', href: dashboard().url },
            {
                title: 'Pianificazione Produzione',
                href: planningNav.index.url(),
            },
        ],
        [],
    );

    // Data iniziale = oggi (state.currentDate = moment().startOf('day'))
    const [currentDate, setCurrentDate] = useState<string>(today);
    // UX moderno: vista iniziale = giornaliera per ore (più leggibile del dettaglio a quarti)
    const [rangeMode, setRangeMode] = useState<RangeMode>('day');
    const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('hour');
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [lines, setLines] = useState<PlanningLine[]>([]);
    const [planning, setPlanning] = useState<PlanningRow[]>([]);
    const [summaries, setSummaries] = useState<PlanningSummaryRow[]>([]);
    const [contracts, setContracts] = useState<PlanningContract[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [infoMessage, setInfoMessage] = useState<string | null>(null);
    const [editingCellKey, setEditingCellKey] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState('');
    const [editingSummaryKey, setEditingSummaryKey] = useState<string | null>(
        null,
    );
    const [editingSummaryValue, setEditingSummaryValue] = useState('');

    const { start: startDate, end: endDate } = useMemo(
        () => getRangeDates(currentDate, rangeMode),
        [currentDate, rangeMode],
    );

    const rangeDays: BoardDay[] = useMemo(() => {
        const out: BoardDay[] = [];
        let d = startDate;
        while (d <= endDate) {
            const dt = new Date(d + 'T12:00:00');
            out.push({
                dateStr: d,
                label: formatDayLabel(d),
                isWeekend: dt.getDay() === 0 || dt.getDay() === 6,
            });
            d = addDays(d, 1);
        }
        return out;
    }, [startDate, endDate]);

    const goPrev = useCallback(() => {
        setCurrentDate((prev) =>
            rangeMode === 'day'
                ? addDays(prev, -1)
                : rangeMode === 'week'
                  ? addDays(prev, -7)
                  : addMonths(prev, -1),
        );
    }, [rangeMode]);

    const goNext = useCallback(() => {
        setCurrentDate((prev) =>
            rangeMode === 'day'
                ? addDays(prev, 1)
                : rangeMode === 'week'
                  ? addDays(prev, 7)
                  : addMonths(prev, 1),
        );
    }, [rangeMode]);

    const goToday = useCallback(() => {
        setCurrentDate(today);
    }, [today]);

    const openDay = useCallback((dateStr: string, zoom: ZoomLevel = 'hour') => {
        setCurrentDate(dateStr);
        setRangeMode('day');
        setZoomLevel(zoom);
    }, []);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(api.planning.data.url(), {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    start_date: `${startDate} 00:00:00`,
                    end_date: `${endDate} 23:59:59`,
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(
                    `Errore caricamento planning (${response.status}): ${text}`,
                );
            }

            const json = await response.json();
            if (json.error_code !== 0) {
                throw new Error(json.message || 'Errore sconosciuto');
            }

            setLines(json.lines ?? []);
            setPlanning(json.planning ?? []);
            setSummaries(json.summary ?? []);
            setContracts(json.contracts ?? []);
        } catch (e) {
            const err = e as Error;
            setError(
                err.message || 'Errore durante il caricamento del planning',
            );
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const savePlanningCell = useCallback(
        async (cellKey: string, newValue: number) => {
            try {
                const parts = cellKey.split('_');
                if (parts.length < 3) return;
                const lineUuid = parts[0];
                const orderUuid = parts[1];
                const timestamp = parts.slice(2).join('_');
                const y = timestamp.slice(0, 4);
                const m = timestamp.slice(4, 6);
                const d = timestamp.slice(6, 8);
                const hour = Number(timestamp.slice(8, 10));
                const minute = Number(timestamp.slice(10, 12));
                const dateStr = `${y}-${m}-${d}`;

                const response = await fetch(api.planning.save.url(), {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        order_uuid: orderUuid,
                        lasworkline_uuid: lineUuid,
                        date: dateStr,
                        hour,
                        minute,
                        workers: newValue,
                        zoom_level: zoomLevel,
                    }),
                });
                const json = await response.json().catch(() => ({}));
                const err = json as { error_code?: number; message?: string };
                if (!response.ok || err.error_code !== 0) {
                    setError(err.message ?? 'Errore salvataggio');
                    return;
                }
                const replan = (
                    json as {
                        replan_result?: {
                            quarters_added?: number;
                            quarters_removed?: number;
                            message?: string;
                        };
                    }
                ).replan_result;
                const hasReplan =
                    (replan?.quarters_added ?? 0) > 0 ||
                    (replan?.quarters_removed ?? 0) > 0;
                // Applicare sempre l'aggiornamento ottimistico; non chiamare loadData() dopo save
                // altrimenti il replan può far tornare la riga vuota (-).
                setPlanning((prev) => {
                    // Backend usa hour*100+minute (es. 800, 815); stesso formato della vista classica
                    const timeKey = (h: number, mm: number) =>
                        String(h * 100 + mm);
                    const keysToSet =
                        zoomLevel === 'hour'
                            ? [0, 15, 30, 45].map((mm) => timeKey(hour, mm))
                            : [timeKey(hour, minute)];
                    const dateOnly = dateStr;
                    const dateFull = `${dateOnly} 00:00:00`;
                    let found = false;
                    const next = prev.map((row) => {
                        // Modifica solo la riga con stesso order, linea e data (formato backend Y-m-d H:i:s)
                        if (
                            row.order_uuid !== orderUuid ||
                            row.lasworkline_uuid !== lineUuid ||
                            !row.date ||
                            row.date.slice(0, 10) !== dateOnly
                        )
                            return row;
                        found = true;
                        let hoursObj: Record<string, number> = {};
                        try {
                            hoursObj = JSON.parse(row.hours) as Record<
                                string,
                                number
                            >;
                        } catch {
                            hoursObj = {};
                        }
                        const nextHours = { ...hoursObj };
                        if (newValue <= 0) {
                            for (const k of keysToSet) delete nextHours[k];
                        } else {
                            for (const k of keysToSet) nextHours[k] = newValue;
                        }
                        return { ...row, hours: JSON.stringify(nextHours) };
                    });
                    if (!found && newValue > 0) {
                        const nextHours: Record<string, number> = {};
                        for (const k of keysToSet) nextHours[k] = newValue;
                        next.push({
                            id: null,
                            order_uuid: orderUuid,
                            lasworkline_uuid: lineUuid,
                            date: dateFull,
                            hours: JSON.stringify(nextHours),
                        });
                    }
                    return next;
                });
                setInfoMessage(
                    hasReplan
                        ? `Aggiornato: ${newValue} addetti. ${replan?.message ?? ''}`.trim()
                        : `Aggiornato: ${newValue} addetti`,
                );
            } catch (e) {
                setError((e as Error).message ?? 'Errore di connessione');
            }
        },
        [zoomLevel],
    );

    const saveSummaryCell = useCallback(
        async (summaryKey: string, inputVal: string) => {
            try {
                const timestamp = summaryKey.substring(0, 12);
                const summaryType = summaryKey.substring(13);
                const y = timestamp.slice(0, 4);
                const m = timestamp.slice(4, 6);
                const d = timestamp.slice(6, 8);
                const hour = Number(timestamp.slice(8, 10));
                const minute = Number(timestamp.slice(10, 12));
                const dateStr = `${y}-${m}-${d}`;
                const isReset = inputVal.trim() === '';
                const value = isReset ? 0 : Number.parseInt(inputVal, 10) || 0;

                const response = await fetch(api.planning.summary.save.url(), {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        summary_type: summaryType,
                        date: dateStr,
                        hour,
                        minute,
                        value,
                        reset: isReset ? 1 : 0,
                        zoom_level: zoomLevel,
                    }),
                });
                const json = await response.json().catch(() => ({}));
                const err = json as { error_code?: number; message?: string };
                if (!response.ok || err.error_code !== 0) {
                    setError(err.message ?? 'Errore salvataggio summary');
                    return;
                }
                setSummaries((prev) => {
                    const slotKey = hour * 100 + minute;
                    return prev.map((row) => {
                        if (
                            !row.date ||
                            row.date.slice(0, 10) !== dateStr ||
                            row.summary_type !== summaryType
                        )
                            return row;
                        let hoursObj: Record<string, number> = {};
                        try {
                            hoursObj = JSON.parse(row.hours) as Record<
                                string,
                                number
                            >;
                        } catch {
                            hoursObj = {};
                        }
                        const next = { ...hoursObj };
                        if (value <= 0) delete next[String(slotKey)];
                        else next[String(slotKey)] = value;
                        return { ...row, hours: JSON.stringify(next) };
                    });
                });
                setInfoMessage('Riepilogo aggiornato');
            } catch (e) {
                setError((e as Error).message ?? 'Errore di connessione');
            }
        },
        [zoomLevel],
    );

    const occupancyByLineAndDay: BoardOccupancy = useMemo(() => {
        if (planning.length === 0 || rangeDays.length === 0) return {};
        const dateSet = new Set(rangeDays.map((d) => d.dateStr));
        const result: BoardOccupancy = {};

        for (const row of planning) {
            if (!row.date) continue;
            const dateStr = row.date.slice(0, 10);
            if (!dateSet.has(dateStr)) continue;
            let workersSum = 0;
            try {
                const hoursObj = JSON.parse(row.hours || '{}') as Record<
                    string,
                    number
                >;
                for (const value of Object.values(hoursObj)) {
                    if (typeof value === 'number' && value > 0) {
                        workersSum += value;
                    }
                }
            } catch {
                // ignore parse errors; treat as 0
            }
            if (workersSum <= 0) continue;
            if (!result[row.lasworkline_uuid]) {
                result[row.lasworkline_uuid] = {};
            }
            result[row.lasworkline_uuid][dateStr] =
                (result[row.lasworkline_uuid][dateStr] ?? 0) + workersSum;
        }

        return result;
    }, [planning, rangeDays]);

    const occupancyByOrderAndDay: Record<
        string,
        Record<string, number>
    > = useMemo(() => {
        if (planning.length === 0 || rangeDays.length === 0) return {};
        const dateSet = new Set(rangeDays.map((d) => d.dateStr));
        const result: Record<string, Record<string, number>> = {};
        for (const row of planning) {
            if (!row.date) continue;
            const dateStr = row.date.slice(0, 10);
            if (!dateSet.has(dateStr)) continue;
            let workersSum = 0;
            try {
                const hoursObj = JSON.parse(row.hours || '{}') as Record<
                    string,
                    number
                >;
                for (const value of Object.values(hoursObj)) {
                    if (typeof value === 'number' && value > 0)
                        workersSum += value;
                }
            } catch {
                /* ignore */
            }
            if (workersSum <= 0) continue;
            if (!result[row.order_uuid]) result[row.order_uuid] = {};
            result[row.order_uuid][dateStr] =
                (result[row.order_uuid][dateStr] ?? 0) + workersSum;
        }
        return result;
    }, [planning, rangeDays]);

    const totaleImpegnoByDay: Record<string, number> = useMemo(() => {
        const out: Record<string, number> = {};
        for (const day of rangeDays) {
            let sum = 0;
            for (const line of lines) {
                sum += occupancyByLineAndDay[line.uuid]?.[day.dateStr] ?? 0;
            }
            out[day.dateStr] = sum;
        }
        return out;
    }, [rangeDays, lines, occupancyByLineAndDay]);

    const summaryData = useMemo(() => {
        const map: Record<string, number> = {};
        for (const row of summaries) {
            if (!row.date) continue;
            const dateStr = row.date.slice(0, 10);
            let hoursObj: Record<string, number> = {};
            try {
                hoursObj = JSON.parse(row.hours) as Record<string, number>;
            } catch {
                hoursObj = {};
            }
            for (const [slotKey, value] of Object.entries(hoursObj)) {
                const slotInt = Number.parseInt(slotKey, 10);
                const hour = Math.floor(slotInt / 100);
                const minute = slotInt % 100;
                const ts = toTimestamp(dateStr, hour, minute);
                map[`${ts}_${row.summary_type}`] = Number(value) || 0;
            }
        }
        return map;
    }, [summaries]);

    const slotColumns: SlotColumn[] = useMemo(() => {
        const now = new Date();
        const nowStr = now.toISOString().slice(0, 10);
        const nowHour = now.getHours();
        const nowMinute = now.getMinutes();
        const nowQuarter = Math.floor(nowMinute / 15) * 15;
        const cols: SlotColumn[] = [];
        if (rangeMode === 'month') return [];

        if (rangeMode === 'week') {
            // Vista settimanale: 7 giorni (rolling window) per ore
            for (let d = 0; d < 7; d++) {
                const dayStr = addDays(startDate, d);
                const dayOfWeek = new Date(dayStr + 'T12:00:00').getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                for (let hour = START_HOUR; hour < END_HOUR; hour++) {
                    // Solo oggi: non mostrare slot passati
                    if (dayStr === nowStr && hour < nowHour) continue;
                    cols.push({
                        timestamp: toTimestamp(dayStr, hour, 0),
                        dateStr: dayStr,
                        hour,
                        minute: 0,
                        label: `${hour}h`,
                        isWeekend,
                        isDayEnd: hour === END_HOUR - 1,
                    });
                }
            }
            return cols;
        }

        // rangeMode === 'day'
        {
            const dateStr = currentDate;
            const dayOfWeek = new Date(dateStr + 'T12:00:00').getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            for (let hour = START_HOUR; hour < END_HOUR; hour++) {
                if (zoomLevel === 'hour') {
                    if (dateStr === nowStr && hour < nowHour) continue;
                    cols.push({
                        timestamp: toTimestamp(dateStr, hour, 0),
                        dateStr,
                        hour,
                        minute: 0,
                        label: `${hour}h`,
                        isWeekend,
                        isDayEnd: hour === END_HOUR - 1,
                    });
                    continue;
                }

                for (let minute = 0; minute < 60; minute += 15) {
                    if (
                        dateStr === nowStr &&
                        (hour < nowHour ||
                            (hour === nowHour && minute < nowQuarter))
                    )
                        continue;
                    cols.push({
                        timestamp: toTimestamp(dateStr, hour, minute),
                        dateStr,
                        hour,
                        minute,
                        label: `${hour}:${pad2(minute)}`,
                        isWeekend,
                        isDayEnd: hour === END_HOUR - 1 && minute === 45,
                    });
                }
            }
            return cols;
        }
    }, [rangeMode, currentDate, startDate, zoomLevel]);

    const planningData = useMemo(() => {
        const map: Record<string, number> = {};
        for (const row of planning) {
            if (!row.date) continue;
            const dateStr = row.date.slice(0, 10);
            let hoursObj: Record<string, number> = {};
            try {
                hoursObj = JSON.parse(row.hours) as Record<string, number>;
            } catch {
                hoursObj = {};
            }
            for (const [slotKey, value] of Object.entries(hoursObj)) {
                const slotInt = Number.parseInt(slotKey, 10);
                const hour = Math.floor(slotInt / 100);
                const minute = slotInt % 100;
                const ts = toTimestamp(dateStr, hour, minute);
                const key = getCellKey(
                    row.lasworkline_uuid,
                    row.order_uuid,
                    ts,
                );
                const workers = Number(value) || 0;
                if (workers > 0) map[key] = workers;
            }
        }
        return map;
    }, [planning]);

    const totalsByTimestamp: Record<string, number> = useMemo(() => {
        const out: Record<string, number> = {};
        for (const col of slotColumns) {
            if (col.isWeekend) continue;
            let sum = 0;
            for (const line of lines) {
                for (const order of line.orders ?? []) {
                    if (zoomLevel === 'hour') {
                        let quarterSum = 0;
                        let quarterCount = 0;
                        for (const min of [0, 15, 30, 45]) {
                            const v =
                                planningData[
                                    getCellKey(
                                        line.uuid,
                                        order.uuid,
                                        toTimestamp(col.dateStr, col.hour, min),
                                    )
                                ] ?? 0;
                            if (v > 0) {
                                quarterSum += v;
                                quarterCount++;
                            }
                        }
                        if (quarterCount > 0) {
                            sum += Math.round(quarterSum / quarterCount);
                        }
                    } else {
                        const v =
                            planningData[
                                getCellKey(line.uuid, order.uuid, col.timestamp)
                            ] ?? 0;
                        sum += v > 0 ? v : 0;
                    }
                }
            }
            out[col.timestamp] = sum;
        }
        return out;
    }, [slotColumns, lines, planningData, zoomLevel]);

    const getSummaryValueForSlot = useCallback(
        (
            timestamp: string,
            summaryType: string,
            defaultValue: number,
        ): number => {
            if (zoomLevel === 'hour') {
                const [y, m, d, hh] = [
                    timestamp.slice(0, 4),
                    timestamp.slice(4, 6),
                    timestamp.slice(6, 8),
                    Number(timestamp.slice(8, 10)),
                ];
                for (const min of [0, 15, 30, 45]) {
                    const ts = `${y}${m}${d}${pad2(hh)}${pad2(min)}`;
                    const key = `${ts}_${summaryType}`;
                    if (
                        Object.prototype.hasOwnProperty.call(summaryData, key)
                    ) {
                        return summaryData[key] ?? defaultValue;
                    }
                }
                return defaultValue;
            }
            const key = `${timestamp}_${summaryType}`;
            if (Object.prototype.hasOwnProperty.call(summaryData, key)) {
                return summaryData[key] ?? defaultValue;
            }
            return defaultValue;
        },
        [summaryData, zoomLevel],
    );

    const isSummaryValueCustom = useCallback(
        (timestamp: string, summaryType: string): boolean => {
            if (zoomLevel === 'hour') {
                const [y, m, d, hh] = [
                    timestamp.slice(0, 4),
                    timestamp.slice(4, 6),
                    timestamp.slice(6, 8),
                    Number(timestamp.slice(8, 10)),
                ];
                return [0, 15, 30, 45].some((min) => {
                    const ts = `${y}${m}${d}${pad2(hh)}${pad2(min)}`;
                    return Object.prototype.hasOwnProperty.call(
                        summaryData,
                        `${ts}_${summaryType}`,
                    );
                });
            }
            return Object.prototype.hasOwnProperty.call(
                summaryData,
                `${timestamp}_${summaryType}`,
            );
        },
        [summaryData, zoomLevel],
    );

    const getSummaryValueForDay = useCallback(
        (
            dateStr: string,
            summaryType: string,
            defaultValue: number,
        ): number => {
            const ts = toTimestamp(dateStr, 8, 0);
            const key = `${ts}_${summaryType}`;
            if (Object.prototype.hasOwnProperty.call(summaryData, key)) {
                return summaryData[key] ?? defaultValue;
            }
            return defaultValue;
        },
        [summaryData],
    );

    const summaryValuesByDay = useMemo(() => {
        const byDay: Record<string, Record<string, number>> = {};
        for (const day of rangeDays) {
            if (day.isWeekend) continue;
            const contractCounts = countContractsByQualifica(
                day.dateStr,
                contracts,
            );
            const totaleImpegno = totaleImpegnoByDay[day.dateStr] ?? 0;
            const assenze = getSummaryValueForDay(day.dateStr, 'assenze', 0);
            const caporeparto = getSummaryValueForDay(
                day.dateStr,
                'caporeparto',
                contractCounts.capo_reparto,
            );
            const magazzinieri = getSummaryValueForDay(
                day.dateStr,
                'magazzinieri',
                contractCounts.magazzinieri,
            );
            const daImpiegare =
                contractCounts.contratto - assenze - caporeparto - magazzinieri;
            const disponibili = daImpiegare - totaleImpegno;
            byDay[day.dateStr] = {
                totale_impegno: totaleImpegno,
                da_impiegare: daImpiegare,
                assenze,
                disponibili,
                caporeparto,
                magazzinieri,
            };
        }
        return byDay;
    }, [rangeDays, contracts, totaleImpegnoByDay, getSummaryValueForDay]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pianificazione Produzione" />

            <div
                ref={containerRef}
                className="flex min-w-0 flex-1 flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
                aria-busy={loading}
                aria-label="Pianificazione produzione"
            >
                {/* Toolbar: navegación, fecha, zoom y periodo — diseño enterprise 2026 */}
                <header
                    role="toolbar"
                    aria-label="Controlli pianificazione"
                    className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-lg border border-border/80 bg-muted/20 px-4 py-3 shadow-sm"
                >
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={goPrev}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                            title={
                                rangeMode === 'day'
                                    ? 'Giorno precedente'
                                    : rangeMode === 'week'
                                      ? 'Settimana precedente'
                                      : 'Mese precedente'
                            }
                            disabled={loading || currentDate <= today}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                            title={
                                rangeMode === 'day'
                                    ? 'Giorno successivo'
                                    : rangeMode === 'week'
                                      ? 'Settimana successiva'
                                      : 'Mese successivo'
                            }
                            disabled={loading}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={goToday}
                            className={`ml-2 rounded-md border px-3 py-2 text-sm font-medium shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                                currentDate === today
                                    ? 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/20'
                                    : 'border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                            disabled={loading}
                            title="Vai a oggi"
                        >
                            Oggi
                        </button>
                    </div>

                    <div
                        className="hidden h-6 w-px bg-border sm:block"
                        aria-hidden
                    />
                    <div className="flex min-w-0 shrink-0 items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            {rangeMode === 'day' ? 'Data:' : 'Range:'}{' '}
                            <strong className="font-semibold text-foreground">
                                {formatDateRangeLabel(currentDate, rangeMode)}
                            </strong>
                        </span>
                    </div>

                    <div
                        className="hidden h-6 w-px bg-border sm:block"
                        aria-hidden
                    />
                    <div className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-2">
                        {rangeMode === 'day' ? (
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                                    Zoom
                                </span>
                                <div
                                    className="inline-flex items-center gap-px rounded-md border border-border bg-background p-0.5 text-xs font-medium shadow-sm"
                                    role="group"
                                    aria-label="Zoom temporale"
                                >
                                    <button
                                        type="button"
                                        className={`rounded px-2 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none ${
                                            zoomLevel === 'hour'
                                                ? 'bg-accent text-accent-foreground'
                                                : 'text-muted-foreground hover:bg-muted'
                                        }`}
                                        onClick={() => setZoomLevel('hour')}
                                        disabled={loading}
                                        aria-pressed={zoomLevel === 'hour'}
                                    >
                                        Ore
                                    </button>
                                    <button
                                        type="button"
                                        className={`rounded px-2 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none ${
                                            zoomLevel === 'quarter'
                                                ? 'bg-accent text-accent-foreground'
                                                : 'text-muted-foreground hover:bg-muted'
                                        }`}
                                        onClick={() => setZoomLevel('quarter')}
                                        disabled={loading}
                                        aria-pressed={zoomLevel === 'quarter'}
                                    >
                                        Quarti
                                    </button>
                                </div>
                            </div>
                        ) : null}

                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                                Periodo
                            </span>
                            <div
                                className="inline-flex items-center gap-px rounded-md border border-border bg-background p-0.5 text-xs font-medium shadow-sm"
                                role="group"
                                aria-label="Periodo di visualizzazione"
                            >
                                <button
                                    type="button"
                                    className={`rounded px-2 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none ${
                                        rangeMode === 'day'
                                            ? 'bg-accent text-accent-foreground'
                                            : 'text-muted-foreground hover:bg-muted'
                                    }`}
                                    onClick={() => {
                                        setRangeMode('day');
                                        setZoomLevel('hour');
                                    }}
                                    disabled={loading}
                                    aria-pressed={rangeMode === 'day'}
                                >
                                    Diaria
                                </button>
                                <button
                                    type="button"
                                    className={`rounded px-2 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none ${
                                        rangeMode === 'week'
                                            ? 'bg-accent text-accent-foreground'
                                            : 'text-muted-foreground hover:bg-muted'
                                    }`}
                                    onClick={() => {
                                        setRangeMode('week');
                                        setZoomLevel('hour');
                                    }}
                                    disabled={loading}
                                    aria-pressed={rangeMode === 'week'}
                                >
                                    Settimanale
                                </button>
                                <button
                                    type="button"
                                    className={`rounded px-2 py-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none ${
                                        rangeMode === 'month'
                                            ? 'bg-accent text-accent-foreground'
                                            : 'text-muted-foreground hover:bg-muted'
                                    }`}
                                    onClick={() => setRangeMode('month')}
                                    disabled={loading}
                                    aria-pressed={rangeMode === 'month'}
                                >
                                    Mensile
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {infoMessage ? (
                    <div
                        role="status"
                        aria-live="polite"
                        className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary"
                    >
                        {infoMessage}
                    </div>
                ) : null}

                {error ? (
                    <div
                        role="alert"
                        aria-live="assertive"
                        className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                    >
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={() => void loadData()}
                            className="rounded-md border border-destructive/60 bg-destructive/20 px-2.5 py-1 font-medium hover:bg-destructive/30"
                        >
                            Riprova
                        </button>
                    </div>
                ) : null}

                {/* Legenda: stato celle e link vista classica — semántica y colapsable */}
                <section
                    aria-labelledby="planning-legend-title"
                    className="rounded-lg border border-border/60 bg-muted/20"
                >
                    <details className="group/details" open>
                        <summary
                            id="planning-legend-title"
                            className="flex cursor-pointer list-none flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden"
                        >
                            <span>Legenda</span>
                            <span className="inline-flex size-5 items-center justify-center rounded border border-border text-[10px] transition-transform group-open/details:rotate-180 sm:hidden">
                                ▼
                            </span>
                        </summary>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/40 bg-muted/30 px-3 py-2.5 text-xs">
                            <dl className="flex flex-wrap items-center gap-x-5 gap-y-2">
                                <div className="flex items-center gap-2">
                                    <dt className="sr-only">Occupato</dt>
                                    <dd className="flex items-center gap-1.5">
                                        <span
                                            className="size-4 shrink-0 rounded border border-emerald-500/60 bg-emerald-500/80"
                                            aria-hidden
                                        />
                                        <span>Verde = occupato (addetti)</span>
                                    </dd>
                                </div>
                                <div className="flex items-center gap-2">
                                    <dt className="sr-only">Libero</dt>
                                    <dd className="flex items-center gap-1.5">
                                        <span
                                            className="size-4 shrink-0 rounded border border-dashed border-muted bg-background/40"
                                            aria-hidden
                                        />
                                        <span>Grigio = libero</span>
                                    </dd>
                                </div>
                                <div className="flex items-center gap-2">
                                    <dt className="sr-only">
                                        Deficit / overdue
                                    </dt>
                                    <dd className="flex items-center gap-1.5">
                                        <span
                                            className="size-4 shrink-0 rounded border border-red-500/60 bg-red-500/80"
                                            aria-hidden
                                        />
                                        <span>
                                            Rosso = deficit / celle overdue
                                        </span>
                                    </dd>
                                </div>
                                <div className="flex items-center gap-2">
                                    <dt className="sr-only">Deadline</dt>
                                    <dd className="flex items-center gap-1.5">
                                        <span
                                            className="size-4 shrink-0 border-r-2 border-amber-500 bg-transparent px-1"
                                            aria-hidden
                                        />
                                        <span>
                                            Bordo ambra = deadline consegna
                                        </span>
                                    </dd>
                                </div>
                                {rangeMode !== 'month' &&
                                    zoomLevel === 'hour' && (
                                        <div className="flex items-center gap-2">
                                            <dt className="sr-only">
                                                Valori misti
                                            </dt>
                                            <dd className="text-muted-foreground">
                                                * = valori misti (vista ore)
                                            </dd>
                                        </div>
                                    )}
                            </dl>
                            {/* Link a vista classica rimosso: la vista legacy non è più disponibile */}
                        </div>
                    </details>
                </section>
                {rangeMode !== 'month' ? (
                    <DayGridView
                        slotColumns={slotColumns}
                        lines={lines}
                        planningData={planningData}
                        totalsByTimestamp={totalsByTimestamp}
                        zoomLevel={zoomLevel}
                        onZoomDay={
                            rangeMode === 'week'
                                ? (dateStr) => openDay(dateStr, 'quarter')
                                : undefined
                        }
                        getSummaryValueForSlot={getSummaryValueForSlot}
                        isSummaryValueCustom={isSummaryValueCustom}
                        contracts={contracts}
                        loading={loading}
                        editingCellKey={editingCellKey}
                        editingValue={editingValue}
                        setEditingCellKey={setEditingCellKey}
                        setEditingValue={setEditingValue}
                        onSavePlanningCell={savePlanningCell}
                        editingSummaryKey={editingSummaryKey}
                        editingSummaryValue={editingSummaryValue}
                        setEditingSummaryKey={setEditingSummaryKey}
                        setEditingSummaryValue={setEditingSummaryValue}
                        onSaveSummaryCell={saveSummaryCell}
                    />
                ) : (
                    <>
                        <PlanningMonthSummary
                            rangeDays={rangeDays}
                            lines={lines}
                            loading={loading}
                            occupancyByLineAndDay={occupancyByLineAndDay}
                            occupancyByOrderAndDay={occupancyByOrderAndDay}
                            summaryValuesByDay={summaryValuesByDay}
                            editingSummaryKey={editingSummaryKey}
                            editingSummaryValue={editingSummaryValue}
                            setEditingSummaryKey={setEditingSummaryKey}
                            setEditingSummaryValue={setEditingSummaryValue}
                            saveSummaryCell={saveSummaryCell}
                            openDay={openDay}
                        />
                        {/*
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-sm">
                            <thead>
                                <tr>
                                    <th className="sticky left-0 z-10 bg-card px-2 py-2 text-left text-xs font-semibold text-muted-foreground">
                                        Linea
                                    </th>
                                    {rangeDays.map((day) => (
                                        <th
                                            key={day.dateStr}
                                            className="px-2 py-2 text-center text-xs font-semibold text-muted-foreground"
                                        >
                                            <button
                                                type="button"
                                                className="rounded px-1 py-0.5 hover:bg-accent/50"
                                                onClick={() =>
                                                    openDay(day.dateStr, 'hour')
                                                }
                                                disabled={loading}
                                                title="Apri dettaglio giorno"
                                            >
                                                {day.label}
                                            </button>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {lines.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={1 + rangeDays.length}
                                            className="px-3 py-6 text-center text-sm text-muted-foreground"
                                        >
                                            {loading
                                                ? 'Caricamento planning…'
                                                : 'Nessuna linea LAS attiva nel periodo selezionato.'}
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {lines.map((line) => {
                                            const lineMap =
                                                occupancyByLineAndDay[
                                                    line.uuid
                                                ] ?? {};
                                            return (
                                                <Fragment key={line.uuid}>
                                                    <tr className="border-b border-border/60 bg-muted/20 align-top">
                                                        <td className="sticky left-0 z-10 bg-muted/30 px-2 py-2 text-xs font-semibold text-foreground shadow-sm">
                                                            <div className="flex flex-col">
                                                                <span>
                                                                    {line.code}
                                                                </span>
                                                                <span className="truncate text-[11px] font-normal text-muted-foreground">
                                                                    {line.name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        {rangeDays.map((day) => (
                                                            <td
                                                                key={
                                                                    day.dateStr
                                                                }
                                                                className="px-1 py-2 align-middle"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    className="block w-full"
                                                                    onClick={() =>
                                                                        openDay(
                                                                            day.dateStr,
                                                                            'hour',
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        loading
                                                                    }
                                                                    title="Apri dettaglio giorno"
                                                                >
                                                                    <BoardCell
                                                                        value={
                                                                            lineMap[
                                                                                day
                                                                                    .dateStr
                                                                            ] ??
                                                                            0
                                                                        }
                                                                    />
                                                                </button>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                    {(line.orders ?? []).map(
                                                        (order) => {
                                                            const orderMap =
                                                                occupancyByOrderAndDay[
                                                                    order.uuid
                                                                ] ?? {};
                                                            return (
                                                                <tr
                                                                    key={
                                                                        order.uuid
                                                                    }
                                                                    className="align-top"
                                                                >
                                                                    <td className="sticky left-0 z-10 bg-card py-1.5 pr-2 pl-6 text-xs text-muted-foreground shadow-sm">
                                                                        <span
                                                                            className="block truncate"
                                                                            title={`${order.code} - ${order.article_code ?? ''}`}
                                                                        >
                                                                            {
                                                                                order.code
                                                                            }
                                                                            {order.article_code
                                                                                ? ` — ${order.article_code}`
                                                                                : ''}
                                                                        </span>
                                                                    </td>
                                                                    {rangeDays.map(
                                                                        (
                                                                            day,
                                                                        ) => (
                                                                            <td
                                                                                key={
                                                                                    day.dateStr
                                                                                }
                                                                                className="px-1 py-1.5 align-middle"
                                                                            >
                                                                                <button
                                                                                    type="button"
                                                                                    className="block w-full"
                                                                                    onClick={() =>
                                                                                        openDay(
                                                                                            day.dateStr,
                                                                                            'hour',
                                                                                        )
                                                                                    }
                                                                                    disabled={
                                                                                        loading
                                                                                    }
                                                                                    title="Apri dettaglio giorno"
                                                                                >
                                                                                    <BoardCell
                                                                                        value={
                                                                                            orderMap[
                                                                                                day
                                                                                                    .dateStr
                                                                                            ] ??
                                                                                            0
                                                                                        }
                                                                                    />
                                                                                </button>
                                                                            </td>
                                                                        ),
                                                                    )}
                                                                </tr>
                                                            );
                                                        },
                                                    )}
                                                </Fragment>
                                            );
                                        })}
                                        {SUMMARY_ROWS.map((row) => (
                                            <tr
                                                key={`summary_${row.id}`}
                                                className="border-t-2 border-border bg-muted/40 align-middle"
                                            >
                                                <td className="sticky left-0 z-10 bg-muted/50 px-2 py-2 text-xs font-semibold text-foreground shadow-sm">
                                                    {row.label}
                                                </td>
                                                {rangeDays.map((day) => {
                                                    if (day.isWeekend) {
                                                        return (
                                                            <td
                                                                key={
                                                                    day.dateStr
                                                                }
                                                                className="px-1 py-2 text-center text-xs text-muted-foreground"
                                                            >
                                                                —
                                                            </td>
                                                        );
                                                    }
                                                    const values =
                                                        summaryValuesByDay[
                                                            day.dateStr
                                                        ];
                                                    const value = values
                                                        ? (values[row.id] ?? 0)
                                                        : 0;
                                                    const isDisponibiliWarning =
                                                        row.id ===
                                                            'disponibili' &&
                                                        value !== 0;
                                                    const summaryKeyRiepilogo =
                                                        `${toTimestamp(day.dateStr, 8, 0)}_${row.id}`;
                                                    const isSummaryEditing =
                                                        editingSummaryKey ===
                                                        summaryKeyRiepilogo;
                                                    if (
                                                        row.editable &&
                                                        isSummaryEditing
                                                    ) {
                                                        return (
                                                            <td
                                                                key={day.dateStr}
                                                                className="min-w-[3rem] border border-primary p-0 align-middle"
                                                            >
                                                                <input
                                                                    type="number"
                                                                    min={0}
                                                                    className="h-8 w-full border-0 bg-primary/10 px-1 text-center text-xs focus:outline-none"
                                                                    value={
                                                                        editingSummaryValue
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setEditingSummaryValue(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    onBlur={() => {
                                                                        void saveSummaryCell(
                                                                            summaryKeyRiepilogo,
                                                                            editingSummaryValue,
                                                                        ).then(
                                                                            () => {
                                                                                setEditingSummaryKey(
                                                                                    null,
                                                                                );
                                                                                setEditingSummaryValue(
                                                                                    '',
                                                                                );
                                                                            },
                                                                        );
                                                                    }}
                                                                    onKeyDown={(
                                                                        e,
                                                                    ) => {
                                                                        if (
                                                                            e.key ===
                                                                            'Escape'
                                                                        ) {
                                                                            setEditingSummaryKey(
                                                                                null,
                                                                            );
                                                                            setEditingSummaryValue(
                                                                                '',
                                                                            );
                                                                        }
                                                                    }}
                                                                    autoFocus
                                                                />
                                                            </td>
                                                        );
                                                    }
                                                    if (row.editable) {
                                                        return (
                                                            <td
                                                                key={day.dateStr}
                                                                className="min-w-[3rem] cursor-pointer px-1 py-2 align-middle"
                                                            >
                                                                <div
                                                                    className="flex h-8 items-center justify-center rounded-md border border-border bg-background text-xs font-medium text-foreground hover:bg-accent/50"
                                                                    onClick={() => {
                                                                        setEditingSummaryKey(
                                                                            summaryKeyRiepilogo,
                                                                        );
                                                                        setEditingSummaryValue(
                                                                            String(
                                                                                value,
                                                                            ),
                                                                        );
                                                                    }}
                                                                >
                                                                    {value >
                                                                    0
                                                                        ? value
                                                                        : ''}
                                                                </div>
                                                            </td>
                                                        );
                                                    }
                                                    return (
                                                        <td
                                                            key={day.dateStr}
                                                            className="px-1 py-2 align-middle"
                                                        >
                                                            <div
                                                                className={`flex h-8 items-center justify-center rounded-md text-xs font-medium ${
                                                                    isDisponibiliWarning
                                                                        ? 'bg-red-500/80 text-red-50'
                                                                        : 'border border-border bg-background text-foreground'
                                                                }`}
                                                            >
                                                                {value}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                        */}
                    </>
                )}
            </div>
        </AppLayout>
    );
}

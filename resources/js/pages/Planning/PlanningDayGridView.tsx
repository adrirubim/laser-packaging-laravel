/**
 * Griglia giorno/settimana — slot orari, celle pianificazione e riepilogo.
 * Header sticky, navigazione Tab/Enter, Shift+rueda scroll orizzontale.
 */
import { useTranslations } from '@/hooks/use-translations';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SUMMARY_ROWS } from './constants';
import type { PlanningContract, PlanningLine, SlotColumn } from './types';
import {
    countContractsByQualifica,
    formatDayLabel,
    getCellKey,
    getISOWeekNumber,
    isCellEnabledForOrder,
    toTimestamp,
} from './utils';

export type DayGridViewProps = {
    slotColumns: SlotColumn[];
    lines: PlanningLine[];
    planningData: Record<string, number>;
    totalsByTimestamp: Record<string, number>;
    zoomLevel: 'hour' | 'quarter';
    onZoomDay?: (dateStr: string) => void;
    onEmptyGoToday?: () => void;
    onEmptyChangeRange?: () => void;
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
    savingCellKey: string | null;
    savingSummaryKey: string | null;
    cellValidationError: { cellKey: string; message: string } | null;
    summaryValidationError: { key: string; message: string } | null;
};

const PlanningDayGridView = memo(function PlanningDayGridView({
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
    onEmptyGoToday,
    onEmptyChangeRange,
    setEditingCellKey,
    setEditingValue,
    onSavePlanningCell,
    editingSummaryKey,
    editingSummaryValue,
    setEditingSummaryKey,
    setEditingSummaryValue,
    onSaveSummaryCell,
    savingCellKey,
    savingSummaryKey,
    cellValidationError,
    summaryValidationError,
}: DayGridViewProps) {
    const { t } = useTranslations();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [hasHorizontalOverflow, setHasHorizontalOverflow] = useState(false);

    const checkOverflow = useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        setHasHorizontalOverflow(el.scrollWidth > el.clientWidth);
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            if (!e.shiftKey || el.scrollWidth <= el.clientWidth) return;
            el.scrollLeft += e.deltaY;
            e.preventDefault();
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const raf = requestAnimationFrame(() => checkOverflow());
        const ro = new ResizeObserver(() => checkOverflow());
        ro.observe(el);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [checkOverflow, slotColumns.length, lines.length]);

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
                {t('planning.no_columns')}
            </div>
        );
    }

    return (
        <div className="flex min-w-0 flex-col gap-0">
            <div
                ref={scrollContainerRef}
                className="max-h-[calc(100vh-14rem)] overflow-x-auto overflow-y-auto"
                title={t('planning.scroll_hint')}
            >
                <table
                    className="min-w-full border-collapse text-sm"
                    aria-describedby="planning-grid-caption"
                >
                    <caption id="planning-grid-caption" className="sr-only">
                        {t('planning.grid_caption')}
                    </caption>
                    <thead className="sticky top-0 z-20 border-b-2 border-border bg-card shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                        <tr>
                            <th
                                rowSpan={3}
                                scope="col"
                                className="sticky left-0 z-30 w-32 border-r border-border/60 bg-muted/40 px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground"
                            >
                                {t('planning.column_line')}
                            </th>
                            <th
                                rowSpan={3}
                                scope="col"
                                className="sticky left-[8rem] z-30 w-40 border-r border-border/60 bg-muted/40 px-2 py-2.5 text-left text-xs font-semibold text-muted-foreground"
                            >
                                {t('common.order')}
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
                            {headerGroups.days.map((d, dayIdx) => (
                                <th
                                    key={`d_${d.dateStr}`}
                                    scope="col"
                                    colSpan={d.colspan}
                                    className={`px-1 py-1.5 text-center text-[10px] font-semibold ${
                                        d.isWeekend
                                            ? 'bg-muted/50 text-muted-foreground'
                                            : 'text-muted-foreground'
                                    }${headerGroups.days.length > 1 && dayIdx < headerGroups.days.length - 1 ? 'border-r-2 border-border/80' : ''}${headerGroups.days.length > 1 && !d.isWeekend && dayIdx % 2 === 1 ? 'bg-muted/15' : ''}`}
                                >
                                    <div className="flex items-center justify-center gap-1">
                                        <span>{d.label}</span>
                                        {d.showZoomButton ? (
                                            <button
                                                type="button"
                                                className="inline-flex size-5 min-h-[22px] min-w-[22px] items-center justify-center rounded border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none"
                                                title={t(
                                                    'planning.zoom_quarters',
                                                )}
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
                                    }${col.isDayEnd ? 'border-r-2 border-border/80' : ''}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading && lines.length === 0 ? (
                            <>
                                {Array.from({ length: 8 }).map((_, idx) => (
                                    <tr
                                        key={`skeleton_row_${idx}`}
                                        className="border-b border-border/40"
                                    >
                                        <td className="sticky left-0 z-10 bg-card px-2 py-1.5">
                                            <div className="h-4 w-16 animate-pulse rounded bg-muted/60" />
                                        </td>
                                        <td className="sticky left-[8rem] z-10 bg-card px-2 py-1.5">
                                            <div className="h-4 w-28 animate-pulse rounded bg-muted/60" />
                                        </td>
                                        {slotColumns.map((col) => (
                                            <td
                                                key={`skeleton_cell_${idx}_${col.timestamp}`}
                                                className="min-w-[3rem] px-1 py-1.5 align-middle"
                                            >
                                                <div className="h-6 w-full animate-pulse rounded bg-muted/40" />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </>
                        ) : lines.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={2 + slotColumns.length}
                                    className="px-4 py-8 text-center text-muted-foreground"
                                >
                                    <div className="space-y-3">
                                        <p>{t('planning.no_lines_period')}</p>
                                        <div className="flex justify-center gap-3">
                                            {onEmptyGoToday ? (
                                                <button
                                                    type="button"
                                                    className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                                                    onClick={onEmptyGoToday}
                                                >
                                                    {t('planning.go_today')}
                                                </button>
                                            ) : null}
                                            {onEmptyChangeRange ? (
                                                <button
                                                    type="button"
                                                    className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                                                    onClick={onEmptyChangeRange}
                                                >
                                                    {t(
                                                        'planning.change_period',
                                                    )}
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <>
                                {lines.map((line) =>
                                    (line.orders ?? []).map(
                                        (order, orderIdx) => {
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
                                                    className="border-b border-border/60 align-middle [content-visibility:auto]"
                                                >
                                                    <td className="sticky left-0 z-10 bg-card px-2 py-1.5 text-xs font-medium text-foreground shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
                                                        {isFirstOrder ? (
                                                            <>
                                                                <span>
                                                                    {line.code}
                                                                </span>
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
                                                    {slotColumns.map(
                                                        (col, colIdx) => {
                                                            const cellKey =
                                                                getCellKey(
                                                                    line.uuid,
                                                                    order.uuid,
                                                                    col.timestamp,
                                                                );
                                                            const colDayOfWeek =
                                                                new Date(
                                                                    col.dateStr +
                                                                        'T12:00:00',
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
                                                                (slotColumns[
                                                                    colIdx + 1
                                                                ]?.dateStr ??
                                                                    '') >
                                                                    deliveryDateStr;
                                                            const dayEndClass =
                                                                !isDeadlineBorder &&
                                                                col.isDayEnd
                                                                    ? ' border-r-2 border-border/80'
                                                                    : '';
                                                            let value: number;
                                                            let displayMixed = false;
                                                            if (
                                                                zoomLevel ===
                                                                'hour'
                                                            ) {
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
                                                                ].filter(
                                                                    (v) =>
                                                                        v > 0,
                                                                );
                                                                if (
                                                                    vals.length ===
                                                                    0
                                                                )
                                                                    value = 0;
                                                                else if (
                                                                    vals.length ===
                                                                        4 &&
                                                                    vals.every(
                                                                        (v) =>
                                                                            v ===
                                                                            vals[0],
                                                                    )
                                                                )
                                                                    value =
                                                                        vals[0];
                                                                else {
                                                                    value =
                                                                        Math.round(
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
                                                                    planningData[
                                                                        cellKey
                                                                    ] ?? 0;
                                                            }
                                                            const isEditing =
                                                                editingCellKey !==
                                                                    null &&
                                                                editingCellKey ===
                                                                    cellKey;
                                                            const isSavingCell =
                                                                savingCellKey ===
                                                                cellKey;

                                                            if (isEditing) {
                                                                const editDeadlineClass =
                                                                    isDeadlineBorder
                                                                        ? ' border-r-2 border-amber-500 dark:border-amber-400'
                                                                        : '';
                                                                return (
                                                                    <td
                                                                        key={
                                                                            col.timestamp
                                                                        }
                                                                        data-editing-cell="true"
                                                                        className={
                                                                            'min-w-[3rem] border border-primary p-0 align-middle' +
                                                                            editDeadlineClass +
                                                                            dayEndClass
                                                                        }
                                                                    >
                                                                        <div className="flex flex-col">
                                                                            <input
                                                                                type="number"
                                                                                min={
                                                                                    0
                                                                                }
                                                                                className="h-9 w-full border-0 bg-primary/10 px-1 text-center text-xs focus:outline-none"
                                                                                value={
                                                                                    editingValue
                                                                                }
                                                                                disabled={
                                                                                    isSavingCell
                                                                                }
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    setEditingValue(
                                                                                        e
                                                                                            .target
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
                                                                                        val >=
                                                                                            0
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
                                                                            {cellValidationError &&
                                                                                cellValidationError.cellKey ===
                                                                                    cellKey && (
                                                                                    <span
                                                                                        className="px-1 py-0.5 text-[10px] text-destructive"
                                                                                        role="alert"
                                                                                    >
                                                                                        {
                                                                                            cellValidationError.message
                                                                                        }
                                                                                    </span>
                                                                                )}
                                                                        </div>
                                                                    </td>
                                                                );
                                                            }

                                                            const base =
                                                                'min-w-[3rem] cursor-pointer px-1 py-1.5 text-center text-xs align-middle';
                                                            const style =
                                                                !enabled
                                                                    ? `${base} bg-muted/50 text-muted-foreground`
                                                                    : isOverdue
                                                                      ? `${base} bg-red-500/80 text-red-50 font-medium dark:bg-red-600/90 dark:text-white`
                                                                      : value >
                                                                              0 ||
                                                                          displayMixed
                                                                        ? `${base} border border-emerald-500/60 bg-emerald-500/80 text-emerald-50 dark:border-emerald-400/70 dark:bg-emerald-600/90 dark:text-white`
                                                                        : `${base} border border-dashed border-muted bg-background/40 dark:bg-muted/30`;
                                                            const deadlineClass =
                                                                isDeadlineBorder
                                                                    ? ' border-r-2 border-amber-500 dark:border-amber-400'
                                                                    : '';

                                                            return (
                                                                <td
                                                                    key={
                                                                        col.timestamp
                                                                    }
                                                                    className={
                                                                        style +
                                                                        deadlineClass +
                                                                        dayEndClass
                                                                    }
                                                                    onClick={() => {
                                                                        if (
                                                                            enabled
                                                                        ) {
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
                                                                        : value >
                                                                            0
                                                                          ? value
                                                                          : t(
                                                                                'common.empty_value',
                                                                            )}
                                                                </td>
                                                            );
                                                        },
                                                    )}
                                                </tr>
                                            );
                                        },
                                    ),
                                )}
                                {SUMMARY_ROWS.map((row) => {
                                    const isEditable = row.editable === true;
                                    return (
                                        <tr
                                            key={`sum_${row.id}`}
                                            className="border-t-2 border-border bg-muted/40 align-middle [content-visibility:auto]"
                                        >
                                            <td
                                                colSpan={2}
                                                className="sticky left-0 z-10 bg-muted/50 px-2 py-2 text-xs font-semibold text-foreground"
                                            >
                                                {t(
                                                    `planning.summary.${row.id}`,
                                                )}
                                            </td>
                                            {slotColumns.map((col) => {
                                                const summaryDayEndClass =
                                                    col.isDayEnd
                                                        ? ' border-r-2 border-border/80'
                                                        : '';
                                                if (col.isWeekend) {
                                                    return (
                                                        <td
                                                            key={col.timestamp}
                                                            className={
                                                                'min-w-[3rem] px-1 py-2 text-center text-xs text-muted-foreground' +
                                                                summaryDayEndClass
                                                            }
                                                        >
                                                            {t(
                                                                'common.empty_value',
                                                            )}
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
                                                else if (
                                                    row.id === 'da_impiegare'
                                                )
                                                    displayVal = daImpiegare;
                                                else if (row.id === 'assenze')
                                                    displayVal = assenze;
                                                else if (
                                                    row.id === 'disponibili'
                                                )
                                                    displayVal = disponibili;
                                                else if (
                                                    row.id === 'caporeparto'
                                                )
                                                    displayVal = caporeparto;
                                                else if (
                                                    row.id === 'magazzinieri'
                                                )
                                                    displayVal = magazzinieri;
                                                else displayVal = 0;

                                                const summaryKey = `${col.timestamp}_${row.id}`;
                                                const isSummaryEditing =
                                                    isEditable &&
                                                    editingSummaryKey ===
                                                        summaryKey;
                                                const isSummarySaving =
                                                    savingSummaryKey ===
                                                    summaryKey;

                                                if (
                                                    isEditable &&
                                                    (row.id === 'assenze' ||
                                                        row.id ===
                                                            'caporeparto' ||
                                                        row.id ===
                                                            'magazzinieri')
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
                                                                key={
                                                                    col.timestamp
                                                                }
                                                                className={
                                                                    'min-w-[3rem] border border-primary p-0 align-middle' +
                                                                    summaryDayEndClass
                                                                }
                                                            >
                                                                <div className="flex flex-col">
                                                                    <input
                                                                        type="number"
                                                                        min={0}
                                                                        className="h-8 w-full border-0 bg-primary/10 px-1 text-center text-xs focus:outline-none"
                                                                        value={
                                                                            editingSummaryValue
                                                                        }
                                                                        disabled={
                                                                            isSummarySaving
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
                                                                    {summaryValidationError?.key ===
                                                                        summaryKey && (
                                                                        <span
                                                                            className="px-1 py-0.5 text-[10px] text-destructive"
                                                                            role="alert"
                                                                        >
                                                                            {
                                                                                summaryValidationError.message
                                                                            }
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        );
                                                    }
                                                    return (
                                                        <td
                                                            key={col.timestamp}
                                                            className={
                                                                'min-w-[3rem] cursor-pointer border border-border bg-background px-1 py-2 text-center align-middle text-xs hover:bg-accent/50' +
                                                                summaryDayEndClass
                                                            }
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
                                                                    currentVal ===
                                                                        0
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
                                                                ? 'bg-red-500/80 font-medium text-red-50 dark:bg-red-600/90 dark:text-white'
                                                                : 'border border-border bg-background'
                                                        }${summaryDayEndClass}`}
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
            {hasHorizontalOverflow ? (
                <p
                    className="py-1.5 text-center text-xs text-muted-foreground"
                    role="status"
                    aria-live="polite"
                >
                    {t('planning.scroll_more_columns')}
                </p>
            ) : null}
        </div>
    );
});

export default PlanningDayGridView;

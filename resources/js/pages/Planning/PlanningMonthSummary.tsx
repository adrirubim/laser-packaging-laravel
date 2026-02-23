import {
    Fragment,
    memo,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import BoardCell from './BoardCell';
import { SUMMARY_ROWS } from './constants';
import type {
    BoardDay,
    BoardOccupancy,
    PlanningLine,
    ZoomLevel,
} from './types';
import { toTimestamp } from './utils';

export type PlanningMonthSummaryProps = {
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
    savingSummaryKey: string | null;
    summaryValidationError: { key: string; message: string } | null;
    onEmptyGoToday?: () => void;
    onEmptyChangeRange?: () => void;
};

const PlanningMonthSummary = memo(function PlanningMonthSummary({
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
    savingSummaryKey,
    summaryValidationError,
    onEmptyGoToday,
    onEmptyChangeRange,
}: PlanningMonthSummaryProps) {
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
        const raf = requestAnimationFrame(() => checkOverflow());
        const ro = new ResizeObserver(() => checkOverflow());
        ro.observe(el);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, [checkOverflow, rangeDays.length, lines.length]);

    return (
        <div className="flex min-w-0 flex-col gap-0">
            <div
                ref={scrollContainerRef}
                className="max-h-[calc(100vh-14rem)] overflow-x-auto overflow-y-auto"
            >
                <table
                    className="min-w-full border-collapse text-sm"
                    aria-describedby="planning-month-summary-caption"
                >
                    <caption
                        id="planning-month-summary-caption"
                        className="sr-only"
                    >
                        Riepilogo mensile di pianificazione per linea di lavoro
                        e giorno.
                    </caption>
                    <thead className="sticky top-0 z-10 border-b border-border bg-card">
                        <tr>
                            <th className="sticky left-0 z-20 bg-card px-2 py-2 text-left text-xs font-semibold text-muted-foreground">
                                Linea
                            </th>
                            {rangeDays.map((day) => (
                                <th
                                    key={day.dateStr}
                                    className="bg-card px-2 py-2 text-center text-xs font-semibold text-muted-foreground"
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
                        {loading && lines.length === 0 ? (
                            <>
                                {Array.from({ length: 8 }).map((_, idx) => (
                                    <tr
                                        key={`month_skeleton_row_${idx}`}
                                        className="border-b border-border/40"
                                    >
                                        <td className="sticky left-0 z-10 bg-card px-2 py-2">
                                            <div className="h-4 w-20 animate-pulse rounded bg-muted/60" />
                                        </td>
                                        {rangeDays.map((day) => (
                                            <td
                                                key={`month_skeleton_cell_${idx}_${day.dateStr}`}
                                                className="px-1 py-2 align-middle"
                                            >
                                                <div className="h-8 w-full animate-pulse rounded bg-muted/40" />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </>
                        ) : lines.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={1 + rangeDays.length}
                                    className="px-3 py-6 text-center text-sm text-muted-foreground"
                                >
                                    <div className="space-y-3">
                                        <p>
                                            Nessuna linea LAS attiva nel periodo
                                            selezionato.
                                        </p>
                                        <div className="flex justify-center gap-3">
                                            {onEmptyGoToday ? (
                                                <button
                                                    type="button"
                                                    className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                                                    onClick={onEmptyGoToday}
                                                >
                                                    Vai a oggi
                                                </button>
                                            ) : null}
                                            {onEmptyChangeRange ? (
                                                <button
                                                    type="button"
                                                    className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                                                    onClick={onEmptyChangeRange}
                                                >
                                                    Cambia periodo
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <>
                                {lines.map((line) => {
                                    const lineMap =
                                        occupancyByLineAndDay[line.uuid] ?? {};
                                    return (
                                        <Fragment key={line.uuid}>
                                            <tr className="border-b border-border/60 bg-muted/20 align-top [content-visibility:auto]">
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
                                                                        day
                                                                            .dateStr
                                                                    ] ?? 0
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
                                                            key={order.uuid}
                                                            className="align-top [content-visibility:auto]"
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
                                                            {rangeDays.map(
                                                                (day) => (
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
                                        className="border-t-2 border-border bg-muted/40 align-middle [content-visibility:auto]"
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

                                            if (
                                                row.editable &&
                                                isSummaryEditing
                                            ) {
                                                return (
                                                    <td
                                                        key={day.dateStr}
                                                        className="min-w-[3rem] border border-primary p-0 align-middle"
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
                                                                    savingSummaryKey ===
                                                                    summaryKeyRiepilogo
                                                                }
                                                                onChange={(e) =>
                                                                    setEditingSummaryValue(
                                                                        e.target
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
                                                            {summaryValidationError?.key ===
                                                                summaryKeyRiepilogo && (
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
                                                            {value > 0
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
                                                                ? 'bg-red-500/80 text-red-50 dark:bg-red-600/90 dark:text-white'
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
            {hasHorizontalOverflow ? (
                <p
                    className="py-1.5 text-center text-xs text-muted-foreground"
                    role="status"
                    aria-live="polite"
                >
                    Scorri per vedere più colonne
                </p>
            ) : null}
        </div>
    );
});

export default PlanningMonthSummary;

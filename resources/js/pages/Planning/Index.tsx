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
import {
    Suspense,
    lazy,
    startTransition,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { END_HOUR, START_HOUR } from './constants';
import PlanningLegend from './PlanningLegend';
import PlanningToolbar from './PlanningToolbar';
import type {
    BoardDay,
    BoardOccupancy,
    PlanningContract,
    PlanningDataResponse,
    PlanningLine,
    PlanningRow,
    PlanningSummaryRow,
    RangeMode,
    SavePlanningResponse,
    SaveSummaryResponse,
    SlotColumn,
    ZoomLevel,
} from './types';
import {
    addDays,
    addMonths,
    countContractsByQualifica,
    formatDateRangeLabel,
    formatDayLabel,
    getCellKey,
    getRangeDates,
    pad2,
    toTimestamp,
} from './utils';

const PlanningDayGridView = lazy(() => import('./PlanningDayGridView'));

const PlanningMonthSummary = lazy(() => import('./PlanningMonthSummary'));

type PlanningRoutes = {
    index: { url: () => string };
};
const planningNav = planningRoutes as unknown as PlanningRoutes;

type PlanningBoardProps = PageProps<{ today: string }>;
/* const PlanningMonthSummary = memo(function PlanningMonthSummary({
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
}); */

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
    const [toolbarLoading, setToolbarLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [infoMessage, setInfoMessage] = useState<string | null>(null);
    const [editingCellKey, setEditingCellKey] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState('');
    const [editingSummaryKey, setEditingSummaryKey] = useState<string | null>(
        null,
    );
    const [editingSummaryValue, setEditingSummaryValue] = useState('');
    const [savingCellKey, setSavingCellKey] = useState<string | null>(null);
    const [savingSummaryKey, setSavingSummaryKey] = useState<string | null>(
        null,
    );

    useEffect(() => {
        if (loading) {
            const timeoutId = window.setTimeout(() => {
                setToolbarLoading(true);
            }, 180);
            return () => {
                window.clearTimeout(timeoutId);
            };
        }
        setToolbarLoading(false);
        return undefined;
    }, [loading]);

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

    const openDayQuarter = useCallback(
        (dateStr: string) => {
            openDay(dateStr, 'quarter');
        },
        [openDay],
    );

    const handleSetRangeMode = useCallback((mode: RangeMode) => {
        startTransition(() => {
            setRangeMode(mode);
            if (mode !== 'day') setZoomLevel('hour');
        });
    }, []);

    const handleSetZoomLevel = useCallback((level: ZoomLevel) => {
        startTransition(() => setZoomLevel(level));
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

            const json = (await response.json()) as PlanningDataResponse;
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
            setSavingCellKey(cellKey);
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

                if (response.status === 422) {
                    const data = (await response.json().catch(() => ({}))) as {
                        message?: string;
                        errors?: Record<string, string[]>;
                    };
                    const firstErrorFromFields =
                        data.errors &&
                        Object.values(data.errors).flat().find(Boolean);
                    setError(
                        firstErrorFromFields ??
                            data.message ??
                            'Errore di validazione',
                    );
                    return;
                }

                const json = (await response
                    .json()
                    .catch(() => ({}))) as SavePlanningResponse;
                if (!response.ok || json.error_code !== 0) {
                    setError(json.message ?? 'Errore salvataggio');
                    return;
                }
                const replan = json.replan_result;
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
                        let hoursObj: Record<string, number>;
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
            } finally {
                setSavingCellKey(null);
            }
        },
        [zoomLevel],
    );

    const saveSummaryCell = useCallback(
        async (summaryKey: string, inputVal: string) => {
            setSavingSummaryKey(summaryKey);
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

                if (response.status === 422) {
                    const data = (await response.json().catch(() => ({}))) as {
                        message?: string;
                        errors?: Record<string, string[]>;
                    };
                    const firstErrorFromFields =
                        data.errors &&
                        Object.values(data.errors).flat().find(Boolean);
                    setError(
                        firstErrorFromFields ??
                            data.message ??
                            'Errore di validazione summary',
                    );
                    return;
                }

                const json = (await response
                    .json()
                    .catch(() => ({}))) as SaveSummaryResponse;
                if (!response.ok || json.error_code !== 0) {
                    setError(json.message ?? 'Errore salvataggio summary');
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
                        let hoursObj: Record<string, number>;
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
            } finally {
                setSavingSummaryKey(null);
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
            let hoursObj: Record<string, number>;
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
            let hoursObj: Record<string, number>;
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
            <Head
                title={`Pianificazione — ${formatDateRangeLabel(currentDate, rangeMode)}`}
            />

            <div
                ref={containerRef}
                className="flex min-w-0 flex-1 flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
                aria-busy={loading}
                aria-label="Pianificazione produzione"
            >
                <PlanningToolbar
                    currentDate={currentDate}
                    today={today}
                    rangeMode={rangeMode}
                    zoomLevel={zoomLevel}
                    loading={toolbarLoading}
                    goPrev={goPrev}
                    goNext={goNext}
                    goToday={goToday}
                    onSetRangeMode={handleSetRangeMode}
                    onSetZoomLevel={handleSetZoomLevel}
                    formatDateRangeLabel={formatDateRangeLabel}
                />

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

                <PlanningLegend rangeMode={rangeMode} zoomLevel={zoomLevel} />
                <Suspense
                    fallback={
                        <div
                            className="flex min-h-[6rem] items-center justify-center text-sm text-muted-foreground"
                            role="status"
                            aria-live="polite"
                        >
                            Caricamento griglia…
                        </div>
                    }
                >
                    {rangeMode !== 'month' ? (
                        <PlanningDayGridView
                            slotColumns={slotColumns}
                            lines={lines}
                            planningData={planningData}
                            totalsByTimestamp={totalsByTimestamp}
                            zoomLevel={zoomLevel}
                            onZoomDay={
                                rangeMode === 'week'
                                    ? openDayQuarter
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
                            savingCellKey={savingCellKey}
                            savingSummaryKey={savingSummaryKey}
                            onEmptyGoToday={goToday}
                            onEmptyChangeRange={() =>
                                handleSetRangeMode('week')
                            }
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
                                savingSummaryKey={savingSummaryKey}
                                onEmptyGoToday={goToday}
                                onEmptyChangeRange={() =>
                                    handleSetRangeMode('week')
                                }
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
                </Suspense>
            </div>
        </AppLayout>
    );
}

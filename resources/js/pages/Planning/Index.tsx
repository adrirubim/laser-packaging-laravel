/**
 * Planning Board — Modern view 2026
 *
 * Hour/quarter zoom, cell and summary editing, shifts, weekend, overdue, deadline,
 * Tab/Enter navigation, error handling. Tailwind only, no external CSS.
 */
import { ErrorBoundary } from '@/components/error-boundary';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import api from '@/routes/api';
import orders from '@/routes/orders/index';
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
import { toast } from 'sonner';
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

export default function PlanningBoard({ today }: PlanningBoardProps) {
    const { t } = useTranslations();
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('nav.orders'), href: orders.index().url },
            {
                title: t('nav.pianificazione_produzione'),
                href: planningNav.index.url(),
            },
        ],
        [t],
    );

    // Data iniziale = oggi (state.currentDate = moment().startOf('day'))
    const [currentDate, setCurrentDate] = useState<string>(today);
    // Modern UX: initial view = daily by hours (more readable than quarter detail)
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
    const [cellValidationError, setCellValidationError] = useState<{
        cellKey: string;
        message: string;
    } | null>(null);
    const [summaryValidationError, setSummaryValidationError] = useState<{
        key: string;
        message: string;
    } | null>(null);

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
        const maxRetries = 2;
        const delays = [1000, 2000]; // backoff 1s, 2s

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
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
                        t('planning.error_load', {
                            status: response.status,
                            detail: text,
                        }),
                    );
                }

                const json = (await response.json()) as PlanningDataResponse;
                if (json.error_code !== 0) {
                    throw new Error(
                        json.message || t('planning.error_unknown'),
                    );
                }

                setLines(json.lines ?? []);
                setPlanning(json.planning ?? []);
                setSummaries(json.summary ?? []);
                setContracts(json.contracts ?? []);
                setLoading(false);
                return;
            } catch (e) {
                const err = e as Error;
                const message = err.message || t('planning.error_load_generic');
                if (attempt === maxRetries) {
                    setError(message);
                    setLoading(false);
                } else {
                    await new Promise((r) =>
                        setTimeout(r, delays[attempt] ?? 2000),
                    );
                }
            }
        }
    }, [startDate, endDate, t]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const savePlanningCell = useCallback(
        async (
            cellKey: string,
            newValue: number,
            options?: { skipUndo?: boolean },
        ) => {
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

                // Calcola il valore precedente (per Undo) solo se richiesto
                let previousWorkers = 0;
                if (!options?.skipUndo) {
                    const timeKey = (h: number, mm: number) =>
                        String(h * 100 + mm);
                    const keysToSet =
                        zoomLevel === 'hour'
                            ? [0, 15, 30, 45].map((mm) => timeKey(hour, mm))
                            : [timeKey(hour, minute)];
                    const dateOnly = dateStr;

                    for (const row of planning) {
                        if (
                            row.order_uuid !== orderUuid ||
                            row.lasworkline_uuid !== lineUuid ||
                            !row.date ||
                            row.date.slice(0, 10) !== dateOnly
                        ) {
                            continue;
                        }
                        let hoursObj: Record<string, number>;
                        try {
                            hoursObj = JSON.parse(row.hours) as Record<
                                string,
                                number
                            >;
                        } catch {
                            hoursObj = {};
                        }
                        for (const k of keysToSet) {
                            if (hoursObj[k] != null) {
                                previousWorkers = hoursObj[k];
                                break;
                            }
                        }
                        if (previousWorkers > 0) break;
                    }
                }

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
                    const msg =
                        firstErrorFromFields ??
                        data.message ??
                        t('planning.error_validation');
                    setError(msg);
                    setCellValidationError({ cellKey, message: msg });
                    return;
                }

                setCellValidationError(null);
                const json = (await response
                    .json()
                    .catch(() => ({}))) as SavePlanningResponse;
                if (!response.ok || json.error_code !== 0) {
                    setError(json.message ?? t('planning.error_save'));
                    return;
                }
                const replan = json.replan_result;
                const hasReplan =
                    (replan?.quarters_added ?? 0) > 0 ||
                    (replan?.quarters_removed ?? 0) > 0;
                // Applicare sempre l'aggiornamento ottimistico; non chiamare loadData() dopo save
                // otherwise replan may return empty row (-).
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
                setError(null);
                const showUndoToast =
                    !options?.skipUndo && previousWorkers > 0 && newValue <= 0;
                if (showUndoToast) {
                    toast.success(t('planning.toast_cell_cleared'), {
                        action: {
                            label: t('common.cancel'),
                            onClick: () => {
                                void savePlanningCell(
                                    cellKey,
                                    previousWorkers,
                                    {
                                        skipUndo: true,
                                    },
                                );
                            },
                        },
                    });
                } else {
                    setInfoMessage(
                        hasReplan
                            ? t('planning.updated_with_replan', {
                                  count: newValue,
                                  message: replan?.message ?? '',
                              }).trim()
                            : t('planning.updated', { count: newValue }),
                    );
                }
            } catch (e) {
                setError(
                    (e as Error).message ?? t('planning.error_connection'),
                );
            } finally {
                setSavingCellKey(null);
            }
        },
        [planning, zoomLevel, t],
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
                    const msg =
                        firstErrorFromFields ??
                        data.message ??
                        t('planning.error_validation_summary');
                    setError(msg);
                    setSummaryValidationError({
                        key: summaryKey,
                        message: msg,
                    });
                    return;
                }

                setSummaryValidationError(null);
                const json = (await response
                    .json()
                    .catch(() => ({}))) as SaveSummaryResponse;
                if (!response.ok || json.error_code !== 0) {
                    setError(json.message ?? t('planning.error_save_summary'));
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
                setError(null);
                setInfoMessage(t('planning.summary_updated'));
            } catch (e) {
                setError(
                    (e as Error).message ?? t('planning.error_connection'),
                );
            } finally {
                setSavingSummaryKey(null);
            }
        },
        [zoomLevel, t],
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
                    // Today only: do not show past slots
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

    const planningErrorFallback = (
        <div
            className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-6 text-center"
            role="alert"
        >
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6">
                <h2 className="mb-2 text-lg font-semibold">
                    {t('planning.error_view_title')}
                </h2>
                <p className="mb-4 text-sm text-muted-foreground">
                    {t('planning.error_view_description')}
                </p>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                    {t('planning.reload')}
                </button>
            </div>
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('planning.page_title_with_range', {
                    range: formatDateRangeLabel(currentDate, rangeMode),
                })}
            />

            <ErrorBoundary fallback={planningErrorFallback}>
                <div
                    ref={containerRef}
                    className="flex min-w-0 flex-1 flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
                    aria-busy={loading}
                    aria-labelledby="planning-section-heading"
                >
                    <h1
                        id="planning-section-heading"
                        className="text-2xl font-semibold tracking-tight text-foreground"
                    >
                        {t('planning.page_title')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {rangeMode === 'day'
                            ? t('planning.view_description_day')
                            : rangeMode === 'week'
                              ? t('planning.view_description_week')
                              : t('planning.view_description_month')}
                    </p>
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
                                aria-label={t('planning.retry_load')}
                            >
                                {t('planning.retry_load')}
                            </button>
                        </div>
                    ) : null}

                    <PlanningLegend
                        rangeMode={rangeMode}
                        zoomLevel={zoomLevel}
                    />
                    <Suspense
                        fallback={
                            <div
                                className="flex min-h-[6rem] items-center justify-center text-sm text-muted-foreground"
                                role="status"
                                aria-live="polite"
                                aria-busy="true"
                            >
                                {t('planning.loading_grid')}
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
                                setEditingCellKey={(k: string | null) => {
                                    setEditingCellKey(k);
                                    if (k !== null)
                                        setCellValidationError(null);
                                }}
                                setEditingValue={setEditingValue}
                                onSavePlanningCell={savePlanningCell}
                                editingSummaryKey={editingSummaryKey}
                                editingSummaryValue={editingSummaryValue}
                                setEditingSummaryKey={(k: string | null) => {
                                    setEditingSummaryKey(k);
                                    if (k !== null)
                                        setSummaryValidationError(null);
                                }}
                                setEditingSummaryValue={setEditingSummaryValue}
                                onSaveSummaryCell={saveSummaryCell}
                                savingCellKey={savingCellKey}
                                savingSummaryKey={savingSummaryKey}
                                cellValidationError={cellValidationError}
                                summaryValidationError={summaryValidationError}
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
                                    occupancyByLineAndDay={
                                        occupancyByLineAndDay
                                    }
                                    occupancyByOrderAndDay={
                                        occupancyByOrderAndDay
                                    }
                                    summaryValuesByDay={summaryValuesByDay}
                                    editingSummaryKey={editingSummaryKey}
                                    editingSummaryValue={editingSummaryValue}
                                    setEditingSummaryKey={(
                                        k: string | null,
                                    ) => {
                                        setEditingSummaryKey(k);
                                        if (k !== null)
                                            setSummaryValidationError(null);
                                    }}
                                    setEditingSummaryValue={
                                        setEditingSummaryValue
                                    }
                                    saveSummaryCell={saveSummaryCell}
                                    savingSummaryKey={savingSummaryKey}
                                    summaryValidationError={
                                        summaryValidationError
                                    }
                                    onEmptyGoToday={goToday}
                                    onEmptyChangeRange={() =>
                                        handleSetRangeMode('week')
                                    }
                                    openDay={openDay}
                                />
                            </>
                        )}
                    </Suspense>
                </div>
            </ErrorBoundary>
        </AppLayout>
    );
}

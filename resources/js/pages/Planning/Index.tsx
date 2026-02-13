import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

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

type PlanningIndexProps = PageProps<{
    today: string;
}>;

export default function PlanningIndex({ today }: PlanningIndexProps) {
    const [lines, setLines] = useState<PlanningLine[]>([]);
    const [planning, setPlanning] = useState<PlanningRow[]>([]);
    const [summaries, setSummaries] = useState<PlanningSummaryRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/planning/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    start_date: `${today} 00:00:00`,
                    end_date: `${today} 23:59:59`,
                }),
            });

            if (!response.ok) {
                throw new Error(
                    'Errore nel caricamento dei dati di pianificazione',
                );
            }

            const json = await response.json();

            if (json.error_code !== 0) {
                throw new Error(json.message ?? 'Errore sconosciuto');
            }

            setLines((json.lines ?? []) as PlanningLine[]);
            setPlanning((json.planning ?? []) as PlanningRow[]);
            setSummaries((json.summary ?? []) as PlanningSummaryRow[]);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Errore sconosciuto');
        } finally {
            setLoading(false);
        }
    }, [today]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    // Mappa: linea -> ora del giorno -> info su occupazione e mix di quarti
    const occupancyByLineAndHour = useMemo(() => {
        type HourStats = { min: number; max: number };
        const stats: Record<string, Record<number, HourStats>> = {};

        for (const row of planning) {
            if (!row.date || !row.hours) continue;
            if (!row.date.startsWith(today)) continue;

            let hoursObject: Record<string, number>;

            try {
                hoursObject = JSON.parse(row.hours) as Record<string, number>;
            } catch {
                continue;
            }

            for (const [timeKey, workers] of Object.entries(hoursObject)) {
                const value = Number(workers);
                if (!Number.isFinite(value) || value <= 0) continue;

                // timeKey es "800", "815", "1430", etc. → extraer la parte de hora
                const hourPart = timeKey.slice(0, -2);
                const hour = Number.parseInt(hourPart, 10);

                if (Number.isNaN(hour)) continue;

                if (!stats[row.lasworkline_uuid]) {
                    stats[row.lasworkline_uuid] = {};
                }

                const current = stats[row.lasworkline_uuid][hour];
                if (!current) {
                    stats[row.lasworkline_uuid][hour] = {
                        min: value,
                        max: value,
                    };
                } else {
                    stats[row.lasworkline_uuid][hour] = {
                        min: Math.min(current.min, value),
                        max: Math.max(current.max, value),
                    };
                }
            }
        }

        const result: Record<
            string,
            Record<number, { busy: boolean; mixed: boolean }>
        > = {};

        for (const [lineUuid, hoursMap] of Object.entries(stats)) {
            result[lineUuid] = {};
            for (const [hourStr, s] of Object.entries(hoursMap)) {
                const hour = Number.parseInt(hourStr, 10);
                if (Number.isNaN(hour)) continue;
                const busy = s.max > 0;
                const mixed = s.min !== s.max;
                if (busy) {
                    result[lineUuid][hour] = { busy, mixed };
                }
            }
        }

        return result;
    }, [planning, today]);

    // Mappa: tipo di summary -> ora del giorno -> valore
    const summaryByTypeAndHour = useMemo(() => {
        const map: Record<string, Record<number, number>> = {};

        for (const row of summaries) {
            if (!row.date || !row.hours) continue;
            if (row.date !== today) continue;

            let hoursObject: Record<string, number>;

            try {
                hoursObject = JSON.parse(row.hours) as Record<string, number>;
            } catch {
                continue;
            }

            const type = row.summary_type;
            if (!map[type]) {
                map[type] = {};
            }

            for (const [timeKey, raw] of Object.entries(hoursObject)) {
                const value = Number(raw);
                if (!Number.isFinite(value) || value <= 0) continue;

                const hourPart = timeKey.slice(0, -2);
                const hour = Number.parseInt(hourPart, 10);
                if (Number.isNaN(hour)) continue;

                map[type][hour] = value;
            }
        }

        return map;
    }, [summaries, today]);

    const workingHours = useMemo(
        () => Array.from({ length: 12 }, (_, index) => index + 7), // 07:00–18:00
        [],
    );

    // Helpers per la griglia editabile per ordine/ora
    const isOrderHourActive = useCallback(
        (orderUuid: string, lineUuid: string, hour: number): boolean => {
            for (const row of planning) {
                if (!row.date || !row.hours) continue;
                if (!row.date.startsWith(today)) continue;
                if (
                    row.order_uuid !== orderUuid ||
                    row.lasworkline_uuid !== lineUuid
                )
                    continue;

                let hoursObject: Record<string, number>;

                try {
                    hoursObject = JSON.parse(row.hours) as Record<
                        string,
                        number
                    >;
                } catch {
                    continue;
                }

                for (const [timeKey, workers] of Object.entries(hoursObject)) {
                    const value = Number(workers);
                    if (!Number.isFinite(value) || value <= 0) continue;

                    const hourPart = timeKey.slice(0, -2);
                    const slotHour = Number.parseInt(hourPart, 10);

                    if (!Number.isNaN(slotHour) && slotHour === hour) {
                        return true;
                    }
                }
            }

            return false;
        },
        [planning, today],
    );

    const toggleOrderHour = useCallback(
        async (
            orderUuid: string,
            lineUuid: string,
            hour: number,
        ): Promise<void> => {
            const active = isOrderHourActive(orderUuid, lineUuid, hour);

            try {
                const response = await fetch('/api/planning/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        order_uuid: orderUuid,
                        lasworkline_uuid: lineUuid,
                        date: today,
                        hour,
                        minute: 0,
                        workers: active ? 0 : 1,
                        zoom_level: 'hour',
                    }),
                });

                if (!response.ok) {
                    console.error(
                        'Errore nel salvataggio della pianificazione',
                    );
                    return;
                }

                const json = await response.json();
                if (json.error_code !== 0) {
                    console.error('Errore planning:', json.message);
                } else {
                    void loadData();
                }
            } catch (e) {
                console.error('Errore imprevisto nel salvataggio planning', e);
            }
        },
        [isOrderHourActive, loadData, today],
    );

    return (
        <AppLayout>
            <Head title="Pianificazione Produzione" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">
                        Pianificazione Produzione
                    </h1>
                    <span className="text-sm text-muted-foreground">
                        Data: {today}
                    </span>
                </div>

                {error && (
                    <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-sm text-muted-foreground">
                        Caricamento in corso…
                    </div>
                ) : (
                    <div className="space-y-4">
                        {lines.map((line) => {
                            const lineOccupancy =
                                occupancyByLineAndHour[line.uuid] ?? {};

                            return (
                                <div
                                    key={line.uuid}
                                    className="rounded-md border bg-card p-3 shadow-sm"
                                >
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <div className="font-medium">
                                            {line.code} — {line.name}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span>
                                                Ordini: {line.orders.length}
                                            </span>
                                            <span className="hidden sm:inline-block">
                                                Slot occupati in verde nella
                                                riga sottostante
                                            </span>
                                        </div>
                                    </div>

                                    {/* Griglia compatta per visualizzare le ore assegnate (verde) per la linea */}
                                    <div className="mb-3 overflow-x-auto rounded-md border bg-background px-2 py-2">
                                        <div className="mb-1 text-xs font-medium text-muted-foreground">
                                            Distribuzione ore (linea)
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                                            {workingHours.map((hour) => {
                                                const info =
                                                    lineOccupancy[hour];
                                                const isBusy =
                                                    info?.busy ?? false;
                                                const isMixed =
                                                    info?.mixed ?? false;

                                                return (
                                                    <div
                                                        key={hour}
                                                        className="flex flex-col items-center gap-0.5"
                                                    >
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {hour
                                                                .toString()
                                                                .padStart(
                                                                    2,
                                                                    '0',
                                                                )}
                                                            :00
                                                        </span>
                                                        <div className="relative flex h-3 w-6 items-center justify-center rounded-sm border text-[8px] sm:h-4 sm:w-8">
                                                            <div
                                                                className={[
                                                                    'h-full w-full rounded-[2px]',
                                                                    isBusy
                                                                        ? 'bg-emerald-500/70'
                                                                        : 'bg-muted',
                                                                ].join(' ')}
                                                            />
                                                            {isMixed ? (
                                                                <span className="pointer-events-none absolute text-[9px] font-semibold text-foreground">
                                                                    *
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Tabella ordini della linea */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border-collapse text-xs">
                                            <thead>
                                                <tr className="border-b text-left text-muted-foreground">
                                                    <th className="px-2 py-1">
                                                        Codice
                                                    </th>
                                                    <th className="px-2 py-1">
                                                        Articolo
                                                    </th>
                                                    <th className="px-2 py-1">
                                                        Descrizione
                                                    </th>
                                                    <th className="px-2 py-1 text-right">
                                                        Q.tà
                                                    </th>
                                                    <th className="px-2 py-1 text-right">
                                                        Prodotta
                                                    </th>
                                                    <th className="px-2 py-1 text-right">
                                                        Stato
                                                    </th>
                                                    <th className="px-2 py-1 text-right">
                                                        Oggi (ore)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {line.orders.map((order) => (
                                                    <tr
                                                        key={order.uuid}
                                                        className="border-b align-top last:border-0"
                                                    >
                                                        <td className="px-2 py-1">
                                                            {order.code}
                                                        </td>
                                                        <td className="px-2 py-1">
                                                            {order.article_code}
                                                        </td>
                                                        <td className="px-2 py-1">
                                                            {order.description}
                                                        </td>
                                                        <td className="px-2 py-1 text-right">
                                                            {order.quantity}
                                                        </td>
                                                        <td className="px-2 py-1 text-right">
                                                            {
                                                                order.worked_quantity
                                                            }
                                                        </td>
                                                        <td className="px-2 py-1 text-right">
                                                            {order.status}
                                                        </td>
                                                        <td className="px-2 py-1">
                                                            <div className="flex flex-wrap justify-end gap-0.5">
                                                                {workingHours.map(
                                                                    (hour) => {
                                                                        const active =
                                                                            isOrderHourActive(
                                                                                order.uuid,
                                                                                line.uuid,
                                                                                hour,
                                                                            );

                                                                        return (
                                                                            <button
                                                                                key={
                                                                                    hour
                                                                                }
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    void toggleOrderHour(
                                                                                        order.uuid,
                                                                                        line.uuid,
                                                                                        hour,
                                                                                    );
                                                                                }}
                                                                                className={[
                                                                                    'flex h-4 w-4 items-center justify-center rounded border text-[9px]',
                                                                                    active
                                                                                        ? 'border-emerald-500/70 bg-emerald-500/70 text-emerald-50'
                                                                                        : 'border-border bg-muted text-muted-foreground hover:bg-muted/80',
                                                                                ].join(
                                                                                    ' ',
                                                                                )}
                                                                                title={`${hour.toString().padStart(2, '0')}:00`}
                                                                            >
                                                                                {hour
                                                                                    .toString()
                                                                                    .padStart(
                                                                                        2,
                                                                                        '0',
                                                                                    )}
                                                                            </button>
                                                                        );
                                                                    },
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {line.orders.length === 0 && (
                                                    <tr>
                                                        <td
                                                            className="px-2 py-2 text-center text-muted-foreground"
                                                            colSpan={7}
                                                        >
                                                            Nessun ordine
                                                            pianificabile per
                                                            questa linea.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}

                        {lines.length === 0 && !error && (
                            <div className="text-sm text-muted-foreground">
                                Nessuna linea LAS attiva trovata nel periodo
                                selezionato.
                            </div>
                        )}

                        {/* Riepilogo giornaliero personale */}
                        <div className="mt-6 rounded-md border bg-card p-3 shadow-sm">
                            <div className="mb-2 flex items-center justify-between">
                                <h2 className="text-sm font-semibold">
                                    Riepilogo personale (oggi)
                                </h2>
                                <span className="text-xs text-muted-foreground">
                                    Clicca su una cella per impostare o
                                    resettare il valore
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse text-xs">
                                    <thead>
                                        <tr className="border-b text-left text-muted-foreground">
                                            <th className="px-2 py-1">Tipo</th>
                                            {workingHours.map((hour) => (
                                                <th
                                                    key={hour}
                                                    className="px-1 py-1 text-center"
                                                >
                                                    {hour
                                                        .toString()
                                                        .padStart(2, '0')}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            {
                                                key: 'assenze',
                                                label: 'Assenze',
                                            },
                                            {
                                                key: 'caporeparto',
                                                label: 'Caporeparto',
                                            },
                                            {
                                                key: 'magazzinieri',
                                                label: 'Magazzinieri',
                                            },
                                            {
                                                key: 'da_impiegare',
                                                label: 'Da impiegare',
                                            },
                                            {
                                                key: 'disponibili',
                                                label: 'Disponibili',
                                            },
                                        ].map((row) => {
                                            const values =
                                                summaryByTypeAndHour[row.key] ??
                                                {};

                                            return (
                                                <tr
                                                    key={row.key}
                                                    className="border-b last:border-0"
                                                >
                                                    <td className="px-2 py-1 font-medium">
                                                        {row.label}
                                                    </td>
                                                    {workingHours.map(
                                                        (hour) => {
                                                            const value =
                                                                values[hour] ??
                                                                0;

                                                            const handleClick =
                                                                async (): Promise<void> => {
                                                                    try {
                                                                        const body =
                                                                            value >
                                                                            0
                                                                                ? {
                                                                                      summary_type:
                                                                                          row.key,
                                                                                      date: today,
                                                                                      hour,
                                                                                      minute: 0,
                                                                                      value: 0,
                                                                                      reset: 1,
                                                                                      zoom_level:
                                                                                          'hour',
                                                                                  }
                                                                                : {
                                                                                      summary_type:
                                                                                          row.key,
                                                                                      date: today,
                                                                                      hour,
                                                                                      minute: 0,
                                                                                      value: 1,
                                                                                      reset: 0,
                                                                                      zoom_level:
                                                                                          'hour',
                                                                                  };

                                                                        const response =
                                                                            await fetch(
                                                                                '/api/planning/summary',
                                                                                {
                                                                                    method: 'POST',
                                                                                    headers:
                                                                                        {
                                                                                            'Content-Type':
                                                                                                'application/json',
                                                                                            Accept: 'application/json',
                                                                                        },
                                                                                    body: JSON.stringify(
                                                                                        body,
                                                                                    ),
                                                                                },
                                                                            );

                                                                        if (
                                                                            !response.ok
                                                                        ) {
                                                                            console.error(
                                                                                'Errore nel salvataggio del summary',
                                                                            );
                                                                            return;
                                                                        }

                                                                        const json =
                                                                            await response.json();
                                                                        if (
                                                                            json.error_code !==
                                                                            0
                                                                        ) {
                                                                            console.error(
                                                                                'Errore summary:',
                                                                                json.message,
                                                                            );
                                                                        } else {
                                                                            void loadData();
                                                                        }
                                                                    } catch (err) {
                                                                        console.error(
                                                                            'Errore imprevisto nel salvataggio summary',
                                                                            err,
                                                                        );
                                                                    }
                                                                };

                                                            const isActive =
                                                                value > 0;

                                                            return (
                                                                <td
                                                                    key={hour}
                                                                    className="px-1 py-1 text-center"
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={
                                                                            handleClick
                                                                        }
                                                                        className={[
                                                                            'flex h-6 w-8 items-center justify-center rounded text-[11px]',
                                                                            isActive
                                                                                ? 'bg-emerald-500/80 text-emerald-50'
                                                                                : 'bg-muted text-muted-foreground hover:bg-muted/80',
                                                                        ].join(
                                                                            ' ',
                                                                        )}
                                                                    >
                                                                        {isActive
                                                                            ? value
                                                                            : ''}
                                                                    </button>
                                                                </td>
                                                            );
                                                        },
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

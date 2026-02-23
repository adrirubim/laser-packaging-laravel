import { DashboardEmptyState } from '@/components/dashboard/DashboardEmptyState';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useTranslations } from '@/hooks/use-translations';
import { Maximize2 } from 'lucide-react';
import { useState } from 'react';
import type { LegendPayload } from 'recharts';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

const STATUS_LABEL_KEYS: Record<OrderStatusKey, string> = {
    lanciato: 'dashboard.chart_status_launched',
    in_avanzamento: 'dashboard.chart_status_in_progress',
    sospeso: 'dashboard.chart_status_suspended',
    completato: 'dashboard.chart_status_completed',
};

type OrderStatusKey = 'lanciato' | 'in_avanzamento' | 'sospeso' | 'completato';

type OrderStatusData = {
    name: string;
    value: number;
    color: string;
    statusKey: OrderStatusKey;
};

type OrderStatusChartProps = {
    data: {
        lanciato: number;
        in_avanzamento: number;
        sospeso: number;
        completato: number;
    };
    /**
     * Callback opzionale quando l'utente clicca su una sezione.
     * Permette ad es. di navigare all'elenco ordini filtrato.
     */
    onStatusClick?: (status: OrderStatusKey) => void;
};

// Palette unificata per stati ordini (dashboard)
// Lanciato  -> blu
// In avanz. -> giallo caldo
// Sospeso   -> rosso
// Completato-> verde
const COLORS: Record<OrderStatusKey, string> = {
    lanciato: '#60A5FA', // blu medio/pastel (coerente con Tendenze Ordini)
    in_avanzamento: '#FACC15', // giallo vivo ma non neon
    sospeso: '#FB7185', // rosso/rosa deciso ma morbido
    completato: '#4ADE80', // verde deciso ma ancora "soft"
};

const RADIAN = Math.PI / 180;

export function OrderStatusChart({
    data,
    onStatusClick,
}: OrderStatusChartProps) {
    const { t } = useTranslations();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isFocusOpen, setIsFocusOpen] = useState(false);
    const chartData: OrderStatusData[] = [
        {
            name: t(STATUS_LABEL_KEYS.lanciato),
            value: data.lanciato,
            color: COLORS.lanciato,
            statusKey: 'lanciato' as const,
        },
        {
            name: t(STATUS_LABEL_KEYS.in_avanzamento),
            value: data.in_avanzamento,
            color: COLORS.in_avanzamento,
            statusKey: 'in_avanzamento' as const,
        },
        {
            name: t(STATUS_LABEL_KEYS.sospeso),
            value: data.sospeso,
            color: COLORS.sospeso,
            statusKey: 'sospeso' as const,
        },
        {
            name: t(STATUS_LABEL_KEYS.completato),
            value: data.completato,
            color: COLORS.completato,
            statusKey: 'completato' as const,
        },
    ].filter((item) => item.value > 0);

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    // Recharts tipa `content` de forma muy genérica y no expone bien `payload`.
    // Usamos `any` SOLO aquí como frontera con la librería, manteniendo el resto
    // del componente estrictamente tipado.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderLegend = (props: any) => {
        const payload = (props?.payload ?? []) as LegendPayload[];

        if (!payload || !payload.length) {
            return null;
        }

        return (
            <div className="mt-2 w-full px-2 sm:px-0">
                <ul className="flex flex-col items-start gap-1 text-xs sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-4 sm:gap-y-1">
                    {payload.map((entry) => {
                        const labelValue = entry.value ?? '';
                        const count =
                            (entry.payload as { value?: number } | undefined)
                                ?.value ?? 0;
                        const percentage =
                            total > 0 && count != null
                                ? ((count / total) * 100).toFixed(1)
                                : '0';
                        const label = `${labelValue} — ${t(
                            'dashboard.chart_orders_legend',
                            {
                                count,
                                pct: percentage,
                            },
                        )}`;

                        return (
                            <li
                                key={String(labelValue)}
                                className="flex items-center gap-1"
                            >
                                <span
                                    className="inline-block h-2 w-2 rounded-sm"
                                    style={{
                                        backgroundColor:
                                            entry.color ?? 'currentColor',
                                    }}
                                />
                                <span className="whitespace-nowrap sm:whitespace-normal">
                                    {label}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    const renderActiveLabel = (props: {
        cx?: number;
        cy?: number;
        midAngle?: number;
        outerRadius?: number;
        index?: number;
        name?: string;
        value?: number;
        payload?: { color?: string };
    }) => {
        const { cx, cy, midAngle, outerRadius, index, name, value, payload } =
            props;

        // Solo mostramos la etiqueta para el sector activo
        if (
            activeIndex === null ||
            typeof index !== 'number' ||
            index !== activeIndex
        ) {
            return null;
        }

        if (
            cx == null ||
            cy == null ||
            midAngle == null ||
            outerRadius == null
        ) {
            return null;
        }

        const radius = outerRadius + 16;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        const numericValue =
            typeof value === 'number' ? value : Number(value ?? 0);
        const percentage =
            total > 0 ? ((numericValue / total) * 100).toFixed(1) : '0';
        const label = `${name ?? ''} — ${t('dashboard.chart_orders_legend', {
            count: numericValue,
            pct: percentage,
        })}`;
        const color = payload?.color ?? 'currentColor';

        return (
            <text
                x={x}
                y={y}
                fill={color}
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={11}
            >
                {label}
            </text>
        );
    };

    const renderChart = (height: number) => {
        if (total === 0) {
            return <DashboardEmptyState />;
        }

        return (
            <ResponsiveContainer width="100%" height={height}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderActiveLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        // Feedback visual de que es interactivo
                        style={
                            onStatusClick ? { cursor: 'pointer' } : undefined
                        }
                        isAnimationActive={false}
                        onMouseMove={(_, index: number) =>
                            setActiveIndex(index)
                        }
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                                // Evidenziazione al passaggio: la porzione attiva resta opaca, il resto perde intensità
                                opacity={
                                    activeIndex === null ||
                                    activeIndex === index
                                        ? 1
                                        : 0.4
                                }
                                onClick={() => {
                                    if (onStatusClick) {
                                        onStatusClick(entry.statusKey);
                                    }
                                }}
                            />
                        ))}
                    </Pie>
                    <Legend
                        verticalAlign="bottom"
                        align="center"
                        content={renderLegend}
                    />
                </PieChart>
            </ResponsiveContainer>
        );
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                    <div>
                        <CardTitle className="text-base">
                            {t('dashboard.chart_order_status_title')}
                        </CardTitle>
                        <CardDescription className="text-xs text-foreground/80">
                            {t('dashboard.chart_order_status_desc')}
                        </CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={t(
                            'dashboard.chart_order_status_expand_aria',
                        )}
                        onClick={() => setIsFocusOpen(true)}
                    >
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>{renderChart(300)}</CardContent>
            </Card>

            <Dialog open={isFocusOpen} onOpenChange={setIsFocusOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            {t('dashboard.chart_order_status_title')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">{renderChart(360)}</div>
                </DialogContent>
            </Dialog>
        </>
    );
}

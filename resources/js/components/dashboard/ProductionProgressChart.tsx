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
import { Maximize2 } from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    TooltipProps,
    XAxis,
    YAxis,
} from 'recharts';

type ProductionProgressData = {
    orderNumber: string;
    worked: number;
    total: number;
    progress: number;
    isUrgent: boolean;
    daysUntilDelivery?: number;
};

type ProductionProgressChartProps = {
    data: ProductionProgressData[];
    maxItems?: number;
    /**
     * Callback opzionale al clic su una barra (ordine specifico)
     */
    onBarClick?: (orderNumber: string) => void;
};

type TooltipPayloadEntry = {
    dataKey?: string;
    value?: number;
    payload?: { fullName?: string; total?: number };
};

function ProductionProgressTooltip({
    active,
    payload,
}: TooltipProps<number, string> & { payload?: TooltipPayloadEntry[] }) {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const data = payload[0]?.payload;
    if (!data) return null;

    return (
        <div
            style={{
                backgroundColor: 'hsl(var(--popover))',
                border: '2px solid hsl(var(--border))',
                borderRadius: '8px',
                padding: '12px 16px',
                boxShadow:
                    '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                zIndex: 1000,
            }}
        >
            <p
                style={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: 600,
                    marginBottom: '8px',
                    fontSize: '14px',
                }}
            >
                Ordine: {data.fullName}
            </p>
            <p
                style={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: 500,
                    marginBottom: '4px',
                    fontSize: '13px',
                }}
            >
                Totale: {Number(data.total).toLocaleString()}
            </p>
            {payload.map((entry: TooltipPayloadEntry, index: number) => {
                if (entry.dataKey === 'worked') {
                    return (
                        <p
                            key={index}
                            style={{
                                color: 'hsl(var(--foreground))',
                                fontWeight: 500,
                                fontSize: '13px',
                                marginBottom: '4px',
                            }}
                        >
                            Processato / Totale:{' '}
                            {Number(entry.value).toLocaleString()} /{' '}
                            {Number(data.total).toLocaleString()}
                        </p>
                    );
                }
                if (entry.dataKey === 'remaining') {
                    return (
                        <p
                            key={index}
                            style={{
                                color: 'hsl(var(--foreground))',
                                fontWeight: 500,
                                fontSize: '13px',
                            }}
                        >
                            Rimanente: {Number(entry.value).toLocaleString()}
                        </p>
                    );
                }
                return null;
            })}
        </div>
    );
}

export function ProductionProgressChart({
    data,
    maxItems = 10,
    onBarClick,
}: ProductionProgressChartProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isFocusOpen, setIsFocusOpen] = useState(false);
    const chartData = data.slice(0, maxItems).map((item) => ({
        name:
            item.orderNumber.length > 15
                ? `${item.orderNumber.substring(0, 15)}...`
                : item.orderNumber,
        fullName: item.orderNumber,
        worked: item.worked,
        total: item.total,
        progress: item.progress,
        remaining: item.total - item.worked,
        isUrgent: item.isUrgent,
        daysUntilDelivery: item.daysUntilDelivery,
    }));

    // Usiamo la stessa palette "stati" della dashboard
    // overdue   -> rosso (vicino a sospeso)
    // urgent    -> giallo caldo (vicino a in_avanzamento)
    // completed -> verde (vicino a completato)
    // in prog.  -> blu (vicino a lanciato)
    const getBarColor = (item: (typeof chartData)[0]) => {
        if (
            item.isUrgent &&
            item.daysUntilDelivery !== undefined &&
            item.daysUntilDelivery < 0
        ) {
            return '#FB7185'; // rosso/sospeso - in ritardo
        }
        if (
            item.isUrgent &&
            item.daysUntilDelivery !== undefined &&
            item.daysUntilDelivery <= 3
        ) {
            return '#FACC15'; // giallo caldo - urgente
        }
        if (item.progress >= 100) {
            return '#4ADE80'; // verde - completato
        }
        return '#60A5FA'; // blu - in avanzamento
    };

    const renderChart = (height: number) => {
        if (chartData.length === 0) {
            return <DashboardEmptyState />;
        }

        return (
            <ResponsiveContainer
                width="100%"
                height={Math.max(height, chartData.length * 40)}
            >
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--muted-foreground) / 0.2)"
                    />
                    <XAxis
                        type="number"
                        domain={[0, 'dataMax']}
                        stroke="hsl(var(--foreground) / 0.8)"
                        style={{ fontSize: '12px', fontWeight: 500 }}
                        tick={{ fill: 'hsl(var(--foreground) / 0.8)' }}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        stroke="hsl(var(--foreground) / 0.8)"
                        style={{ fontSize: '12px', fontWeight: 500 }}
                        width={90}
                        tick={{ fill: 'hsl(var(--foreground) / 0.8)' }}
                    />
                    <RechartsTooltip
                        content={<ProductionProgressTooltip />}
                        wrapperStyle={{
                            zIndex: 1000,
                        }}
                    />
                    <Bar
                        dataKey="total"
                        stackId="a"
                        // Barra di sfondo in grigio chiaro (coerente con il track del progresso)
                        fill="#e5e7eb"
                        radius={[0, 4, 4, 0]}
                    >
                        {chartData.map((_, index) => (
                            <Cell key={`cell-total-${index}`} fill="#e5e7eb" />
                        ))}
                    </Bar>
                    {/* Colore base allineato alla palette blu degli stati */}
                    <Bar
                        dataKey="worked"
                        stackId="a"
                        fill="#60A5FA"
                        radius={[0, 4, 4, 0]}
                        // Feedback global de interactividad
                        style={onBarClick ? { cursor: 'pointer' } : undefined}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-worked-${index}`}
                                fill={getBarColor(entry)}
                                opacity={
                                    activeIndex === null ||
                                    activeIndex === index
                                        ? 1
                                        : 0.4
                                }
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(null)}
                                onClick={() => {
                                    if (onBarClick) {
                                        onBarClick(entry.fullName);
                                    }
                                }}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        );
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                    <div>
                        <CardTitle className="text-base">
                            Progresso di Produzione per Ordine
                        </CardTitle>
                        <CardDescription className="text-xs text-foreground/80">
                            Visualizzazione del progresso di produzione degli
                            ordini più urgenti
                        </CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Apri grafico Progresso di Produzione per Ordine in vista dettagliata"
                        onClick={() => setIsFocusOpen(true)}
                    >
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>{renderChart(300)}</CardContent>
            </Card>

            <Dialog open={isFocusOpen} onOpenChange={setIsFocusOpen}>
                <DialogContent className="max-w-5xl">
                    <DialogHeader>
                        <DialogTitle>
                            Progresso di Produzione per Ordine
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">{renderChart(420)}</div>
                </DialogContent>
            </Dialog>
        </>
    );
}

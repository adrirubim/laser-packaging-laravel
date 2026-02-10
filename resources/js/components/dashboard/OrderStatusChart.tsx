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
    Cell,
    Legend,
    Pie,
    PieChart,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from 'recharts';

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

export function OrderStatusChart({
    data,
    onStatusClick,
}: OrderStatusChartProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isFocusOpen, setIsFocusOpen] = useState(false);
    const chartData: OrderStatusData[] = [
        {
            name: 'Lanciate',
            value: data.lanciato,
            color: COLORS.lanciato,
            statusKey: 'lanciato' as const,
        },
        {
            name: 'In Avanzamento',
            value: data.in_avanzamento,
            color: COLORS.in_avanzamento,
            statusKey: 'in_avanzamento' as const,
        },
        {
            name: 'Sospese',
            value: data.sospeso,
            color: COLORS.sospeso,
            statusKey: 'sospeso' as const,
        },
        {
            name: 'Completate',
            value: data.completato,
            color: COLORS.completato,
            statusKey: 'completato' as const,
        },
    ].filter((item) => item.value > 0);

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    // Usiamo props flessibili per adattarci al tipo Recharts.
    // Mostrare solo l'etichetta della porzione in hover (activeIndex).
    const renderLabel = (props: {
        name?: string;
        value?: number;
        index?: number;
    }) => {
        const { name, value, index } = props;

        // Senza hover: non mostrare etichette
        if (activeIndex === null) {
            return '';
        }

        // Con hover: solo l'etichetta della porzione attiva
        if (typeof index === 'number' && index !== activeIndex) {
            return '';
        }

        const numericValue =
            typeof value === 'number' ? value : Number(value ?? 0);
        const percentage =
            total > 0 ? ((numericValue / total) * 100).toFixed(1) : '0';
        return `${name ?? ''}: ${percentage}%`;
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
                        label={renderLabel}
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
                    <RechartsTooltip
                        formatter={(value?: number | string) => {
                            const numericValue =
                                typeof value === 'number'
                                    ? value
                                    : Number(value ?? 0);
                            return [numericValue, 'Ordini'] as [number, string];
                        }}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--popover))',
                            border: '2px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))',
                            fontWeight: 500,
                            padding: '12px 16px',
                            boxShadow:
                                '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                            zIndex: 1000,
                        }}
                        labelStyle={{
                            color: 'hsl(var(--foreground))',
                            fontWeight: 600,
                            marginBottom: '4px',
                        }}
                        wrapperStyle={{
                            zIndex: 1000,
                        }}
                    />
                    <Legend
                        formatter={(
                            value,
                            entry: { payload?: { value?: number } },
                        ) => {
                            const percentage =
                                total > 0 && entry.payload?.value != null
                                    ? (
                                          (entry.payload.value / total) *
                                          100
                                      ).toFixed(1)
                                    : '0';
                            return `${value} (${percentage}%)`;
                        }}
                        wrapperStyle={{
                            color: 'hsl(var(--foreground) / 0.9)',
                        }}
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
                            Distribuzione Ordini per Stato
                        </CardTitle>
                        <CardDescription className="text-xs text-foreground/80">
                            Visualizzazione percentuale degli ordini per stato
                        </CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Apri grafico Distribuzione Ordini per Stato in vista dettagliata"
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
                            Distribuzione Ordini per Stato
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">{renderChart(360)}</div>
                </DialogContent>
            </Dialog>
        </>
    );
}

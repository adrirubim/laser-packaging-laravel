import { DashboardEmptyState } from '@/components/dashboard/DashboardEmptyState';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';

type TrendDataPoint = {
    period: string;
    count: number;
    previousCount?: number;
};

type OrdersTrendChartProps = {
    data: TrendDataPoint[];
    previousPeriodData?: TrendDataPoint[];
    groupBy?: 'day' | 'week' | 'month';
    /**
     * Callback opzionale al clic su un punto della serie.
     * Permette di navigare, ad es. all'elenco filtrato per periodo.
     */
    onPointClick?: (period: string) => void;
};

export function OrdersTrendChart({
    data,
    previousPeriodData,
    groupBy = 'day',
    onPointClick,
}: OrdersTrendChartProps) {
    // Merge current and previous period data
    const chartData = data.map((point) => {
        const previousPoint = previousPeriodData?.find(
            (p) => p.period === point.period,
        );
        return {
            ...point,
            previousCount: previousPoint?.count || 0,
        };
    });

    const formatPeriod = (period: string) => {
        if (groupBy === 'day') {
            // Format: YYYY-MM-DD to DD/MM
            const [, month, day] = period.split('-');
            return `${day}/${month}`;
        } else if (groupBy === 'week') {
            return period;
        } else {
            // Format: YYYY-MM to MM/YYYY
            const parts = period.split('-');
            return parts.length >= 2 ? `${parts[1]}/${parts[0]}` : period;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Tendenze Ordini</CardTitle>
                <CardDescription className="text-xs text-foreground/80">
                    Andamento degli ordini nel tempo{' '}
                    {previousPeriodData &&
                        previousPeriodData.length > 0 &&
                        '(con confronto periodo precedente)'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {chartData.length === 0 ? (
                    <DashboardEmptyState message="Nessun dato per il periodo selezionato" />
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="hsl(var(--muted-foreground) / 0.2)"
                            />
                            <XAxis
                                dataKey="period"
                                tickFormatter={formatPeriod}
                                stroke="hsl(var(--foreground) / 0.8)"
                                style={{ fontSize: '12px', fontWeight: 500 }}
                                tick={{ fill: 'hsl(var(--foreground) / 0.8)' }}
                            />
                            <YAxis
                                stroke="hsl(var(--foreground) / 0.8)"
                                style={{ fontSize: '12px', fontWeight: 500 }}
                                tick={{ fill: 'hsl(var(--foreground) / 0.8)' }}
                            />
                            <RechartsTooltip
                                formatter={(
                                    value: number | string | undefined,
                                    name: string | undefined,
                                ) => {
                                    const label =
                                        name === 'count'
                                            ? 'Periodo Corrente'
                                            : 'Periodo Precedente';
                                    const numericValue =
                                        typeof value === 'number'
                                            ? value
                                            : Number(value ?? 0);
                                    return [numericValue, label];
                                }}
                                labelFormatter={(label) =>
                                    `Periodo: ${formatPeriod(label)}`
                                }
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
                                formatter={(value) => {
                                    return value === 'count'
                                        ? 'Periodo Corrente'
                                        : 'Periodo Precedente';
                                }}
                            />
                            {/* Linea principale in blu pastello */}
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#60A5FA"
                                strokeWidth={2}
                                // Evidenziare che è interattivo su punti e linea
                                dot={{
                                    fill: '#60A5FA',
                                    r: 4,
                                    cursor: onPointClick
                                        ? 'pointer'
                                        : 'default',
                                }}
                                activeDot={{
                                    r: 7,
                                    strokeWidth: 2,
                                    stroke: '#2563EB',
                                    cursor: onPointClick
                                        ? 'pointer'
                                        : 'default',
                                }}
                                name="count"
                                style={
                                    onPointClick
                                        ? { cursor: 'pointer' }
                                        : undefined
                                }
                                // Click su un punto della serie
                                onClick={(props) => {
                                    const activeLabel = (
                                        props as { activeLabel?: string }
                                    )?.activeLabel;
                                    if (onPointClick && activeLabel) {
                                        onPointClick(String(activeLabel));
                                    }
                                }}
                            />
                            {previousPeriodData &&
                                previousPeriodData.length > 0 && (
                                    <Line
                                        type="monotone"
                                        dataKey="previousCount"
                                        stroke="#C4B5FD"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={{ fill: '#C4B5FD', r: 3 }}
                                        name="previousCount"
                                    />
                                )}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}

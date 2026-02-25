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

type OrdersTrendTooltipPayload = {
    name?: string;
    value?: number;
};

type OrdersTrendTooltipProps = {
    active?: boolean;
    payload?: OrdersTrendTooltipPayload[];
    label?: string | number;
    groupBy: 'day' | 'week' | 'month';
    formatPeriod: (period: string) => string;
};

function OrdersTrendTooltipContent(props: OrdersTrendTooltipProps) {
    const { active, payload, label, formatPeriod } = props;
    const { t } = useTranslations();
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const entries = payload ?? [];

    const current = entries.find((entry) => entry.name === 'count') as
        | OrdersTrendTooltipPayload
        | undefined;
    const previous = entries.find((entry) => entry.name === 'previousCount') as
        | OrdersTrendTooltipPayload
        | undefined;

    const currentValue = Number(current?.value ?? 0);
    const previousValue = Number(previous?.value ?? 0);
    const hasPreviousPoint = previous !== undefined;

    const delta = currentValue - previousValue;
    const hasNonZeroPrevious = hasPreviousPoint && previousValue !== 0;
    const deltaPercent = hasNonZeroPrevious
        ? ((delta / previousValue) * 100).toFixed(1)
        : '0.0';

    let deltaLabel = '';
    let deltaColor = 'hsl(var(--foreground))';

    if (hasPreviousPoint) {
        if (hasNonZeroPrevious) {
            if (delta > 0) {
                deltaLabel = t('dashboard.chart_trend_tooltip_delta_positive', {
                    delta: delta.toLocaleString(),
                    percent: deltaPercent,
                });
                deltaColor = 'rgb(34, 197, 94)';
            } else if (delta < 0) {
                deltaLabel = t('dashboard.chart_trend_tooltip_delta_negative', {
                    delta: delta.toLocaleString(),
                    percent: deltaPercent,
                });
                deltaColor = 'rgb(248, 113, 113)';
            } else {
                deltaLabel = t('dashboard.chart_trend_tooltip_delta_zero');
            }
        } else {
            deltaLabel = t('dashboard.chart_trend_tooltip_delta_new', {
                current: currentValue.toLocaleString(),
            });
            deltaColor = 'rgb(34, 197, 94)';
        }
    }

    const formattedLabel =
        typeof label === 'string' ? formatPeriod(label) : String(label ?? '');

    return (
        <div
            style={{
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
                {t('dashboard.chart_trend_tooltip_period')} {formattedLabel}
            </p>
            <p
                style={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: 500,
                    fontSize: '13px',
                    marginBottom: '4px',
                }}
            >
                {t('dashboard.chart_trend_tooltip_current')}{' '}
                {currentValue.toLocaleString()}
            </p>
            {previous && (
                <p
                    style={{
                        color: 'hsl(var(--foreground))',
                        fontWeight: 500,
                        fontSize: '13px',
                        marginBottom: hasPreviousPoint ? '4px' : '0px',
                    }}
                >
                    {t('dashboard.chart_trend_tooltip_previous')}{' '}
                    {previousValue.toLocaleString()}
                </p>
            )}
            {hasPreviousPoint && (
                <p
                    style={{
                        color: deltaColor,
                        fontWeight: 600,
                        fontSize: '13px',
                    }}
                >
                    {deltaLabel}
                </p>
            )}
            {!hasPreviousPoint && (
                <p
                    style={{
                        color: 'hsl(var(--foreground) / 0.85)',
                        fontWeight: 500,
                        fontSize: '13px',
                    }}
                >
                    {t('dashboard.chart_trend_tooltip_no_previous')}
                </p>
            )}
        </div>
    );
}

export function OrdersTrendChart({
    data,
    previousPeriodData,
    groupBy = 'day',
    onPointClick,
}: OrdersTrendChartProps) {
    const { t } = useTranslations();
    const [isFocusOpen, setIsFocusOpen] = useState(false);

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

    const renderChart = (height: number) => {
        if (chartData.length === 0) {
            return (
                <DashboardEmptyState
                    message={t('dashboard.chart_trend_no_data')}
                />
            );
        }

        // Detect dark/light theme to adjust tooltips.
        const isDark =
            typeof document !== 'undefined'
                ? document.documentElement.classList.contains('dark') ||
                  (window.matchMedia &&
                      window.matchMedia('(prefers-color-scheme: dark)').matches)
                : false;

        const tooltipBackground = isDark
            ? 'rgba(15, 23, 42, 0.97)' // muy oscuro en dark
            : '#ffffff'; // blanco en light

        const tooltipBorder = isDark
            ? 'rgba(148, 163, 184, 0.75)' // slate-400
            : 'rgba(148, 163, 184, 0.4)';

        return (
            <ResponsiveContainer width="100%" height={height}>
                <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 28 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--muted-foreground) / 0.2)"
                    />
                    <XAxis
                        dataKey="period"
                        tickFormatter={formatPeriod}
                        stroke="currentColor"
                        style={{ fontSize: '11px', fontWeight: 500 }}
                        tick={{ fill: 'currentColor' }}
                        interval={
                            chartData.length > 18
                                ? Math.max(0, Math.floor(chartData.length / 12))
                                : 0
                        }
                    />
                    <YAxis
                        stroke="currentColor"
                        style={{ fontSize: '12px', fontWeight: 500 }}
                        tick={{ fill: 'currentColor' }}
                    />
                    <RechartsTooltip
                        content={(props) => (
                            <div
                                style={{
                                    backgroundColor: tooltipBackground,
                                    border: `2px solid ${tooltipBorder}`,
                                    borderRadius: '8px',
                                }}
                            >
                                <OrdersTrendTooltipContent
                                    {...({
                                        // First convert to unknown so
                                        // TypeScript accepts the cast
                                        ...(props as unknown as {
                                            active?: boolean;
                                            payload?: OrdersTrendTooltipPayload[];
                                            label?: string | number;
                                        }),
                                        groupBy,
                                        formatPeriod,
                                    } as OrdersTrendTooltipProps)}
                                />
                            </div>
                        )}
                        wrapperStyle={{
                            zIndex: 1000,
                        }}
                    />
                    <Legend
                        formatter={(value) =>
                            value === 'count'
                                ? t('dashboard.chart_trend_period_current')
                                : t('dashboard.chart_trend_period_previous')
                        }
                    />
                    {/* Linea principale in blu pastello */}
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#60A5FA"
                        strokeWidth={2}
                        // Indicate it's interactive on points and line
                        dot={{
                            fill: '#60A5FA',
                            r: 4,
                            cursor: onPointClick ? 'pointer' : 'default',
                        }}
                        activeDot={{
                            r: 7,
                            strokeWidth: 2,
                            stroke: '#2563EB',
                            cursor: onPointClick ? 'pointer' : 'default',
                        }}
                        name="count"
                        style={onPointClick ? { cursor: 'pointer' } : undefined}
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
                    {previousPeriodData && previousPeriodData.length > 0 && (
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
        );
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                    <div>
                        <CardTitle className="text-base">
                            {t('dashboard.chart_trend_title')}
                        </CardTitle>
                        <CardDescription className="text-xs text-foreground/80">
                            {t('dashboard.chart_trend_desc')}{' '}
                            {previousPeriodData &&
                                previousPeriodData.length > 0 &&
                                t('dashboard.chart_trend_desc_compare')}
                        </CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={t('dashboard.chart_trend_expand_aria')}
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
                            {t('dashboard.chart_trend_title')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">{renderChart(420)}</div>
                </DialogContent>
            </Dialog>
        </>
    );
}

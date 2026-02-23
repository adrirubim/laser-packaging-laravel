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

type TopCustomer = {
    id: number;
    uuid: string;
    company_name: string;
    order_count: number;
};

type TopCustomerChartRow = {
    name: string;
    fullName: string;
    ordini: number;
    raw: TopCustomer;
};

type TopCustomersTooltipProps = TooltipProps<number, string> & {
    payload?: { value?: number; payload?: TopCustomerChartRow }[];
};

type TopCustomersChartProps = {
    data: TopCustomer[];
    /**
     * Callback opzionale al clic su una barra.
     * Permette di navigare, ad es. al dettaglio del cliente.
     */
    onBarClick?: (customer: TopCustomer) => void;
};

function TopCustomersTooltipContent({
    active,
    payload,
}: TopCustomersTooltipProps) {
    const { t } = useTranslations();
    if (!active || !payload || payload.length === 0) {
        return null;
    }
    const data = payload[0]?.payload;
    if (!data) return null;

    const isDark =
        typeof document !== 'undefined'
            ? document.documentElement.classList.contains('dark') ||
              (window.matchMedia &&
                  window.matchMedia('(prefers-color-scheme: dark)').matches)
            : false;

    const backgroundColor = isDark ? 'rgba(15, 23, 42, 0.97)' : '#ffffff';
    const borderColor = isDark
        ? 'rgba(148, 163, 184, 0.75)'
        : 'rgba(148, 163, 184, 0.4)';
    return (
        <div
            style={{
                backgroundColor,
                border: `2px solid ${borderColor}`,
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
                {t('dashboard.customer_label')} {data.fullName}
            </p>
            <p
                style={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: 500,
                    fontSize: '13px',
                }}
            >
                {t('dashboard.chart_orders_total')}{' '}
                {Number(payload[0].value ?? 0).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                })}
            </p>
        </div>
    );
}

export function TopCustomersChart({
    data,
    onBarClick,
}: TopCustomersChartProps) {
    const { t } = useTranslations();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isFocusOpen, setIsFocusOpen] = useState(false);

    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        {t('dashboard.chart_top_customers_title')}
                    </CardTitle>
                    <CardDescription className="text-xs text-foreground/80">
                        {t('dashboard.chart_top_customers_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DashboardEmptyState />
                </CardContent>
            </Card>
        );
    }

    const chartData: TopCustomerChartRow[] = data.map((customer) => ({
        name:
            customer.company_name.length > 28
                ? customer.company_name.substring(0, 28) + '…'
                : customer.company_name,
        fullName: customer.company_name,
        ordini: customer.order_count,
        raw: customer,
    }));

    const renderYAxisTick = (props: {
        x?: string | number;
        y?: string | number;
        payload?: { value?: string };
    }) => {
        const { x, y, payload } = props;
        // Cercare l'indice dal nome mostrato sull'asse Y
        const payloadValue = payload?.value;
        if (!payloadValue) {
            return (
                <text
                    x={x}
                    y={y}
                    dy={4}
                    textAnchor="end"
                    style={{
                        fontSize: 12,
                        fontWeight: 500,
                        fill: 'currentColor',
                    }}
                />
            );
        }
        const index = chartData.findIndex(
            (entry) => entry.name === payloadValue,
        );
        const entry = index >= 0 ? chartData[index] : null;
        const isActive = activeIndex === index;

        return (
            <text
                x={x}
                y={y}
                dy={4}
                textAnchor="end"
                style={{
                    cursor: onBarClick ? 'pointer' : 'default',
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 500,
                    fill: 'currentColor',
                }}
                onMouseEnter={() => {
                    if (index >= 0) {
                        setActiveIndex(index);
                    }
                }}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => {
                    if (onBarClick && entry && index >= 0) {
                        onBarClick(entry.raw);
                    }
                }}
            >
                {payloadValue}
            </text>
        );
    };

    const renderChart = (height: number) => (
        <ResponsiveContainer
            width="100%"
            height={Math.max(height, chartData.length * 40)}
        >
            <BarChart
                data={chartData}
                layout="vertical"
                // Margen fino y consistente con el resto de la dashboard,
                // especialmente en móvil.
                margin={{ top: 5, right: 30, left: 4, bottom: 5 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--muted-foreground) / 0.2)"
                />
                <XAxis
                    type="number"
                    stroke="currentColor"
                    style={{ fontSize: '12px', fontWeight: 500 }}
                    tick={{ fill: 'currentColor' }}
                />
                <YAxis
                    dataKey="name"
                    type="category"
                    width={130}
                    tick={renderYAxisTick}
                    stroke="currentColor"
                />
                <RechartsTooltip
                    content={<TopCustomersTooltipContent />}
                    wrapperStyle={{
                        zIndex: 1000,
                    }}
                />
                {/* Verde pastello per un aspetto più morbido */}
                <Bar
                    dataKey="ordini"
                    fill="#6EE7B7"
                    radius={[0, 4, 4, 0]}
                    style={onBarClick ? { cursor: 'pointer' } : undefined}
                    onMouseLeave={() => setActiveIndex(null)}
                >
                    {chartData.map((entry, index) => (
                        <Cell
                            key={`top-customer-${entry.raw.uuid}`}
                            fill="#6EE7B7"
                            opacity={
                                activeIndex === null || activeIndex === index
                                    ? 1
                                    : 0.4
                            }
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                            onClick={() => {
                                if (onBarClick) {
                                    onBarClick(entry.raw);
                                }
                            }}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                    <div>
                        <CardTitle className="text-base">
                            {t('dashboard.chart_top_customers_title')}
                        </CardTitle>
                        <CardDescription className="text-xs text-foreground/80">
                            {t('dashboard.chart_top_customers_desc')}
                        </CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={t(
                            'dashboard.chart_top_customers_expand_aria',
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
                            {t('dashboard.chart_top_customers_title')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">{renderChart(360)}</div>
                </DialogContent>
            </Dialog>
        </>
    );
}

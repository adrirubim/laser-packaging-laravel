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

type TopArticle = {
    id: number;
    uuid: string;
    cod_article_las: string;
    article_descr?: string | null;
    total_quantity: number;
};

type TopArticlesChartProps = {
    data: TopArticle[];
    /**
     * Callback opzionale al clic su una barra.
     * Permette di navigare al dettaglio dell'articolo.
     */
    onBarClick?: (article: TopArticle) => void;
};

type TopArticleChartRow = {
    name: string;
    description: string;
    quantita: number;
    raw: TopArticle;
};

type TopArticlesTooltipProps = TooltipProps<number, string> & {
    payload?: { value?: number; payload?: TopArticleChartRow }[];
};

function TopArticlesTooltipContent({
    active,
    payload,
}: TopArticlesTooltipProps) {
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
                    marginBottom: '4px',
                    fontSize: '14px',
                }}
            >
                {t('dashboard.chart_article_label')} {data.name}
            </p>
            <p
                style={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: 500,
                    marginBottom: '8px',
                    fontSize: '12px',
                }}
            >
                {t('common.description')}: {data.description}
            </p>
            <p
                style={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: 500,
                    fontSize: '13px',
                }}
            >
                {t('dashboard.chart_quantity_total')}{' '}
                {Number(payload[0].value ?? 0).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                })}
            </p>
        </div>
    );
}

export function TopArticlesChart({ data, onBarClick }: TopArticlesChartProps) {
    const { t } = useTranslations();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isFocusOpen, setIsFocusOpen] = useState(false);

    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        {t('dashboard.chart_top_articles_title')}
                    </CardTitle>
                    <CardDescription className="text-xs text-foreground/80">
                        {t('dashboard.chart_top_articles_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DashboardEmptyState />
                </CardContent>
            </Card>
        );
    }

    const chartData: TopArticleChartRow[] = data.map((article) => ({
        name: article.cod_article_las,
        description: article.article_descr || t('dashboard.no_description'),
        quantita: article.total_quantity,
        raw: article,
    }));

    const renderYAxisTick = (props: {
        x?: string | number;
        y?: string | number;
        payload?: { value?: string };
    }) => {
        const { x, y, payload } = props;
        // Cercare l'indice dal codice articolo mostrato
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
                // Margen coherente con TopClientes y Progresso Produzione,
                // optimizado para móvil.
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
                    width={110}
                    tick={renderYAxisTick}
                    stroke="currentColor"
                />
                <RechartsTooltip
                    content={<TopArticlesTooltipContent />}
                    wrapperStyle={{
                        zIndex: 1000,
                    }}
                />
                {/* Viola pastello per armonizzarsi con il resto della dashboard */}
                <Bar
                    dataKey="quantita"
                    fill="#A5B4FC"
                    radius={[0, 4, 4, 0]}
                    style={onBarClick ? { cursor: 'pointer' } : undefined}
                    onMouseLeave={() => setActiveIndex(null)}
                >
                    {chartData.map((entry, index) => (
                        <Cell
                            key={`top-article-${entry.raw.uuid}`}
                            fill="#A5B4FC"
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
                            {t('dashboard.chart_top_articles_title')}
                        </CardTitle>
                        <CardDescription className="text-xs text-foreground/80">
                            {t('dashboard.chart_top_articles_desc_full')}
                        </CardDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={t(
                            'dashboard.chart_top_articles_expand_aria',
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
                            {t('dashboard.chart_top_articles_title')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-2">{renderChart(360)}</div>
                </DialogContent>
            </Dialog>
        </>
    );
}

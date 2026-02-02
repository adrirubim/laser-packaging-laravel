import { DashboardEmptyState } from '@/components/dashboard/DashboardEmptyState';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
                    marginBottom: '4px',
                    fontSize: '14px',
                }}
            >
                {data.name}
            </p>
            <p
                style={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: 500,
                    marginBottom: '8px',
                    fontSize: '12px',
                }}
            >
                {data.description}
            </p>
            <p
                style={{
                    color: 'hsl(var(--foreground))',
                    fontWeight: 500,
                    fontSize: '13px',
                }}
            >
                Quantità: {payload[0].value?.toLocaleString()}
            </p>
        </div>
    );
}

export function TopArticlesChart({ data, onBarClick }: TopArticlesChartProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Top 5 Articoli</CardTitle>
                    <CardDescription className="text-xs text-foreground/80">
                        Articoli più prodotti
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
        description: article.article_descr || 'Senza descrizione',
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
                        fill: 'hsl(var(--foreground) / 0.8)',
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
                    fill: 'hsl(var(--foreground) / 0.8)',
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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Top 5 Articoli</CardTitle>
                <CardDescription className="text-xs text-foreground/80">
                    Articoli più prodotti (quantità totale)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="hsl(var(--muted-foreground) / 0.2)"
                        />
                        <XAxis
                            type="number"
                            stroke="hsl(var(--foreground) / 0.8)"
                            style={{ fontSize: '12px', fontWeight: 500 }}
                            tick={{ fill: 'hsl(var(--foreground) / 0.8)' }}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={100}
                            tick={renderYAxisTick}
                            stroke="hsl(var(--foreground) / 0.8)"
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
                            style={
                                onBarClick ? { cursor: 'pointer' } : undefined
                            }
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`top-article-${entry.raw.uuid}`}
                                    fill="#A5B4FC"
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
                                            onBarClick(entry.raw);
                                        }
                                    }}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import productionPortal from '@/routes/production-portal/index';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, LogOut, Package, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

type Order = {
    uuid: string;
    order_production_number: string;
    number_customer_reference_order?: string | null;
    quantity: number;
    worked_quantity: number;
    remain_quantity: number;
    status: number;
    status_label: string;
    autocontrollo: number;
    article?: {
        uuid: string;
        cod_article_las: string;
        article_descr?: string | null;
    } | null;
    customer?: {
        uuid: string;
        company_name: string;
    } | null;
    division?: {
        uuid: string;
        name: string;
    } | null;
};

type Employee = {
    uuid: string;
    name: string;
    surname: string;
    matriculation_number: string;
};

type DashboardProps = {
    orders: Order[];
    employee: Employee;
    token?: string;
    flash?: {
        success?: string;
        error?: string;
    };
};

const STATUS_COLORS: Record<number, string> = {
    2: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/40',
    3: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/40',
    4: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/40',
};

export default function ProductionPortalDashboard({
    orders,
    employee,
    token,
    flash,
}: DashboardProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Store token globally for API calls (in effect to satisfy immutability rule)
    useEffect(() => {
        if (typeof window !== 'undefined' && token) {
            window.__PRODUCTION_PORTAL_TOKEN__ = token;
        }
    }, [token]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.reload({
            onFinish: () => setIsRefreshing(false),
        });
    };

    const handleLogout = () => {
        router.post(productionPortal.logout.url());
    };

    const getProgressPercentage = (order: Order): number => {
        if (order.quantity === 0) return 0;
        return Math.round((order.worked_quantity / order.quantity) * 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <Head title="Portale di Produzione - Dashboard" />

            {/* Header */}
            <header className="border-b bg-white/50 backdrop-blur dark:bg-slate-900/50">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Portale di Produzione
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Benvenuto, {employee.name} {employee.surname}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        >
                            <RefreshCw
                                className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                            />
                            Aggiorna
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Esci
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                {flash?.error && (
                    <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/5 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                        {flash.error}
                    </div>
                )}

                {flash?.success && (
                    <div className="mb-4 rounded-md border border-emerald-500/40 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                        {flash.success}
                    </div>
                )}

                {/* Stats */}
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Ordini Attivi</CardDescription>
                            <CardTitle className="text-3xl">
                                {orders.length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>In corso</CardDescription>
                            <CardTitle className="text-3xl">
                                {orders.filter((o) => o.status === 3).length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Lanciate</CardDescription>
                            <CardTitle className="text-3xl">
                                {orders.filter((o) => o.status === 2).length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Orders List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ordini di Produzione</CardTitle>
                        <CardDescription>
                            Lista degli ordini attivi disponibili
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {orders.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                <Package className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                <p>Non ci sono ordini attivi disponibili</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div
                                        key={order.uuid}
                                        className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="mb-2 flex items-center gap-3">
                                                    <h3 className="text-lg font-semibold">
                                                        {
                                                            order.order_production_number
                                                        }
                                                    </h3>
                                                    <Badge
                                                        className={
                                                            STATUS_COLORS[
                                                                order.status
                                                            ] || ''
                                                        }
                                                    >
                                                        {order.status_label}
                                                    </Badge>
                                                    {order.autocontrollo ===
                                                        0 && (
                                                        <Badge
                                                            variant="outline"
                                                            className="border-orange-500 text-orange-700 dark:text-orange-300"
                                                        >
                                                            Pendiente
                                                            Autocontrollo
                                                        </Badge>
                                                    )}
                                                </div>

                                                {order.article && (
                                                    <p className="mb-1 text-sm text-muted-foreground">
                                                        <strong>
                                                            Artículo:
                                                        </strong>{' '}
                                                        {
                                                            order.article
                                                                .cod_article_las
                                                        }{' '}
                                                        -{' '}
                                                        {order.article
                                                            .article_descr ||
                                                            'Sin descripción'}
                                                    </p>
                                                )}

                                                {order.customer && (
                                                    <p className="mb-1 text-sm text-muted-foreground">
                                                        <strong>
                                                            Cliente:
                                                        </strong>{' '}
                                                        {
                                                            order.customer
                                                                .company_name
                                                        }
                                                        {order.division &&
                                                            ` - ${order.division.name}`}
                                                    </p>
                                                )}

                                                {/* Progress Bar */}
                                                <div className="mt-3">
                                                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                                                        <span>
                                                            Progresso:{' '}
                                                            {
                                                                order.worked_quantity
                                                            }{' '}
                                                            / {order.quantity}
                                                        </span>
                                                        <span>
                                                            {getProgressPercentage(
                                                                order,
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full rounded-full bg-muted">
                                                        <div
                                                            className="h-2 rounded-full bg-primary transition-all"
                                                            style={{
                                                                width: `${getProgressPercentage(order)}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        Restante:{' '}
                                                        {order.remain_quantity}
                                                    </p>
                                                </div>
                                            </div>

                                            <Link
                                                href={productionPortal.order.url(
                                                    { order: order.uuid },
                                                )}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Vedi dettagli
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    addManualQuantity,
    addPalletQuantity,
    confirmAutocontrollo,
    suspendOrder,
} from '@/lib/api/production-portal';
import productionPortal from '@/routes/production-portal/index';
import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Calculator,
    CheckCircle,
    LogOut,
    Package,
    Plus,
    RefreshCw,
} from 'lucide-react';
import { useEffect, useState } from 'react';

type ProductionPortalApiResult = { ok?: number; print_url?: string };

type OrderDetail = {
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
        plan_packaging?: number | null;
        pallet_plans?: number | null;
    } | null;
    offer?: {
        uuid: string;
        offer_number: string;
    } | null;
    las_work_line?: {
        uuid: string;
        code: string;
        name: string;
    } | null;
    pallet_type?: {
        uuid: string;
        cod: string;
        description: string;
    } | null;
    customer?: {
        uuid: string;
        company_name: string;
    } | null;
    division?: {
        uuid: string;
        name: string;
    } | null;
    shipping_address?: {
        uuid: string;
        street: string;
        city: string;
        postal_code: string;
    } | null;
};

type Employee = {
    uuid: string;
    name: string;
    surname: string;
    matriculation_number: string;
    token: string;
};

type OrderDetailProps = {
    order: OrderDetail;
    employee: Employee;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function ProductionPortalOrderDetail({
    order,
    employee,
    flash,
}: OrderDetailProps) {
    const [manualQuantity, setManualQuantity] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [actionMessage, setActionMessage] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    // Store token globally for API calls (in effect to satisfy immutability rule)
    useEffect(() => {
        if (typeof window !== 'undefined' && employee.token) {
            window.__PRODUCTION_PORTAL_TOKEN__ = employee.token;
        }
    }, [employee.token]);

    const getProgressPercentage = (): number => {
        if (order.quantity === 0) return 0;
        return Math.round((order.worked_quantity / order.quantity) * 100);
    };

    const handleAddPallet = async () => {
        setIsProcessing(true);
        setActionMessage(null);

        try {
            const result = (await addPalletQuantity(
                order.uuid,
                employee.token,
            )) as ProductionPortalApiResult;
            if (result.ok === 1) {
                setActionMessage({
                    type: 'success',
                    message: 'Quantità di pallet aggiunta correttamente',
                });
                if (result.print_url) {
                    // Open print URL in new window
                    window.open(result.print_url, '_blank');
                }
                // Refresh page after 1 second
                setTimeout(() => {
                    router.reload();
                }, 1000);
            }
        } catch (error: unknown) {
            setActionMessage({
                type: 'error',
                message:
                    error instanceof Error
                        ? error.message
                        : "Errore nell'aggiungere la quantità di pallet",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAddManual = async () => {
        const quantity = parseFloat(manualQuantity);
        if (isNaN(quantity) || quantity <= 0) {
            setActionMessage({
                type: 'error',
                message: 'Inserisci una quantità valida',
            });
            return;
        }

        setIsProcessing(true);
        setActionMessage(null);

        try {
            const result = (await addManualQuantity(
                order.uuid,
                quantity,
                employee.token,
            )) as ProductionPortalApiResult;
            if (result.ok === 1) {
                setActionMessage({
                    type: 'success',
                    message: `Quantità manuale di ${quantity} aggiunta correttamente`,
                });
                setManualQuantity('');
                if (result.print_url) {
                    window.open(result.print_url, '_blank');
                }
                setTimeout(() => {
                    router.reload();
                }, 1000);
            }
        } catch (error: unknown) {
            setActionMessage({
                type: 'error',
                message:
                    error instanceof Error
                        ? error.message
                        : "Errore nell'aggiungere quantità manuale",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSuspend = async () => {
        setIsProcessing(true);
        setActionMessage(null);

        try {
            const result = (await suspendOrder(
                order.uuid,
                employee.token,
            )) as ProductionPortalApiResult;
            if (result.ok === 1) {
                setActionMessage({
                    type: 'success',
                    message: 'Ordine sospeso correttamente',
                });
                setTimeout(() => {
                    router.visit(productionPortal.dashboard.url());
                }, 1500);
            }
        } catch (error: unknown) {
            setActionMessage({
                type: 'error',
                message:
                    error instanceof Error
                        ? error.message
                        : "Errore nella sospensione dell'ordine",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmAutocontrollo = async () => {
        setIsProcessing(true);
        setActionMessage(null);

        try {
            const result = (await confirmAutocontrollo(
                order.uuid,
                employee.token,
            )) as ProductionPortalApiResult;
            if (result.ok === 1) {
                setActionMessage({
                    type: 'success',
                    message: 'Autocontrollo confermato correttamente',
                });
                setTimeout(() => {
                    router.reload();
                }, 1000);
            }
        } catch (error: unknown) {
            setActionMessage({
                type: 'error',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Errore nella conferma autocontrollo',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRefresh = () => {
        router.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <Head
                title={`Ordine ${order.order_production_number} - Portale di Produzione`}
            />

            {/* Header */}
            <header className="border-b bg-white/50 backdrop-blur dark:bg-slate-900/50">
                <div className="container mx-auto flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link href={productionPortal.dashboard.url()}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Indietro
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">
                                Ordine {order.order_production_number}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {employee.name} {employee.surname}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isProcessing}
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Aggiorna
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                router.post(productionPortal.logout.url())
                            }
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Esci
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                {/* Messages */}
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
                {actionMessage && (
                    <div
                        className={`mb-4 rounded-md border px-4 py-3 text-sm ${
                            actionMessage.type === 'success'
                                ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'
                                : 'border-red-500/40 bg-red-500/5 text-red-700 dark:text-red-300'
                        }`}
                    >
                        {actionMessage.message}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column - Order Info */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Order Status Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Informazioni ordine</CardTitle>
                                    <Badge
                                        className={
                                            order.status === 2
                                                ? 'border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300'
                                                : order.status === 3
                                                  ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300'
                                                  : 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300'
                                        }
                                    >
                                        {order.status_label}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Numero ordine
                                        </Label>
                                        <p className="font-semibold">
                                            {order.order_production_number}
                                        </p>
                                    </div>
                                    {order.number_customer_reference_order && (
                                        <div>
                                            <Label className="text-xs text-muted-foreground">
                                                Riferimento cliente
                                            </Label>
                                            <p className="font-semibold">
                                                {
                                                    order.number_customer_reference_order
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {order.article && (
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Articolo
                                        </Label>
                                        <p className="font-semibold">
                                            {order.article.cod_article_las}
                                        </p>
                                        {order.article.article_descr && (
                                            <p className="text-sm text-muted-foreground">
                                                {order.article.article_descr}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {order.customer && (
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Cliente
                                        </Label>
                                        <p className="font-semibold">
                                            {order.customer.company_name}
                                        </p>
                                        {order.division && (
                                            <p className="text-sm text-muted-foreground">
                                                {order.division.name}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {order.shipping_address && (
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Indirizzo di consegna
                                        </Label>
                                        <p className="font-semibold">
                                            {order.shipping_address.street}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.shipping_address.city} -{' '}
                                            {order.shipping_address.postal_code}
                                        </p>
                                    </div>
                                )}

                                {order.las_work_line && (
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Linea di lavoro LAS
                                        </Label>
                                        <p className="font-semibold">
                                            {order.las_work_line.code} -{' '}
                                            {order.las_work_line.name}
                                        </p>
                                    </div>
                                )}

                                {order.pallet_type && (
                                    <div>
                                        <Label className="text-xs text-muted-foreground">
                                            Tipo pallet
                                        </Label>
                                        <p className="font-semibold">
                                            {order.pallet_type.cod} -{' '}
                                            {order.pallet_type.description}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Progress Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Progresso di produzione</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Quantità totale
                                        </span>
                                        <span className="font-semibold">
                                            {order.quantity}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Quantità Processata
                                        </span>
                                        <span className="font-semibold text-primary">
                                            {order.worked_quantity}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Quantità Rimanente
                                        </span>
                                        <span className="font-semibold">
                                            {order.remain_quantity}
                                        </span>
                                    </div>
                                    <div className="h-4 w-full rounded-full bg-muted">
                                        <div
                                            className="flex h-4 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white transition-all"
                                            style={{
                                                width: `${getProgressPercentage()}%`,
                                            }}
                                        >
                                            {getProgressPercentage()}%
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="space-y-6">
                        {/* Aggiungi pallet */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Aggiungi pallet completo
                                </CardTitle>
                                <CardDescription>
                                    Aggiungi la quantità necessaria per
                                    completare un pallet
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    className="w-full"
                                    onClick={handleAddPallet}
                                    disabled={
                                        isProcessing || order.status === 4
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    {isProcessing
                                        ? 'Elaborazione...'
                                        : 'Aggiungi pallet'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Aggiungi quantità manuale */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calculator className="h-5 w-5" />
                                    Aggiungi quantità manuale
                                </CardTitle>
                                <CardDescription>
                                    Inserisci una quantità specifica da
                                    elaborare
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="manual_quantity">
                                        Quantità
                                    </Label>
                                    <Input
                                        id="manual_quantity"
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={manualQuantity}
                                        onChange={(e) =>
                                            setManualQuantity(e.target.value)
                                        }
                                        placeholder="0.00"
                                        disabled={
                                            isProcessing || order.status === 4
                                        }
                                    />
                                </div>
                                <Button
                                    className="w-full"
                                    onClick={handleAddManual}
                                    disabled={
                                        isProcessing ||
                                        !manualQuantity ||
                                        order.status === 4
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    {isProcessing
                                        ? 'Elaborazione...'
                                        : 'Aggiungi quantità'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Autocontrollo */}
                        {order.autocontrollo === 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5" />
                                        Conferma autocontrollo
                                    </CardTitle>
                                    <CardDescription>
                                        Conferma che l'autocontrollo è stato
                                        superato
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={handleConfirmAutocontrollo}
                                        disabled={isProcessing}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        {isProcessing
                                            ? 'Elaborazione...'
                                            : 'Conferma Autocontrollo'}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Suspend Order */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="h-5 w-5" />
                                    Sospendi Ordine
                                </CardTitle>
                                <CardDescription>
                                    Sospende l'ordine per autocontrollo non
                                    superato
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            disabled={
                                                isProcessing ||
                                                order.status === 4
                                            }
                                        >
                                            <AlertTriangle className="mr-2 h-4 w-4" />
                                            Sospendi ordine
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Confermare sospensione?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Questa azione sospenderà
                                                l'ordine{' '}
                                                {order.order_production_number}{' '}
                                                per "Autocontrollo Non
                                                Superato". Questa azione non può
                                                essere annullata facilmente.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel
                                                disabled={isProcessing}
                                            >
                                                Annulla
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleSuspend}
                                                disabled={isProcessing}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                {isProcessing
                                                    ? 'Elaborazione...'
                                                    : 'Conferma sospensione'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

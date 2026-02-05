import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    getOrderStatusColor,
    getOrderStatusLabel,
} from '@/constants/orderStatus';
import AppLayout from '@/layouts/app-layout';
import orders from '@/routes/orders/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';

type Order = {
    uuid: string;
    id: number;
    order_production_number: string;
    status: number;
    quantity?: number | null;
    worked_quantity?: number | null;
    motivazione?: string | null;
    article?: {
        cod_article_las: string;
        article_descr?: string | null;
    } | null;
};

type StatusSemaforo = {
    etichette: number;
    packaging: number;
    prodotto: number;
};

type StatusOption = {
    value: number;
    label: string;
};

type OrdersManageStatusProps = {
    order: Order;
    statusSemaforo: StatusSemaforo;
    statusOptions: StatusOption[];
};

const SEMAFORO_OPTIONS = [
    { value: 0, label: 'Rosso' },
    { value: 1, label: 'Giallo' },
    { value: 2, label: 'Verde' },
];

export default function OrdersManageStatus({
    order,
    statusSemaforo: initialStatusSemaforo,
    statusOptions,
}: OrdersManageStatusProps) {
    const [statusSemaforo, setStatusSemaforo] = useState<StatusSemaforo>(
        initialStatusSemaforo,
    );
    const [newStatus, setNewStatus] = useState<number | null>(null);
    const [motivazione, setMotivazione] = useState<string>('');
    const [isSavingSemaforo, setIsSavingSemaforo] = useState(false);
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showLanciatoPrompt, setShowLanciatoPrompt] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Ordini',
            href: orders.index().url,
        },
        {
            title: order.order_production_number,
            href: orders.show({ order: order.uuid }).url,
        },
        {
            title: 'Gestisci Stato',
            href: `/orders/${order.uuid}/manage-status`,
        },
    ];

    const handleSemaforoChange = (
        field: keyof StatusSemaforo,
        value: number,
    ) => {
        setStatusSemaforo((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveSemaforo = async () => {
        setIsSavingSemaforo(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(
                `/orders/${order.uuid}/save-semaforo`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify(statusSemaforo),
                },
            );

            const data = await response.json();

            if (data.success) {
                setSuccess('Semaforo salvato con successo.');
                if (data.all_green && data.can_change_to_lanciato) {
                    setShowLanciatoPrompt(true);
                }
            } else {
                setError(
                    data.message || 'Errore nel salvataggio del semaforo.',
                );
            }
        } catch {
            setError('Errore di connessione. Riprova.');
        } finally {
            setIsSavingSemaforo(false);
        }
    };

    const handleChangeStatus = async () => {
        if (newStatus === null) {
            setError('Seleziona un nuovo stato.');
            return;
        }

        // Validate SOSPESO requires motivazione
        if (newStatus === 4 && !motivazione.trim()) {
            setError('La motivazione è obbligatoria per sospendere un ordine.');
            return;
        }

        setIsChangingStatus(true);
        setError(null);
        setSuccess(null);

        try {
            const payload: {
                status: number;
                motivazione?: string;
                force?: boolean;
            } = { status: newStatus };
            if (newStatus === 4) {
                payload.motivazione = motivazione;
            }
            if (newStatus === 3) {
                payload.force = true;
            }

            const response = await fetch(
                `/orders/${order.uuid}/change-status`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify(payload),
                },
            );

            const data = await response.json();

            if (data.success) {
                setSuccess('Stato ordine aggiornato con successo.');
                setTimeout(() => {
                    router.visit(orders.show({ order: order.uuid }).url);
                }, 1500);
            } else {
                setError(
                    data.message || "Errore nell'aggiornamento dello stato.",
                );
            }
        } catch {
            setError('Errore di connessione. Riprova.');
        } finally {
            setIsChangingStatus(false);
        }
    };

    const handleChangeToLanciato = () => {
        setShowLanciatoPrompt(false);
        setNewStatus(2);
        // handleChangeStatus will be called automatically when newStatus changes
        // But we need to trigger it manually
        setTimeout(() => {
            handleChangeStatus();
        }, 100);
    };

    const allGreen =
        statusSemaforo.etichette === 2 &&
        statusSemaforo.packaging === 2 &&
        statusSemaforo.prodotto === 2;

    // Get available status transitions based on current status
    const getAvailableStatuses = (): StatusOption[] => {
        const currentStatus = order.status;

        // Can always change to SOSPESO
        const availableStatuses = statusOptions.filter(
            (opt) => opt.value === 4,
        );

        // Add other valid transitions
        if (currentStatus === 0) {
            // PIANIFICATO
            availableStatuses.push(
                ...statusOptions.filter((opt) => opt.value === 1),
            );
        } else if (currentStatus === 1) {
            // IN_ALLESTIMENTO
            if (allGreen) {
                availableStatuses.push(
                    ...statusOptions.filter((opt) => opt.value === 2),
                );
            }
        } else if (currentStatus === 2) {
            // LANCIATO
            availableStatuses.push(
                ...statusOptions.filter((opt) => opt.value === 3),
            );
        } else if (currentStatus === 3) {
            // IN_AVANZAMENTO
            availableStatuses.push(
                ...statusOptions.filter((opt) => opt.value === 5),
            );
        } else if (currentStatus === 4) {
            // SOSPESO - can go back to previous status
            availableStatuses.push(
                ...statusOptions.filter(
                    (opt) => opt.value !== 4 && opt.value !== 6,
                ),
            );
        } else if (currentStatus === 5) {
            // EVASO
            availableStatuses.push(
                ...statusOptions.filter((opt) => opt.value === 6),
            );
        }

        return availableStatuses;
    };

    const availableStatuses = getAvailableStatuses();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Gestisci Stato - ${order.order_production_number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Gestisci Stato Ordine
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Ordine:{' '}
                            <span className="font-medium">
                                {order.order_production_number}
                            </span>
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href={orders.show({ order: order.uuid }).url}>
                            Torna ai Dettagli
                        </Link>
                    </Button>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="border-green-500 bg-green-50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            {success}
                        </AlertDescription>
                    </Alert>
                )}

                {showLanciatoPrompt && (
                    <Alert className="border-blue-500 bg-blue-50">
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                            Tutti i semafori sono verdi. Vuoi cambiare lo stato
                            dell'ordine in "Lanciato"?
                            <div className="mt-2 flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleChangeToLanciato}
                                >
                                    Sì, cambia a Lanciato
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setShowLanciatoPrompt(false)}
                                >
                                    No, mantieni stato attuale
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informazioni Ordine</CardTitle>
                            <CardDescription>
                                Dettagli dell'ordine
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Numero di Produzione
                                </Label>
                                <p className="text-lg font-semibold">
                                    {order.order_production_number}
                                </p>
                            </div>
                            {order.article && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Articolo
                                    </Label>
                                    <p>{order.article.cod_article_las}</p>
                                    {order.article.article_descr && (
                                        <p className="text-sm text-muted-foreground">
                                            {order.article.article_descr}
                                        </p>
                                    )}
                                </div>
                            )}
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Stato Attuale
                                </Label>
                                <span
                                    className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getOrderStatusColor(order.status)}`}
                                >
                                    {getOrderStatusLabel(order.status)}
                                </span>
                            </div>
                            {order.quantity && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Quantità
                                    </Label>
                                    <p>{order.quantity}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Semaforo</CardTitle>
                            <CardDescription>
                                Stato dei controlli di qualità
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="etichette">Etichette</Label>
                                <Select
                                    value={statusSemaforo.etichette.toString()}
                                    onValueChange={(value) =>
                                        handleSemaforoChange(
                                            'etichette',
                                            parseInt(value),
                                        )
                                    }
                                >
                                    <SelectTrigger id="etichette">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SEMAFORO_OPTIONS.map((opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value.toString()}
                                            >
                                                <span
                                                    className={`inline-flex items-center gap-2`}
                                                >
                                                    {opt.value === 0 && (
                                                        <XCircle className="h-4 w-4 text-red-600" />
                                                    )}
                                                    {opt.value === 1 && (
                                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                                    )}
                                                    {opt.value === 2 && (
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    )}
                                                    {opt.label}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="packaging">Packaging</Label>
                                <Select
                                    value={statusSemaforo.packaging.toString()}
                                    onValueChange={(value) =>
                                        handleSemaforoChange(
                                            'packaging',
                                            parseInt(value),
                                        )
                                    }
                                >
                                    <SelectTrigger id="packaging">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SEMAFORO_OPTIONS.map((opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value.toString()}
                                            >
                                                <span
                                                    className={`inline-flex items-center gap-2`}
                                                >
                                                    {opt.value === 0 && (
                                                        <XCircle className="h-4 w-4 text-red-600" />
                                                    )}
                                                    {opt.value === 1 && (
                                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                                    )}
                                                    {opt.value === 2 && (
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    )}
                                                    {opt.label}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="prodotto">Prodotto</Label>
                                <Select
                                    value={statusSemaforo.prodotto.toString()}
                                    onValueChange={(value) =>
                                        handleSemaforoChange(
                                            'prodotto',
                                            parseInt(value),
                                        )
                                    }
                                >
                                    <SelectTrigger id="prodotto">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SEMAFORO_OPTIONS.map((opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value.toString()}
                                            >
                                                <span
                                                    className={`inline-flex items-center gap-2`}
                                                >
                                                    {opt.value === 0 && (
                                                        <XCircle className="h-4 w-4 text-red-600" />
                                                    )}
                                                    {opt.value === 1 && (
                                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                                    )}
                                                    {opt.value === 2 && (
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    )}
                                                    {opt.label}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {allGreen && (
                                <Alert className="border-green-500 bg-green-50">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        Tutti i semafori sono verdi. Puoi
                                        cambiare lo stato a "Lanciato".
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Button
                                onClick={handleSaveSemaforo}
                                disabled={isSavingSemaforo}
                                className="w-full"
                            >
                                {isSavingSemaforo ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    'Salva Semaforo'
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Cambia Stato Ordine</CardTitle>
                            <CardDescription>
                                Seleziona il nuovo stato per questo ordine
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="new-status">Nuovo Stato</Label>
                                <Select
                                    value={newStatus?.toString() || ''}
                                    onValueChange={(value) => {
                                        setNewStatus(parseInt(value));
                                        setMotivazione('');
                                    }}
                                >
                                    <SelectTrigger id="new-status">
                                        <SelectValue placeholder="Seleziona un nuovo stato" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableStatuses.map((opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value.toString()}
                                            >
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {newStatus === 4 && (
                                <div>
                                    <Label htmlFor="motivazione">
                                        Motivazione *
                                    </Label>
                                    <Textarea
                                        id="motivazione"
                                        value={motivazione}
                                        onChange={(e) =>
                                            setMotivazione(e.target.value)
                                        }
                                        placeholder="Inserisci la motivazione per la sospensione..."
                                        rows={3}
                                    />
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        La motivazione è obbligatoria per
                                        sospendere un ordine.
                                    </p>
                                </div>
                            )}

                            <Button
                                onClick={handleChangeStatus}
                                disabled={
                                    isChangingStatus ||
                                    newStatus === null ||
                                    (newStatus === 4 && !motivazione.trim())
                                }
                                className="w-full"
                            >
                                {isChangingStatus ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Aggiornamento...
                                    </>
                                ) : (
                                    'Cambia Stato'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

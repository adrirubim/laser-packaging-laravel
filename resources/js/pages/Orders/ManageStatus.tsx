import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { Head, router } from '@inertiajs/react';
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
    type ConfirmActionType =
        | 'back'
        | 'allestimento'
        | 'sospendi'
        | 'evaso'
        | 'riprendi'
        | 'forza-avanzamento';
    const [confirmAction, setConfirmAction] =
        useState<ConfirmActionType | null>(null);

    const handleBackToDetails = () => {
        // Replica del comportamento legacy: conferma generica alla chiusura
        setConfirmAction('back');
    };

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
                setSuccess('Impostazioni del semaforo salvate con successo.');
                if (data.all_green && data.can_change_to_lanciato) {
                    setShowLanciatoPrompt(true);
                }
            } else {
                setError(
                    data.message ||
                        'Si è verificato un errore nel salvataggio del semaforo.',
                );
            }
        } catch {
            setError(
                'Errore di connessione durante il salvataggio del semaforo. Riprova.',
            );
        } finally {
            setIsSavingSemaforo(false);
        }
    };

    const performChangeStatus = async (payload: {
        status: number;
        motivazione?: string;
        force?: boolean;
    }) => {
        setIsChangingStatus(true);
        setError(null);
        setSuccess(null);

        try {
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
                setSuccess("Stato dell'ordine aggiornato con successo.");
                setTimeout(() => {
                    router.visit(orders.show({ order: order.uuid }).url);
                }, 1500);
            } else {
                setError(
                    data.message ||
                        "Si è verificato un errore nell'aggiornamento dello stato dell'ordine.",
                );
            }
        } catch {
            setError(
                "Errore di connessione durante l'aggiornamento dello stato. Riprova.",
            );
        } finally {
            setIsChangingStatus(false);
        }
    };

    const handleChangeStatus = async () => {
        if (newStatus === null) {
            setError('Seleziona un nuovo stato per procedere.');
            return;
        }

        // Validate SOSPESO requires motivazione
        if (newStatus === 4 && !motivazione.trim()) {
            setError("La motivazione è obbligatoria per sospendere l'ordine.");
            return;
        }

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

        await performChangeStatus(payload);
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

    const handleChangeToAllestimento = () => {
        setConfirmAction('allestimento');
    };

    const handleSuspendFromAvanzamento = () => {
        if (order.status !== 3) return;

        setConfirmAction('sospendi');
    };

    const handleChangeToEvasoFromAvanzamento = () => {
        if (order.status !== 3) return;

        setConfirmAction('evaso');
    };

    const handleResumeFromSospeso = () => {
        if (order.status !== 4) return;

        setConfirmAction('riprendi');
    };

    const getConfirmConfig = (action: ConfirmActionType) => {
        switch (action) {
            case 'back':
                return {
                    title: 'Tornare ai dettagli?',
                    description:
                        "Vuoi tornare alla pagina di dettaglio dell'ordine? Le modifiche di stato già salvate resteranno applicate.",
                    confirmLabel: 'Torna ai dettagli',
                };
            case 'allestimento':
                return {
                    title: 'Passa in Allestimento',
                    description:
                        "Vuoi cambiare lo stato dell'ordine in Allestimento?",
                    confirmLabel: 'Sì, passa in Allestimento',
                };
            case 'sospendi':
                return {
                    title: 'Sospendi ordine',
                    description:
                        "L'ordine verrà spostato in stato Sospeso. Specifica una motivazione per ricordare il motivo della pausa.",
                    confirmLabel: 'Sospendi ordine',
                };
            case 'evaso':
                return {
                    title: 'Passa in Evaso',
                    description: "Vuoi cambiare lo stato dell'ordine in Evaso?",
                    confirmLabel: 'Sì, passa in Evaso',
                };
            case 'riprendi':
                return {
                    title: 'Riprendi ordine',
                    description:
                        "Vuoi riprendere l'ordine e riportarlo in Avanzamento?",
                    confirmLabel: 'Riprendi ordine',
                };
            case 'forza-avanzamento':
                return {
                    title: 'Forza passaggio in Avanzamento',
                    description:
                        "Sei sicuro di voler forzare lo stato dell'ordine in Avanzamento?",
                    confirmLabel: 'Forza in Avanzamento',
                };
        }
    };

    const handleConfirmAction = async () => {
        if (!confirmAction) return;

        switch (confirmAction) {
            case 'back':
                setConfirmAction(null);
                router.visit(orders.show({ order: order.uuid }).url);
                return;
            case 'allestimento':
                setConfirmAction(null);
                void performChangeStatus({ status: 1 });
                return;
            case 'sospendi': {
                const trimmed = motivazione.trim();
                if (!trimmed) {
                    setError(
                        "La motivazione è obbligatoria per sospendere l'ordine.",
                    );
                    return;
                }
                setConfirmAction(null);
                void performChangeStatus({
                    status: 4,
                    motivazione: trimmed,
                });
                return;
            }
            case 'evaso':
                setConfirmAction(null);
                void performChangeStatus({ status: 5 });
                return;
            case 'riprendi':
                setConfirmAction(null);
                void performChangeStatus({ status: 3 });
                return;
            case 'forza-avanzamento':
                setConfirmAction(null);
                void performChangeStatus({ status: 3, force: true });
                return;
        }
    };

    const allGreen =
        statusSemaforo.etichette === 2 &&
        statusSemaforo.packaging === 2 &&
        statusSemaforo.prodotto === 2;

    // En legacy el botón "Passa In Lanciato" se muestra cuando
    // todos los semáforos son > 0 (amarillo o verde). El prompt
    // automático sólo aparece cuando los tres están en verde.
    const allPositive =
        statusSemaforo.etichette > 0 &&
        statusSemaforo.packaging > 0 &&
        statusSemaforo.prodotto > 0;

    // Get available status transitions based on current status
    const getAvailableStatuses = (): StatusOption[] => {
        const currentStatus = order.status;

        // Se l'ordine è già SALDATO (6), non ci sono transizioni possibili
        if (currentStatus === 6) {
            return [];
        }

        const availableStatuses: StatusOption[] = [];

        // Può andare in SOSPESO solo da stato 3 (IN_AVANZAMENTO), come nel dialogo legacy
        if (currentStatus === 3) {
            availableStatuses.push(
                ...statusOptions.filter((opt) => opt.value === 4),
            );
        }

        // Add other valid transitions
        if (currentStatus === 0) {
            // PIANIFICATO
            availableStatuses.push(
                ...statusOptions.filter((opt) => opt.value === 1),
            );
        } else if (currentStatus === 1) {
            // IN_ALLESTIMENTO:
            // - Il legacy mostra il bottone "Passa In Lanciato" quando tutti
            //   i semafori sono > 0 (almeno giallo).
            // - Se tutti e 3 sono verdi, oltre al bottone compare anche il prompt
            //   automatico di conferma.
            if (allPositive) {
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
            // SOSPESO - può solo riprendere tornando in AVANZAMENTO (3)
            availableStatuses.push(
                ...statusOptions.filter((opt) => opt.value === 3),
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
                    <Button variant="outline" onClick={handleBackToDetails}>
                        Torna ai Dettagli
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

                {confirmAction && (
                    <AlertDialog
                        open={!!confirmAction}
                        onOpenChange={(open) => {
                            if (!open) setConfirmAction(null);
                        }}
                    >
                        <AlertDialogContent>
                            {(() => {
                                const { title, description, confirmLabel } =
                                    getConfirmConfig(confirmAction);
                                return (
                                    <>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                {title}
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                {description}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        {confirmAction === 'sospendi' && (
                                            <div className="mt-4 space-y-2">
                                                <Label htmlFor="motivazione-modal">
                                                    Motivazione sospensione
                                                </Label>
                                                <Textarea
                                                    id="motivazione-modal"
                                                    value={motivazione}
                                                    onChange={(e) =>
                                                        setMotivazione(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Indica brevemente il motivo della sospensione (es. attesa materiali, problema qualità, richiesta cliente...)"
                                                    rows={3}
                                                />
                                            </div>
                                        )}
                                        <AlertDialogFooter className="mt-6">
                                            <AlertDialogCancel>
                                                Annulla
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => {
                                                    void handleConfirmAction();
                                                }}
                                            >
                                                {confirmLabel}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </>
                                );
                            })()}
                        </AlertDialogContent>
                    </AlertDialog>
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
                            {order.worked_quantity != null && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Quantità Lavorata
                                    </Label>
                                    <p>{order.worked_quantity}</p>
                                </div>
                            )}
                            {order.status === 4 && order.motivazione && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Motivazione sospensione
                                    </Label>
                                    <p>{order.motivazione}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {order.status === 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Semaforo materiali e controlli
                                </CardTitle>
                                <CardDescription>
                                    Indica se etichette, packaging e prodotto
                                    sono pronti prima di lanciare l'ordine.
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

                                <div className="rounded-md border bg-muted/40 p-3 text-xs">
                                    {allGreen ? (
                                        <span className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Semaforo: tutto pronto, puoi
                                            lanciare l'ordine.
                                        </span>
                                    ) : allPositive ? (
                                        <span className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-300">
                                            <AlertCircle className="h-4 w-4" />
                                            Semaforo: pronto al lancio, ma con
                                            controlli ancora da completare.
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 text-red-700 dark:text-red-300">
                                            <XCircle className="h-4 w-4" />
                                            Semaforo: NON pronto al lancio.
                                            Imposta almeno giallo tutte le voci.
                                        </span>
                                    )}
                                </div>

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
                                <p className="text-xs text-muted-foreground">
                                    Salvare il semaforo non cambia lo stato
                                    dell'ordine: il passaggio in \"Lanciato\"
                                    avviene dal riquadro \"Cambia Stato
                                    Ordine\".
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <Card
                        className={
                            order.status === 6
                                ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                                : order.status === 1
                                  ? 'md:col-span-2'
                                  : ''
                        }
                    >
                        {order.status !== 6 && (
                            <CardHeader>
                                <CardTitle>Cambia Stato Ordine</CardTitle>
                                <CardDescription>
                                    {order.status === 0
                                        ? "L'ordine è pianificato. Quando sei pronto a preparare materiali ed etichette, passalo in Allestimento."
                                        : order.status === 1
                                          ? 'Quando il semaforo è almeno giallo su tutte le voci puoi passare l\'ordine in "Lanciato". Se è tutto verde ti consigliamo di farlo subito.'
                                          : order.status === 2
                                            ? "L'ordine è in stato Lanciato. Passerà in Avanzamento automaticamente alla prima quantità registrata dal portale. Se vuoi avviare la produzione subito senza attendere, usa il pulsante qui sotto."
                                            : order.status === 3
                                              ? "L'ordine è in Avanzamento (in produzione). Puoi sospenderlo temporaneamente indicando il motivo, oppure segnarlo come Evaso quando la lavorazione è completata."
                                              : order.status === 4
                                                ? "L'ordine è sospeso. Quando il problema è risolto puoi riprenderlo tornando in Avanzamento."
                                                : order.status === 5
                                                  ? "L'ordine è evaso. Quando la parte amministrativa è completata, passalo in Saldato."
                                                  : 'Seleziona il nuovo stato per questo ordine.'}
                                </CardDescription>
                            </CardHeader>
                        )}
                        <CardContent className="space-y-4">
                            {order.status === 6 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <CheckCircle2 className="mb-4 h-16 w-16 text-emerald-600 dark:text-emerald-500" />
                                    <h3 className="text-xl font-semibold text-foreground">
                                        L'ordine è stato Saldato.
                                    </h3>
                                    <p className="mt-2 text-sm break-words text-muted-foreground">
                                        Non sono possibili ulteriori modifiche
                                        di stato. L'ordine è chiuso
                                        definitivamente.
                                    </p>
                                </div>
                            ) : order.status === 0 ? (
                                <div className="space-y-2">
                                    <Button
                                        onClick={handleChangeToAllestimento}
                                        disabled={isChangingStatus}
                                        className="w-full"
                                    >
                                        {isChangingStatus ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Aggiornamento...
                                            </>
                                        ) : (
                                            'Passa In Allestimento'
                                        )}
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        Questo passaggio prepara l&apos;ordine
                                        per la produzione (materiali ed
                                        etichette). Non è pensato per tornare
                                        indietro frequentemente.
                                    </p>
                                </div>
                            ) : order.status === 2 ? (
                                <div className="space-y-2">
                                    <Button
                                        onClick={() =>
                                            setConfirmAction(
                                                'forza-avanzamento',
                                            )
                                        }
                                        disabled={isChangingStatus}
                                        className="w-full"
                                    >
                                        {isChangingStatus ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Aggiornamento...
                                            </>
                                        ) : (
                                            'Forza In Avanzamento'
                                        )}
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        Porta l&apos;ordine in Avanzamento senza
                                        attendere la prima quantità dal portale.
                                        Utile se la produzione è già iniziata o
                                        per correzioni manuali.
                                    </p>
                                </div>
                            ) : order.status === 3 ? (
                                <div className="space-y-3">
                                    <div className="flex flex-col gap-3 md:flex-row">
                                        <Button
                                            variant="destructive"
                                            onClick={
                                                handleSuspendFromAvanzamento
                                            }
                                            disabled={isChangingStatus}
                                            className="w-full md:w-1/2"
                                        >
                                            {isChangingStatus ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Aggiornamento...
                                                </>
                                            ) : (
                                                'Sospendi'
                                            )}
                                        </Button>
                                        <Button
                                            onClick={
                                                handleChangeToEvasoFromAvanzamento
                                            }
                                            disabled={isChangingStatus}
                                            className="w-full md:w-1/2"
                                        >
                                            {isChangingStatus ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Aggiornamento...
                                                </>
                                            ) : (
                                                'Passa In Evaso'
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        <strong>Sospendi:</strong> mette in
                                        pausa l&apos;ordine (obbligatorio
                                        indicare il motivo).{' '}
                                        <strong>Passa In Evaso:</strong> segna
                                        la lavorazione come completata; potrai
                                        poi chiuderlo in Saldato.
                                    </p>
                                </div>
                            ) : order.status === 4 ? (
                                <div className="space-y-2">
                                    <Button
                                        onClick={handleResumeFromSospeso}
                                        disabled={isChangingStatus}
                                        className="w-full"
                                    >
                                        {isChangingStatus ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Aggiornamento...
                                            </>
                                        ) : (
                                            'Riprendi (Ritorna In Avanzamento)'
                                        )}
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        Riporta l&apos;ordine dal ramo Sospeso
                                        alla produzione attiva (stato
                                        Avanzamento). Usa questa azione quando
                                        il motivo della sospensione è stato
                                        risolto.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {order.status !== 6 && (
                                        <div className="space-y-1">
                                            <Label htmlFor="new-status">
                                                Nuovo Stato
                                            </Label>
                                            <Select
                                                value={
                                                    newStatus?.toString() || ''
                                                }
                                                onValueChange={(value) => {
                                                    setNewStatus(
                                                        parseInt(value),
                                                    );
                                                    setMotivazione('');
                                                }}
                                            >
                                                <SelectTrigger id="new-status">
                                                    <SelectValue placeholder="Seleziona un nuovo stato" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableStatuses.map(
                                                        (opt) => (
                                                            <SelectItem
                                                                key={opt.value}
                                                                value={opt.value.toString()}
                                                            >
                                                                {opt.label}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {order.status === 5 && (
                                                <p className="text-xs text-muted-foreground">
                                                    Da Evaso puoi solo
                                                    completare l&apos;ordine
                                                    portandolo in Saldato, dopo
                                                    aver chiuso la parte
                                                    amministrativa.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {order.status !== 6 && newStatus === 4 && (
                                        <div>
                                            <Label htmlFor="motivazione">
                                                Motivazione *
                                            </Label>
                                            <Textarea
                                                id="motivazione"
                                                value={motivazione}
                                                onChange={(e) =>
                                                    setMotivazione(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Inserisci la motivazione per la sospensione..."
                                                rows={3}
                                            />
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                La motivazione è obbligatoria
                                                per sospendere un ordine.
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleChangeStatus}
                                        disabled={
                                            order.status === 6 ||
                                            isChangingStatus ||
                                            newStatus === null ||
                                            (newStatus === 4 &&
                                                !motivazione.trim())
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
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

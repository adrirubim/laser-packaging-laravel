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
    getOrderStatusLabelKey,
} from '@/constants/orderStatus';
import { useTranslations } from '@/hooks/use-translations';
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

const SEMAFORO_OPTIONS_KEYS = [
    { value: 0, key: 'orders.manage_status.semaforo_red' },
    { value: 1, key: 'orders.manage_status.semaforo_yellow' },
    { value: 2, key: 'orders.manage_status.semaforo_green' },
];

export default function OrdersManageStatus({
    order,
    statusSemaforo: initialStatusSemaforo,
    statusOptions,
}: OrdersManageStatusProps) {
    const { t } = useTranslations();
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
            title: t('nav.orders'),
            href: orders.index().url,
        },
        {
            title: order.order_production_number,
            href: orders.show({ order: order.uuid }).url,
        },
        {
            title: t('orders.manage_status'),
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
                setSuccess(t('orders.manage_status.toasts.semaforo_saved'));
                if (data.all_green && data.can_change_to_lanciato) {
                    setShowLanciatoPrompt(true);
                }
            } else {
                setError(
                    data.message ||
                        t('orders.manage_status.toasts.semaforo_error'),
                );
            }
        } catch {
            setError(
                t('orders.manage_status.toasts.semaforo_connection_error'),
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
                setSuccess(t('orders.manage_status.toasts.status_updated'));
                setTimeout(() => {
                    router.visit(orders.show({ order: order.uuid }).url);
                }, 1500);
            } else {
                setError(
                    data.message ||
                        t('orders.manage_status.toasts.status_error'),
                );
            }
        } catch {
            setError(t('orders.manage_status.toasts.status_connection_error'));
        } finally {
            setIsChangingStatus(false);
        }
    };

    const handleChangeStatus = async () => {
        if (newStatus === null) {
            setError(t('orders.manage_status.errors.select_status'));
            return;
        }

        // Validate SOSPESO requires motivazione
        if (newStatus === 4 && !motivazione.trim()) {
            setError(t('orders.manage_status.errors.motivazione_required'));
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
                    title: t('orders.manage_status.dialogs.back_title'),
                    description: t('orders.manage_status.dialogs.back_desc'),
                    confirmLabel: t(
                        'orders.manage_status.dialogs.back_confirm',
                    ),
                };
            case 'allestimento':
                return {
                    title: t('orders.manage_status.dialogs.allestimento_title'),
                    description: t(
                        'orders.manage_status.dialogs.allestimento_desc',
                    ),
                    confirmLabel: t(
                        'orders.manage_status.dialogs.allestimento_confirm',
                    ),
                };
            case 'sospendi':
                return {
                    title: t('orders.manage_status.dialogs.sospendi_title'),
                    description: t(
                        'orders.manage_status.dialogs.sospendi_desc',
                    ),
                    confirmLabel: t(
                        'orders.manage_status.dialogs.sospendi_confirm',
                    ),
                };
            case 'evaso':
                return {
                    title: t('orders.manage_status.dialogs.evaso_title'),
                    description: t('orders.manage_status.dialogs.evaso_desc'),
                    confirmLabel: t(
                        'orders.manage_status.dialogs.evaso_confirm',
                    ),
                };
            case 'riprendi':
                return {
                    title: t('orders.manage_status.dialogs.riprendi_title'),
                    description: t(
                        'orders.manage_status.dialogs.riprendi_desc',
                    ),
                    confirmLabel: t(
                        'orders.manage_status.dialogs.riprendi_confirm',
                    ),
                };
            case 'forza-avanzamento':
                return {
                    title: t('orders.manage_status.dialogs.forza_title'),
                    description: t('orders.manage_status.dialogs.forza_desc'),
                    confirmLabel: t(
                        'orders.manage_status.dialogs.forza_confirm',
                    ),
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
                        t('orders.manage_status.errors.motivazione_required'),
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

    // In legacy the "Passa In Lanciato" button shows when all semaphores are > 0 (yellow or green).
    // The automatic prompt only appears when all three are green.
    const allPositive =
        statusSemaforo.etichette > 0 &&
        statusSemaforo.packaging > 0 &&
        statusSemaforo.prodotto > 0;

    // Get available status transitions based on current status
    const getAvailableStatuses = (): StatusOption[] => {
        const currentStatus = order.status;

        // If order is already SALDATO (6), no transitions are possible
        if (currentStatus === 6) {
            return [];
        }

        const availableStatuses: StatusOption[] = [];

        // Can go to SOSPESO only from status 3 (IN_AVANZAMENTO), as in legacy dialog
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
            // SOSPESO - can only resume by going back to AVANZAMENTO (3)
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
            <Head
                title={`${t('orders.manage_status')} - ${order.order_production_number}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t('orders.manage_status.title')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('common.order')}:{' '}
                            <span className="font-medium">
                                {order.order_production_number}
                            </span>
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleBackToDetails}>
                        {t('orders.manage_status.back_to_details')}
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
                                                    {t(
                                                        'orders.manage_status.labels.motivazione',
                                                    )}
                                                </Label>
                                                <Textarea
                                                    id="motivazione-modal"
                                                    value={motivazione}
                                                    onChange={(e) =>
                                                        setMotivazione(
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'orders.manage_status.placeholders.suspension_reason',
                                                    )}
                                                    rows={3}
                                                />
                                            </div>
                                        )}
                                        <AlertDialogFooter className="mt-6">
                                            <AlertDialogCancel>
                                                {t('common.cancel')}
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
                            {t('orders.manage_status.help.all_green_prompt')}
                            <div className="mt-2 flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleChangeToLanciato}
                                >
                                    {t(
                                        'orders.manage_status.buttons.yes_lanciato',
                                    )}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setShowLanciatoPrompt(false)}
                                >
                                    {t('orders.manage_status.buttons.no_keep')}
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('orders.manage_status.sections.order_info')}
                            </CardTitle>
                            <CardDescription>
                                {t('orders.manage_status.labels.order_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t(
                                        'orders.manage_status.labels.production_number',
                                    )}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {order.order_production_number}
                                </p>
                            </div>
                            {order.article && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'orders.manage_status.labels.article',
                                        )}
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
                                    {t(
                                        'orders.manage_status.labels.current_status',
                                    )}
                                </Label>
                                <span
                                    className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getOrderStatusColor(order.status)}`}
                                >
                                    {t(getOrderStatusLabelKey(order.status), {
                                        status: String(order.status),
                                    })}
                                </span>
                            </div>
                            {order.quantity && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'orders.manage_status.labels.quantity',
                                        )}
                                    </Label>
                                    <p>{order.quantity}</p>
                                </div>
                            )}
                            {order.worked_quantity != null && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'orders.manage_status.labels.worked_quantity',
                                        )}
                                    </Label>
                                    <p>{order.worked_quantity}</p>
                                </div>
                            )}
                            {order.status === 4 && order.motivazione && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'orders.manage_status.labels.motivazione',
                                        )}
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
                                    {t(
                                        'orders.manage_status.sections.semaforo_title',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'orders.manage_status.sections.semaforo_desc',
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="etichette">
                                        {t(
                                            'orders.manage_status.sections.labels',
                                        )}
                                    </Label>
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
                                            {SEMAFORO_OPTIONS_KEYS.map(
                                                (opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={opt.value.toString()}
                                                    >
                                                        <span
                                                            className={`inline-flex items-center gap-2`}
                                                        >
                                                            {opt.value ===
                                                                0 && (
                                                                <XCircle className="h-4 w-4 text-red-600" />
                                                            )}
                                                            {opt.value ===
                                                                1 && (
                                                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                                            )}
                                                            {opt.value ===
                                                                2 && (
                                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                            )}
                                                            {t(opt.key)}
                                                        </span>
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="packaging">
                                        {t(
                                            'orders.manage_status.sections.packaging',
                                        )}
                                    </Label>
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
                                            {SEMAFORO_OPTIONS_KEYS.map(
                                                (opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={opt.value.toString()}
                                                    >
                                                        <span
                                                            className={`inline-flex items-center gap-2`}
                                                        >
                                                            {opt.value ===
                                                                0 && (
                                                                <XCircle className="h-4 w-4 text-red-600" />
                                                            )}
                                                            {opt.value ===
                                                                1 && (
                                                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                                            )}
                                                            {opt.value ===
                                                                2 && (
                                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                            )}
                                                            {t(opt.key)}
                                                        </span>
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="prodotto">
                                        {t(
                                            'orders.manage_status.sections.product',
                                        )}
                                    </Label>
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
                                            {SEMAFORO_OPTIONS_KEYS.map(
                                                (opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={opt.value.toString()}
                                                    >
                                                        <span
                                                            className={`inline-flex items-center gap-2`}
                                                        >
                                                            {opt.value ===
                                                                0 && (
                                                                <XCircle className="h-4 w-4 text-red-600" />
                                                            )}
                                                            {opt.value ===
                                                                1 && (
                                                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                                            )}
                                                            {opt.value ===
                                                                2 && (
                                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                            )}
                                                            {t(opt.key)}
                                                        </span>
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="rounded-md border bg-muted/40 p-3 text-xs">
                                    {allGreen ? (
                                        <span className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                                            <CheckCircle2 className="h-4 w-4" />
                                            {t(
                                                'orders.manage_status.help.semaforo_ready',
                                            )}
                                        </span>
                                    ) : allPositive ? (
                                        <span className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-300">
                                            <AlertCircle className="h-4 w-4" />
                                            {t(
                                                'orders.manage_status.help.semaforo_amber',
                                            )}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2 text-red-700 dark:text-red-300">
                                            <XCircle className="h-4 w-4" />
                                            {t(
                                                'orders.manage_status.help.semaforo_red',
                                            )}
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
                                            {t(
                                                'orders.manage_status.buttons.saving',
                                            )}
                                        </>
                                    ) : (
                                        t(
                                            'orders.manage_status.buttons.save_semaforo',
                                        )
                                    )}
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                    {t(
                                        'orders.manage_status.help.semaforo_note',
                                    )}
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
                                <CardTitle>
                                    {t(
                                        'orders.manage_status.sections.change_status',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {order.status === 0
                                        ? t(
                                              'orders.manage_status.help.status_0',
                                          )
                                        : order.status === 1
                                          ? t(
                                                'orders.manage_status.help.status_1',
                                            )
                                          : order.status === 2
                                            ? t(
                                                  'orders.manage_status.help.status_2',
                                              )
                                            : order.status === 3
                                              ? t(
                                                    'orders.manage_status.help.status_3',
                                                )
                                              : order.status === 4
                                                ? t(
                                                      'orders.manage_status.help.status_4',
                                                  )
                                                : order.status === 5
                                                  ? t(
                                                        'orders.manage_status.help.status_5',
                                                    )
                                                  : t(
                                                        'orders.manage_status.help.select_state',
                                                    )}
                                </CardDescription>
                            </CardHeader>
                        )}
                        <CardContent className="space-y-4">
                            {order.status === 6 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <CheckCircle2 className="mb-4 h-16 w-16 text-emerald-600 dark:text-emerald-500" />
                                    <h3 className="text-xl font-semibold text-foreground">
                                        {t(
                                            'orders.manage_status.help.status_6',
                                        )}
                                    </h3>
                                    <p className="mt-2 text-sm break-words text-muted-foreground">
                                        {t(
                                            'orders.manage_status.help.status_6_desc',
                                        )}
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
                                                {t(
                                                    'orders.manage_status.buttons.updating',
                                                )}
                                            </>
                                        ) : (
                                            t(
                                                'orders.manage_status.buttons.pass_allestimento',
                                            )
                                        )}
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            'orders.manage_status.help.allestimento_note',
                                        )}
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
                                                {t(
                                                    'orders.manage_status.buttons.updating',
                                                )}
                                            </>
                                        ) : (
                                            t(
                                                'orders.manage_status.buttons.forza_avanzamento',
                                            )
                                        )}
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            'orders.manage_status.help.forza_note',
                                        )}
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
                                                    {t(
                                                        'orders.manage_status.buttons.updating',
                                                    )}
                                                </>
                                            ) : (
                                                t(
                                                    'orders.manage_status.buttons.sospendi',
                                                )
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
                                                    {t(
                                                        'orders.manage_status.buttons.updating',
                                                    )}
                                                </>
                                            ) : (
                                                t(
                                                    'orders.manage_status.buttons.pass_evaso',
                                                )
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            'orders.manage_status.help.sospendi_evaso_note',
                                        )}
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
                                                {t(
                                                    'orders.manage_status.buttons.updating',
                                                )}
                                            </>
                                        ) : (
                                            t(
                                                'orders.manage_status.buttons.riprendi',
                                            )
                                        )}
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            'orders.manage_status.help.riprendi_note',
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {order.status !== 6 && (
                                        <div className="space-y-1">
                                            <Label htmlFor="new-status">
                                                {t(
                                                    'orders.manage_status.labels.new_status',
                                                )}
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
                                                    <SelectValue
                                                        placeholder={t(
                                                            'orders.manage_status.placeholders.select_status',
                                                        )}
                                                    />
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
                                                    {t(
                                                        'orders.manage_status.help.evaso_saldato_note',
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {order.status !== 6 && newStatus === 4 && (
                                        <div>
                                            <Label htmlFor="motivazione">
                                                {t(
                                                    'orders.manage_status.labels.motivazione',
                                                )}{' '}
                                                *
                                            </Label>
                                            <Textarea
                                                id="motivazione"
                                                value={motivazione}
                                                onChange={(e) =>
                                                    setMotivazione(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={t(
                                                    'orders.manage_status.placeholders.motivazione',
                                                )}
                                                rows={3}
                                            />
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {t(
                                                    'orders.manage_status.help.motivazione_required',
                                                )}
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
                                                {t(
                                                    'orders.manage_status.buttons.updating',
                                                )}
                                            </>
                                        ) : (
                                            t(
                                                'orders.manage_status.buttons.change_status',
                                            )
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

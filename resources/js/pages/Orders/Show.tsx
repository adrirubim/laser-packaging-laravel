import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { FlashNotifications } from '@/components/flash-notifications';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getLotTypeOptionKey } from '@/constants/lotTypes';
import { getLabelOptionKey } from '@/constants/orderLabels';
import { getOrderStatusLabelKey } from '@/constants/orderStatus';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import articles from '@/routes/articles/index';
import orders from '@/routes/orders/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

type PalletSheet = {
    uuid: string;
    code: string;
    description?: string | null;
};

type Material = {
    uuid: string;
    cod: string;
    description?: string | null;
};

type Article = {
    uuid: string;
    cod_article_las: string;
    article_descr?: string | null;
    um?: string | null;
    palletSheet?: PalletSheet | null;
    materials?: Material[];
    offer?: {
        customer?: { company_name: string } | null;
        customerDivision?: { name: string } | null;
    } | null;
};

type ShippingAddress = {
    street?: string | null;
    city?: string | null;
    postal_code?: string | null;
    division?: {
        customer?: { company_name: string } | null;
    } | null;
};

type Order = {
    uuid: string;
    order_production_number: string;
    number_customer_reference_order?: string | null;
    quantity?: number | null;
    worked_quantity?: number | null;
    remain_quantity?: number | null;
    status: number;
    line?: number | null;
    type_lot?: number | null;
    lot?: string | null;
    expiration_date?: string | null;
    external_labels?: number | null;
    pvp_labels?: number | null;
    ingredients_labels?: number | null;
    variable_data_labels?: number | null;
    label_of_jumpers?: number | null;
    indications_for_shop?: string | null;
    indications_for_production?: string | null;
    indications_for_delivery?: string | null;
    delivery_requested_date?: string | null;
    expected_production_start_date?: string | null;
    status_semaforo?: {
        etichette?: number;
        packaging?: number;
        prodotto?: number;
    } | null;
    motivazione?: string | null;
    autocontrollo?: boolean | null;
    article?: Article | null;
    shippingAddress?: ShippingAddress | null;
};

type OrdersShowProps = {
    order: Order;
};

export default function OrdersShow({ order }: OrdersShowProps) {
    const { t } = useTranslations();
    const [downloadingBarcode, setDownloadingBarcode] = useState(false);
    const [downloadingAutocontrollo, setDownloadingAutocontrollo] =
        useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [uiFlash, setUiFlash] = useState<{
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    }>({});
    const { props: pageProps } = usePage<{
        flash?: { success?: string; error?: string };
    }>();
    const mergedFlash = {
        ...pageProps.flash,
        ...(Object.keys(uiFlash).length > 0 ? uiFlash : {}),
    };

    const clearUiFlash = () => setUiFlash({});

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.orders'),
            href: orders.index().url,
        },
        {
            title: order.order_production_number,
            href: orders.show({ order: order.uuid }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        setIsDeleting(true);
        router.delete(orders.destroy({ order: order.uuid }).url, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                router.visit(orders.index().url);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    /**
     * Download del PDF barcode di un ordine.
     * Usa iframe temporaneo per forzare il dialogo di salvataggio
     * ed evitare che il PDF si apra automaticamente.
     */
    const handleDownloadBarcode = () => {
        if (downloadingBarcode) {
            return;
        }

        setDownloadingBarcode(true);
        setUiFlash({
            info: t('orders.toasts.barcode_download_started'),
        });

        try {
            // Create temporary invisible iframe to force download
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.setAttribute('aria-hidden', 'true');

            // Impostare src per scaricare il PDF
            // Le intestazioni Content-Disposition: attachment forzano il dialogo
            iframe.src = `/orders/${order.uuid}/download-barcode`;

            // Add to DOM
            document.body.appendChild(iframe);

            // Pulire iframe dopo un delay
            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
                setDownloadingBarcode(false);
            }, 1000);
        } catch (error) {
            console.error('Errore nello scaricare il barcode:', error);
            setDownloadingBarcode(false);
            setUiFlash({
                error:
                    error instanceof Error
                        ? `${t('orders.toasts.barcode_download_error')}: ${error.message}`
                        : t('orders.toasts.barcode_download_error'),
            });
        }
    };

    /**
     * Download del PDF autocontrollo di un ordine.
     * Usa iframe temporaneo per forzare il dialogo di salvataggio
     * ed evitare che il PDF si apra automaticamente.
     */
    const handleDownloadAutocontrollo = () => {
        if (downloadingAutocontrollo) {
            return;
        }

        setDownloadingAutocontrollo(true);
        setUiFlash({
            info: t('orders.toasts.autocontrollo_download_started'),
        });

        try {
            // Create temporary invisible iframe to force download
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.setAttribute('aria-hidden', 'true');

            // Impostare src per scaricare il PDF
            // Le intestazioni Content-Disposition: attachment forzano il dialogo
            iframe.src = `/orders/${order.uuid}/download-autocontrollo`;

            // Add to DOM
            document.body.appendChild(iframe);

            // Pulire iframe dopo un delay
            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
                setDownloadingAutocontrollo(false);
            }, 1000);
        } catch (error) {
            console.error('Errore nello scaricare autocontrollo:', error);
            setDownloadingAutocontrollo(false);
            setUiFlash({
                error:
                    error instanceof Error
                        ? `${t('orders.toasts.autocontrollo_download_error')}: ${error.message}`
                        : t('orders.toasts.autocontrollo_download_error'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('orders.show.page_title', {
                    number: order.order_production_number,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t('orders.show.page_title', {
                                number: order.order_production_number,
                            })}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('orders.show.status_label')}:{' '}
                            <span className="font-medium">
                                {t(getOrderStatusLabelKey(order.status), {
                                    status: String(order.status),
                                })}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    orders.manageStatus({ order: order.uuid })
                                        .url
                                }
                            >
                                {t('orders.manage_status')}
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    orders.manageEmployees({
                                        order: order.uuid,
                                    }).url
                                }
                            >
                                {t('orders.show.manage_employees')}
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleDownloadBarcode}
                            disabled={downloadingBarcode}
                        >
                            {downloadingBarcode ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('orders.barcode_generating')}
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    {t('orders.barcode_print')}
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleDownloadAutocontrollo}
                            disabled={downloadingAutocontrollo}
                        >
                            {downloadingAutocontrollo ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('orders.autocontrollo_generating')}
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    {t('orders.autocontrollo_print')}
                                </>
                            )}
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={orders.edit({ order: order.uuid }).url}>
                                {t('common.edit')}
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={isDeleting}
                        >
                            {t('common.delete')}
                        </Button>
                    </div>
                </div>

                <FlashNotifications
                    flash={mergedFlash}
                    onDismiss={clearUiFlash}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('orders.show.details_title')}
                            </CardTitle>
                            <CardDescription>
                                {t('orders.show.details_subtitle')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('orders.show.production_number')}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {order.order_production_number}
                                </p>
                            </div>

                            {order.article && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('orders.labels.article_code_las')}
                                    </Label>
                                    <p className="text-lg font-semibold">
                                        {order.article.cod_article_las}
                                    </p>
                                    {order.article.article_descr && (
                                        <p className="text-sm text-muted-foreground">
                                            {order.article.article_descr}
                                        </p>
                                    )}
                                </div>
                            )}

                            {order.article?.um && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('orders.labels.um')}
                                    </Label>
                                    <p>{order.article.um}</p>
                                </div>
                            )}

                            {order.line !== null &&
                                order.line !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t('orders.labels.line')}
                                        </Label>
                                        <p>{order.line}</p>
                                    </div>
                                )}

                            {order.number_customer_reference_order && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('orders.show.reference_client')}
                                    </Label>
                                    <p>
                                        {order.number_customer_reference_order}
                                    </p>
                                </div>
                            )}

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('orders.show.quantity')}
                                </Label>
                                <p>
                                    {order.worked_quantity || 0} /{' '}
                                    {order.quantity || 0}
                                    {order.remain_quantity !== undefined &&
                                        order.remain_quantity !== null && (
                                            <span className="ml-2 text-muted-foreground">
                                                ({t('orders.show.remaining')}:{' '}
                                                {order.remain_quantity})
                                            </span>
                                        )}
                                </p>
                            </div>

                            {order.autocontrollo !== null &&
                                order.autocontrollo !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            {t('orders.show.autocontrollo')}
                                        </Label>
                                        <p>
                                            {order.autocontrollo ? (
                                                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                                    {t('orders.show.yes')}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    {t('orders.show.no')}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('orders.show.customer_info_title')}
                            </CardTitle>
                            <CardDescription>
                                {t('orders.show.customer_info_subtitle')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {order.article?.offer?.customer && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('orders.show.customer')}
                                    </Label>
                                    <p className="text-lg font-semibold">
                                        {
                                            order.article.offer.customer
                                                .company_name
                                        }
                                    </p>
                                </div>
                            )}

                            {order.article?.offer?.customerDivision && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('orders.show.division')}
                                    </Label>
                                    <p>
                                        {
                                            order.article.offer.customerDivision
                                                .name
                                        }
                                    </p>
                                </div>
                            )}

                            {order.shippingAddress && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('orders.show.shipping_address')}
                                    </Label>
                                    <p>
                                        {[
                                            order.shippingAddress.street,
                                            order.shippingAddress.city,
                                            order.shippingAddress.postal_code,
                                        ]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {((order.type_lot !== null &&
                        order.type_lot !== undefined) ||
                        order.lot ||
                        order.expiration_date ||
                        order.external_labels != null ||
                        order.pvp_labels != null ||
                        order.ingredients_labels != null ||
                        order.variable_data_labels != null ||
                        order.label_of_jumpers != null ||
                        order.indications_for_shop ||
                        order.indications_for_production ||
                        order.indications_for_delivery ||
                        order.delivery_requested_date ||
                        order.expected_production_start_date ||
                        order.article?.palletSheet ||
                        order.article?.materials?.length ||
                        order.status_semaforo ||
                        order.motivazione) && (
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>
                                    {t('orders.show.advanced_info_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('orders.show.advanced_info_subtitle')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {order.type_lot !== null &&
                                        order.type_lot !== undefined && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">
                                                    {t('orders.show.lot_type')}
                                                </Label>
                                                <p>
                                                    {getLotTypeOptionKey(
                                                        order.type_lot,
                                                    )
                                                        ? t(
                                                              getLotTypeOptionKey(
                                                                  order.type_lot,
                                                              )!,
                                                          )
                                                        : ''}
                                                </p>
                                            </div>
                                        )}

                                    {order.lot && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t('orders.labels.lot')}
                                            </Label>
                                            <p>{order.lot}</p>
                                        </div>
                                    )}

                                    {order.expiration_date && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    'orders.show.expiration_date',
                                                )}
                                            </Label>
                                            <p>
                                                {new Date(
                                                    order.expiration_date,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}

                                    {order.delivery_requested_date && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    'orders.show.delivery_requested',
                                                )}
                                            </Label>
                                            <p>
                                                {new Date(
                                                    order.delivery_requested_date,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}

                                    {order.expected_production_start_date && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    'orders.show.expected_production_start',
                                                )}
                                            </Label>
                                            <p>
                                                {new Date(
                                                    order.expected_production_start_date,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}

                                    <div className="md:col-span-2">
                                        <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                                            {t('orders.show.labels')}
                                        </Label>
                                        <div className="flex flex-wrap gap-4">
                                            {order.external_labels != null && (
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                        order.external_labels >
                                                        0
                                                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {t(
                                                        'orders.show.labels_external',
                                                    )}
                                                    :{' '}
                                                    {getLabelOptionKey(
                                                        order.external_labels,
                                                    )
                                                        ? t(
                                                              getLabelOptionKey(
                                                                  order.external_labels,
                                                              )!,
                                                          )
                                                        : ''}
                                                </span>
                                            )}
                                            {order.pvp_labels != null && (
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                        order.pvp_labels > 0
                                                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {t(
                                                        'orders.show.labels_pvp',
                                                    )}
                                                    :{' '}
                                                    {getLabelOptionKey(
                                                        order.pvp_labels,
                                                    )
                                                        ? t(
                                                              getLabelOptionKey(
                                                                  order.pvp_labels,
                                                              )!,
                                                          )
                                                        : ''}
                                                </span>
                                            )}
                                            {order.ingredients_labels !=
                                                null && (
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                        order.ingredients_labels >
                                                        0
                                                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {t(
                                                        'orders.show.labels_ingredients',
                                                    )}
                                                    :{' '}
                                                    {getLabelOptionKey(
                                                        order.ingredients_labels,
                                                    )
                                                        ? t(
                                                              getLabelOptionKey(
                                                                  order.ingredients_labels,
                                                              )!,
                                                          )
                                                        : ''}
                                                </span>
                                            )}
                                            {order.variable_data_labels !=
                                                null && (
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                        order.variable_data_labels >
                                                        0
                                                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {t(
                                                        'orders.show.labels_variable',
                                                    )}
                                                    :{' '}
                                                    {getLabelOptionKey(
                                                        order.variable_data_labels,
                                                    )
                                                        ? t(
                                                              getLabelOptionKey(
                                                                  order.variable_data_labels,
                                                              )!,
                                                          )
                                                        : ''}
                                                </span>
                                            )}
                                            {order.label_of_jumpers != null && (
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                        order.label_of_jumpers >
                                                        0
                                                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {t(
                                                        'orders.show.labels_jumper',
                                                    )}
                                                    :{' '}
                                                    {getLabelOptionKey(
                                                        order.label_of_jumpers,
                                                    )
                                                        ? t(
                                                              getLabelOptionKey(
                                                                  order.label_of_jumpers,
                                                              )!,
                                                          )
                                                        : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {order.status_semaforo &&
                                        (order.status_semaforo.etichette !=
                                            null ||
                                            order.status_semaforo.packaging !=
                                                null ||
                                            order.status_semaforo.prodotto !=
                                                null) && (
                                            <div className="md:col-span-2">
                                                <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                                                    {t(
                                                        'orders.show.status_semaforo',
                                                    )}
                                                </Label>
                                                <div className="flex flex-wrap gap-4">
                                                    {order.status_semaforo
                                                        .etichette !==
                                                        undefined &&
                                                        order.status_semaforo
                                                            .etichette !==
                                                            null && (
                                                            <span
                                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                                    order
                                                                        .status_semaforo
                                                                        .etichette ===
                                                                    2
                                                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                                        : order
                                                                                .status_semaforo
                                                                                .etichette ===
                                                                            1
                                                                          ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300'
                                                                          : 'bg-red-500/10 text-red-700 dark:text-red-300'
                                                                }`}
                                                            >
                                                                {t(
                                                                    'orders.show.semaforo_labels',
                                                                )}
                                                                :{' '}
                                                                {order
                                                                    .status_semaforo
                                                                    .etichette ===
                                                                2
                                                                    ? t(
                                                                          'orders.show.status_ok',
                                                                      )
                                                                    : order
                                                                            .status_semaforo
                                                                            .etichette ===
                                                                        1
                                                                      ? t(
                                                                            'orders.show.status_pending',
                                                                        )
                                                                      : t(
                                                                            'orders.show.status_error',
                                                                        )}
                                                            </span>
                                                        )}
                                                    {order.status_semaforo
                                                        .packaging !==
                                                        undefined &&
                                                        order.status_semaforo
                                                            .packaging !==
                                                            null && (
                                                            <span
                                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                                    order
                                                                        .status_semaforo
                                                                        .packaging ===
                                                                    2
                                                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                                        : order
                                                                                .status_semaforo
                                                                                .packaging ===
                                                                            1
                                                                          ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300'
                                                                          : 'bg-red-500/10 text-red-700 dark:text-red-300'
                                                                }`}
                                                            >
                                                                {t(
                                                                    'orders.show.semaforo_packaging',
                                                                )}
                                                                :{' '}
                                                                {order
                                                                    .status_semaforo
                                                                    .packaging ===
                                                                2
                                                                    ? t(
                                                                          'orders.show.status_ok',
                                                                      )
                                                                    : order
                                                                            .status_semaforo
                                                                            .packaging ===
                                                                        1
                                                                      ? t(
                                                                            'orders.show.status_pending',
                                                                        )
                                                                      : t(
                                                                            'orders.show.status_error',
                                                                        )}
                                                            </span>
                                                        )}
                                                    {order.status_semaforo
                                                        .prodotto !==
                                                        undefined &&
                                                        order.status_semaforo
                                                            .prodotto !==
                                                            null && (
                                                            <span
                                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                                    order
                                                                        .status_semaforo
                                                                        .prodotto ===
                                                                    2
                                                                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                                        : order
                                                                                .status_semaforo
                                                                                .prodotto ===
                                                                            1
                                                                          ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300'
                                                                          : 'bg-red-500/10 text-red-700 dark:text-red-300'
                                                                }`}
                                                            >
                                                                {t(
                                                                    'orders.show.semaforo_product',
                                                                )}
                                                                :{' '}
                                                                {order
                                                                    .status_semaforo
                                                                    .prodotto ===
                                                                2
                                                                    ? t(
                                                                          'orders.show.status_ok',
                                                                      )
                                                                    : order
                                                                            .status_semaforo
                                                                            .prodotto ===
                                                                        1
                                                                      ? t(
                                                                            'orders.show.status_pending',
                                                                        )
                                                                      : t(
                                                                            'orders.show.status_error',
                                                                        )}
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                        )}

                                    {order.motivazione && (
                                        <div className="md:col-span-2">
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t('orders.show.motivazione')}
                                            </Label>
                                            <p className="rounded-md border border-yellow-200 bg-yellow-50 p-3 whitespace-pre-wrap dark:border-yellow-800 dark:bg-yellow-900/20">
                                                {order.motivazione}
                                            </p>
                                        </div>
                                    )}

                                    {order.article?.palletSheet && (
                                        <div className="md:col-span-2">
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t('orders.show.pallet_sheet')}
                                            </Label>
                                            <div className="flex items-center gap-2">
                                                <p className="flex-1">
                                                    {
                                                        order.article
                                                            .palletSheet.code
                                                    }{' '}
                                                    -{' '}
                                                    {order.article.palletSheet
                                                        .description || ''}
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        window.open(
                                                            articles.palletSheets.downloadFile(
                                                                {
                                                                    palletSheet:
                                                                        order
                                                                            .article
                                                                            ?.palletSheet
                                                                            ?.uuid ||
                                                                        '',
                                                                },
                                                            ).url,
                                                            '_blank',
                                                        )
                                                    }
                                                >
                                                    <Download className="mr-2 h-4 w-4" />
                                                    {t(
                                                        'orders.show.download_attachment',
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {order.article?.materials &&
                                        order.article.materials.length > 0 && (
                                            <div className="md:col-span-2">
                                                <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                                                    {t(
                                                        'orders.show.components_list',
                                                    )}
                                                </Label>
                                                <div className="space-y-2">
                                                    {order.article.materials.map(
                                                        (material) => (
                                                            <div
                                                                key={
                                                                    material.uuid
                                                                }
                                                                className="rounded-md bg-muted p-2"
                                                            >
                                                                <p className="text-sm">
                                                                    {
                                                                        material.cod
                                                                    }{' '}
                                                                    -{' '}
                                                                    {material.description ||
                                                                        ''}
                                                                </p>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {order.indications_for_shop && (
                                        <div className="md:col-span-2">
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    'orders.show.indications_shop',
                                                )}
                                            </Label>
                                            <p className="whitespace-pre-wrap">
                                                {order.indications_for_shop}
                                            </p>
                                        </div>
                                    )}

                                    {order.indications_for_production && (
                                        <div className="md:col-span-2">
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    'orders.show.indications_production',
                                                )}
                                            </Label>
                                            <p className="whitespace-pre-wrap">
                                                {
                                                    order.indications_for_production
                                                }
                                            </p>
                                        </div>
                                    )}

                                    {order.indications_for_delivery && (
                                        <div className="md:col-span-2">
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    'orders.show.indications_delivery',
                                                )}
                                            </Label>
                                            <p className="whitespace-pre-wrap">
                                                {order.indications_for_delivery}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title={t('orders.show.dialog_confirm_delete')}
                description={t('orders.delete_confirm_description', {
                    order_number: order.order_production_number,
                })}
                itemName={t('orders.show.page_title', {
                    number: order.order_production_number,
                })}
            />
        </AppLayout>
    );
}

import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getLotTypeText } from '@/constants/lotTypes';
import { getLabelText } from '@/constants/orderLabels';
import AppLayout from '@/layouts/app-layout';
import articles from '@/routes/articles/index';
import orders from '@/routes/orders/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
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

const STATUS_LABELS: Record<number, string> = {
    0: 'Pianificato',
    1: 'In Allestimento',
    2: 'Lanciato',
    3: 'In Avanzamento',
    4: 'Sospeso',
    5: 'Completato',
};

export default function OrdersShow({ order }: OrdersShowProps) {
    const [downloadingBarcode, setDownloadingBarcode] = useState(false);
    const [downloadingAutocontrollo, setDownloadingAutocontrollo] =
        useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Ordini',
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

        try {
            // Creare iframe temporaneo invisibile per forzare il download
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.setAttribute('aria-hidden', 'true');

            // Impostare src per scaricare il PDF
            // Le intestazioni Content-Disposition: attachment forzano il dialogo
            iframe.src = `/orders/${order.uuid}/download-barcode`;

            // Aggiungere al DOM
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
            alert(
                error instanceof Error
                    ? `Errore nello scaricare il barcode: ${error.message}`
                    : 'Errore nello scaricare il barcode',
            );
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

        try {
            // Creare iframe temporaneo invisibile per forzare il download
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.setAttribute('aria-hidden', 'true');

            // Impostare src per scaricare il PDF
            // Le intestazioni Content-Disposition: attachment forzano il dialogo
            iframe.src = `/orders/${order.uuid}/download-autocontrollo`;

            // Aggiungere al DOM
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
            alert(
                error instanceof Error
                    ? `Errore nello scaricare autocontrollo: ${error.message}`
                    : 'Errore nello scaricare autocontrollo',
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ordine ${order.order_production_number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Ordine {order.order_production_number}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Stato:{' '}
                            <span className="font-medium">
                                {STATUS_LABELS[order.status] ||
                                    `Stato ${order.status}`}
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
                                Gestisci Stato
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
                                Gestisci Dipendenti
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
                                    Generando Barcode...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Stampa Barcode
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
                                    Generando Autocontrollo...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" />
                                    Stampa Autocontrollo
                                </>
                            )}
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={orders.edit({ order: order.uuid }).url}>
                                Modifica
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={isDeleting}
                        >
                            Elimina
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dettagli Ordine</CardTitle>
                            <CardDescription>
                                Informazioni di base su questo ordine
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
                                        Codice articolo LAS
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
                                        U.m.
                                    </Label>
                                    <p>{order.article.um}</p>
                                </div>
                            )}

                            {order.line !== null &&
                                order.line !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Riga
                                        </Label>
                                        <p>{order.line}</p>
                                    </div>
                                )}

                            {order.number_customer_reference_order && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Riferimento Cliente
                                    </Label>
                                    <p>
                                        {order.number_customer_reference_order}
                                    </p>
                                </div>
                            )}

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Quantità
                                </Label>
                                <p>
                                    {order.worked_quantity || 0} /{' '}
                                    {order.quantity || 0}
                                    {order.remain_quantity !== undefined &&
                                        order.remain_quantity !== null && (
                                            <span className="ml-2 text-muted-foreground">
                                                (Rimanente:{' '}
                                                {order.remain_quantity})
                                            </span>
                                        )}
                                </p>
                            </div>

                            {order.autocontrollo !== null &&
                                order.autocontrollo !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Autocontrollo
                                        </Label>
                                        <p>
                                            {order.autocontrollo ? (
                                                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                                    Sì
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    No
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informazioni Cliente</CardTitle>
                            <CardDescription>
                                Dettagli cliente e spedizione
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {order.article?.offer?.customer && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Cliente
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
                                        Divisione
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
                                        Indirizzo di Spedizione
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
                                <CardTitle>Informazioni Avanzate</CardTitle>
                                <CardDescription>
                                    Dettagli aggiuntivi dell'ordine
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {order.type_lot !== null &&
                                        order.type_lot !== undefined && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">
                                                    Tipo Lotto
                                                </Label>
                                                <p>
                                                    {getLotTypeText(
                                                        order.type_lot,
                                                    )}
                                                </p>
                                            </div>
                                        )}

                                    {order.lot && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Lotto
                                            </Label>
                                            <p>{order.lot}</p>
                                        </div>
                                    )}

                                    {order.expiration_date && (
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Data di Scadenza
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
                                                Data Richiesta Consegna
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
                                                Data Prevista Inizio Produzione
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
                                            Etichette
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
                                                    Etichette Esterne:{' '}
                                                    {getLabelText(
                                                        order.external_labels,
                                                    )}
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
                                                    Etichette PVP:{' '}
                                                    {getLabelText(
                                                        order.pvp_labels,
                                                    )}
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
                                                    Etichette Ingredienti:{' '}
                                                    {getLabelText(
                                                        order.ingredients_labels,
                                                    )}
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
                                                    Etichette Dati Variabili:{' '}
                                                    {getLabelText(
                                                        order.variable_data_labels,
                                                    )}
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
                                                    Etichette Jumper:{' '}
                                                    {getLabelText(
                                                        order.label_of_jumpers,
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {order.status_semaforo && (
                                        <div className="md:col-span-2">
                                            <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                                                Status Semáforo
                                            </Label>
                                            <div className="flex flex-wrap gap-4">
                                                {order.status_semaforo
                                                    .etichette !== undefined &&
                                                    order.status_semaforo
                                                        .etichette !== null && (
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                                order
                                                                    .status_semaforo
                                                                    .etichette ===
                                                                1
                                                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                                    : order
                                                                            .status_semaforo
                                                                            .etichette ===
                                                                        0
                                                                      ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300'
                                                                      : 'bg-red-500/10 text-red-700 dark:text-red-300'
                                                            }`}
                                                        >
                                                            Etichette:{' '}
                                                            {order
                                                                .status_semaforo
                                                                .etichette === 1
                                                                ? 'Ok'
                                                                : order
                                                                        .status_semaforo
                                                                        .etichette ===
                                                                    0
                                                                  ? 'In attesa'
                                                                  : 'Errore'}
                                                        </span>
                                                    )}
                                                {order.status_semaforo
                                                    .packaging !== undefined &&
                                                    order.status_semaforo
                                                        .packaging !== null && (
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                                order
                                                                    .status_semaforo
                                                                    .packaging ===
                                                                1
                                                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                                    : order
                                                                            .status_semaforo
                                                                            .packaging ===
                                                                        0
                                                                      ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300'
                                                                      : 'bg-red-500/10 text-red-700 dark:text-red-300'
                                                            }`}
                                                        >
                                                            Confezionamento:{' '}
                                                            {order
                                                                .status_semaforo
                                                                .packaging === 1
                                                                ? 'Ok'
                                                                : order
                                                                        .status_semaforo
                                                                        .packaging ===
                                                                    0
                                                                  ? 'In attesa'
                                                                  : 'Errore'}
                                                        </span>
                                                    )}
                                                {order.status_semaforo
                                                    .prodotto !== undefined &&
                                                    order.status_semaforo
                                                        .prodotto !== null && (
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                                order
                                                                    .status_semaforo
                                                                    .prodotto ===
                                                                1
                                                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                                                    : order
                                                                            .status_semaforo
                                                                            .prodotto ===
                                                                        0
                                                                      ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300'
                                                                      : 'bg-red-500/10 text-red-700 dark:text-red-300'
                                                            }`}
                                                        >
                                                            Prodotto:{' '}
                                                            {order
                                                                .status_semaforo
                                                                .prodotto === 1
                                                                ? 'Ok'
                                                                : order
                                                                        .status_semaforo
                                                                        .prodotto ===
                                                                    0
                                                                  ? 'In attesa'
                                                                  : 'Errore'}
                                                        </span>
                                                    )}
                                            </div>
                                        </div>
                                    )}

                                    {order.motivazione && (
                                        <div className="md:col-span-2">
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Motivazione
                                            </Label>
                                            <p className="rounded-md border border-yellow-200 bg-yellow-50 p-3 whitespace-pre-wrap dark:border-yellow-800 dark:bg-yellow-900/20">
                                                {order.motivazione}
                                            </p>
                                        </div>
                                    )}

                                    {order.article?.palletSheet && (
                                        <div className="md:col-span-2">
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Foglio Pallet Aggiuntivo
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
                                                    Scarica allegato
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {order.article?.materials &&
                                        order.article.materials.length > 0 && (
                                            <div className="md:col-span-2">
                                                <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                                                    Elenco componenti
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
                                                Indicazioni per Negozio
                                            </Label>
                                            <p className="whitespace-pre-wrap">
                                                {order.indications_for_shop}
                                            </p>
                                        </div>
                                    )}

                                    {order.indications_for_production && (
                                        <div className="md:col-span-2">
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                Indicazioni per Produzione
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
                                                Indicazioni per Consegna
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
                title="Conferma eliminazione"
                description={
                    <>
                        Sei sicuro di voler eliminare questo ordine? Questa
                        azione non può essere annullata. L&apos;ordine verrà
                        eliminato definitivamente.
                    </>
                }
                itemName={`Ordine ${order.order_production_number}`}
            />
        </AppLayout>
    );
}

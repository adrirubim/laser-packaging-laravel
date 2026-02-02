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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import offerOperations from '@/routes/offer-operations';
import offers from '@/routes/offers';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';

// Formattare numeri in formato italiano (virgola decimali, punto migliaia)
const formatNumber = (
    value: number | null | undefined,
    decimals: number = 5,
): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return '';
    }
    const rounded =
        Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    const parts = rounded.toFixed(decimals).split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';

    // Aggiungere separatori migliaia (punto)
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return formattedInteger + ',' + decimalPart;
};

// Formattare interi
const formatInteger = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return '';
    }
    return Math.round(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

type Customer = {
    uuid: string;
    code?: string;
    company_name: string;
};

type CustomerDivision = {
    uuid: string;
    name: string;
};

type Activity = {
    uuid: string;
    name: string;
};

type Sector = {
    uuid: string;
    name: string;
};

type Seasonality = {
    uuid: string;
    name: string;
};

type OrderType = {
    uuid: string;
    name: string;
};

type LasFamily = {
    uuid: string;
    code: string;
    name: string;
};

type LasWorkLine = {
    uuid: string;
    code: string;
    name: string;
};

type LsResource = {
    uuid: string;
    code: string;
    name: string;
};

type Article = {
    uuid: string;
    cod_article_las: string;
    article_descr?: string | null;
};

type Operation = {
    uuid: string;
    category: {
        uuid?: string;
        name: string;
    };
    codice_univoco: string;
    descrizione: string;
    secondi_operazione: number;
    num_op: number;
    total_sec: number;
    filename?: string | null;
};

type Offer = {
    uuid: string;
    offer_number: string;
    offer_date?: string;
    validity_date?: string;
    customer?: Customer | null;
    customerDivision?: CustomerDivision | null;
    activity?: Activity | null;
    sector?: Sector | null;
    seasonality?: Seasonality | null;
    typeOrder?: OrderType | null;
    lasFamily?: LasFamily | null;
    lasWorkLine?: LasWorkLine | null;
    lsResource?: LsResource | null;
    customer_ref?: string | null;
    article_code_ref?: string | null;
    provisional_description?: string | null;
    unit_of_measure?: string | null;
    quantity?: number | null;
    piece?: number | null;
    declared_weight_cfz?: number | null;
    declared_weight_pz?: number | null;
    notes?: string | null;
    operations?: Operation[];
    theoretical_time_cfz?: number;
    unexpected?: number;
    total_theoretical_time?: number;
    theoretical_time?: number;
    production_time_cfz?: number;
    production_time?: number;
    production_average_cfz?: number;
    production_average_pz?: number;
    expected_workers?: number | null;
    expected_revenue?: number | null;
    rate_cfz?: number | null;
    rate_pz?: number | null;
    rate_rounding_cfz?: number | null;
    rate_increase_cfz?: number | null;
    rate_rounding_cfz_perc?: number;
    final_rate_cfz?: number;
    final_rate_pz?: number;
    materials_euro?: number | null;
    logistics_euro?: number | null;
    other_euro?: number | null;
    total_rate_cfz?: number;
    total_rate_pz?: number;
    offer_notes?: string | null;
    ls_setup_cost?: number | null;
    ls_other_costs?: number | null;
    approval_status?: string | null;
    articles?: Article[];
};

type OffersShowProps = {
    offer: Offer;
};

export default function OffersShow({ offer }: OffersShowProps) {
    const [downloadingPdf, setDownloadingPdf] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offerte',
            href: offers.index().url,
        },
        {
            title: offer.offer_number,
            href: offers.show({ offer: offer.uuid }).url,
        },
    ];

    const handleDelete = () => {
        if (
            confirm(
                'Sei sicuro di voler eliminare questa offerta? Questa azione non può essere annullata.',
            )
        ) {
            router.delete(offers.destroy({ offer: offer.uuid }).url, {
                onSuccess: () => {
                    router.visit(offers.index().url);
                },
            });
        }
    };

    const handleDownloadPdf = () => {
        if (downloadingPdf) return;

        setDownloadingPdf(true);

        try {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.visibility = 'hidden';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.setAttribute('aria-hidden', 'true');

            iframe.src = offers.downloadPdf({ offer: offer.uuid }).url;

            document.body.appendChild(iframe);

            setTimeout(() => {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
                setDownloadingPdf(false);
            }, 1000);
        } catch (error) {
            console.error('Errore nello scaricare il PDF:', error);
            setDownloadingPdf(false);
            alert(
                error instanceof Error
                    ? `Errore nello scaricare il PDF: ${error.message}`
                    : 'Errore nello scaricare il PDF. Riprova.',
            );
        }
    };

    // Formattare data per input type="date"
    const formatDateForInput = (dateString?: string): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Offerta ${offer.offer_number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Offerta {offer.offer_number}
                        </h1>
                        {offer.offer_date && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                Data:{' '}
                                {new Date(
                                    offer.offer_date,
                                ).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDownloadPdf();
                            }}
                            disabled={downloadingPdf}
                        >
                            {downloadingPdf ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generando PDF...
                                </>
                            ) : (
                                <>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Genera PDF
                                </>
                            )}
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={offers.edit({ offer: offer.uuid }).url}>
                                Modifica
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Elimina
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Dettagli Offerta</CardTitle>
                        <CardDescription>
                            Informazioni complete sull'offerta
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {/* Sezione: Informazione Generale (senza titolo/separatore visivo extra) */}
                        {/* Contenitore centrato con righe titolo-input */}
                        <div className="flex justify-center">
                            <div className="w-full max-w-4xl space-y-1">
                                {/* Numero Offerta */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="offer_number"
                                        className="text-left"
                                    >
                                        Numero Offerta
                                    </Label>
                                    <Input
                                        id="offer_number"
                                        name="offer_number"
                                        type="text"
                                        value={offer.offer_number}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>

                                {/* Data Offerta */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="offer_date"
                                        className="text-left"
                                    >
                                        Data Offerta
                                    </Label>
                                    <Input
                                        id="offer_date"
                                        name="offer_date"
                                        type="date"
                                        value={formatDateForInput(
                                            offer.offer_date,
                                        )}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>

                                {/* Data Validità */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="validity_date"
                                        className="text-left"
                                    >
                                        Data Validità
                                    </Label>
                                    <Input
                                        id="validity_date"
                                        name="validity_date"
                                        type="date"
                                        value={formatDateForInput(
                                            offer.validity_date,
                                        )}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    {/* Sezione: Dati Cliente */}
                    <div className="space-y-1 rounded-md bg-muted/30 px-3 py-2">
                        {/* Contenitore centrato con righe titolo-input */}
                        <div className="flex justify-center">
                            <div className="w-full max-w-4xl space-y-1">
                                {/* Cliente */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="customer_uuid"
                                        className="text-left"
                                    >
                                        Cliente
                                    </Label>
                                    <Input
                                        id="customer_uuid"
                                        name="customer_uuid"
                                        type="text"
                                        value={
                                            offer.customer
                                                ? `${offer.customer.code || ''}${offer.customer.code ? ' - ' : ''}${offer.customer.company_name || ''}`
                                                : ''
                                        }
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>

                                {/* Divisione */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="customerdivision_uuid"
                                        className="text-left"
                                    >
                                        Divisione
                                    </Label>
                                    <Input
                                        id="customerdivision_uuid"
                                        name="customerdivision_uuid"
                                        type="text"
                                        value={
                                            offer.customerDivision?.name || ''
                                        }
                                        readOnly
                                        className={
                                            offer.customerDivision?.name
                                                ? 'bg-muted'
                                                : 'bg-muted/50 text-muted-foreground italic'
                                        }
                                        placeholder={
                                            offer.customerDivision?.name
                                                ? undefined
                                                : 'Non specificato'
                                        }
                                    />
                                </div>

                                {/* Rif. Cliente */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="customer_ref"
                                        className="text-left"
                                    >
                                        Rif. Cliente
                                    </Label>
                                    <Input
                                        id="customer_ref"
                                        name="customer_ref"
                                        type="text"
                                        value={offer.customer_ref || ''}
                                        readOnly
                                        className={
                                            offer.customer_ref
                                                ? 'bg-muted'
                                                : 'bg-muted/50 text-muted-foreground italic'
                                        }
                                        placeholder={
                                            offer.customer_ref
                                                ? undefined
                                                : 'Non specificato'
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sezione: Classificazione */}
                    <div className="space-y-1 rounded-md bg-muted/30 px-3 py-2">
                        {/* Contenitore centrato con righe titolo-input */}
                        <div className="flex justify-center">
                            <div className="w-full max-w-4xl space-y-1">
                                {/* Attività */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="activity_uuid"
                                        className="text-left"
                                    >
                                        Attività
                                    </Label>
                                    <Input
                                        id="activity_uuid"
                                        name="activity_uuid"
                                        type="text"
                                        value={offer.activity?.name || ''}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>

                                {/* Settore */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="sector_uuid"
                                        className="text-left"
                                    >
                                        Settore
                                    </Label>
                                    <Input
                                        id="sector_uuid"
                                        name="sector_uuid"
                                        type="text"
                                        value={offer.sector?.name || ''}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>

                                {/* Stagionalità */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="type_uuid"
                                        className="text-left"
                                    >
                                        Stagionalità
                                    </Label>
                                    <Input
                                        id="type_uuid"
                                        name="type_uuid"
                                        type="text"
                                        value={offer.seasonality?.name || ''}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>

                                {/* Tipo Ordine */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="order_type_uuid"
                                        className="text-left"
                                    >
                                        Tipo Ordine
                                    </Label>
                                    <Input
                                        id="order_type_uuid"
                                        name="order_type_uuid"
                                        type="text"
                                        value={offer.typeOrder?.name || ''}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sezione: Dati LAS */}
                    <div className="space-y-1 rounded-md bg-muted/30 px-3 py-2">
                        {/* Contenitore centrato con righe titolo-input */}
                        <div className="flex justify-center">
                            <div className="w-full max-w-4xl space-y-1">
                                {/* Famiglia LAS */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="lasfamily_uuid"
                                        className="text-left"
                                    >
                                        Famiglia LAS
                                    </Label>
                                    <Input
                                        id="lasfamily_uuid"
                                        name="lasfamily_uuid"
                                        type="text"
                                        value={
                                            offer.lasFamily
                                                ? `${offer.lasFamily.code || ''} - ${offer.lasFamily.name || ''}`
                                                : ''
                                        }
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>

                                {/* L&S Risorsa */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="lsresource_uuid"
                                        className="text-left"
                                    >
                                        L&S Risorsa
                                    </Label>
                                    <Input
                                        id="lsresource_uuid"
                                        name="lsresource_uuid"
                                        type="text"
                                        value={
                                            offer.lsResource
                                                ? `${offer.lsResource.code || ''} - ${offer.lsResource.name || ''}`
                                                : ''
                                        }
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>

                                {/* Linea di Lavoro LAS */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="lasworkline_uuid"
                                        className="text-left"
                                    >
                                        Linea di Lavoro LAS
                                    </Label>
                                    <Input
                                        id="lasworkline_uuid"
                                        name="lasworkline_uuid"
                                        type="text"
                                        value={
                                            offer.lasWorkLine
                                                ? `${offer.lasWorkLine.code || ''} - ${offer.lasWorkLine.name || ''}`
                                                : ''
                                        }
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sezione: Dati Articolo */}
                    <div className="space-y-1">
                        {/* Contenitore centrato con righe titolo-input */}
                        <div className="flex justify-center">
                            <div className="w-full max-w-4xl space-y-1">
                                {/* Codice articolo di riferimento */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="article_code_ref"
                                        className="text-left"
                                    >
                                        Codice articolo di riferimento
                                    </Label>
                                    <Input
                                        id="article_code_ref"
                                        name="article_code_ref"
                                        type="text"
                                        value={offer.article_code_ref || ''}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>

                                {/* Descrizione provvisoria */}
                                <div className="grid grid-cols-2 items-start gap-4">
                                    <Label
                                        htmlFor="provisional_description"
                                        className="pt-2 text-left"
                                    >
                                        Descrizione provvisoria
                                    </Label>
                                    <Textarea
                                        id="provisional_description"
                                        name="provisional_description"
                                        value={
                                            offer.provisional_description || ''
                                        }
                                        readOnly
                                        className="bg-muted"
                                        rows={3}
                                    />
                                </div>

                                {/* Unità di Misura */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="unit_of_measure"
                                        className="text-left"
                                    >
                                        Unità di Misura
                                    </Label>
                                    <Input
                                        id="unit_of_measure"
                                        name="unit_of_measure"
                                        type="text"
                                        value={offer.unit_of_measure || ''}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </div>

                                {/* Quantità */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="quantity"
                                        className="text-left"
                                    >
                                        Quantità
                                    </Label>
                                    <Input
                                        id="quantity"
                                        name="quantity"
                                        type="text"
                                        value={
                                            offer.quantity !== null &&
                                            offer.quantity !== undefined
                                                ? formatNumber(offer.quantity)
                                                : ''
                                        }
                                        readOnly
                                        className="bg-muted text-right font-mono tabular-nums"
                                    />
                                </div>

                                {/* Pezzo */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="piece"
                                        className="text-left"
                                    >
                                        Pz
                                    </Label>
                                    <Input
                                        id="piece"
                                        name="piece"
                                        type="text"
                                        value={
                                            offer.piece !== null &&
                                            offer.piece !== undefined
                                                ? formatNumber(offer.piece)
                                                : ''
                                        }
                                        readOnly
                                        className="bg-muted text-right font-mono tabular-nums"
                                    />
                                </div>

                                {/* Peso dichiarato gr/cfz */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="declared_weight_cfz"
                                        className="text-left"
                                    >
                                        Peso dichiarato gr/cfz
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="declared_weight_cfz"
                                            name="declared_weight_cfz"
                                            type="text"
                                            value={
                                                offer.declared_weight_cfz !==
                                                    null &&
                                                offer.declared_weight_cfz !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.declared_weight_cfz,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            gr/cfz
                                        </span>
                                    </div>
                                </div>

                                {/* Peso dichiarato gr/pz */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="declared_weight_pz"
                                        className="text-left"
                                    >
                                        Peso dichiarato gr/pz
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="declared_weight_pz"
                                            name="declared_weight_pz"
                                            type="text"
                                            value={
                                                offer.declared_weight_pz !==
                                                    null &&
                                                offer.declared_weight_pz !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.declared_weight_pz,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            gr/pz
                                        </span>
                                    </div>
                                </div>

                                {/* Note */}
                                <div className="grid grid-cols-2 items-start gap-4">
                                    <Label
                                        htmlFor="notes"
                                        className="pt-2 text-left"
                                    >
                                        Note
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        name="notes"
                                        value={offer.notes || ''}
                                        readOnly
                                        className={
                                            offer.notes
                                                ? 'bg-muted'
                                                : 'bg-muted/50 text-muted-foreground italic'
                                        }
                                        placeholder={
                                            offer.notes
                                                ? undefined
                                                : 'Nessuna nota'
                                        }
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sezione: Operazioni */}
                    <div className="space-y-1">
                        {offer.operations && offer.operations.length > 0 ? (
                            <div className="overflow-hidden rounded-md border">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="px-4 py-3 text-left text-sm font-medium">
                                                    Categoria
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">
                                                    Operazione
                                                </th>
                                                <th className="px-4 py-3 text-right text-sm font-medium">
                                                    Secondi
                                                </th>
                                                <th className="px-4 py-3 text-right text-sm font-medium">
                                                    N° Op
                                                </th>
                                                <th className="px-4 py-3 text-right text-sm font-medium">
                                                    Totale
                                                </th>
                                                <th className="px-4 py-3 text-right text-sm font-medium">
                                                    Allegato
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {offer.operations.map(
                                                (operation, index) => (
                                                    <tr
                                                        key={
                                                            operation.uuid ||
                                                            index
                                                        }
                                                        className={`border-b ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                                                    >
                                                        <td className="px-4 py-3 text-sm">
                                                            {operation.category
                                                                ?.name || '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">{`${operation.codice_univoco || ''} - ${operation.descrizione || ''}`}</td>
                                                        <td className="px-4 py-3 text-right font-mono text-sm tabular-nums">
                                                            {formatNumber(
                                                                operation.secondi_operazione,
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-mono text-sm tabular-nums">
                                                            {formatInteger(
                                                                operation.num_op,
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums">
                                                            {formatNumber(
                                                                operation.total_sec,
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-right text-sm">
                                                            {operation.filename ? (
                                                                <button
                                                                    type="button"
                                                                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-primary transition-colors hover:bg-muted/60 hover:text-primary/80"
                                                                    onClick={() => {
                                                                        window.location.href =
                                                                            offerOperations.downloadFile(
                                                                                {
                                                                                    offerOperation:
                                                                                        operation.uuid,
                                                                                },
                                                                            ).url;
                                                                    }}
                                                                    title="Scarica allegato"
                                                                    aria-label="Scarica allegato operazione"
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                </button>
                                                            ) : (
                                                                <span className="text-muted-foreground">
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <div className="w-full max-w-4xl">
                                    <div className="grid grid-cols-2 items-center gap-4">
                                        <Label className="text-left">
                                            Operazioni
                                        </Label>
                                        <p className="text-muted-foreground italic">
                                            Nessuna offerta presente
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Sezione: Calcoli Tempo */}
                    <div className="space-y-1 rounded-md bg-muted/30 px-3 py-2">
                        {/* Contenitore centrato con righe titolo-input */}
                        <div className="flex justify-center">
                            <div className="w-full max-w-4xl space-y-1">
                                {/* Tempo teorico (sec/cfz) */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="theoretical_time_cfz"
                                        className="text-left"
                                    >
                                        Tempo teorico (sec/cfz)
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="theoretical_time_cfz"
                                            name="theoretical_time_cfz"
                                            type="text"
                                            value={
                                                offer.theoretical_time_cfz !==
                                                    null &&
                                                offer.theoretical_time_cfz !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.theoretical_time_cfz,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            sec/cfz
                                        </span>
                                    </div>
                                </div>

                                {/* Imprevisti */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="unexpected"
                                        className="text-left"
                                    >
                                        Imprevisti
                                    </Label>
                                    <Input
                                        id="unexpected"
                                        name="unexpected"
                                        type="text"
                                        value={
                                            offer.unexpected !== null &&
                                            offer.unexpected !== undefined
                                                ? formatNumber(offer.unexpected)
                                                : ''
                                        }
                                        readOnly
                                        className="bg-muted text-right font-mono tabular-nums"
                                    />
                                </div>

                                {/* Tempo teorico totale (sec/cfz) */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="total_theoretical_time"
                                        className="text-left"
                                    >
                                        Tempo teorico totale (sec/cfz)
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="total_theoretical_time"
                                            name="total_theoretical_time"
                                            type="text"
                                            value={
                                                offer.total_theoretical_time !==
                                                    null &&
                                                offer.total_theoretical_time !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.total_theoretical_time,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            sec/cfz
                                        </span>
                                    </div>
                                </div>

                                {/* Tempo teorico (sec/pz) */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="theoretical_time"
                                        className="text-left"
                                    >
                                        Tempo teorico (sec/pz)
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="theoretical_time"
                                            name="theoretical_time"
                                            type="text"
                                            value={
                                                offer.theoretical_time !==
                                                    null &&
                                                offer.theoretical_time !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.theoretical_time,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            sec/pz
                                        </span>
                                    </div>
                                </div>

                                {/* Tempo produzione (sec/cfz) */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="production_time_cfz"
                                        className="text-left"
                                    >
                                        Tempo produzione (sec/cfz)
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="production_time_cfz"
                                            name="production_time_cfz"
                                            type="text"
                                            value={
                                                offer.production_time_cfz !==
                                                    null &&
                                                offer.production_time_cfz !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.production_time_cfz,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            sec/cfz
                                        </span>
                                    </div>
                                </div>

                                {/* Tempo produzione (sec/pz) */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="production_time"
                                        className="text-left"
                                    >
                                        Tempo produzione (sec/pz)
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="production_time"
                                            name="production_time"
                                            type="text"
                                            value={
                                                offer.production_time !==
                                                    null &&
                                                offer.production_time !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.production_time,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            sec/pz
                                        </span>
                                    </div>
                                </div>

                                {/* Media prevista (cfz/h/ps) */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="production_average_cfz"
                                        className="text-left"
                                    >
                                        Media prevista (cfz/h/ps)
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="production_average_cfz"
                                            name="production_average_cfz"
                                            type="text"
                                            value={
                                                offer.production_average_cfz !==
                                                    null &&
                                                offer.production_average_cfz !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.production_average_cfz,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            cfz/h/ps
                                        </span>
                                    </div>
                                </div>

                                {/* Media prevista (pz/h/ps) */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="production_average_pz"
                                        className="text-left"
                                    >
                                        Media prevista (pz/h/ps)
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="production_average_pz"
                                            name="production_average_pz"
                                            type="text"
                                            value={
                                                offer.production_average_pz !==
                                                    null &&
                                                offer.production_average_pz !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.production_average_pz,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            pz/h/ps
                                        </span>
                                    </div>
                                </div>

                                {/* Addetti previsti */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="expected_workers"
                                        className="text-left"
                                    >
                                        Addetti previsti
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="expected_workers"
                                            name="expected_workers"
                                            type="text"
                                            value={
                                                offer.expected_workers !==
                                                    null &&
                                                offer.expected_workers !==
                                                    undefined
                                                    ? formatInteger(
                                                          offer.expected_workers,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            pz/h/ps
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sezione: Tariffe e Costi */}
                    <div className="space-y-1 rounded-md bg-muted/30 px-3 py-2">
                        {/* Contenitore centrato con righe titolo-input */}
                        <div className="flex justify-center">
                            <div className="w-full max-w-4xl space-y-1">
                                {/* Ricavo Manodopera prevista */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="expected_revenue"
                                        className="text-left"
                                    >
                                        Ricavo Manodopera prevista
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="expected_revenue"
                                            name="expected_revenue"
                                            type="text"
                                            value={
                                                offer.expected_revenue !==
                                                    null &&
                                                offer.expected_revenue !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.expected_revenue,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            €
                                        </span>
                                    </div>
                                </div>

                                {/* Tariffa mdo cfz */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="rate_cfz"
                                        className="text-left"
                                    >
                                        Tariffa mdo cfz
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="rate_cfz"
                                            name="rate_cfz"
                                            type="text"
                                            value={
                                                offer.rate_cfz !== null &&
                                                offer.rate_cfz !== undefined
                                                    ? formatNumber(
                                                          offer.rate_cfz,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            cfz
                                        </span>
                                    </div>
                                </div>

                                {/* Tariffa mdo pz */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="rate_pz"
                                        className="text-left"
                                    >
                                        Tariffa mdo pz
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="rate_pz"
                                            name="rate_pz"
                                            type="text"
                                            value={
                                                offer.rate_pz !== null &&
                                                offer.rate_pz !== undefined
                                                    ? formatNumber(
                                                          offer.rate_pz,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            pz
                                        </span>
                                    </div>
                                </div>

                                {/* Tariffa mdo cfz arrotondata */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="rate_rounding_cfz"
                                        className="text-left"
                                    >
                                        Tariffa mdo cfz arrotondata
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="rate_rounding_cfz"
                                            name="rate_rounding_cfz"
                                            type="text"
                                            value={
                                                offer.rate_rounding_cfz !==
                                                    null &&
                                                offer.rate_rounding_cfz !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.rate_rounding_cfz,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            cfz
                                        </span>
                                    </div>
                                </div>

                                {/* Aumento/sconto tariffa cfz */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="rate_increase_cfz"
                                        className="text-left"
                                    >
                                        Aumento/sconto tariffa cfz
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="rate_increase_cfz"
                                            name="rate_increase_cfz"
                                            type="text"
                                            value={
                                                offer.rate_increase_cfz !==
                                                    null &&
                                                offer.rate_increase_cfz !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.rate_increase_cfz,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            cfz
                                        </span>
                                    </div>
                                </div>

                                {/* Tariffa mdo cfz arrotondata % */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="rate_rounding_cfz_perc"
                                        className="text-left"
                                    >
                                        Tariffa mdo cfz arrotondata %
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="rate_rounding_cfz_perc"
                                            name="rate_rounding_cfz_perc"
                                            type="text"
                                            value={
                                                offer.rate_rounding_cfz_perc !==
                                                    null &&
                                                offer.rate_rounding_cfz_perc !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.rate_rounding_cfz_perc,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* Tariffa definitiva mdo cfz */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="final_rate_cfz"
                                        className="text-left"
                                    >
                                        Tariffa definitiva mdo cfz
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="final_rate_cfz"
                                            name="final_rate_cfz"
                                            type="text"
                                            value={
                                                offer.final_rate_cfz !== null &&
                                                offer.final_rate_cfz !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.final_rate_cfz,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            cfz
                                        </span>
                                    </div>
                                </div>

                                {/* Tariffa definitiva mdo pz */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="final_rate_pz"
                                        className="text-left"
                                    >
                                        Tariffa definitiva mdo pz
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="final_rate_pz"
                                            name="final_rate_pz"
                                            type="text"
                                            value={
                                                offer.final_rate_pz !== null &&
                                                offer.final_rate_pz !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.final_rate_pz,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            pz
                                        </span>
                                    </div>
                                </div>

                                {/* Euro materiali */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="materials_euro"
                                        className="text-left"
                                    >
                                        Euro materiali
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="materials_euro"
                                            name="materials_euro"
                                            type="text"
                                            value={
                                                offer.materials_euro !== null &&
                                                offer.materials_euro !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.materials_euro,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            €
                                        </span>
                                    </div>
                                </div>

                                {/* Euro logistica */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="logistics_euro"
                                        className="text-left"
                                    >
                                        Euro logistica
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="logistics_euro"
                                            name="logistics_euro"
                                            type="text"
                                            value={
                                                offer.logistics_euro !== null &&
                                                offer.logistics_euro !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.logistics_euro,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            €
                                        </span>
                                    </div>
                                </div>

                                {/* Euro altro */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="other_euro"
                                        className="text-left"
                                    >
                                        Euro altro
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="other_euro"
                                            name="other_euro"
                                            type="text"
                                            value={
                                                offer.other_euro !== null &&
                                                offer.other_euro !== undefined
                                                    ? formatNumber(
                                                          offer.other_euro,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            €
                                        </span>
                                    </div>
                                </div>

                                {/* Tariffa totale cfz */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="total_rate_cfz"
                                        className="text-left"
                                    >
                                        Tariffa totale cfz
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="total_rate_cfz"
                                            name="total_rate_cfz"
                                            type="text"
                                            value={
                                                offer.total_rate_cfz !== null &&
                                                offer.total_rate_cfz !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.total_rate_cfz,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            cfz
                                        </span>
                                    </div>
                                </div>

                                {/* Tariffa totale pz */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="total_rate_pz"
                                        className="text-left"
                                    >
                                        Tariffa totale pz
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="total_rate_pz"
                                            name="total_rate_pz"
                                            type="text"
                                            value={
                                                offer.total_rate_pz !== null &&
                                                offer.total_rate_pz !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.total_rate_pz,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            pz
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sezione: Informazioni Aggiuntive */}
                    <div className="space-y-1">
                        {/* Contenitore centrato con righe titolo-input */}
                        <div className="flex justify-center">
                            <div className="w-full max-w-4xl space-y-1">
                                {/* Note sull'offerta */}
                                <div className="grid grid-cols-2 items-start gap-4">
                                    <Label
                                        htmlFor="offer_notes"
                                        className="pt-2 text-left"
                                    >
                                        Note sull'offerta
                                    </Label>
                                    <Textarea
                                        id="offer_notes"
                                        name="offer_notes"
                                        value={offer.offer_notes || ''}
                                        readOnly
                                        className={
                                            offer.offer_notes
                                                ? 'bg-muted'
                                                : 'bg-muted/50 text-muted-foreground italic'
                                        }
                                        placeholder={
                                            offer.offer_notes
                                                ? undefined
                                                : 'Nessuna nota'
                                        }
                                        rows={3}
                                    />
                                </div>

                                {/* L&S Costo setup (%) */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="ls_setup_cost"
                                        className="text-left"
                                    >
                                        L&S Costo setup (%)
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="ls_setup_cost"
                                            name="ls_setup_cost"
                                            type="text"
                                            value={
                                                offer.ls_setup_cost !== null &&
                                                offer.ls_setup_cost !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.ls_setup_cost,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            %
                                        </span>
                                    </div>
                                </div>

                                {/* L&S Altri costi */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="ls_other_costs"
                                        className="text-left"
                                    >
                                        L&S Altri costi
                                    </Label>
                                    <div className="flex">
                                        <Input
                                            id="ls_other_costs"
                                            name="ls_other_costs"
                                            type="text"
                                            value={
                                                offer.ls_other_costs !== null &&
                                                offer.ls_other_costs !==
                                                    undefined
                                                    ? formatNumber(
                                                          offer.ls_other_costs,
                                                      )
                                                    : ''
                                            }
                                            readOnly
                                            className="rounded-r-none bg-muted text-right font-mono tabular-nums"
                                        />
                                        <span className="inline-flex items-center rounded-r-md border border-l-0 bg-muted px-3 text-sm">
                                            €
                                        </span>
                                    </div>
                                </div>

                                {/* Approvazione */}
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <Label
                                        htmlFor="approval_status"
                                        className="text-left"
                                    >
                                        Approvazione
                                    </Label>
                                    <Input
                                        id="approval_status"
                                        name="approval_status"
                                        type="text"
                                        value={offer.approval_status || ''}
                                        readOnly
                                        className={
                                            offer.approval_status
                                                ? 'bg-muted'
                                                : 'bg-muted/50 text-muted-foreground italic'
                                        }
                                        placeholder={
                                            offer.approval_status
                                                ? undefined
                                                : 'Non specificato'
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}

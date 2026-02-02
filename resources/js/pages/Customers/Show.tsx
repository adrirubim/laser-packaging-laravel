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
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import customerDivisions from '@/routes/customer-divisions';
import customers from '@/routes/customers';
import offers from '@/routes/offers';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, Edit, FileText, MapPin, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Division = {
    id: number;
    uuid: string;
    name: string;
    code?: string | null;
};

type Offer = {
    id: number;
    uuid: string;
    offer_number: string;
    offer_date?: string;
    description?: string | null;
};

type Customer = {
    id: number;
    uuid: string;
    code: string;
    company_name: string;
    vat_number?: string | null;
    co?: string | null;
    street?: string | null;
    postal_code?: string | null;
    city?: string | null;
    province?: string | null;
    country?: string | null;
    divisions?: Division[];
    offers?: Offer[];
};

type CustomersShowProps = {
    customer: Customer;
};

export default function CustomersShow({ customer }: CustomersShowProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Clienti',
            href: customers.index().url,
        },
        {
            title: customer.code,
            href: customers.show({ customer: customer.uuid }).url,
        },
    ];

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(customers.destroy({ customer: customer.uuid }).url, {
            onSuccess: () => {
                router.visit(customers.index().url);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Cliente ${customer.code}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                            <h1 className="text-2xl font-bold">
                                {customer.company_name}
                            </h1>
                            <div className="flex items-center gap-2">
                                {customer.divisions &&
                                    customer.divisions.length > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="gap-1"
                                        >
                                            <Building2 className="h-3 w-3" />
                                            {customer.divisions.length}{' '}
                                            {customer.divisions.length === 1
                                                ? 'Divisione'
                                                : 'Divisioni'}
                                        </Badge>
                                    )}
                                {customer.offers &&
                                    customer.offers.length > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="gap-1"
                                        >
                                            <FileText className="h-3 w-3" />
                                            {customer.offers.length}{' '}
                                            {customer.offers.length === 1
                                                ? 'Offerta'
                                                : 'Offerte'}
                                        </Badge>
                                    )}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Codice:{' '}
                            <span className="font-mono">{customer.code}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    customers.edit({ customer: customer.uuid })
                                        .url
                                }
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifica
                            </Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    disabled={isDeleting}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Elimina
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Conferma eliminazione
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Sei sicuro di voler eliminare il cliente{' '}
                                        <strong>{customer.company_name}</strong>{' '}
                                        (Codice: {customer.code})?
                                        <br />
                                        <br />
                                        Questa azione non può essere annullata.
                                        Tutti i dati associati a questo cliente
                                        verranno eliminati definitivamente.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isDeleting}>
                                        Annulla
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                Eliminando...
                                            </>
                                        ) : (
                                            'Elimina definitivamente'
                                        )}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dettagli Cliente</CardTitle>
                            <CardDescription>
                                Informazioni di base su questo cliente
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Codice
                                </Label>
                                <p className="font-mono text-lg font-semibold">
                                    {customer.code}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Ragione Sociale
                                </Label>
                                <p className="text-lg font-semibold">
                                    {customer.company_name}
                                </p>
                            </div>

                            {customer.vat_number && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Partita IVA
                                    </Label>
                                    <p>{customer.vat_number}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Indirizzo</CardTitle>
                            <CardDescription>
                                Indirizzo completo del cliente
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {customer.street && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Via
                                    </Label>
                                    <p className="text-lg font-semibold">
                                        {customer.street}
                                    </p>
                                </div>
                            )}

                            {customer.co && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        C/O
                                    </Label>
                                    <p>{customer.co}</p>
                                </div>
                            )}

                            {(customer.city ||
                                customer.postal_code ||
                                customer.province) && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Località
                                    </Label>
                                    <p className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        {[
                                            customer.city,
                                            customer.postal_code
                                                ? `(${customer.postal_code})`
                                                : null,
                                            customer.province,
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                    </p>
                                </div>
                            )}

                            {customer.country && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Nazione
                                    </Label>
                                    <p>{customer.country}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Divisioni</CardTitle>
                                <CardDescription>
                                    Divisioni del cliente
                                </CardDescription>
                            </div>
                            <Button asChild size="sm" variant="outline">
                                <Link
                                    href={
                                        customerDivisions.create({
                                            query: {
                                                customer_uuid: customer.uuid,
                                            },
                                        }).url
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nuova Divisione
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {customer.divisions && customer.divisions.length > 0 ? (
                            <div className="space-y-2">
                                {customer.divisions.map((division) => (
                                    <Link
                                        key={division.uuid}
                                        href={
                                            customerDivisions.show({
                                                customerDivision: division.uuid,
                                            }).url
                                        }
                                        className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {division.name}
                                            </p>
                                            {division.code && (
                                                <p className="text-sm text-muted-foreground">
                                                    Codice: {division.code}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground">
                                <Building2 className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                <p>
                                    Nessuna divisione associata a questo
                                    cliente.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Offerte Associate</CardTitle>
                                <CardDescription>
                                    Offerte collegate a questo cliente
                                </CardDescription>
                            </div>
                            <Button asChild size="sm" variant="outline">
                                <Link
                                    href={
                                        offers.create({
                                            query: {
                                                customer_uuid: customer.uuid,
                                            },
                                        }).url
                                    }
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nuova Offerta
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {customer.offers && customer.offers.length > 0 ? (
                            <div className="space-y-2">
                                {customer.offers.map((offer) => (
                                    <Link
                                        key={offer.uuid}
                                        href={
                                            offers.show({ offer: offer.uuid })
                                                .url
                                        }
                                        className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div>
                                            <p className="font-mono font-medium">
                                                {offer.offer_number}
                                            </p>
                                            {offer.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {offer.description}
                                                </p>
                                            )}
                                            {offer.offer_date && (
                                                <p className="text-xs text-muted-foreground">
                                                    Data:{' '}
                                                    {new Date(
                                                        offer.offer_date,
                                                    ).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground">
                                <FileText className="mx-auto mb-2 h-8 w-8 opacity-50" />
                                <p>
                                    Nessuna offerta associata a questo cliente.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

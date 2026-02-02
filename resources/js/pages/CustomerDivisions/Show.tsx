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
import customerShippingAddresses from '@/routes/customer-shipping-addresses';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye } from 'lucide-react';

type Customer = {
    uuid: string;
    company_name: string;
};

type ShippingAddress = {
    id: number;
    uuid: string;
    street: string;
    city: string;
    postal_code?: string | null;
    co?: string | null;
};

type CustomerDivision = {
    id: number;
    uuid: string;
    name: string;
    code?: string | null;
    customer?: Customer | null;
    shippingAddresses?: ShippingAddress[];
    shipping_addresses?: ShippingAddress[]; // Laravel puede serializar en snake_case
};

type CustomerDivisionsShowProps = {
    division: CustomerDivision;
};

export default function CustomerDivisionsShow({
    division,
}: CustomerDivisionsShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Divisioni Clienti',
            href: customerDivisions.index().url,
        },
        {
            title: division.name,
            href: customerDivisions.show({ customerDivision: division.uuid })
                .url,
        },
    ];

    const handleDelete = () => {
        if (
            confirm(
                'Sei sicuro di voler eliminare questa divisione? Questa azione non può essere annullata.',
            )
        ) {
            router.delete(
                customerDivisions.destroy({ customerDivision: division.uuid })
                    .url,
                {
                    onSuccess: () => {
                        router.visit(customerDivisions.index().url);
                    },
                },
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Divisione Cliente ${division.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{division.name}</h1>
                        {division.code && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                Codice: {division.code}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    customerDivisions.edit({
                                        customerDivision: division.uuid,
                                    }).url
                                }
                            >
                                Modifica
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Elimina
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dettagli Divisione</CardTitle>
                            <CardDescription>
                                Informazioni di base su questa divisione
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Nome
                                </Label>
                                <p className="text-lg font-semibold">
                                    {division.name}
                                </p>
                            </div>

                            {division.code && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Codice
                                    </Label>
                                    <p className="font-mono">{division.code}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informazioni Cliente</CardTitle>
                            <CardDescription>
                                Dettagli del cliente di appartenenza
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {division.customer && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Cliente
                                    </Label>
                                    <p className="text-lg font-semibold">
                                        {division.customer.company_name}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {(() => {
                    const addresses =
                        division.shippingAddresses ||
                        division.shipping_addresses ||
                        [];
                    return addresses.length > 0 ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Indirizzi di Spedizione</CardTitle>
                                <CardDescription>
                                    Indirizzi associati a questa divisione
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {addresses.map((address) => (
                                        <Link
                                            key={address.uuid}
                                            href={
                                                customerShippingAddresses.show({
                                                    customerShippingAddress:
                                                        address.uuid,
                                                }).url
                                            }
                                            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {address.street}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {address.city}{' '}
                                                    {address.postal_code
                                                        ? `(${address.postal_code})`
                                                        : ''}
                                                </p>
                                                {address.co && (
                                                    <p className="text-xs text-muted-foreground">
                                                        c/o: {address.co}
                                                    </p>
                                                )}
                                            </div>
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                <p>
                                    Nessun indirizzo di spedizione associato a
                                    questa divisione.
                                </p>
                            </CardContent>
                        </Card>
                    );
                })()}
            </div>
        </AppLayout>
    );
}

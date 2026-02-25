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
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import customerDivisions from '@/routes/customer-divisions/index';
import customerShippingAddresses from '@/routes/customer-shipping-addresses/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

type Customer = {
    uuid: string;
    company_name: string;
};

type CustomerDivision = {
    id: number;
    uuid: string;
    name: string;
    customer?: Customer | null;
};

type Order = {
    uuid: string;
    order_production_number: string;
    quantity?: number | null;
};

type CustomerShippingAddress = {
    id: number;
    uuid: string;
    street: string;
    city: string;
    postal_code?: string | null;
    province?: string | null;
    country?: string | null;
    co?: string | null;
    contacts?: string | null;
    customerDivision?: CustomerDivision | null;
    customer_division?: CustomerDivision | null; // Laravel serializa en snake_case
    orders?: Order[];
};

type CustomerShippingAddressesShowProps = {
    address: CustomerShippingAddress;
};

export default function CustomerShippingAddressesShow({
    address,
}: CustomerShippingAddressesShowProps) {
    const { t } = useTranslations();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('customer_shipping_addresses.index.title'),
            href: customerShippingAddresses.index().url,
        },
        {
            title: address.street,
            href: customerShippingAddresses.show({
                customerShippingAddress: address.uuid,
            }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        setIsDeleting(true);
        router.delete(
            customerShippingAddresses.destroy({
                customerShippingAddress: address.uuid,
            }).url,
            {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    router.visit(customerShippingAddresses.index().url);
                },
                onFinish: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('customer_shipping_addresses.show.page_title', {
                    street: address.street,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{address.street}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {address.city}{' '}
                            {address.postal_code
                                ? `(${address.postal_code})`
                                : ''}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    customerShippingAddresses.edit({
                                        customerShippingAddress: address.uuid,
                                    }).url
                                }
                            >
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

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t(
                                    'customer_shipping_addresses.show.details_title',
                                )}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'customer_shipping_addresses.show.details_subtitle',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t(
                                        'customer_shipping_addresses.table.street',
                                    )}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {address.street}
                                </p>
                            </div>

                            {address.co && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'customer_shipping_addresses.table.co',
                                        )}
                                    </Label>
                                    <p>{address.co}</p>
                                </div>
                            )}

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t(
                                        'customer_shipping_addresses.table.city',
                                    )}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {address.city}
                                </p>
                            </div>

                            {address.postal_code && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'customer_shipping_addresses.table.cap',
                                        )}
                                    </Label>
                                    <p>{address.postal_code}</p>
                                </div>
                            )}

                            {address.province && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'customer_shipping_addresses.table.province',
                                        )}
                                    </Label>
                                    <p>{address.province}</p>
                                </div>
                            )}

                            {address.country && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'customer_shipping_addresses.table.country',
                                        )}
                                    </Label>
                                    <p>{address.country}</p>
                                </div>
                            )}

                            {address.contacts && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'customer_shipping_addresses.table.contacts',
                                        )}
                                    </Label>
                                    <p>{address.contacts}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t(
                                    'customer_shipping_addresses.show.division_title',
                                )}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'customer_shipping_addresses.show.division_subtitle',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(() => {
                                const division =
                                    address.customerDivision ||
                                    address.customer_division;
                                if (!division) return null;

                                return (
                                    <>
                                        {division.customer && (
                                            <div>
                                                <Label className="text-sm font-medium text-muted-foreground">
                                                    {t(
                                                        'customer_divisions.show.customer_label',
                                                    )}
                                                </Label>
                                                <p className="text-lg font-semibold">
                                                    {
                                                        division.customer
                                                            .company_name
                                                    }
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">
                                                {t(
                                                    'customer_shipping_addresses.index.division_label',
                                                )}
                                            </Label>
                                            <Link
                                                href={
                                                    customerDivisions.show({
                                                        customerDivision:
                                                            division.uuid,
                                                    }).url
                                                }
                                                className="text-lg font-semibold text-primary hover:underline"
                                            >
                                                {division.name}
                                            </Link>
                                        </div>
                                    </>
                                );
                            })()}
                        </CardContent>
                    </Card>
                </div>

                {address.orders && address.orders.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t(
                                    'customer_shipping_addresses.show.orders_title',
                                )}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'customer_shipping_addresses.show.orders_subtitle',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {address.orders.map((order) => (
                                    <div
                                        key={order.uuid}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                        <div>
                                            <p className="font-mono font-medium">
                                                {order.order_production_number}
                                            </p>
                                            {order.quantity !== null &&
                                                order.quantity !==
                                                    undefined && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Quantità:{' '}
                                                        {order.quantity}
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {(!address.orders || address.orders.length === 0) && (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <p>
                                {t(
                                    'customer_shipping_addresses.show.orders_empty',
                                )}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title={t('customer_shipping_addresses.delete_title')}
                description={t(
                    'customer_shipping_addresses.delete_description',
                )}
                itemName={`${address.street}${
                    address.city ? `, ${address.city}` : ''
                }${address.postal_code ? ` (${address.postal_code})` : ''}`}
            />
        </AppLayout>
    );
}

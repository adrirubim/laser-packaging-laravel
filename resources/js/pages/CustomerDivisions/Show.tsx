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
import { Eye } from 'lucide-react';
import { useState } from 'react';

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
    const { t } = useTranslations();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('customer_divisions.index.title'),
            href: customerDivisions.index().url,
        },
        {
            title: division.name,
            href: customerDivisions.show({ customerDivision: division.uuid })
                .url,
        },
    ];

    const handleDeleteConfirm = () => {
        setIsDeleting(true);
        router.delete(
            customerDivisions.destroy({ customerDivision: division.uuid }).url,
            {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    router.visit(customerDivisions.index().url);
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
                title={t('customer_divisions.show.page_title', {
                    name: division.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{division.name}</h1>
                        {division.code && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t('customer_divisions.show.code_label')}{' '}
                                {division.code}
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
                                {t('customer_divisions.show.details_title')}
                            </CardTitle>
                            <CardDescription>
                                {t('customer_divisions.show.details_subtitle')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('customer_divisions.show.name_label')}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {division.name}
                                </p>
                            </div>

                            {division.code && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t('common.code')}
                                    </Label>
                                    <p className="font-mono">{division.code}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('customer_divisions.show.customer_title')}
                            </CardTitle>
                            <CardDescription>
                                {t('customer_divisions.show.customer_subtitle')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {division.customer && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        {t(
                                            'customer_divisions.show.customer_label',
                                        )}
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
                                <CardTitle>
                                    {t(
                                        'customer_divisions.show.shipping_title',
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'customer_divisions.show.shipping_subtitle',
                                    )}
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
                                    {t(
                                        'customer_divisions.show.shipping_empty',
                                    )}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })()}
            </div>

            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title={t('customer_divisions.delete_confirm_title')}
                description={t('customer_divisions.delete_confirm_description')}
                itemName={division.name}
            />
        </AppLayout>
    );
}

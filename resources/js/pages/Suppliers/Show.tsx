import { FormLabel } from '@/components/FormLabel';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import suppliers from '@/routes/suppliers/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

type Supplier = {
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
    contacts?: string | null;
};

type SuppliersShowProps = {
    supplier: Supplier;
};

export default function SuppliersShow({ supplier }: SuppliersShowProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { t } = useTranslations();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.suppliers'),
            href: suppliers.index().url,
        },
        {
            title: supplier.code,
            href: suppliers.show({ supplier: supplier.uuid }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        setIsDeleting(true);
        router.delete(suppliers.destroy({ supplier: supplier.uuid }).url, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                router.visit(suppliers.index().url);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('suppliers.show.page_title', {
                    code: supplier.code,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {supplier.company_name}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('suppliers.show.code_label')} {supplier.code}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    suppliers.edit({ supplier: supplier.uuid })
                                        .url
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
                                {t('suppliers.show.details_title')}
                            </CardTitle>
                            <CardDescription>
                                {t('suppliers.show.details_subtitle')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <FormLabel className="text-sm font-medium text-muted-foreground">
                                    {t('suppliers.show.uuid_label')}
                                </FormLabel>
                                <p className="font-mono text-sm">
                                    {supplier.uuid}
                                </p>
                            </div>

                            <div>
                                <FormLabel className="text-sm font-medium text-muted-foreground">
                                    {t('suppliers.table.code')}
                                </FormLabel>
                                <p className="font-mono text-lg font-semibold">
                                    {supplier.code}
                                </p>
                            </div>

                            <div>
                                <FormLabel className="text-sm font-medium text-muted-foreground">
                                    {t('suppliers.table.company_name')}
                                </FormLabel>
                                <p className="text-lg font-semibold">
                                    {supplier.company_name}
                                </p>
                            </div>

                            {supplier.vat_number && (
                                <div>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                        {t('suppliers.table.vat')}
                                    </FormLabel>
                                    <p>{supplier.vat_number}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('suppliers.show.contact_title')}
                            </CardTitle>
                            <CardDescription>
                                {t('suppliers.show.contact_subtitle')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {supplier.co && (
                                <div>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                        {t('suppliers.table.co')}
                                    </FormLabel>
                                    <p>{supplier.co}</p>
                                </div>
                            )}

                            {supplier.street && (
                                <div>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                        {t('suppliers.table.street')}
                                    </FormLabel>
                                    <p>{supplier.street}</p>
                                </div>
                            )}

                            {(supplier.city || supplier.postal_code) && (
                                <div>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                        {t('suppliers.show.city_cap_label')}
                                    </FormLabel>
                                    <p>
                                        {supplier.city ?? ''}{' '}
                                        {supplier.postal_code
                                            ? `(${supplier.postal_code})`
                                            : ''}
                                    </p>
                                </div>
                            )}

                            {supplier.province && (
                                <div>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                        {t('suppliers.show.province_label')}
                                    </FormLabel>
                                    <p>{supplier.province}</p>
                                </div>
                            )}

                            {supplier.country && (
                                <div>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                        {t('suppliers.show.country_label')}
                                    </FormLabel>
                                    <p>{supplier.country}</p>
                                </div>
                            )}

                            {supplier.contacts && (
                                <div>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                        {t('suppliers.table.contacts')}
                                    </FormLabel>
                                    <p className="whitespace-pre-wrap">
                                        {supplier.contacts}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title={t('suppliers.delete_title')}
                description={t('suppliers.delete_description')}
                itemName={`${supplier.company_name} (Codice: ${supplier.code})`}
            />
        </AppLayout>
    );
}

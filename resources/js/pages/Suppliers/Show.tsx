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

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Fornitori',
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
            <Head title={`Fornitore ${supplier.code}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {supplier.company_name}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Codice: {supplier.code}
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
                            <CardTitle>Dettagli Fornitore</CardTitle>
                            <CardDescription>
                                Informazioni principali
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <FormLabel className="text-sm font-medium text-muted-foreground">
                                    UUID
                                </FormLabel>
                                <p className="font-mono text-sm">
                                    {supplier.uuid}
                                </p>
                            </div>

                            <div>
                                <FormLabel className="text-sm font-medium text-muted-foreground">
                                    Codice Fornitore
                                </FormLabel>
                                <p className="font-mono text-lg font-semibold">
                                    {supplier.code}
                                </p>
                            </div>

                            <div>
                                <FormLabel className="text-sm font-medium text-muted-foreground">
                                    Ragione Sociale
                                </FormLabel>
                                <p className="text-lg font-semibold">
                                    {supplier.company_name}
                                </p>
                            </div>

                            {supplier.vat_number && (
                                <div>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                        Partita IVA
                                    </FormLabel>
                                    <p>{supplier.vat_number}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informazioni di Contatto</CardTitle>
                            <CardDescription>
                                Indirizzo e contatti
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {supplier.co && (
                                <div>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                        C/O
                                    </FormLabel>
                                    <p>{supplier.co}</p>
                                </div>
                            )}

                            {supplier.street && (
                                <div>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                        Via
                                    </FormLabel>
                                    <p>{supplier.street}</p>
                                </div>
                            )}

                            {(supplier.city || supplier.postal_code) && (
                                <div>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                        Città / CAP
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
                                        Provincia
                                    </FormLabel>
                                    <p>{supplier.province}</p>
                                </div>
                            )}

                            {supplier.country && (
                                <div>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                        Nazione
                                    </FormLabel>
                                    <p>{supplier.country}</p>
                                </div>
                            )}

                            {supplier.contacts && (
                                <div>
                                    <FormLabel className="text-sm font-medium text-muted-foreground">
                                        Contatti
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
                title="Elimina Fornitore"
                description="Sei sicuro di voler eliminare questo fornitore? Questa azione non può essere annullata."
                itemName={`${supplier.company_name} (Codice: ${supplier.code})`}
            />
        </AppLayout>
    );
}

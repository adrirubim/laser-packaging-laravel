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
import AppLayout from '@/layouts/app-layout';
import offerOperationCategories from '@/routes/offer-operation-categories/index';
import offerOperations from '@/routes/offer-operations/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type OfferOperation = {
    id: number;
    uuid: string;
    codice?: string;
    descrizione?: string;
};

type OfferOperationCategory = {
    id: number;
    uuid: string;
    code: string;
    name: string;
    operations?: OfferOperation[];
};

type OfferOperationCategoriesShowProps = {
    category: OfferOperationCategory;
};

export default function OfferOperationCategoriesShow({
    category,
}: OfferOperationCategoriesShowProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offerte',
            href: '/offers',
        },
        {
            title: 'Categorie Operazioni',
            href: offerOperationCategories.index().url,
        },
        {
            title: category.name,
            href: offerOperationCategories.show({
                offerOperationCategory: category.uuid,
            }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        setIsDeleting(true);
        router.delete(
            offerOperationCategories.destroy({
                offerOperationCategory: category.uuid,
            }).url,
            {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    router.visit(offerOperationCategories.index().url);
                },
                onFinish: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Categoria Operazione ${category.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{category.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Codice:{' '}
                            <span className="font-mono">{category.code}</span> |
                            UUID:{' '}
                            <span className="font-mono">{category.uuid}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    offerOperationCategories.edit({
                                        offerOperationCategory: category.uuid,
                                    }).url
                                }
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifica
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={isDeleting}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Elimina
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dettagli Categoria</CardTitle>
                            <CardDescription>
                                Informazioni su questa categoria
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Codice
                                </Label>
                                <p className="font-mono text-lg font-semibold">
                                    {category.code}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    Nome
                                </Label>
                                <p className="text-lg font-semibold">
                                    {category.name}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    UUID
                                </Label>
                                <p className="font-mono text-sm">
                                    {category.uuid}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    ID
                                </Label>
                                <p className="text-sm">{category.id}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {category.operations && category.operations.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Operazioni</CardTitle>
                                    <CardDescription>
                                        Operazioni associate a questa categoria
                                    </CardDescription>
                                </div>
                                <Button asChild size="sm" variant="outline">
                                    <Link
                                        href={
                                            offerOperations.create({
                                                query: {
                                                    category_uuid:
                                                        category.uuid,
                                                },
                                            }).url
                                        }
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Nuova Operazione
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {category.operations.map((operation) => (
                                    <Link
                                        key={operation.uuid}
                                        href={
                                            offerOperations.show({
                                                offerOperation: operation.uuid,
                                            }).url
                                        }
                                        className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div>
                                            <p className="font-mono font-medium">
                                                {operation.codice ?? '—'}
                                            </p>
                                            {operation.descrizione && (
                                                <p className="text-sm text-muted-foreground">
                                                    {operation.descrizione}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <ConfirmDeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDeleteConfirm}
                    title="Elimina Categoria Operazione"
                    description="Sei sicuro di voler eliminare questa categoria operazione? Questa azione non può essere annullata."
                    itemName={category.name}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}

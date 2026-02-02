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
import offerOperations from '@/routes/offer-operations';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type OfferOperation = {
    id: number;
    uuid: string;
    category_uuid?: string;
    codice?: string;
    codice_univoco?: string;
    descrizione?: string;
    secondi_operazione?: number;
    filename?: string;
    category?: {
        name: string;
    };
};

type OfferOperationsShowProps = {
    operation: OfferOperation;
};

const getFileDisplayName = (path?: string | null): string => {
    if (!path) return '—';
    const base = path.split('/').pop() ?? path;
    const parts = base.split('_');
    return parts.length > 1 ? parts.slice(1).join('_') : base;
};

export default function OfferOperationsShow({
    operation,
}: OfferOperationsShowProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offerte',
            href: '/offers',
        },
        {
            title: 'Operazioni',
            href: offerOperations.index().url,
        },
        {
            title: operation.codice ?? operation.descrizione ?? 'Operazione',
            href: offerOperations.show({ offerOperation: operation.uuid }).url,
        },
    ];

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(
            offerOperations.destroy({ offerOperation: operation.uuid }).url,
            {
                onSuccess: () => {
                    router.visit(offerOperations.index().url);
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
                title={`Operazione ${operation.codice ?? operation.descrizione ?? ''}`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {operation.descrizione ??
                                operation.codice ??
                                'Operazione'}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {operation.codice && (
                                <>
                                    Codice:{' '}
                                    <span className="font-mono">
                                        {operation.codice}
                                    </span>{' '}
                                    |{' '}
                                </>
                            )}
                            UUID:{' '}
                            <span className="font-mono">{operation.uuid}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    offerOperations.edit({
                                        offerOperation: operation.uuid,
                                    }).url
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
                                        Sei sicuro di voler eliminare
                                        l'operazione{' '}
                                        <strong>
                                            {operation.descrizione ??
                                                operation.codice}
                                        </strong>
                                        ?
                                        <br />
                                        <br />
                                        Questa azione non può essere annullata.
                                        L'operazione verrà eliminata
                                        definitivamente.
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
                            <CardTitle>Dettagli Operazione</CardTitle>
                            <CardDescription>
                                Informazioni su questa operazione
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {operation.category && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Categoria
                                    </Label>
                                    <p className="text-lg font-semibold">
                                        {operation.category.name}
                                    </p>
                                </div>
                            )}

                            {operation.codice && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Codice
                                    </Label>
                                    <p className="font-mono text-lg font-semibold">
                                        {operation.codice}
                                    </p>
                                </div>
                            )}

                            {operation.descrizione && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Descrizione
                                    </Label>
                                    <p className="text-lg font-semibold">
                                        {operation.descrizione}
                                    </p>
                                </div>
                            )}

                            {operation.secondi_operazione !== undefined &&
                                operation.secondi_operazione !== null && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Secondi Operazione
                                        </Label>
                                        <p>
                                            {operation.secondi_operazione}{' '}
                                            secondi
                                        </p>
                                    </div>
                                )}

                            {operation.filename && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Nome allegato
                                    </Label>
                                    <p className="font-mono">
                                        {getFileDisplayName(operation.filename)}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informazioni Sistema</CardTitle>
                            <CardDescription>Dati tecnici</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    UUID
                                </Label>
                                <p className="font-mono text-sm">
                                    {operation.uuid}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    ID
                                </Label>
                                <p className="text-sm">{operation.id}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

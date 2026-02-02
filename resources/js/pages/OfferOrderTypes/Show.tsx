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
import offerOrderTypes from '@/routes/offer-order-types';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type OfferOrderType = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type OfferOrderTypesShowProps = {
    orderType: OfferOrderType;
};

export default function OfferOrderTypesShow({
    orderType,
}: OfferOrderTypesShowProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offerte',
            href: '/offers',
        },
        {
            title: 'Tipi ordini',
            href: offerOrderTypes.index().url,
        },
        {
            title: orderType.name,
            href: offerOrderTypes.show({ offerOrderType: orderType.uuid }).url,
        },
    ];

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(
            offerOrderTypes.destroy({ offerOrderType: orderType.uuid }).url,
            {
                onSuccess: () => {
                    router.visit(offerOrderTypes.index().url);
                },
                onFinish: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tipo Ordine ${orderType.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{orderType.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Codice:{' '}
                            <span className="font-mono">{orderType.code}</span>{' '}
                            | UUID:{' '}
                            <span className="font-mono">{orderType.uuid}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    offerOrderTypes.edit({
                                        offerOrderType: orderType.uuid,
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
                                        Sei sicuro di voler eliminare il tipo
                                        ordine <strong>{orderType.name}</strong>{' '}
                                        (Codice: {orderType.code})?
                                        <br />
                                        <br />
                                        Questa azione non può essere annullata.
                                        Il tipo ordine verrà eliminato
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

                <Card>
                    <CardHeader>
                        <CardTitle>Dettagli Tipo Ordine</CardTitle>
                        <CardDescription>
                            Informazioni su questo tipo ordine
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Codice
                            </Label>
                            <p className="font-mono text-lg font-semibold">
                                {orderType.code}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Nome
                            </Label>
                            <p className="text-lg font-semibold">
                                {orderType.name}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                UUID
                            </Label>
                            <p className="font-mono text-sm">
                                {orderType.uuid}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                ID
                            </Label>
                            <p className="text-sm">{orderType.id}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

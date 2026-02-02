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
import valueTypes from '@/routes/value-types';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type ValueType = {
    id: number;
    uuid: string;
};

type ValueTypesShowProps = {
    valueType: ValueType;
};

export default function ValueTypesShow({ valueType }: ValueTypesShowProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Configurazione',
            href: '#',
        },
        {
            title: 'Tipi di Valore',
            href: valueTypes.index().url,
        },
        {
            title: valueType.uuid.substring(0, 8) + '...',
            href: valueTypes.show({ valueType: valueType.uuid }).url,
        },
    ];

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(valueTypes.destroy({ valueType: valueType.uuid }).url, {
            onSuccess: () => {
                router.visit(valueTypes.index().url);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`Tipo di Valore ${valueType.uuid.substring(0, 8)}...`}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="font-mono text-2xl font-bold">
                            {valueType.uuid}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Tipo di Valore
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    valueTypes.edit({
                                        valueType: valueType.uuid,
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
                                        Sei sicuro di voler eliminare il tipo di
                                        valore{' '}
                                        <strong className="font-mono">
                                            {valueType.uuid}
                                        </strong>
                                        ?
                                        <br />
                                        <br />
                                        Questa azione non può essere annullata.
                                        Il tipo di valore verrà eliminato
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
                        <CardTitle>Dettagli Tipo di Valore</CardTitle>
                        <CardDescription>
                            Informazioni su questo tipo di valore
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                UUID
                            </Label>
                            <p className="font-mono text-sm">
                                {valueType.uuid}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                ID
                            </Label>
                            <p className="text-sm">{valueType.id}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

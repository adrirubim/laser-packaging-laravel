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
import lasFamilies from '@/routes/las-families';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type LasFamily = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type LasFamiliesShowProps = {
    family: LasFamily;
};

export default function LasFamiliesShow({ family }: LasFamiliesShowProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offerte',
            href: '/offers',
        },
        {
            title: 'Famiglia LAS',
            href: lasFamilies.index().url,
        },
        {
            title: family.name,
            href: lasFamilies.show({ lasFamily: family.uuid }).url,
        },
    ];

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(lasFamilies.destroy({ lasFamily: family.uuid }).url, {
            onSuccess: () => {
                router.visit(lasFamilies.index().url);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Famiglia LAS ${family.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{family.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Codice:{' '}
                            <span className="font-mono">{family.code}</span> |
                            UUID:{' '}
                            <span className="font-mono">{family.uuid}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    lasFamilies.edit({ lasFamily: family.uuid })
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
                                        Sei sicuro di voler eliminare la
                                        famiglia LAS{' '}
                                        <strong>{family.name}</strong> (Codice:{' '}
                                        {family.code})?
                                        <br />
                                        <br />
                                        Questa azione non può essere annullata.
                                        La famiglia LAS verrà eliminata
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
                        <CardTitle>Dettagli Famiglia LAS</CardTitle>
                        <CardDescription>
                            Informazioni su questa famiglia LAS
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Codice
                            </Label>
                            <p className="font-mono text-lg font-semibold">
                                {family.code}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Nome
                            </Label>
                            <p className="text-lg font-semibold">
                                {family.name}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                UUID
                            </Label>
                            <p className="font-mono text-sm">{family.uuid}</p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                ID
                            </Label>
                            <p className="text-sm">{family.id}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

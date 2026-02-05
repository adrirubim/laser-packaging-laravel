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
import lasWorkLines from '@/routes/las-work-lines/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type LasWorkLine = {
    id: number;
    uuid: string;
    code: string;
    name: string;
};

type LasWorkLinesShowProps = {
    workLine: LasWorkLine;
};

export default function LasWorkLinesShow({ workLine }: LasWorkLinesShowProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offerte',
            href: '/offers',
        },
        {
            title: 'LAS Linee di Lavoro',
            href: lasWorkLines.index().url,
        },
        {
            title: workLine.name,
            href: lasWorkLines.show({ lasWorkLine: workLine.uuid }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        if (isDeleting) return;

        setIsDeleting(true);
        router.delete(
            lasWorkLines.destroy({ lasWorkLine: workLine.uuid }).url,
            {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    router.visit(lasWorkLines.index().url);
                },
                onFinish: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Linea di Lavoro LAS ${workLine.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{workLine.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Codice:{' '}
                            <span className="font-mono">{workLine.code}</span> |
                            UUID:{' '}
                            <span className="font-mono">{workLine.uuid}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    lasWorkLines.edit({
                                        lasWorkLine: workLine.uuid,
                                    }).url
                                }
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Modifica
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Elimina
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Dettagli Linea di Lavoro LAS</CardTitle>
                        <CardDescription>
                            Informazioni su questa linea di lavoro
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Codice
                            </Label>
                            <p className="font-mono text-lg font-semibold">
                                {workLine.code}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Nome
                            </Label>
                            <p className="text-lg font-semibold">
                                {workLine.name}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                UUID
                            </Label>
                            <p className="font-mono text-sm">{workLine.uuid}</p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                ID
                            </Label>
                            <p className="text-sm">{workLine.id}</p>
                        </div>
                    </CardContent>
                </Card>

                <ConfirmDeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDeleteConfirm}
                    isDeleting={isDeleting}
                    title="Conferma eliminazione"
                    description={
                        <>
                            Sei sicuro di voler eliminare la linea di lavoro LAS{' '}
                            <strong>{workLine.name}</strong> (Codice:{' '}
                            {workLine.code})? Questa azione non può essere
                            annullata. La linea di lavoro verrà eliminata
                            definitivamente.
                        </>
                    }
                    itemName={`${workLine.name} (Codice: ${workLine.code})`}
                />
            </div>
        </AppLayout>
    );
}

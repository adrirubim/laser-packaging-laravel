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
import offerActivities from '@/routes/offer-activities/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type OfferActivity = {
    id: number;
    uuid: string;
    name: string;
};

type OfferActivitiesShowProps = {
    activity: OfferActivity;
};

export default function OfferActivitiesShow({
    activity,
}: OfferActivitiesShowProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Offerte',
            href: '/offers',
        },
        {
            title: 'Attività',
            href: offerActivities.index().url,
        },
        {
            title: activity.name,
            href: offerActivities.show({ offerActivity: activity.uuid }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        setIsDeleting(true);
        router.delete(
            offerActivities.destroy({ offerActivity: activity.uuid }).url,
            {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    router.visit(offerActivities.index().url);
                },
                onFinish: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Attività ${activity.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{activity.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            UUID:{' '}
                            <span className="font-mono">{activity.uuid}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    offerActivities.edit({
                                        offerActivity: activity.uuid,
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

                <Card>
                    <CardHeader>
                        <CardTitle>Dettagli Attività</CardTitle>
                        <CardDescription>
                            Informazioni su questa attività
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Nome
                            </Label>
                            <p className="text-lg font-semibold">
                                {activity.name}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                UUID
                            </Label>
                            <p className="font-mono text-sm">{activity.uuid}</p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                ID
                            </Label>
                            <p className="text-sm">{activity.id}</p>
                        </div>
                    </CardContent>
                </Card>

                <ConfirmDeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDeleteConfirm}
                    title="Elimina Attività"
                    description="Sei sicuro di voler eliminare questa attività? Questa azione non può essere annullata."
                    itemName={activity.name}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}

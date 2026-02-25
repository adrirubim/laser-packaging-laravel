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
import offerSeasonalities from '@/routes/offer-seasonalities/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type OfferSeasonality = {
    id: number;
    uuid: string;
    name: string;
};

type OfferSeasonalitiesShowProps = {
    seasonality: OfferSeasonality;
};

export default function OfferSeasonalitiesShow({
    seasonality,
}: OfferSeasonalitiesShowProps) {
    const { t } = useTranslations();
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.offers'),
            href: '/offers',
        },
        {
            title: t('offer_seasonalities.page_title'),
            href: offerSeasonalities.index().url,
        },
        {
            title: seasonality.name,
            href: offerSeasonalities.show({
                offerSeasonality: seasonality.uuid,
            }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        setIsDeleting(true);
        router.delete(
            offerSeasonalities.destroy({ offerSeasonality: seasonality.uuid })
                .url,
            {
                onSuccess: () => {
                    router.visit(offerSeasonalities.index().url);
                },
                onFinish: () => {
                    setIsDeleting(false);
                    setDeleteDialogOpen(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('offer_seasonalities.show.page_title', {
                    name: seasonality.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {seasonality.name}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            UUID:{' '}
                            <span className="font-mono">
                                {seasonality.uuid}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    offerSeasonalities.edit({
                                        offerSeasonality: seasonality.uuid,
                                    }).url
                                }
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                {t('common.edit')}
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('common.delete')}
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('offer_seasonalities.show.details_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('offer_seasonalities.show.details_subtitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t('offer_seasonalities.form.name_label')}
                            </Label>
                            <p className="text-lg font-semibold">
                                {seasonality.name}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                UUID
                            </Label>
                            <p className="font-mono text-sm">
                                {seasonality.uuid}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                ID
                            </Label>
                            <p className="text-sm">{seasonality.id}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title={t('offer_seasonalities.delete.title')}
                description={t('offer_seasonalities.delete.description')}
                itemName={seasonality.name}
            />
        </AppLayout>
    );
}

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
import offerTypes from '@/routes/offer-types/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type OfferType = {
    id: number;
    uuid: string;
    name: string;
};

type OfferTypesShowProps = {
    offerType: OfferType;
};

export default function OfferTypesShow({ offerType }: OfferTypesShowProps) {
    const { t } = useTranslations();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('nav.offers'), href: '/offers' },
        { title: t('nav.offer_types'), href: offerTypes.index().url },
        {
            title: offerType.name,
            href: offerTypes.show({ offerType: offerType.uuid }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        setIsDeleting(true);
        router.delete(offerTypes.destroy({ offerType: offerType.uuid }).url, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                router.visit(offerTypes.index().url);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    const itemName = offerType.name;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tipo di Offerta ${offerType.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{offerType.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('common.uuid')}:{' '}
                            <span className="font-mono">{offerType.uuid}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    offerTypes.edit({
                                        offerType: offerType.uuid,
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
                            {t('offer_types.show.details_title')}
                        </CardTitle>
                        <CardDescription>
                            {t('offer_types.show.details_subtitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t('offer_types.form.name_label')}
                            </Label>
                            <p className="text-lg font-semibold">
                                {offerType.name}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t('common.uuid')}
                            </Label>
                            <p className="font-mono text-sm">
                                {offerType.uuid}
                            </p>
                        </div>

                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t('common.id')}
                            </Label>
                            <p className="text-sm">{offerType.id}</p>
                        </div>
                    </CardContent>
                </Card>

                <ConfirmDeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDeleteConfirm}
                    title={t('offer_types.delete.title')}
                    description={t('offer_types.delete.description')}
                    itemName={itemName}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}

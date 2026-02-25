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
import offerOperationLists from '@/routes/offer-operation-lists/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Offer = {
    uuid: string;
    offer_number: string;
    provisional_description?: string | null;
};

type Operation = {
    uuid: string;
    code: string;
    description?: string | null;
};

type OperationList = {
    id: number;
    uuid: string;
    num_op: number;
    offer?: Offer | null;
    operation?: Operation | null;
};

type OfferOperationListsShowProps = {
    operationList: OperationList;
};

export default function OfferOperationListsShow({
    operationList,
}: OfferOperationListsShowProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { t } = useTranslations();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('nav.offers'), href: '/offers' },
        {
            title: t('offer_operation_lists.page_title'),
            href: offerOperationLists.index().url,
        },
        {
            title: `${operationList.offer?.offer_number ?? t('common.not_available')} - ${operationList.operation?.code ?? t('common.not_available')}`,
            href: offerOperationLists.show({
                offerOperationList: operationList.uuid,
            }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        setIsDeleting(true);
        router.delete(
            offerOperationLists.destroy({
                offerOperationList: operationList.uuid,
            }).url,
            {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    router.visit(offerOperationLists.index().url);
                },
                onFinish: () => setIsDeleting(false),
            },
        );
    };

    const itemName = [
        operationList.offer?.offer_number ?? t('common.not_available'),
        operationList.operation?.code ?? t('common.not_available'),
    ].join(' - ');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('offer_operation_lists.show.page_title')} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t('offer_operation_lists.show.heading')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('offer_operation_lists.show.operation_label')}{' '}
                            {operationList.operation?.code ||
                                t('common.not_available')}{' '}
                            | {t('common.uuid')}:{' '}
                            <span className="font-mono">
                                {operationList.uuid}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    offerOperationLists.edit({
                                        offerOperationList: operationList.uuid,
                                    }).url
                                }
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                {t('common.edit')}
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={isDeleting}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('common.delete')}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('offer_operation_lists.show.details_title')}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'offer_operation_lists.show.details_subtitle',
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('common.id')}
                                </Label>
                                <p className="text-sm">{operationList.id}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('common.uuid')}
                                </Label>
                                <p className="font-mono text-sm">
                                    {operationList.uuid}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('offer_operation_lists.table.offer')}
                                </Label>
                                <p className="font-mono text-lg font-semibold">
                                    {operationList.offer?.offer_number ||
                                        t('common.not_available')}
                                </p>
                                {operationList.offer
                                    ?.provisional_description && (
                                    <p className="text-sm text-muted-foreground">
                                        {
                                            operationList.offer
                                                .provisional_description
                                        }
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('offer_operation_lists.table.operation')}
                                </Label>
                                <p className="font-mono text-lg font-semibold">
                                    {operationList.operation?.code ||
                                        t('common.not_available')}
                                </p>
                                {operationList.operation?.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {operationList.operation.description}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t(
                                        'offer_operation_lists.show.num_op_label',
                                    )}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {operationList.num_op}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <ConfirmDeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDeleteConfirm}
                    title={t('offer_operation_lists.delete_confirm_title')}
                    description={t('offer_operation_lists.delete_description')}
                    itemName={itemName}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}

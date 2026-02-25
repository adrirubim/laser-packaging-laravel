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
import orderStates from '@/routes/order-states/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type OrderState = {
    id: number;
    uuid: string;
    name: string;
    sorting: number;
    initial: boolean;
    production: boolean;
};

type OrderStatesShowProps = {
    orderState: OrderState;
};

export default function OrderStatesShow({ orderState }: OrderStatesShowProps) {
    const { t } = useTranslations();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('order_states.page_title'),
            href: orderStates.index().url,
        },
        {
            title: orderState.name,
            href: orderStates.show({ orderState: orderState.uuid }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        setIsDeleting(true);
        router.delete(
            orderStates.destroy({ orderState: orderState.uuid }).url,
            {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    router.visit(orderStates.index().url);
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
                title={t('order_states.show.page_title', {
                    name: orderState.name,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {orderState.name}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    orderStates.edit({
                                        orderState: orderState.uuid,
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
                                {t('order_states.show.card_title')}
                            </CardTitle>
                            <CardDescription>
                                {t('order_states.show.card_description')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('order_states.name')}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {orderState.name}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('order_states.sorting')}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {orderState.sorting}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('order_states.initial_state_label')}
                                </Label>
                                <p>
                                    {orderState.initial ? (
                                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                            {t('common.yes')}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">
                                            {t('common.no')}
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('order_states.production_state_label')}
                                </Label>
                                <p>
                                    {orderState.production ? (
                                        <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                                            {t('common.yes')}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">
                                            {t('common.no')}
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('order_states.uuid_column')}
                                </Label>
                                <p className="font-mono text-sm">
                                    {orderState.uuid}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('common.id')}
                                </Label>
                                <p className="text-sm">{orderState.id}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title={t('common.confirm_delete')}
                description={t('order_states.show.delete_description')}
                itemName={orderState.name}
            />
        </AppLayout>
    );
}

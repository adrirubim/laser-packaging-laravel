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
import palletTypes from '@/routes/pallet-types/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

type Article = {
    uuid: string;
    cod_article_las: string;
    article_descr?: string | null;
};

type PalletType = {
    id: number;
    uuid: string;
    cod: string;
    description: string;
    articles?: Article[];
};

type PalletTypesShowProps = {
    palletType: PalletType;
};

export default function PalletTypesShow({ palletType }: PalletTypesShowProps) {
    const { t } = useTranslations();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('pallet_types.title'),
            href: palletTypes.index().url,
        },
        {
            title: palletType.cod,
            href: palletTypes.show({ palletType: palletType.uuid }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        setIsDeleting(true);
        router.delete(
            palletTypes.destroy({ palletType: palletType.uuid }).url,
            {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    router.visit(palletTypes.index().url);
                },
                onFinish: () => setIsDeleting(false),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('pallet_types.show.page_title', {
                    code: palletType.cod,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {palletType.description}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('pallet_types.show.code_label')}{' '}
                            <span className="font-mono">{palletType.cod}</span>{' '}
                            | {t('pallet_types.show.fields.uuid')}:{' '}
                            <span className="font-mono">{palletType.uuid}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    palletTypes.edit({
                                        palletType: palletType.uuid,
                                    }).url
                                }
                            >
                                {t('common.edit')}
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                            disabled={isDeleting}
                        >
                            {isDeleting
                                ? t('common.deleting')
                                : t('common.delete')}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('pallet_types.show.details_title')}
                            </CardTitle>
                            <CardDescription>
                                {t('pallet_types.show.details_subtitle')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('pallet_types.show.fields.id')}
                                </Label>
                                <p className="text-sm">{palletType.id}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('pallet_types.show.fields.uuid')}
                                </Label>
                                <p className="font-mono text-sm">
                                    {palletType.uuid}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('pallet_types.show.fields.code')}
                                </Label>
                                <p className="font-mono text-lg font-semibold">
                                    {palletType.cod}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('pallet_types.show.fields.description')}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {palletType.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {palletType.articles && palletType.articles.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('pallet_types.show.articles_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('pallet_types.show.articles_subtitle')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {palletType.articles.map((article) => (
                                        <div
                                            key={article.uuid}
                                            className="flex items-center justify-between rounded-lg border p-3"
                                        >
                                            <div>
                                                <p className="font-mono font-medium">
                                                    {article.cod_article_las}
                                                </p>
                                                {article.article_descr && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {article.article_descr}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {(!palletType.articles || palletType.articles.length === 0) && (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <p>{t('pallet_types.show.articles_empty')}</p>
                        </CardContent>
                    </Card>
                )}

                <ConfirmDeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDeleteConfirm}
                    title={t('pallet_types.show.delete_confirm_title')}
                    description={t('pallet_types.delete.description')}
                    itemName={t('pallet_types.show.delete_item_name', {
                        description: palletType.description,
                        code: palletType.cod,
                    })}
                    isLoading={isDeleting}
                />
            </div>
        </AppLayout>
    );
}

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
import materials from '@/routes/materials/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

type Article = {
    uuid: string;
    cod_article_las: string;
    article_descr?: string | null;
};

type Material = {
    id: number;
    uuid: string;
    cod: string;
    description: string;
    articles?: Article[];
};

type MaterialsShowProps = {
    material: Material;
};

export default function MaterialsShow({ material }: MaterialsShowProps) {
    const { t } = useTranslations();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('materials.title'),
            href: materials.index().url,
        },
        {
            title: material.cod,
            href: materials.show({ material: material.uuid }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        if (isDeleting) return;

        setIsDeleting(true);
        router.delete(materials.destroy({ material: material.uuid }).url, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                router.visit(materials.index().url);
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('materials.show.page_title', { code: material.cod })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {material.description}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('materials.show.code_label')} {material.cod}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    materials.edit({ material: material.uuid })
                                        .url
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
                                {t('materials.show.details_title')}
                            </CardTitle>
                            <CardDescription>
                                {t('materials.show.details_subtitle')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('materials.show.fields.code')}
                                </Label>
                                <p className="font-mono text-lg font-semibold">
                                    {material.cod}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('materials.show.fields.description')}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {material.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {material.articles && material.articles.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('materials.show.articles_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('materials.show.articles_subtitle')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {material.articles.map((article) => (
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

                {(!material.articles || material.articles.length === 0) && (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <p>{t('materials.show.articles_empty')}</p>
                        </CardContent>
                    </Card>
                )}

                <ConfirmDeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDeleteConfirm}
                    isDeleting={isDeleting}
                    title={t('materials.show.delete_confirm_title')}
                    description={t('materials.delete.description')}
                    itemName={t('materials.show.delete_item_name', {
                        description: material.description,
                        code: material.cod,
                    })}
                />
            </div>
        </AppLayout>
    );
}

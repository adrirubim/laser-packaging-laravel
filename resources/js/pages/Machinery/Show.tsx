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
import machineryRoutes from '@/routes/machinery/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

type Article = {
    uuid: string;
    cod_article_las: string;
    article_descr?: string | null;
};

type ValueType = {
    uuid: string;
    id: number;
};

type Machinery = {
    id: number;
    uuid: string;
    cod: string;
    description: string;
    parameter?: string | null;
    value_type_uuid?: string | null;
    value_type?: ValueType | null;
    articles?: Article[];
};

type MachineryShowProps = {
    machinery: Machinery;
};

export default function MachineryShow({ machinery }: MachineryShowProps) {
    const { t } = useTranslations();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.macchinari'),
            href: machineryRoutes.index().url,
        },
        {
            title: machinery.cod,
            href: machineryRoutes.show({ machinery: machinery.uuid }).url,
        },
    ];

    const handleDeleteConfirm = () => {
        if (isDeleting) return;

        setIsDeleting(true);
        router.delete(
            machineryRoutes.destroy({ machinery: machinery.uuid }).url,
            {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    router.visit(machineryRoutes.index().url);
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
                title={t('machinery.show.page_title', {
                    code: machinery.cod,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {machinery.description}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('machinery.show.code_label')} {machinery.cod}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    machineryRoutes.edit({
                                        machinery: machinery.uuid,
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
                            {t('common.delete')}
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('machinery.show.details_title')}
                            </CardTitle>
                            <CardDescription>
                                {t('machinery.show.details_subtitle')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('machinery.show.fields.id')}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {machinery.id}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('machinery.show.fields.uuid')}
                                </Label>
                                <p className="font-mono text-lg text-xs font-semibold">
                                    {machinery.uuid}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('machinery.show.fields.code')}
                                </Label>
                                <p className="font-mono text-lg font-semibold">
                                    {machinery.cod}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('machinery.show.fields.description')}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {machinery.description}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('machinery.show.fields.parameter')}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {machinery.parameter || (
                                        <span className="text-muted-foreground">
                                            -
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t('machinery.show.fields.value_type')}
                                </Label>
                                <p className="text-lg font-semibold">
                                    {machinery.value_type ? (
                                        `ID: ${machinery.value_type.id}`
                                    ) : (
                                        <span className="text-muted-foreground">
                                            -
                                        </span>
                                    )}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {machinery.articles && machinery.articles.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t('machinery.show.articles_title')}
                                </CardTitle>
                                <CardDescription>
                                    {t('machinery.show.articles_subtitle')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {machinery.articles.map((article) => (
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

                {(!machinery.articles || machinery.articles.length === 0) && (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            <p>{t('machinery.show.articles_empty')}</p>
                        </CardContent>
                    </Card>
                )}

                <ConfirmDeleteDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDeleteConfirm}
                    isDeleting={isDeleting}
                    title={t('machinery.delete.title')}
                    description={t('machinery.delete.description')}
                    itemName={`${machinery.description} (Codice: ${machinery.cod})`}
                />
            </div>
        </AppLayout>
    );
}

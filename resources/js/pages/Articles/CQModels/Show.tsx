import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useTranslations } from '@/hooks/use-translations';
import AppLayout from '@/layouts/app-layout';
import articles from '@/routes/articles/index';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Download, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type CQModel = {
    uuid: string;
    cod_model: string;
    description_model?: string | null;
    filename?: string | null;
};

type CQModelsShowProps = {
    model: CQModel;
};

export default function CQModelsShow() {
    const { t } = useTranslations();
    const { props } = usePage<CQModelsShowProps>();
    const { model: cqModel } = props;
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.articles'),
            href: articles.index().url,
        },
        {
            title: t('articles.cq_models.title'),
            href: articles.cqModels.index().url,
        },
        {
            title: cqModel.cod_model,
            href: articles.cqModels.show({ cqModel: cqModel.uuid }).url,
        },
    ];

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(
            articles.cqModels.destroy({ cqModel: cqModel.uuid }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit(articles.cqModels.index().url);
                },
                onError: () => {
                    setIsDeleting(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={t('articles.cq_models.show.page_title', {
                    code: cqModel.cod_model,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {cqModel.cod_model}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('articles.cq_models.show.subtitle')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={
                                articles.cqModels.edit({
                                    cqModel: cqModel.uuid,
                                }).url
                            }
                        >
                            <Button variant="outline" size="sm">
                                <Edit className="mr-2 h-4 w-4" />
                                {t('common.edit')}
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={isDeleting}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {isDeleting
                                ? t('common.deleting')
                                : t('common.delete')}
                        </Button>
                        <Link href={articles.cqModels.index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t('articles.cq_models.show.back')}
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('articles.cq_models.show.general_info')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t('articles.cq_models.show.fields.cod_model')}
                            </Label>
                            <p className="mt-1 text-sm font-medium">
                                {cqModel.cod_model}
                            </p>
                        </div>
                        {cqModel.description_model && (
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t(
                                        'articles.cq_models.show.fields.description',
                                    )}
                                </Label>
                                <p className="mt-1 text-sm font-medium">
                                    {cqModel.description_model}
                                </p>
                            </div>
                        )}
                        {cqModel.filename && (
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t(
                                        'articles.cq_models.show.fields.filename',
                                    )}
                                </Label>
                                <div className="mt-1 flex items-center gap-2">
                                    <p className="text-sm font-medium">
                                        {cqModel.filename}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            window.location.href =
                                                articles.cqModels.downloadFile({
                                                    cqModel: cqModel.uuid,
                                                }).url;
                                        }}
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <ConfirmDeleteDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                    onConfirm={handleDelete}
                    isLoading={isDeleting}
                    title={t('articles.cq_models.delete.title')}
                    description={t('articles.cq_models.delete.description', {
                        code: cqModel.cod_model,
                    })}
                />
            </div>
        </AppLayout>
    );
}

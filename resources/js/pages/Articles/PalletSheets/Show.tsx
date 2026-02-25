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

type PalletSheet = {
    uuid: string;
    code: string;
    description?: string | null;
    filename?: string | null;
};

type PalletSheetsShowProps = {
    sheet: PalletSheet;
};

export default function PalletSheetsShow() {
    const { t } = useTranslations();
    const { props } = usePage<PalletSheetsShowProps>();
    const { sheet: palletSheet } = props;
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('nav.articles'),
            href: articles.index().url,
        },
        {
            title: t('articles.pallet_sheets.title'),
            href: articles.palletSheets.index().url,
        },
        {
            title: palletSheet.code,
            href: articles.palletSheets.show({ palletSheet: palletSheet.uuid })
                .url,
        },
    ];

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(
            articles.palletSheets.destroy({ palletSheet: palletSheet.uuid })
                .url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit(articles.palletSheets.index().url);
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
                title={t('articles.pallet_sheets.show.page_title', {
                    code: palletSheet.code,
                })}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {palletSheet.code}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('articles.pallet_sheets.show.subtitle')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={
                                articles.palletSheets.edit({
                                    palletSheet: palletSheet.uuid,
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
                        <Link href={articles.palletSheets.index().url}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t('articles.pallet_sheets.show.back')}
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t('articles.pallet_sheets.show.general_info')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                                {t('articles.pallet_sheets.show.fields.code')}
                            </Label>
                            <p className="mt-1 text-sm font-medium">
                                {palletSheet.code}
                            </p>
                        </div>
                        {palletSheet.description && (
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t(
                                        'articles.pallet_sheets.show.fields.description',
                                    )}
                                </Label>
                                <p className="mt-1 text-sm font-medium">
                                    {palletSheet.description}
                                </p>
                            </div>
                        )}
                        {palletSheet.filename && (
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">
                                    {t(
                                        'articles.pallet_sheets.show.fields.filename',
                                    )}
                                </Label>
                                <div className="mt-1 flex items-center gap-2">
                                    <p className="text-sm font-medium">
                                        {palletSheet.filename}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            window.location.href =
                                                articles.palletSheets.downloadFile(
                                                    {
                                                        palletSheet:
                                                            palletSheet.uuid,
                                                    },
                                                ).url;
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
                    title={t('articles.pallet_sheets.delete.title')}
                    description={t(
                        'articles.pallet_sheets.delete.description',
                        {
                            code: palletSheet.code,
                        },
                    )}
                />
            </div>
        </AppLayout>
    );
}
